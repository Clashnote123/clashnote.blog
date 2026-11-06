---
title: 客户端下载
h1: Clash 客户端：各系统怎么选、去哪里下载
layout: page
description: Windows、macOS、Android、iOS 的 Clash/Mihomo 客户端介绍与官方项目下载渠道，说明停更客户端与安全下载注意事项。
updated: 2026-11-06
---

先说结论：**客户端请只从项目的官方发布页下载**，不要使用网盘、第三方站点转发的安装包。本站不托管任何客户端安装文件。

> 重要：本站收录的 17 家机场资料中，没有任何一家明确提供"可直接导入 Clash 的标准订阅"。多数机场要求或推荐使用自家官方客户端。下表的客户端适用于**你的服务商确实提供兼容订阅**的情况。

## 客户端一览

| 系统 | 常用客户端 | 项目页（官方发布渠道） | 说明 |
|---|---|---|---|
| Windows / macOS / Linux | Clash Verge Rev | [github.com/clash-verge-rev/clash-verge-rev](https://github.com/clash-verge-rev/clash-verge-rev/releases) | 基于 Mihomo 内核的图形客户端，本站教程以它为主 |
| Windows / macOS / Linux / Android | FlClash | [github.com/chen08209/FlClash](https://github.com/chen08209/FlClash/releases) | 跨平台开源客户端，同样基于 Mihomo 内核 |
| Android | Clash Meta for Android | [github.com/MetaCubeX/ClashMetaForAndroid](https://github.com/MetaCubeX/ClashMetaForAndroid/releases) | 下载前请在项目页确认当前维护状态 |
| iOS | 无开源官方 Clash 客户端 | App Store | iOS 上常见的是付费闭源应用，请自行核对开发者与评价，本站不做推荐 |
| 内核 | Mihomo | [github.com/MetaCubeX/mihomo](https://github.com/MetaCubeX/mihomo) | 客户端内置内核，一般无需单独安装 |

项目页链接均为官方代码托管页面；本站没有逐一实机验证每个客户端的所有版本。**界面名称与功能位置会随版本变化**，以你下载的版本为准。

## 已停更的客户端

Clash for Windows 作者已在 2023 年停止维护并删除项目。现在网上流传的"Clash for Windows 安装包"来源不明，**不建议下载**。同理，早期的 Clash 内核已不再更新，社区主流转向 Mihomo。

## 下载与安装的安全检查

1. 只从上表的项目发布页（Releases）下载，选择与你系统和 CPU 架构对应的安装包。
2. 看发布页的版本号、发布时间；优先稳定版，不要为了尝鲜装预发布版本。
3. 能核对校验值（SHA256）时核对一下。
4. 不要运行来历不明的"破解版""整合包"。

## 安装之后

- Windows：[Clash Verge Rev Windows 11 安装与使用](/posts/clash-verge-rev-windows-install/)
- 订阅导入：[正确导入订阅链接](/posts/clash-verge-rev-import-subscription/)
- 遇到问题：[故障排查索引](/troubleshooting/)
