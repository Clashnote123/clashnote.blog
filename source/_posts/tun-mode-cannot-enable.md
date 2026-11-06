---
title: Clash TUN 模式无法开启的排查
date: 2026-11-06 10:08:00
updated: 2026-11-06 10:08:00
order: 8
hub: troubleshooting
categories: [故障排查]
tags: [TUN, 服务模式, 管理员权限, Windows]
description: TUN 开关打不开、开了没效果或报错：按服务模式、管理员权限、冲突软件、配置项与日志的顺序排查。
applies: Windows 10 / 11，Clash Verge Rev（Mihomo 内核）
verified: 排查顺序依据 Mihomo TUN 机制与 Clash Verge Rev 的服务模式设计整理，未复现所有环境下的失败场景。
faq:
  - q: 开启 TUN 后断网了怎么办？
    a: 先关闭 TUN 模式恢复网络，再查看日志中的路由与 DNS 报错；常见原因是与其他网络软件冲突。
  - q: 一定要管理员权限吗？
    a: Windows 上创建虚拟网卡需要较高权限，Clash Verge Rev 通过"服务模式"以更高权限运行内核，免去每次手动提权。
sources:
  - { t: Mihomo TUN 文档, u: "https://wiki.metacubex.one/" }
  - { t: Clash Verge Rev 项目页, u: "https://github.com/clash-verge-rev/clash-verge-rev" }
---

**结论：** TUN 要创建虚拟网卡并修改路由，Windows 上需要较高权限。无法开启时，**先看服务模式是否已安装并运行，再看是否有冲突的网络软件**，最后用日志定位。

## 一、检查服务模式

1. 进入「设置」，找到"服务模式"。
2. 如果显示未安装，点击安装并允许管理员授权；安装后确认状态为运行中。
3. 安装后重启 Clash Verge Rev，再尝试打开 TUN。

## 二、检查权限与安全软件

- 以普通用户运行时，TUN 开关可能灰色或报错；用服务模式解决，或以管理员身份运行客户端。
- 安全软件可能拦截虚拟网卡驱动或服务安装。把客户端加入信任列表后再试。

## 三、排查冲突

以下软件常与 TUN 冲突，请先退出再试：

- 其他 VPN、加速器、另一个代理客户端；
- 虚拟化的网络环境（Hyper-V、WSL、虚拟机网卡）可能产生路由干扰，出现问题时可暂时停用对应虚拟交换机以确认；
- 修改过系统路由或 DNS 的软件。

## 四、检查配置

TUN 的核心配置段类似下面，通常客户端会自动生成，不必手动改：

```yaml
tun:
  enable: true
  stack: mixed        # 可选 system / gvisor / mixed
  auto-route: true
  auto-detect-interface: true
  dns-hijack:
    - any:53
```

如果开启后无法上网，可尝试把 `stack` 在 `mixed`、`gvisor`、`system` 间切换测试。每次只改一项。

## 五、用日志定位

打开「日志」页，再次开关 TUN，观察出现的报错。常见线索：

- 与"权限 / access denied"相关：权限或服务模式问题；
- 与"interface / route / wintun"相关：网卡或路由冲突；
- 与"dns"相关：见[DNS 泄露与 DNS 请求路径检查](/posts/dns-leak-check/)。

## 六、仍然失败

回退到系统代理方案，见[系统代理与 TUN 模式区别](/posts/system-proxy-vs-tun/)。大部分浏览器场景用系统代理就足够。
