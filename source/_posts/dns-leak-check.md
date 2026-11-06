---
title: Clash DNS 泄露与 DNS 请求路径检查
date: 2026-11-06 10:09:00
updated: 2026-11-06 10:09:00
order: 9
hub: wiki
categories: [Mihomo 知识库]
tags: [DNS, DNS 泄露, fake-ip, Mihomo]
description: 理解 DNS 请求在 Clash 中怎么走，如何用第三方检测站和日志判断是否泄露，以及 fake-ip、系统 DNS、浏览器安全 DNS 的常见泄露原因。
applies: Windows 10 / 11，Clash Verge Rev（Mihomo 内核）
verified: DNS 机制依据 Mihomo 文档与 Windows 行为整理；检测站点结果依赖你的网络，本站未代你做具体测试。
faq:
  - q: 能用 fake-ip 避免泄露吗？
    a: fake-ip 让域名在本机得到假地址，真实解析在代理侧完成，能减少本地 DNS 暴露，但前提是流量确实进入了 Clash，且配置合理。
  - q: IPv6 要关吗？
    a: IPv6 可能绕过仅配置 IPv4 的代理或 DNS 设置，排查时可临时关闭 IPv6 对比测试。
sources:
  - { t: Mihomo DNS 配置文档, u: "https://wiki.metacubex.one/" }
  - { t: DNS Leak Test, u: "https://www.dnsleaktest.com/" }
---

**结论：** DNS 泄露指你的域名解析请求没有走代理，而是被发给了本地运营商或系统配置的 DNS。要检查它，先弄清**请求走哪条路**，再用检测站验证，最后针对四个常见原因逐个修复。

## 一、DNS 请求路径

访问一个网站，浏览器要先把域名解析成 IP。在 Clash 环境里可能有几条路径：

1. 程序不走 Clash（没读系统代理）→ 直接问系统 DNS → **泄露**。
2. 程序走 Clash，Clash 用自己的 DNS 设置解析，或把域名交给远端节点解析。
3. 浏览器启用了"安全 DNS（DoH）"，绕过系统与 Clash 自己发加密请求。

## 二、检测方法

1. 开启代理（规则模式 + 系统代理，或 TUN）。
2. 打开 [dnsleaktest.com](https://www.dnsleaktest.com/) 或类似的 DNS 泄露检测站，运行标准 / 扩展测试。
3. 看结果列出的 DNS 服务器归属：
   - 若全是你本地运营商的 DNS，而你期望走代理，则存在泄露；
   - 若是节点所在地或你配置的 DoH 服务商，则 DNS 已走代理。

注意：规则模式下，国内域名本来就可能按规则直连并使用国内 DNS，这是设计行为，不一定是问题。**是否算泄露取决于你想保护哪些域名。**

## 三、四个常见原因与处理

1. **程序没进 Clash：** 改用 TUN，或给程序单独设置代理。
2. **Windows 智能多宿主名称解析：** Windows 会向多个网卡同时发 DNS 请求，可能把请求从本地网卡发出。可在组策略或注册表中关闭该行为后再测（修改系统设置前请先了解风险并备份）。
3. **浏览器安全 DNS：** 在浏览器设置中关闭"使用安全 DNS"，让浏览器遵循系统或代理设置。
4. **IPv6：** 暂时关闭 IPv6 对比结果。

## 四、Mihomo DNS 配置片段

下面是常见结构，仅作理解用途，不要不加区分地照抄：

```yaml
dns:
  enable: true
  ipv6: false
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  nameserver:
    - https://dns.alidns.com/dns-query
    - https://doh.pub/dns-query
  fallback:
    - https://1.1.1.1/dns-query
  proxy-server-nameserver:
    - https://dns.alidns.com/dns-query
```

字段含义：`nameserver` 是常规解析使用的 DNS；`fallback` 在特定条件下使用；`proxy-server-nameserver` 专门用于解析代理节点自己的域名。具体字段以[Mihomo 文档](https://wiki.metacubex.one/)为准，随版本会有变化。

## 五、验证

修复后重新运行检测站，对比前后结果；同时在客户端「连接」页确认目标请求确实出现在连接列表里。
