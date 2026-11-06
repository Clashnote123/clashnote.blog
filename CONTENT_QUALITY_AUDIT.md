# CONTENT_QUALITY_AUDIT

逐篇读取了全部 15 篇文章与 9 个栏目页。结论：未发现占位文字、繁体字、重复段落或关键词堆砌；主要缺陷是**没有真实截图、未实机验证、界面名称依赖版本**。字数为正文字符数（`docs/seo-audit-data.json`）。

通用缺陷（所有文章）：无任何真实截图（P3，不能用编造的截图代替）；"验证状态"已如实标注为未逐版本实机验证。

| URL | 主关键词 | 搜索意图 | 字数 | 缺陷 / 建议 | 内链机会 | 级别 |
|---|---|---|---|---|---|---|
| `/posts/clash-verge-rev-windows-install/` | Clash Verge Rev 教程 / Windows 11 | 安装并跑起来 | 2021 | 界面名称随版本变；未写具体版本号。建议上线前在当前稳定版实机核对并加版本号 | → import-subscription（已有） | P3 |
| `/posts/clash-verge-rev-import-subscription/` | Clash 订阅导入 | 如何导入并确认能否导入 | 1684 | 内容准确；建议补一段"订阅类型（Clash/通用）区别"；核心页，入链 32 | → 机场详情页（仅在讨论兼容时，不强塞购买） | P3 |
| `/posts/subscription-error-401-403-404/` | Clash 订阅 401 / 403 / 404 | 报错排查 | 1705 | 已修复过期句子"多数官方客户端型机场…"；description 已加长 | ← no-nodes、update-failed | P2→已修 |
| `/posts/no-nodes-after-import/` | Clash 导入后没有节点 | 排查 | 1384 | description 已加长；建议补一个"最小 YAML 示例对照"链接到 mihomo-yaml-basics | → mihomo-yaml-basics | P3 |
| `/posts/all-nodes-timeout/` | Clash 节点超时 | 排查 | 1328 | 可补"延迟测试 URL 设置位置"（需实机确认菜单名） | → system-proxy-vs-tun | P3 |
| `/posts/clash-rule-global-direct-mode/` | Clash 规则模式 / 全局模式 | 概念区别 | 1566 | 无明显缺陷 | → connected-but-no-web | — |
| `/posts/system-proxy-vs-tun/` | Clash TUN 模式 / 系统代理 | 区别 | 1498 | 无明显缺陷；与 tun-mode-cannot-enable 已分工 | → tun-mode-cannot-enable | — |
| `/posts/tun-mode-cannot-enable/` | Clash TUN 无法开启 | 故障排查 | 1736 | 配置片段仅作理解，已提示"每次只改一项"；description 已加长 | → system-proxy-vs-tun | P3 |
| `/posts/dns-leak-check/` | Clash DNS 泄露 | 检测与修复 | 2124 | "智能多宿主名称解析"部分只给方向，无具体步骤——刻意保守（修改系统策略有风险）；Mihomo DNS 片段为通用示例 | → mihomo-yaml-basics | P3 |
| `/posts/connected-but-no-web/` | Clash 连接不上 / 无法上网 | 排查 | 1449 | 标题无"连接不上"，可考虑加长尾；与 windows-no-internet-after-exit 需在引言中互指 | → windows-no-internet-after-exit | P3 |
| `/posts/mihomo-yaml-basics/` | Mihomo 配置教程 / YAML | 入门 | 1871 | 示例为占位配置（`example.com`），已声明不可直接使用 | → override-keep-config | — |
| `/posts/subscription-update-failed/` | Clash 订阅更新失败 | 排查 | 1344 | 与 401-403-404 内容有少量交叉，已互链分工 | → override | — |
| `/posts/override-keep-config-on-update/` | Clash 规则覆写 | 防覆盖配置 | 1892 | Merge 的 `prepend-/append-` 关键字及界面位置依赖版本，已标注；建议实机核对后加版本号 | → mihomo-yaml-basics | P2（待实机验证） |
| `/posts/windows-no-internet-after-exit/` | 退出 Clash 后无法联网 | 恢复网络 | 1618 | 命令已给；微软参考链接为通用支持页，可换更具体页面 | → system-proxy-vs-tun | P3 |
| `/posts/how-to-read-speedtest-images/` | 机场测速怎么看 | 读图方法 | 1493 | 无实测、无截图（如实说明）；有价值但对商业词帮助有限 | → /speedtests/ | P3 |

## 栏目与功能页

| URL | 发现 | 处理 |
|---|---|---|
| `/clients/` | 正文有过期矛盾表述；缺"Clash 下载"关键词；缺 Clash Party | **已修复** |
| `/tutorials/` | 提示语与现状不符 | **已修复** |
| `/faq/`、`/troubleshooting/`、`/wiki/`、`/speedtests/` | title 过短无关键词 | **已修复**（seoTitle） |
| `/wiki/` | 正文仅 538 字，主要靠文章列表（薄页） | 保留，随新增文章增长 |
| `/compare/` | 正文 303 字，工具型页面 | 合理 |
| `/about/` | description 偏短 | **已修复** |
| `/speedtests/` | 无真实测速，已如实声明 | 保留 |

## 机场详情页（17）

- 正文 1706–3092 字，结构一致但内容字段来自各自资料，编辑点评/FAQ 各不相同；未发现同质化段落。
- 缺陷：10 家"支持导入 Clash"与 MD 原文冲突，只有转述依据（P2，已并列展示与说明）。
- 建议：取得书面依据后更新；不要向每篇教程强塞购买入口。

## 重复 / 合并建议

无需合并或删除；未发现低价值重复页。`connected-but-no-web` 与 `windows-no-internet-after-exit`、`system-proxy-vs-tun` 与 `tun-mode-cannot-enable` 意图不同，保留并互链。
