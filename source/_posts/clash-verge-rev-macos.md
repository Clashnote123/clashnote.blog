---
title: Clash Verge Rev macOS 安装与使用指南
date: 2026-11-07 09:03:00
updated: 2026-11-07 09:03:00
order: 18
hub: tutorials
categories: [新手入门]
tags: [Clash Verge Rev, macOS, 安装, 系统代理, TUN]
description: 在 macOS 上从官方 Releases 下载 Clash Verge Rev，区分 Apple 芯片与 Intel 安装包，处理"无法验证开发者"提示，开启系统代理，并说明 TUN 与服务模式的授权要点。
applies: macOS（Apple 芯片 / Intel），Clash Verge Rev 稳定版
verified: 依据项目发布页与 macOS 通用行为整理，未在本站环境逐版本实机截图；系统设置菜单名称随 macOS 版本变化。
faq:
  - q: 提示"无法打开，因为无法验证开发者"怎么办？
    a: 先确认安装包来自官方发布页；然后在 访达 中右键点击应用选择"打开"，或到 系统设置 → 隐私与安全性 中找到被拦截的应用，选择"仍要打开"。
  - q: M 系列芯片该选哪个包？
    a: 选 aarch64（有的发布页写 arm64）对应的 dmg；Intel 芯片选 x64。
sources:
  - { t: Clash Verge Rev 项目发布页, u: "https://github.com/clash-verge-rev/clash-verge-rev/releases" }
  - { t: Apple：打开来自身份不明开发者的 Mac App, u: "https://support.apple.com/zh-cn/guide/mac-help/mh40616/mac" }
---

**结论：** 在 macOS 上，从 Clash Verge Rev 官方发布页下载与你芯片匹配的 dmg，拖入"应用程序"后首次打开处理好系统的开发者提示，再按需开启系统代理或 TUN 即可。

> 提示：客户端本身不提供节点，需要服务商提供兼容订阅。本站各机场的 Clash 兼容状态与核实依据见[机场推荐](/airports/)；导入方法见[正确导入订阅链接](/posts/clash-verge-rev-import-subscription/)。

## 一、确认芯片并下载

1. 点击左上角苹果菜单 → 关于本机，查看"芯片"：显示 Apple M1/M2 等为 Apple 芯片，显示 Intel 为 Intel 处理器。
2. 打开 [Clash Verge Rev 发布页](https://github.com/clash-verge-rev/clash-verge-rev/releases)，选择**最新稳定版**，不要选 alpha、beta、rc 等预发布版本。
3. 在 Assets 中下载 macOS 的 `.dmg`：Apple 芯片选 `aarch64`（或 `arm64`），Intel 选 `x64`。
4. 不要使用网盘、论坛转发的安装包。发布页若提供校验值，可以在终端核对：

```bash
shasum -a 256 ~/Downloads/你下载的文件.dmg
```

## 二、安装与首次打开

1. 双击 dmg，把 Clash Verge 拖入"应用程序"。
2. 在"应用程序"中打开。若提示"无法验证开发者"或"已损坏"：
   - 在访达中右键点击应用，选择"打开"，在弹窗中再次点"打开"；
   - 或前往 系统设置 → 隐私与安全性，在页面下方找到被拦截的应用，点击"仍要打开"。
3. 只对**来自官方发布页**的安装包执行上述操作。来路不明的安装包不要放行。

## 三、开启系统代理

1. 进入「设置」，打开"系统代理"开关。
2. macOS 会修改当前网络服务的代理设置，可能请求输入系统密码，这是正常的。
3. 验证：系统设置 → 网络 → 当前连接 → 详细信息 → 代理，应能看到网页代理（HTTP）和安全网页代理（HTTPS）指向本机地址和 Clash 端口。

## 四、TUN 模式与服务模式

- TUN 会创建虚拟网卡并修改路由，通常需要更高权限。Clash Verge Rev 通过"服务模式"处理，安装时系统会要求授权。
- 开启顺序：先在「设置」里安装并启动服务模式，再打开 TUN。
- 无法开启或开启后断网，思路与 Windows 相同，参考[TUN 模式无法开启的排查](/posts/tun-mode-cannot-enable/)；原理见[系统代理与 TUN 模式区别](/posts/system-proxy-vs-tun/)。

## 五、验证与常见问题

- 「代理」页能看到节点，延迟测试能出数字（毫秒）。
- 日志页没有持续刷新的红色错误。
- 浏览器打不开网页：见[已连接但浏览器无法访问网页](/posts/connected-but-no-web/)。
- 退出后系统代理残留：在 系统设置 → 网络 → 代理 中手动关闭。尽量通过菜单栏图标选择"退出"，不要强制结束进程。

## 六、不要这样做

- 不要把订阅链接发给他人或截图求助，必须遮挡。
- 不要同时运行多个会修改系统代理的软件，它们会互相覆盖。
