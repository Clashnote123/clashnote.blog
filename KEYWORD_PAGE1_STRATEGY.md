# KEYWORD_PAGE1_STRATEGY

**没有任何关键词工具、Bing Webmaster 或搜索结果数据，因此本文不含搜索量、难度、当前排名；所有"机会"都是待验证假设。** 目标是让每个重要关键词有一篇真正解决问题的核心页，并不保证进入 Bing 第一页。

## 1. 主题集群现状

| 集群 | 核心页 | 支持文章 | 状态 |
|---|---|---|---|
| A 新手入门 | `/tutorials/` | windows-install、rule-global-direct-mode | 有 |
| B Verge Rev 使用 | `/posts/clash-verge-rev-windows-install/` | import-subscription、override | 有（仅 Windows） |
| C 订阅导入与更新 | `/posts/clash-verge-rev-import-subscription/` | 401-403-404、no-nodes、subscription-update-failed | 完整 |
| D DNS 与 TUN | `/posts/system-proxy-vs-tun/` | tun-mode-cannot-enable、dns-leak-check、windows-no-internet-after-exit、connected-but-no-web | 完整 |
| E Mihomo 配置 | `/posts/mihomo-yaml-basics/` | override-keep-config、dns-leak-check | 有，缺"YAML 报错排查" |
| F 分平台指南 | — | — | **缺 Android、macOS** |
| G 机场与套餐 | `/airports/`、`/compare/` | 17 家详情页 | 有，缺"如何选机场/IEPL-IPLC 解释" |
| H 测速与解锁 | `/speedtests/` | how-to-read-speedtest-images | 有（无真实测速） |

## 2. 20 个优先关键词与对应 URL

"状态"= 本地内容扫描结果；"待验证"= 需上线后用 Bing 数据确认。

| # | 关键词 | 主页面 | 状态 / 动作 |
|---|---|---|---|
| 1 | Clash Verge Rev 教程 | `/posts/clash-verge-rev-windows-install/` | 已覆盖；上线后观察 |
| 2 | Clash 订阅导入 | `/posts/clash-verge-rev-import-subscription/` | 已覆盖，核心页 |
| 3 | Clash 订阅更新失败 | `/posts/subscription-update-failed/` | 已覆盖（标题含） |
| 4 | Clash 节点超时 | `/posts/all-nodes-timeout/` | 已覆盖（标题"全部超时"，正文含"节点超时"） |
| 5 | Clash 连接不上 | `/posts/connected-but-no-web/` | 部分覆盖，标题无"连接不上"；可在正文引言补一句，非必须 |
| 6 | Clash TUN 模式 | `/posts/system-proxy-vs-tun/` + `/posts/tun-mode-cannot-enable/` | 已覆盖；**避免两篇争夺**：前者"区别"，后者"无法开启" |
| 7 | Clash DNS 泄露 | `/posts/dns-leak-check/` | 已覆盖 |
| 8 | Clash 规则模式 / 全局模式 | `/posts/clash-rule-global-direct-mode/` | 已覆盖 |
| 9 | Windows 11 Clash | `/posts/clash-verge-rev-windows-install/` | 已覆盖 |
| 10 | Clash 下载 / Clash Verge Rev 下载 | `/clients/` | **本次已补**标题/H1/描述；下载入口为官方 Releases |
| 11 | Clash Party 教程 | — | **缺页**：`/clients/` 仅有一行介绍。建议新建"Clash Party 安装与导入订阅" |
| 12 | Clash 配置教程 / 配置文件 | `/posts/mihomo-yaml-basics/` | 已覆盖 |
| 13 | Clash YAML 错误 | — | **缺页**：建议新建"Clash YAML 报错怎么看（缩进/冒号/Tab）" |
| 14 | Clash 无法上网 | `/posts/connected-but-no-web/` + `/posts/windows-no-internet-after-exit/` | 已覆盖，需明确两篇分工 |
| 15 | Mihomo 配置教程 | `/posts/mihomo-yaml-basics/` | 已覆盖 |
| 16 | Mihomo DNS 配置 | `/posts/dns-leak-check/` | 部分覆盖（含 dns 配置片段）；可后续拆"Mihomo DNS 配置详解" |
| 17 | Clash 机场 / 机场推荐 / Clash 机场推荐 | `/airports/` | 有列表；**顺序非性能排名**，不适合直接对"推荐/稳定"类词承诺；建议补"怎么选机场"指南 |
| 18 | 稳定机场 | — | **缺页且需证据**：没有测速凭证前，不应做"稳定机场榜" |
| 19 | IEPL 机场 / IPLC 机场 | `/airports/`（筛选）+ 各详情页 | **缺解释文章**："IEPL 与 IPLC 的区别与怎么看资料" |
| 20 | Clash Android / macOS 教程 | — | **缺页**：集群 F 空缺 |

## 3. 关键词争夺检查

- 订阅类：import-subscription（怎么导）/401-403-404（报错）/no-nodes（无节点）/update-failed（更新）——意图已区分，无争夺。
- TUN：system-proxy-vs-tun（原理对比）vs tun-mode-cannot-enable（故障）——已分工。
- `/airports/` 与 17 个详情页：列表对"机场推荐"，详情对"品牌名 + 套餐"，无重复正文（详情页平均 2000+ 字，品牌差异字段来自各自资料）。
- 全站无两个页面使用相同 title/description。

## 4. 建议新增内容（需你确认，未自动写入）

1. Clash Party 安装与导入订阅（#11）
2. Clash YAML 报错怎么看（#13）
3. Clash Verge Rev macOS / Android 使用指南（#20，各一篇，注意 Android 客户端维护状态需先核实）
4. IEPL / IPLC / BGP 是什么，怎么看机场资料（#19）
5. 怎么选机场：用流量、预算、Clash 兼容状态筛选（#17；不放购买入口堆砌）

写作原则：解决具体问题、有步骤和验证、引用官方文档；不抄竞品；无截图不假装有截图。

## 5. 30 / 60 / 90 天计划

**前 30 天（先让它能被抓取）**：部署并验证 DNS/HTTPS/www；BWT 验证与 sitemap 提交；IndexNow 首次提交；检查 15 篇文章与 17 个机场页的 Live URL；补 og:image；写 #11、#13。指标：已收录数/43、抓取错误=0、首批展示量。

**31–60 天（补缺口）**：发布 Android、macOS、IEPL/IPLC 解释；用 BWT 查询报表找"有展示、低点击"的页面，仅优化其 title/description；为 10 家"支持 Clash"补书面依据。指标：展示量、点击量、CTR、平均排名（按页面）。

**61–90 天（提升）**：对排名接近第一页且内容有缺口的页面补内容与内链；视真实测速记录决定是否开放"测速"类内容；复查竞品 SERP 的内容类型与深度（不复制）。指标：目标关键词真实位置（附日期/地区）、已收录率、自然点击。

## 6. 分层（上线并有数据后填写）

1 已收录且接近第一页：待验证 · 2 已收录排名较低：待验证 · 3 有页面但未收录：待验证 · 4 尚未建立页面：#11、#13、#18、#19 解释、#20。
