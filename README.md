# Clash Note（clashnote.blog）

Clash 教程、Mihomo 配置与机场选择指南。Hexo 8 + 自研主题 `clashnote`。

```bash
npm install
npm run parse     # 可选：重新解析 raw-data/*.md → source/_data/airports.json
npm run build     # hexo clean && hexo generate
npm run check     # 静态检查 public/
npx hexo server   # 本地预览 http://localhost:4000
```

- 机场数据：`raw-data/`（17 份原始资料）→ `source/_data/airports.json`；编辑点评在 `source/_data/editorial.yml`；FAQ 在 `faq.yml`。
- 新文章：`source/_posts/<slug>.md`，front matter 需 `order`、`hub`、`description`、`applies`、`verified`。
- 详见 `docs/`：`IMPLEMENTATION_PLAN.md`、`DATA_AUDIT.md`、`FINAL_AUDIT.md`。
- 未部署。部署前请确认域名、托管与授权。
