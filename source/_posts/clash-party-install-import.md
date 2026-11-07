---
title: Clash Party 安装与导入订阅教程
date: 2026-11-07 09:04:00
updated: 2026-11-07 09:04:00
order: 19
hub: tutorials
categories: [新手入门]
tags: [Clash Party, Mihomo Party, 订阅导入, 安装, 系统代理]
description: Clash Party（原 Mihomo Party）的下载安装与订阅导入步骤：如何选对安装包、导入前先确认订阅可用、导入后选节点、开启系统代理并验证，以及导入失败时的排查入口。
applies: Windows / macOS / Linux，Clash Party 稳定版（基于 Mihomo 内核）
verified: 依据项目页与 Mihomo 客户端的通用流程整理，未在本站环境逐版本实机截图；项目名称、菜单名称随版本变化，请以项目页和你的版本为准。
faq:
  - q: Clash Party 和 Mihomo Party 是同一个项目吗？
    a: 项目曾以 Mihomo Party 之名流传，现在的项目页使用 Clash Party 名称。下载前请在项目页确认当前名称、发布页与维护状态，避免下载到仿冒包。
  - q: 它和 Clash Verge Rev 选哪个？
    a: 两者都基于 Mihomo 内核、都能导入 Clash 订阅，主要差别在界面和功能取舍。本站教程以 Clash Verge Rev 为主，想换客户端时，订阅导入的思路是相通的。
sources:
  - { t: Clash Party 项目发布页, u: "https://github.com/mihomo-party-org/clash-party/releases" }
  - { t: Mihomo 文档, u: "https://wiki.metacubex.one/" }
---

**结论：** 用 Clash Party 导入订阅分四步——从官方发布页下载匹配系统的安装包、拿到一份**确实兼容 Clash 的订阅**、在订阅管理里粘贴导入、选节点后开启系统代理并验证。其中最容易被忽略的是第二步：没有兼容订阅，客户端再好用也没有节点。

> 提示：客户端本身不提供节点。本站各机场是否支持导入 Clash、订阅如何获取，见[机场推荐](/airports/)的「Clash 兼容说明」；多数需要通过客服渠道询问订阅，选择思路见[Clash 机场怎么选](/posts/how-to-choose-clash-airport/)。

## 一、下载与安装

1. 打开 [Clash Party 项目发布页](https://github.com/mihomo-party-org/clash-party/releases)，选择**最新稳定版**，不要选带 beta、rc 字样的预发布版本。
2. 按系统选择安装包：
   - Windows：选择与你 CPU 架构匹配的安装程序（x64 或 arm64）；
   - macOS：Apple 芯片选 arm64，Intel 选 x64；
   - Linux：按发行版选 deb、rpm 或其他提供的格式。
3. 只从项目发布页下载，不要使用网盘、论坛转发的"整合包"。发布页提供校验值时，请核对。
4. 安装并启动。Windows 防火墙弹窗时允许专用网络；macOS 首次打开遇到"无法验证开发者"，处理方法见[macOS 安装指南](/posts/clash-verge-rev-macos/)。

## 二、先确认订阅可用

导入前先确认三件事：

1. 服务商是否明确提供适用于 Clash / Mihomo 的订阅；
2. 订阅链接来自官方渠道（用户中心或客服），而不是转售；
3. 链接完整，没有被聊天软件截断或带上空格。

订阅链接含个人凭证，不要截图或转发给他人。

## 三、导入订阅

1. 在客户端左侧找到订阅管理页（名称随版本可能叫"订阅""配置"）。
2. 在输入框粘贴订阅链接，点击导入。
3. 导入成功后列表中出现该订阅，点选使其成为当前使用的配置。
4. 进入代理页，应能看到策略组和节点；点击延迟测试，部分节点显示数字（毫秒）即正常。

## 四、开启代理并验证

1. 在设置或首页打开**系统代理**开关。
2. 模式选"规则"（日常推荐），三种模式的区别见[规则、全局、直连模式](/posts/clash-rule-global-direct-mode/)。
3. 验证：浏览器访问一个你预期需要代理的网站，同时在客户端的连接页看到对应记录。
4. TUN（虚拟网卡）需要更高权限，通常要授权或以管理员运行；无法开启时思路与 Verge Rev 相同，见[TUN 模式无法开启的排查](/posts/tun-mode-cannot-enable/)。

## 五、导入失败怎么办

| 现象 | 去哪里看 |
|---|---|
| 提示 401 / 403 / 404 / 超时 | [订阅导入报错排查](/posts/subscription-error-401-403-404/) |
| 导入成功但没有节点 | [导入后没有节点](/posts/no-nodes-after-import/) |
| 节点全部超时 | [节点全部超时](/posts/all-nodes-timeout/) |
| 配置报 YAML 错误 | [YAML 报错怎么看](/posts/clash-yaml-error-fix/) |
| 退出后无法联网 | [Windows 退出后无法联网](/posts/windows-no-internet-after-exit/) |

## 六、不要这样做

- 不要同时开启多个会改系统代理的软件。
- 不要把订阅链接发到群里求助，必须遮挡。
- 不要使用来历不明的安装包。
