---
title: Clash 配置文件 YAML 报错怎么看、怎么改
date: 2026-11-07 09:01:00
updated: 2026-11-07 09:01:00
order: 16
hub: wiki
categories: [Mihomo 知识库]
tags: [YAML, YAML 错误, 配置文件, Mihomo, 排查]
description: Clash / Mihomo 配置文件 YAML 报错的读法：根据日志里的行号和提示定位 Tab、缺空格、缩进错位、全角符号、特殊字符未加引号等常见原因，并给出检查命令与修复步骤。
applies: Mihomo（Clash.Meta）内核；Clash Verge Rev 及其他 Mihomo 客户端
verified: 报错原文为 Go 语言 YAML 解析库的常见提示；各客户端日志展示位置不同。本文未针对任何具体订阅复现，示例为占位配置。
faq:
  - q: 没有行号，只提示配置加载失败怎么办？
    a: 先打开客户端日志页，向上找最早的一条 error；仍没有行号，就用 mihomo -t 测试命令，或把文件放进支持 YAML 检查的编辑器里逐行看。
  - q: 订阅下载下来的配置也会报 YAML 错吗？
    a: 会，但更常见的原因是内容不是 Clash 格式（例如返回的是网页或通用节点列表）。先看文件开头是不是 proxies、port 这类键，而不是 HTML。
sources:
  - { t: YAML 官网规范, u: "https://yaml.org/spec/" }
  - { t: Mihomo 配置文档, u: "https://wiki.metacubex.one/" }
---

**结论：** YAML 报错几乎总是"某一行的写法不合规"。先看日志里给出的**行号和提示原文**，再对照下面的八类原因逐项排查，大多数问题改一两个字符就能解决。

> 如果你是自己手写或用扩展配置追加的内容，先把改动撤回，确认客户端能正常启动，再一次只加一小段。方法见[规则覆写与防止更新覆盖配置](/posts/override-keep-config-on-update/)。

## 一、先找到报错位置

1. 在客户端「日志」页找最早的 error，通常带有类似 `yaml: line 12: ...` 的文字。
2. 记下**行号**和**提示原文**。注意：真正的错误有时在报错行的上一行（例如上一行少了引号）。
3. 想在命令行验证配置，可以用 Mihomo 自带的配置测试参数（路径按你的实际情况替换）：

```bash
mihomo -t -f /path/to/config.yaml
```

它会检查配置并退出，不会启动代理。

## 二、八类常见原因

| 报错提示（常见写法） | 通常原因 | 修改 |
|---|---|---|
| `found character that cannot start any token` | 用了 **Tab** 缩进 | 全部改为空格，同级必须对齐 |
| `mapping values are not allowed in this context` | 冒号后少空格，或值里含未加引号的 `: ` | `key: value`，值含冒号时加引号 |
| `did not find expected key` | 缩进层级不一致，同级的键没有对齐 | 对齐同级缩进，每一级固定 2 个空格 |
| `could not find expected ':'` | 键写成了 `key value`，缺冒号 | 补上冒号 |
| `found unknown escape character` | 双引号字符串里有反斜杠转义（如 Windows 路径） | 改用单引号，或把 `\` 写成 `\\` |
| `did not find expected '-' indicator` | 列表项缺 `- `，或 `-` 后缺空格 | 每个列表项以 `- ` 开头 |
| 配置能读但内核启动失败 | 键名写错、策略组引用了不存在的节点名 | 核对名称完全一致（含大小写和空格） |
| 看不出毛病但就是报错 | **全角符号**（`：`、`“ ”`、全角空格）、文件编码问题 | 全部换成半角，文件保存为 UTF-8 |

## 三、几个特别容易踩的坑

**1. 全角冒号和引号。** 从中文网页或聊天软件复制配置时，冒号、引号、空格可能是全角字符。肉眼几乎看不出，但 YAML 不认。在编辑器里搜索 `：`、`“`、`”` 和全角空格，逐个替换。

**2. 特殊字符开头的值要加引号。** 以 `*`、`&`、`!`、`%`、`@`、`#` 开头，或包含 `: `、` #` 的值，应该用引号括起来：

```yaml
proxies:
  - name: "节点 A: 测试"
    type: ss
    server: example.com
    port: 443
    cipher: aes-128-gcm
    password: "p@ss: word"   # 含冒号和 @，必须加引号
```

**3. 看起来像布尔值或数字的字符串。** `yes`、`no`、`on`、`off`、纯数字（尤其以 0 开头）在 YAML 里可能被当成布尔值或数字。名称、密码、UUID 一类请统一加引号。

**4. 重复的键。** 同一层出现两个 `proxies:` 或两个 `rules:`，后一个会覆盖前一个或直接报错。把内容合并到同一个键下。

**5. 缩进只用空格。** 编辑器最好设置"Tab 转 2 个空格"，并开启显示空白字符。

## 四、修复流程

1. 备份当前文件。
2. 按日志行号定位，先改 Tab、冒号后空格、缩进这三类。
3. 保存为 UTF-8，重新加载配置。
4. 仍报错，用二分法：把后半部分暂时注释掉（行首加 `#`），能加载就说明问题在被注释的部分，再缩小范围。
5. 加载成功后，再检查策略组名称和规则引用是否一致。

## 五、如果文件根本不是 YAML

打开配置文件，如果开头是 `<html`、`<!DOCTYPE` 或一长串乱码，说明下载到的不是配置（可能是网页、错误页或其他格式的节点列表）。这种情况不是 YAML 写错，请回到[订阅导入报错排查](/posts/subscription-error-401-403-404/)或[导入后没有节点](/posts/no-nodes-after-import/)。

结构本身读不懂时，先看[Mihomo YAML 配置文件入门](/posts/mihomo-yaml-basics/)。
