# BING_SEO_AUDIT_REPORT

审计日期：2026-11-07　范围：本地构建（Hexo 8，`public/`）+ 对线上域名的实际探测。Git 检查点：`a0b13f5`（审计前）→ `bda893f`（本次修复）。

## 0. 结论（先看这里）

**clashnote.blog 目前没有上线本站。** 实测：

| 检查 | 结果 |
|---|---|
| DNS | `clashnote.blog` A 记录 = 54.149.79.189、34.216.117.25（AWS，**不是** Cloudflare） |
| `http://clashnote.blog/` | 200，但页面 `<title>Parking Page</title>`，`Server: openresty`，是域名停放页 |
| `https://clashnote.blog/*` | **443 端口连接失败**（Test-NetConnection 失败，请求超时） |
| `/robots.txt`、`/sitemap.xml` | HTTP 404（停放页） |
| `www.clashnote.blog` | 无法解析（无 DNS 记录） |

因此 Bing 现在**无法抓取任何本站内容**，更谈不上收录或排名。这是 P0/P1，必须先于一切内容优化解决：需要你授权并完成部署、把 DNS 指向真实托管，并启用 HTTPS。我没有部署，也没有修改 DNS。

本地构建本身技术状态良好（见下）。**无法获取 Bing Webmaster Tools 数据，所有"收录/排名"均为未验证。**

## 1. 全站 URL 清单（本地构建）

| 项目 | 数量 |
|---|---|
| HTML 页面总数 | 101 |
| 可索引页（在 sitemap 内，200 可抓取） | 43 |
| noindex 页（标签 / 分类 / 归档 / 搜索 / 404） | 58，均不在 sitemap |
| 文章 | 15（全部独立 H1、title、description、canonical） |
| 机场详情页 | 17，+ 机场列表 + 对比页 |
| 栏目与功能页 | 首页、教程、客户端、故障排查、知识库、测速、FAQ、关于、隐私 |
| 非 HTML 资源 | sitemap.xml、robots.txt、search.json、data/airports.json、IndexNow 密钥文件、favicon.svg、CSS、JS |

逐页数据（title/描述长度、正文字数、入链）见 `docs/seo-audit-data.json`，生成工具 `tools/seo-audit.mjs`。已检查页面：101/101（全部）。

## 2. 技术审计结果

| 项 | 状态 | 证据 |
|---|---|---|
| robots.txt | 通过 | `Allow: /`，不阻止 Bingbot 与资源；含 Sitemap 行 |
| noindex / X-Robots-Tag | 通过 | 仅标签、分类、归档、搜索、404 为 `noindex,follow`；静态站无 X-Robots-Tag 头（线上头**未验证**） |
| sitemap.xml | 通过 | 43 条，全部存在、可索引、canonical 一致；不含 noindex |
| Canonical | 通过 | 101 页逐页比对，0 不一致 |
| Title / Description / H1 | 通过（修复后） | 可索引页 title 15–58 字、无重复；每页恰好 1 个 H1；描述均在 50–120 字 |
| 正文是否静态输出 | 通过 | 文章/机场正文在服务端 HTML 中；JS 仅用于搜索、筛选、对比 |
| 结构化数据 | 通过 | Article + BreadcrumbList（文章）、BreadcrumbList（栏目/机场）、WebSite（首页）、FAQPage（/faq/）；全部可解析 |
| lang | 通过 | `zh-CN` |
| 图片 alt | 通过 | 全站无 `<img>`（图标为内联 SVG） |
| **og:image** | **缺失** | 43 个可索引页均无（见 P3） |
| 孤岛页 | 通过 | 所有可索引页主内容区入链 ≥ 1；文章入链 13–32 |
| 繁体字 / 占位文字 | 通过 | 扫描 0 命中 |
| 近似段落 | 通过 | 正文无跨文章重复；工具报出的 25 组均为"相关阅读"卡片摘要（设计性重复） |
| Cloudflare 拦截 Bingbot | **不适用/未验证** | 域名未接入 Cloudflare（DNS 为 AWS 停放页） |
| www / 非 www / HTTP / HTTPS 统一 | **未验证** | 线上未部署；www 无记录；HTTPS 不可达 |

## 3. IndexNow 与 Sitemap

- 已生成 IndexNow 密钥文件 `source/6c4281aa5435f66d2cea051ff7dca68a.txt`（内容即密钥；上线后应可访问 `https://clashnote.blog/6c4281aa5435f66d2cea051ff7dca68a.txt`）。
- `tools/indexnow.mjs`：**默认 dry-run，不发送请求**；只提交内容哈希有变化的 URL，单次 ≤100，记录 `.indexnow-state.json`；需 `--submit` 显式触发。**未提交任何请求**（站点未上线，提交会失败且无意义）。
- 提交成功（200/202）只表示被接收，不等于收录。
- sitemap 的 `lastmod`：文章用真实 `date/updated`；栏目页不写 lastmod（没有真实修改日期）；没有批量刷新日期。

## 4. 17 家机场资料冲突（新旧资料）

- **品牌 MD 原文**中：灵动云"订阅暂停"；微风、大佬云、飞V、无忧、Firefly、灵猫、Sogo云"不提供订阅/不支持第三方客户端"；其余 9 家"不推荐导入"。
- **站长后续转述**：灵动云（总指令）+ 暮光、微风、飞猫云、大佬云、隐形人、飞V、浪网、无忧、Firefly、Sogo云 共 11 家"运营方确认支持导入 Clash"；梯子云、唯兔云、灵猫、全球云、跨界、闪跃"待核实"。
- **冲突**：11 家中有 10 家的 MD 原文与"支持"相反。站点当前显示"支持导入 Clash"，依据是**口头转述，无书面记录、无订阅验证、`lastVerified` 为转述日期**。页面已并列显示 MD 原文与转述依据，并写明获取方式需问客服。**不能认定这 11 家已经过验证。**
- 其他已知冲突（`docs/DATA_AUDIT.md`）：飞猫云节点 57 vs 63；Sogo 15 国 vs 5 地区；灵动云 AI 列表含 Claude 与实测"Claude 无法连接"；"34 家"自述已剔除；优惠码折扣缺失；17 份资料均无资料日期。
- 兼容性字段扫描：全站（101 页、`/data/airports.json`）**无 undefined / null / NaN**；`check-site` 已加入 `Clash: undefined` 检测。

## 5. 问题清单

| 级别 | 问题 | URL / 文件 | 证据 | 状态 |
|---|---|---|---|---|
| **P0/P1** | 域名未部署：指向停放页，HTTPS 不可达，robots/sitemap 404 | `clashnote.blog` | DNS=AWS IP；:80 返回 "Parking Page"；:443 失败 | **未修复，需你授权部署与 DNS** |
| P1 | 线上 www/HTTPS/重定向/响应头无法验证 | — | 站点未上线 | 未验证 |
| P2 | 10 家"支持 Clash"仅有转述依据，与 MD 原文冲突 | `/airports/*` | `docs/DATA_AUDIT.md` §6 | 已并列标注，**需书面依据** |
| P2 | 关键词缺口：缺 Android / macOS / Clash Party 教程、YAML 报错排查、IEPL/IPLC 解释、机场挑选指南 | 见 KEYWORD_PAGE1_STRATEGY.md | 全站扫描 | 建议新建（未自动写） |
| P2 | clients 页正文含过期矛盾表述"没有任何一家…""多数机场…" | `source/clients/index.md` 等 3 处 | grep | **已修复** |
| P2 | 4 个页面 description 偏短（46–48 字） | about、3 篇文章 | seo-audit | **已修复** |
| P2 | 栏目页 title 过短、无关键词（"故障排查 \| Clash Note"等 6 个） | tutorials/troubleshooting/wiki/faq/speedtests/clients | seo-audit | **已修复**（seoTitle） |
| P2 | 无"Clash 下载 / Clash Party"覆盖 | `/clients/` | 关键词扫描 0 命中 | **已修复**（标题、H1、描述、Clash Party 条目） |
| P3 | 无 og:image / 社交卡片图 | 全站 | 43 页缺失 | 未修复（需设计素材 PNG/JPG） |
| P3 | 站内无任何真实截图 | 文章 | 全站无 `<img>` | 未修复（需真实截图） |
| P3 | 文章未实机验证（界面名称随版本变化） | `_posts/*` | `verified` 字段已标注 | 保留标注 |
| P3 | npm audit 6 个 low（构建期） | package.json | npm audit | 未处理 |
| P3 | 未测 LCP/INP/CLS | — | 无真实线上环境 | 未验证 |

## 6. 本地构建与测试

- `hexo clean && hexo generate`：通过（109 文件）。
- `tools/check-site.mjs`：101 页、4287 链接，0 错误 0 警告（含 canonical、唯一 title/description、H1、JSON-LD、死链与锚点、sitemap、undefined）。
- `tools/seo-audit.mjs`：见 §1–2。
- 内置浏览器：搜索、筛选（支持 11 / 待核实 6）、对比、深色、抽屉；17 个机场页 320/390/768 px 无横向溢出（上一轮）。
- 无 lint / TypeScript / Playwright 配置（项目未安装），未运行；用内置浏览器脚本替代。
- **未验证**：线上响应、Bingbot 抓取、Core Web Vitals、Bing 收录与排名。

## 7. 需要你单独决定的事项（我没有擅自执行）

部署上线与 DNS；为 10 家补书面依据或改回待核实；新建文章（Android/macOS/Clash Party/YAML 报错/IEPL-IPLC/机场挑选）；提交 IndexNow（上线后 `node tools/indexnow.mjs --submit`）；og:image 素材；任何 301 或永久链接调整。
