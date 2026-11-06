---
title: Clash 规则覆写与防止更新覆盖配置
date: 2026-11-06 10:13:00
updated: 2026-11-06 10:13:00
order: 13
hub: wiki
categories: [Mihomo 知识库]
tags: [覆写, Merge, Script, 扩展配置, 规则]
description: 订阅更新会覆盖手动修改。用 Clash Verge Rev 的扩展配置（Merge 与 Script）追加规则、策略组，既保留自定义内容，又不被更新冲掉。
applies: Clash Verge Rev（Mihomo 内核）
verified: Merge / Script 概念与关键字依据项目文档整理；前缀关键字与界面位置随版本可能变化，操作前请对照你所用版本的文档。
faq:
  - q: Merge 和 Script 选哪个？
    a: 只是追加规则或节点，用 Merge 更直观；需要根据条件批量处理时用 Script。
  - q: 写错了客户端打不开怎么办？
    a: 先禁用该扩展配置恢复使用，再查看日志中的出错位置修正。
sources:
  - { t: Clash Verge Rev 项目页, u: "https://github.com/clash-verge-rev/clash-verge-rev" }
  - { t: Mihomo 配置文档, u: "https://wiki.metacubex.one/" }
---

**结论：** 订阅每次更新都会用服务商返回的内容替换配置文件，直接改订阅文件的自定义内容会丢。正确做法是把自定义内容放进**扩展配置**：Merge 负责合并追加，Script 负责用脚本改写。

## 一、为什么直接改会丢

订阅更新的本质是"重新下载 → 覆盖旧文件"。你对文件做的任何手工改动，在下一次更新后都会被还原。

## 二、用 Merge 追加规则

在订阅卡片的"扩展配置"中新建 Merge 文件，写入要合并的字段。常见做法是用带前缀的关键字，把条目放在原有条目之前或之后：

```yaml
prepend-rules:
  - DOMAIN-SUFFIX,example.org,DIRECT
  - DOMAIN-KEYWORD,example-keyword,节点选择

append-rules:
  - DOMAIN-SUFFIX,example.net,节点选择
```

- `prepend-` 前缀表示追加到原列表**之前**，优先级更高（规则从上到下匹配）；
- `append-` 前缀表示追加到**之后**。

类似前缀也适用于 `proxies`、`proxy-groups`。追加策略组时要确认引用的节点或组名真实存在。

## 三、用 Script 改写

Script 文件是一个 JavaScript 函数，接收完整配置并返回修改后的配置：

```javascript
function main(config, profileName) {
  // 示例：把日志级别改为 warning
  config["log-level"] = "warning";
  return config;
}
```

Script 灵活但更容易出错，写之前先备份原配置并保持每次改动小而明确。

## 四、全局与单订阅

客户端通常区分"全局扩展配置"和"某个订阅的扩展配置"：前者对所有订阅生效，后者只对所选订阅生效。自定义规则一般放在全局处。

## 五、验证

1. 保存扩展配置并刷新配置后，进入「规则」页，应能看到你追加的规则在预期位置。
2. 手动更新一次订阅，再回到「规则」页确认自定义规则仍然存在，即证明未被覆盖。
3. 日志有 YAML / 脚本报错时，按行号定位修正。

## 六、常见错误

- 缩进用了 Tab，或缩进不一致，见[Mihomo YAML 配置文件入门](/posts/mihomo-yaml-basics/)。
- 追加的规则引用了不存在的策略组名，导致配置无法加载。
- 规则顺序不对：把宽泛规则放在了具体规则前面。
