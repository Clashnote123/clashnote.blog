// 根据 airports.json / editorial.yml / 文章 front matter 生成 README.md（机场推荐置顶）
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const yaml = createRequire(import.meta.url)('js-yaml');
const SITE = 'https://clashnote.blog';
const air = JSON.parse(fs.readFileSync(path.join(root, 'source/_data/airports.json'), 'utf8'));
const ed = yaml.load(fs.readFileSync(path.join(root, 'source/_data/editorial.yml'), 'utf8'));
const dir = path.join(root, 'source/_posts');
const posts = fs.readdirSync(dir).filter(f => f.endsWith('.md')).map(f => {
  const t = fs.readFileSync(path.join(dir, f), 'utf8'); const fm = yaml.load(t.match(/^---\n([\s\S]*?)\n---/)[1] || t.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
  return { slug: f.replace(/\.md$/, ''), title: fm.title, order: fm.order || 99, hub: fm.hub, cat: (fm.categories || [])[0] };
}).sort((a, b) => a.order - b.order);
const regs = a => ['香港', '台湾', '日本', '新加坡', '美国', '韩国', '马来西亚', '越南', '菲律宾', '泰国', '印度', '英国', '法国', '德国', '阿根廷', '土耳其', '巴西'].filter(r => (a.regions + a.regionCounts).includes(r));
const first = s => String(s || '').split('。')[0];
const esc = s => String(s).replace(/\|/g, '／');

const rows = air.map(a => {
  const mm = a.derived.minMonthly; const e = ed[a.slug] || {};
  const link = a.referralUrl ? `[官网注册](${a.referralUrl})` : (a.officialUrl ? `[官网](${a.officialUrl})` : '—');
  return `| ${String(a.rank).padStart(2, '0')} | **[${a.name}](${SITE}/airports/${a.slug}/)** | ¥${mm.price}（${mm.plan} ${mm.gb} GB） | ${regs(a).slice(0, 5).join('、')}${regs(a).length > 5 ? ' 等' : ''} | ${esc(first(e.intro || a.positioning))} | ${link} |`;
});
const group = (hubs, title) => {
  const list = posts.filter(p => hubs.includes(p.cat));
  return list.length ? `### ${title}\n\n${list.map(p => `- [${p.title}](${SITE}/posts/${p.slug}/)`).join('\n')}\n` : '';
};
const nPosts = posts.length;

const md = `# Clash Note｜Clash 订阅机场推荐与第三方客户端导入指南

> 专注 Clash 机场推荐与第三方订阅导入，整理兼容 Clash、Mihomo 的机场服务，提供订阅获取、节点配置及客户端教程。
>
> 网站：[${SITE}](${SITE})（部署中；上线前部分链接暂不可访问）

本站整理 **${air.length} 家机场**的套餐、节点地区、线路类型与订阅获取方式，兼容 Clash Verge Rev、Mihomo Party、Clash Party 等第三方客户端，并提供订阅导入、节点更新、DNS 配置、TUN 模式与连接故障排查教程。

## 机场推荐（${air.length} 家）

${air.length} 家机场按**固定的编辑顺序**排列，**不是性能排名**。价格、节点与规则取自各品牌提供的资料，实际以官网结算页为准。

| # | 机场 | 月付起价 | 节点地区 | 特点 | 入口 |
|---|---|---|---|---|---|
${rows.join('\n')}

**Clash 订阅怎么拿：** 站长已确认上述机场都可以通过订阅链接导入 Clash 等第三方客户端，订阅链接**需要通过官网客服渠道获取**，没有公开入口。具体套餐与获取方式以客服答复为准（该结论目前为站长转述，无书面记录）。

- 流程与话术：[向机场客服索取 Clash 订阅](${SITE}/posts/get-clash-subscription-from-support/)
- 完整路线：[想用 Clash 或第三方客户端？先注册官方账号，再向客服索取订阅链接](${SITE}/posts/register-official-account-get-clash-subscription/)
- 选择思路：[Clash 机场怎么选](${SITE}/posts/how-to-choose-clash-airport/)、[17 家机场各有什么不同](${SITE}/posts/airport-differences-by-need/)
- 并排对比价格与流量：[套餐对比](${SITE}/compare/)

**付款方式：** 17 家统一通过支付宝付款；金额较大（超过 ¥500–¥1000）可联系客服使用微信或 USDT 渠道。

> **商业披露：** 表中"官网注册"为推广链接（sponsored），通过链接注册可能为本站带来佣金，但不影响购买价格。本站为独立内容站，不是 Clash、Mihomo 或任何客户端、机场的官方网站。

## 教程与文章（${nPosts} 篇）

${group(['新手入门'], '新手入门与客户端')}
${group(['机场选择'], '机场选择与订阅获取')}
${group(['故障排查'], '故障排查')}
${group(['Mihomo 知识库'], 'Mihomo 知识库')}
${group(['节点测速'], '节点测速')}
## 站点栏目

| 栏目 | 说明 |
|---|---|
| [机场推荐](${SITE}/airports/) | ${air.length} 家机场资料库，可按地区、预算、线路筛选 |
| [套餐对比](${SITE}/compare/) | 2–4 家机场并排比较 |
| [Clash 教程](${SITE}/tutorials/) | 从安装到排查的教程目录 |
| [客户端下载](${SITE}/clients/) | 各系统客户端与官方下载渠道 |
| [故障排查](${SITE}/troubleshooting/) | 按报错与症状查找 |
| [Mihomo 知识库](${SITE}/wiki/) | YAML、DNS、规则覆写 |
| [节点测速](${SITE}/speedtests/) | 测速方法与记录（目前仅 1 条站长提供、未独立复测的记录） |
| [常见问题](${SITE}/faq/) | FAQ |

## 编辑原则

- 不编造价格、测速、评价；资料没有的内容标注"未提供"。
- 机场顺序为固定编辑顺序，不代表质量或速度排名。
- 测速记录需注明工具、时间与来源；未独立复测的会明确标出。
- 本站不提供、不公开任何订阅链接或令牌。

## 本地开发

技术栈：Hexo 8 + 自研主题 \`clashnote\`。

\`\`\`bash
npm install
npm run parse     # 可选：重新解析 raw-data/*.md → source/_data/airports.json
npm run build     # hexo clean && hexo generate
npm run check     # 静态检查 public/
npx hexo server   # 本地预览 http://localhost:4000
npm run readme    # 重新生成本 README
\`\`\`

- 机场数据：\`source/_data/airports.json\`；编辑点评 \`source/_data/editorial.yml\`；FAQ \`faq.yml\`；测速记录 \`speedtests.yml\`。
- 新文章：\`source/_posts/<slug>.md\`，front matter 需 \`order\`、\`hub\`、\`description\`、\`applies\`、\`verified\`。
- 审计与说明见 \`docs/\` 与根目录的 \`BING_SEO_AUDIT_REPORT.md\` 等文件。
`;
fs.writeFileSync(path.join(root, 'README.md'), md.replace(/\n{3,}/g, '\n\n'), 'utf8');
console.log('README generated:', md.length, 'chars,', air.length, 'airports,', nPosts, 'posts');
