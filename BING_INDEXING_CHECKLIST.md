# BING_INDEXING_CHECKLIST（人工验证清单）

本清单用于上线后在 Bing Webmaster Tools（BWT）验证。**我没有 BWT 访问权限，下面所有项目都是"待验证"，没有任何收录结论。** 能访问 ≠ 能抓取 ≠ 已收录 ≠ 第一页。

## A. 上线前（阻塞项）

- [ ] 确认托管平台与授权，把 `clashnote.blog` DNS 指向真实站点（当前为 AWS 停放页，A 记录 54.149.79.189 / 34.216.117.25）
- [ ] HTTPS 证书有效，`https://clashnote.blog/` 返回 200（当前 443 不可达）
- [ ] 决定 www：要么为 `www` 建 CNAME 并 301 到 `https://clashnote.blog/`，要么不使用 www（当前无记录）
- [ ] `http://` 301 → `https://`，且只跳一次，无循环
- [ ] 上线后 `curl -I` 检查：首页 200、`/robots.txt` 200、`/sitemap.xml` 200、404 页返回 404 状态码、无意外 `X-Robots-Tag`
- [ ] 若使用 Cloudflare：确认未开启拦截 Bingbot 的 Bot Fight / WAF 规则（可用 BWT 的 Live URL 检测验证）

## B. BWT 配置

- [ ] 添加站点 `https://clashnote.blog/` 并验证所有权（DNS TXT 或 meta 标签；meta 验证需要你提供代码，我再加入模板）
- [ ] Sitemaps → 提交 `https://clashnote.blog/sitemap.xml`（应读取到 43 条，状态"成功"）
- [ ] 确认 IndexNow 密钥可访问：`https://clashnote.blog/6c4281aa5435f66d2cea051ff7dca68a.txt`，内容等于密钥
- [ ] 上线并密钥可访问后：`node tools/indexnow.mjs`（dry-run 看变更）→ 确认无误再 `node tools/indexnow.mjs --submit`；记录返回状态（200/202 仅表示接收）

## C. URL 检查（Live URL / URL Inspection）优先清单

首页 `/`；`/tutorials/`；`/troubleshooting/`；`/clients/`；`/airports/`；`/compare/`；
`/posts/clash-verge-rev-import-subscription/`、`/posts/subscription-error-401-403-404/`、`/posts/dns-leak-check/`、`/posts/tun-mode-cannot-enable/`、`/posts/all-nodes-timeout/`；
`/airports/lingdongyun/`、`/airports/muguang-jiasu/`（各抽 2–3 家机场页）。

逐项记录：抓取是否成功 · 页面是否可索引 · Bing 看到的 canonical · 渲染 HTML 是否含正文。

## D. 观察指标（不要编造；以 BWT 导出为准）

| 指标 | 来源 | 频率 |
|---|---|---|
| 已收录页数 / 43 | BWT 索引报告 | 每周 |
| 抓取错误数 | BWT 抓取错误 | 每周 |
| 展示量、点击量、CTR、平均排名 | BWT 搜索表现（按页面/查询） | 每周 |
| 目标关键词的真实位置 | BWT 查询报表 + 手动无痕搜索（记录日期与地区） | 每两周 |
| Core Web Vitals（LCP/INP/CLS） | 上线后用 PageSpeed Insights / CrUX | 每月 |

## E. 预期与风险

- 新站从提交到收录通常需要数天到数周，且无保证；不要重复提交没有变化的 URL。
- 本站 58 个标签/分类/归档/搜索页为 noindex，不会也不应被收录。
