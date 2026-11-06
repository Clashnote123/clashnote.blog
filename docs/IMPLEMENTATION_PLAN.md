# IMPLEMENTATION_PLAN：Clash Note 全站实施方案

日期：2026-11-06

## 项目审计结论

- 工作目录 `博客 cloude\clashnote.blog` 开始时**为空**：没有 Hexo 项目、没有 Stellar 主题、没有文章。因此不存在"需要保留的旧页面/URL"，也没有可删除的内容。
- 指令中提到的 `ClashNote_ClaudeCode_项目包/CLAUDE_CODE_完整建站指令.md`、`数据审查说明.md`、`品牌资料/` 在桌面、下载、文档目录中**均未找到**。`Desktop\博客 cloude\Claude 完整建站指令.txt` 是另一个站点（"机场测试 / jichangshice.com.cn"）的指令，未用于本站，仅其中"不编造数据、区分资料与实测、年付不折月付"的原则与本次指令一致并被沿用。
- 实际使用的输入：`ClashNote_全站统一开发与优化指令.md`（已复制到 `docs/`）与 17 份品牌 MD（已复制到 `raw-data/`）。

## 技术路线（唯一）

Hexo 8.1.2 + 自研主题 `themes/clashnote`（纯 EJS + 一份 CSS + 一份 JS，无第三方主题依赖，无混装）。

| 模块 | 实现 |
|---|---|
| 品牌数据 | `tools/parse-airports.mjs` 解析 `raw-data/*.md` → `source/_data/airports.json` |
| 机场路由 | `scripts/generators.js` 生成 `/airports/`、`/airports/<slug>/`、`/compare/`、`/404.html` |
| 站内搜索 | 构建时生成 `/search.json`（57 条）；`main.js` 本地检索，无后端 |
| 对比 | 构建时生成 `/data/airports.json`；浏览器内对比 2–4 家 |
| SEO | 统一 `layout.ejs`；canonical/OG/Twitter；Article、Breadcrumb、WebSite、FAQPage JSON-LD；自写 sitemap；robots.txt |
| 验证 | `tools/check-site.mjs`（`npm run check`）静态检查全部输出页面 |

## 视觉系统

浅色科技风：背景 `#F7F9FC`、卡片 `#FFF`、文字 `#17243A`、主色 `#4169E1`、边框 `#E5EAF2`；深色模式为手动切换，默认浅色；所有页面共用同一导航、卡片、页脚与设计变量。

## 页面清单

`/`、`/tutorials/`、`/clients/`、`/troubleshooting/`、`/wiki/`、`/airports/`、`/airports/<17 slug>/`、`/compare/`、`/speedtests/`、`/faq/`、`/about/`、`/privacy/`、`/search/`、`/404.html`，以及 15 篇文章与标签/分类/归档（noindex）。

## 命令

```
npm run parse   # 重新解析品牌 MD
npm run build   # hexo clean && hexo generate
npm run check   # 静态检查
npx hexo server # 本地预览 http://localhost:4000
```
