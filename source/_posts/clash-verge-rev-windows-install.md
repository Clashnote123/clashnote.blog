---
title: Clash Verge Rev Windows 11 安装与使用
date: 2026-11-06 10:01:00
updated: 2026-11-06 10:01:00
order: 1
hub: tutorials
categories: [新手入门]
tags: [Clash Verge Rev, Windows 11, 安装]
description: 在 Windows 11 上从 GitHub Releases 下载并安装 Clash Verge Rev，认识界面各页面，并确认客户端能正常启动的验证方法。
applies: Windows 10 / 11（64 位），Clash Verge Rev 稳定版
verified: 依据项目发布页与通用行为整理，未在本站环境逐版本实机截图；菜单名称随版本略有不同，以你下载的版本为准。
faq:
  - q: 安装后打不开或提示缺少组件怎么办？
    a: Clash Verge Rev 基于 Tauri，依赖系统的 WebView2。Windows 11 通常自带；若缺失，可从微软官方页面安装 WebView2 运行时后重试。
  - q: 安装版和便携版选哪个？
    a: 想开机自启、使用服务模式和 TUN，推荐安装版；只想临时使用可以用便携版，但部分需要管理员权限的功能会受限。
sources:
  - { t: Clash Verge Rev 项目发布页, u: "https://github.com/clash-verge-rev/clash-verge-rev/releases" }
  - { t: Mihomo 文档, u: "https://wiki.metacubex.one/" }
---

**结论：** 在 Windows 11 上，从 Clash Verge Rev 官方 GitHub 发布页下载与你 CPU 架构匹配的安装包，安装后启动，看到主界面和"代理"页即为安装成功。下面分步说明，并给出验证办法。

> 提示：Clash 客户端本身不提供任何节点。你需要一个**格式兼容的订阅**才能使用。机场订阅通常需要通过官网客服渠道询问，流程见[向机场客服索取 Clash 订阅](/posts/get-clash-subscription-from-support/)。

## 一、下载

1. 打开 [Clash Verge Rev 发布页](https://github.com/clash-verge-rev/clash-verge-rev/releases)，选择**最新的稳定版本**（不要选带 alpha、beta、rc 字样的预发布版本）。
2. 在 Assets 中找到 Windows 安装包。64 位 Intel / AMD 电脑选 `x64` 的 `setup.exe`；ARM 设备（如部分 Surface）选 `arm64`。
3. 不确定架构时：按 `Win + I` → 系统 → 关于，查看"系统类型"。

不要从网盘、论坛或不明站点下载"整合包"。如果发布页提供校验值，可以用 PowerShell 核对：

```powershell
Get-FileHash .\你下载的安装包.exe -Algorithm SHA256
```

## 二、安装

1. 双击安装包，按提示选择安装目录与语言，完成安装。
2. 首次启动时，如果 Windows 防火墙弹窗，选择允许"专用网络"访问即可。
3. 想使用 TUN 模式，需要后面的"服务模式"，那一步会请求管理员权限，这是正常的。

## 三、认识界面

左侧栏的常见页面（名称随版本可能略有差异）：

| 页面 | 作用 |
|---|---|
| 主页 / 首页 | 当前状态概览 |
| 代理 | 切换规则 / 全局 / 直连模式，选择节点，测试延迟 |
| 订阅（部分版本叫"配置"） | 导入、更新、编辑订阅 |
| 连接 | 查看当前每条连接走的哪个节点 |
| 规则 | 查看当前生效的规则 |
| 日志 | 内核日志，排查问题时最重要 |
| 设置 | 系统代理、TUN 模式、服务模式、开机自启、端口等 |

## 四、验证客户端是否正常

- 启动后右下角托盘出现图标，主界面能打开。
- 进入"设置"，能看到"系统代理"和"TUN 模式"开关。
- 进入"日志"，没有持续刷新的红色错误。

此时还**没有节点**是正常的。下一步请读[《Clash Verge Rev 正确导入订阅链接》](/posts/clash-verge-rev-import-subscription/)。

macOS 用户请看[Clash Verge Rev macOS 安装与使用指南](/posts/clash-verge-rev-macos/)。

## 五、不要这样做

- 不要把订阅链接截图发到群里求助，链接等同于你的账号凭证。
- 不要同时开两个会修改系统代理的软件（如另一个代理客户端、加速器），它们会互相覆盖设置，这是"连接成功却打不开网页"的常见原因。
- 退出时请通过托盘菜单选择"退出"，不要直接结束进程，否则可能留下系统代理设置，见[《退出 Clash 后 Windows 仍无法联网》](/posts/windows-no-internet-after-exit/)。
