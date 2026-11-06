---
title: Mihomo YAML 配置文件入门
date: 2026-11-06 10:11:00
updated: 2026-11-06 10:11:00
order: 11
hub: wiki
categories: [Mihomo 知识库]
tags: [Mihomo, YAML, 配置文件, 策略组]
description: 读懂 Mihomo 配置文件的结构：基础端口、DNS、proxies、proxy-groups、rules 五大块，附 YAML 缩进规则与最小可读示例。
applies: Mihomo（Clash.Meta）内核；Clash Verge Rev 等客户端
verified: 字段依据 Mihomo 官方文档整理；示例为教学用占位配置，不含任何真实节点，不可直接使用。
faq:
  - q: YAML 缩进用 Tab 可以吗？
    a: 不可以。YAML 只允许空格缩进，用 Tab 会导致解析错误。
  - q: 我需要手写配置吗？
    a: 一般不需要，订阅会提供完整配置。读懂结构的意义在于排错和追加规则。
sources:
  - { t: Mihomo 配置文档, u: "https://wiki.metacubex.one/" }
  - { t: YAML 官网, u: "https://yaml.org/" }
---

**结论：** Mihomo 配置文件可以看成五块：**基础设置、DNS、节点（proxies）、策略组（proxy-groups）、规则（rules）**。读懂它们的关系，就能看懂几乎所有订阅，也能安全地做局部修改。

## 一、YAML 的三条规则

1. 用**空格**缩进，不能用 Tab，同级必须对齐。
2. `键: 值`，冒号后必须有一个空格。
3. 列表项以 `- ` 开头（短横线加空格）。

## 二、一份最小可读示例

下面是**占位示例**，服务器地址使用保留域名 `example.com`，仅用于说明结构：

```yaml
mixed-port: 7897
allow-lan: false
mode: rule
log-level: info

proxies:
  - name: "示例节点"
    type: ss
    server: example.com
    port: 443
    cipher: aes-128-gcm
    password: "placeholder"

proxy-groups:
  - name: "节点选择"
    type: select
    proxies:
      - "示例节点"
      - DIRECT

rules:
  - DOMAIN-SUFFIX,example.org,节点选择
  - GEOIP,CN,DIRECT
  - MATCH,节点选择
```

## 三、各块说明

| 块 | 作用 |
|---|---|
| `mixed-port` | 本地同时提供 HTTP / SOCKS 的监听端口，系统代理就指向它 |
| `allow-lan` | 是否允许局域网设备连接，默认保持 false |
| `mode` | rule / global / direct，见[三种模式的区别](/posts/clash-rule-global-direct-mode/) |
| `dns` | DNS 行为，见[DNS 泄露检查](/posts/dns-leak-check/) |
| `proxies` | 节点列表：每个节点的类型、地址、端口、凭证 |
| `proxy-groups` | 策略组：把节点打包成"可选择 / 自动测速 / 故障转移"等 |
| `rules` | 规则表：从上到下匹配，命中即停 |

## 四、规则怎么读

`DOMAIN-SUFFIX,example.org,节点选择` 的意思：域名以 `example.org` 结尾的请求，走名为"节点选择"的策略组。规则**从上到下**匹配，最后的 `MATCH` 是兜底。

## 五、改配置前

- 直接修改订阅文件会在订阅更新时被覆盖，应使用扩展配置，见[规则覆写与防止更新覆盖配置](/posts/override-keep-config-on-update/)。
- 改之前备份原文件；YAML 语法错误会导致客户端无法启动内核，日志中会指出出错的行号，排查方法见[Clash 配置文件 YAML 报错怎么看](/posts/clash-yaml-error-fix/)。
