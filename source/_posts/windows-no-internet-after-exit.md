---
title: 退出 Clash 后 Windows 仍无法联网怎么办
date: 2026-11-06 10:14:00
updated: 2026-11-06 10:14:00
order: 14
hub: troubleshooting
categories: [故障排查]
tags: [系统代理, Windows, 无法联网, 注册表]
description: 关闭 Clash 后浏览器仍打不开网页，多半是系统代理残留。用图形界面或 PowerShell 关闭代理、刷新 DNS，并说明如何避免再次发生。
applies: Windows 10 / 11
verified: 系统代理位于 Windows「Internet 选项」设置，关闭方法为通用做法；命令已核对语法但请先理解再执行。
faq:
  - q: 为什么会残留？
    a: 客户端被强制结束、崩溃或系统突然关机时，没有机会还原系统代理设置。
sources:
  - { t: Microsoft：Windows 中的代理设置, u: "https://support.microsoft.com/zh-cn/windows" }
---

**结论：** 退出 Clash 后无法联网，最常见的原因是 Windows 的系统代理仍指向已经不存在的本机端口。**关掉系统代理开关**通常就能立刻恢复。

## 一、先判断是不是这个问题

- 浏览器提示"代理服务器没有响应"或"无法连接到代理服务器"。
- QQ、微信等不依赖系统代理的软件却能联网。
- 重启 Clash 并开启系统代理后又恢复。

## 二、图形界面关闭（推荐）

1. 按 `Win + I` 打开设置 → 网络和 Internet → 代理。
2. 在"手动设置代理"处，把"使用代理服务器"关闭。
3. 同时确认"自动检测设置"是否符合你的网络环境。
4. 刷新浏览器页面测试。

## 三、用 PowerShell 关闭

以普通 PowerShell 运行：

```powershell
Set-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings' -Name ProxyEnable -Value 0
```

这条命令只把当前用户的 `ProxyEnable` 设置为 0（关闭），不删除地址。查看当前状态：

```powershell
Get-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings' | Select-Object ProxyEnable, ProxyServer
```

## 四、刷新 DNS

```powershell
ipconfig /flushdns
```

## 五、仍然不行

1. 检查是否装有其他代理 / 加速软件，也会写系统代理。
2. 检查浏览器自身是否配置了独立代理，或安装了代理扩展。
3. 用 `netsh winhttp show proxy` 查看 WinHTTP 代理（影响部分系统组件，与浏览器设置不同）。

## 六、预防

- 退出时通过托盘菜单的"退出"，不要直接结束进程；
- 不要在代理开启状态下强制关机；
- 开启"开机自启"时留意启动顺序，避免与其他代理软件互相覆盖。

更多模式与系统代理的原理见[系统代理与 TUN 模式区别](/posts/system-proxy-vs-tun/)。
