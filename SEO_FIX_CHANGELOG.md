# SEO_FIX_CHANGELOG

Git：检查点 `a0b13f5`（审计前）→ 修复提交 `bda893f`。回滚：`git revert bda893f` 或 `git checkout a0b13f5 -- .`。

## 已自动修复

| # | 问题 | 文件 | 修改 |
|---|---|---|---|
| 1 | clients 页过期/矛盾表述（"没有任何一家…""多数机场…"）与新状态冲突 | `source/clients/index.md` | 改为"兼容状态见机场推荐，附核实依据；官方客户端不等同于 Clash 客户端" |
| 2 | 同类矛盾表述 | `source/tutorials/index.md`、`source/_posts/subscription-error-401-403-404.md` | 改为中性表述 |
| 3 | description 偏短（46–48 字） | `source/about/index.md`、`no-nodes-after-import.md`、`subscription-error-401-403-404.md`、`tun-mode-cannot-enable.md` | 补充关键词与内容范围，控制在 ≤ 120 字 |
| 4 | 栏目页 title 过短、无关键词 | `source/{tutorials,troubleshooting,wiki,faq,speedtests,clients}/index.md` | 新增 `seoTitle`（≤ 60 字，唯一） |
| 5 | 缺"Clash 下载 / Clash Party"覆盖 | `source/clients/index.md` | H1、seoTitle、description 含"Clash 下载"；新增 Clash Party 条目（官方项目页链接，提示确认维护状态） |
| 6 | 缺 IndexNow | `source/6c4281aa5435f66d2cea051ff7dca68a.txt`、`tools/indexnow.mjs`、`.gitignore` | 新增密钥文件与 dry-run 工具；**未发送任何请求** |
| 7 | 缺审计工具 | `tools/seo-audit.mjs`、`tools/check-site.mjs` | 新增 SEO 数据导出；检查加入 `Clash: undefined` |

（此前同类修复：`Clash: undefined` 根因为数据值与模板映射不一致，已改统一 `clashSupport` 结构并加兜底。）

## 未修改（刻意保持）

机场排序、套餐价格、推广链接、文章 URL（permalink）、canonical 规则、sitemap 结构、robots.txt、UI 设计。sitemap `lastmod` 仍只使用真实 `date/updated`。

## 本次验证

构建通过（109 文件）；`check-site` 101 页 / 4287 链接 0 错误；`seo-audit` 可索引 43、noindex 58、无孤岛页、无重复 title/description、描述 50–120 字。

## 未修复 / 需你决定

1. **域名未部署（P0/P1）**：指向 AWS 停放页，443 不可达，robots/sitemap 404。需授权部署与 DNS。
2. 10 家机场"支持导入 Clash"仅有转述依据（P2）。
3. 缺页：Clash Party、YAML 报错、Android、macOS、IEPL/IPLC 解释、选机场指南（见 `KEYWORD_PAGE1_STRATEGY.md`）。
4. 无 og:image；无真实截图（P3）。
5. 线上响应头、Core Web Vitals、Bing 收录与排名：**未验证**。
6. 文章未实机验证，Verge Rev 界面名称需上线前核对版本。
7. `npm audit` 6 个 low（构建期依赖）。

## 追加（2026-11-07）：新增 3 篇文章
- `/posts/clash-yaml-error-fix/`（Clash YAML 错误，order 16，知识库）
- `/posts/iepl-iplc-bgp-explained/`（IEPL / IPLC / BGP，order 17，知识库）
- `/posts/clash-verge-rev-macos/`（macOS 指南，order 18，教程）
- 内链：mihomo-yaml-basics → YAML 报错；windows-install 与 /clients/ → macOS；/airports/ → IEPL 解释。
- 验证：构建 120 文件；check-site 112 页 / 4773 链接 0 错误；可索引 46、sitemap 46、无孤岛页。
- 对应 KEYWORD_PAGE1_STRATEGY.md 中 #13、#19、#20（macOS 部分）已建页；Android、Clash Party、选机场指南仍缺。文章未实机验证，已在"验证状态"标注。

## 追加（2026-11-07）：再新增 3 篇
- `/posts/clash-party-install-import/`（Clash Party，order 19）、`/posts/clash-android-import-guide/`（Android，order 20）、`/posts/how-to-choose-clash-airport/`（Clash 机场怎么选，order 21）。
- 机场兼容依据更新为"站长证实：可以导入 Clash，订阅链接必须通过客服渠道询问获取"；11 家 supported 页面均显示客服领取步骤与资料所列客服渠道；依据仍无书面记录。
- 内链：clients 页、import-subscription、/airports/ 指向新文章；新文章互链并指向报错排查。
- 对应策略表 #11（Clash Party）、#20（Android）、#17（选机场指南）已建页。

## 10. 首页标题与简介（2026-11-09）
- SEO title：`Clash 订阅机场推荐｜支持第三方客户端导入的机场服务大全`；首页 H1：`Clash 订阅机场推荐与第三方客户端导入指南`（同一页面，不冲突；此前首页并没有这两个标题）。
- 首页简介与 meta description 按站长提供文字更新（`_config.yml` 的 description 同步，作为未单独设置描述的页面的兜底）。
- 为避免与首页争"机场推荐"：`/airports/` 的 SEO title 改为 `17 家机场资料库：套餐、节点、线路与订阅获取指引 | Clash Note`（H1 与导航名不变）。
