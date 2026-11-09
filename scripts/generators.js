/* global hexo */
'use strict';

const SITE = 'https://clashnote.blog';
const KNOWN_REGIONS = ['香港', '台湾', '日本', '新加坡', '美国', '韩国', '马来西亚', '越南', '菲律宾', '泰国', '印度', '英国', '法国', '德国', '阿根廷', '土耳其', '巴西'];

function strip(html, max) {
  const t = String(html || '').replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ').trim();
  return max ? t.slice(0, max) : t;
}

function lite(a) {
  const text = [a.regions, a.regionCounts].join(' ');
  const regions = KNOWN_REGIONS.filter(r => text.includes(r));
  const lt = [a.lineTypeText, a.lineDetail].join(' ');
  const lines = ['IEPL', 'IPLC', 'BGP'].filter(k => lt.includes(k));
  const cyc = a.plans.cycle.filter(p => !p.limited);
  return {
    id: a.id, rank: a.rank, slug: a.slug, name: a.name, aliases: a.aliases,
    url: `/airports/${a.slug}/`,
    regions, lines,
    nodeText: a.regions,
    minMonthly: a.derived.minMonthly,
    maxMonthlyGB: a.derived.maxMonthlyGB,
    devices: a.devices,
    multiplier: a.multiplier,
    nativeIp: a.nativeIp, residentialIp: a.residentialIp,
    coupon: a.coupon,
    plans: cyc.map(p => ({ name: p.name, gb: p.trafficGB, prices: p.prices, perGbMonthly: p.perGbMonthly || null })),
    hasOneTime: a.plans.onetime.length > 0,
    sourceFile: a.sourceFile,
  };
}

hexo.extend.generator.register('clashnote-routes', function (locals) {
  const data = locals.data || {};
  const airports = data.airports || [];
  const editorial = data.editorial || {};
  const routes = [];

  routes.push({
    path: 'airports/index.html', layout: ['airports'],
    data: {
      title: '机场推荐：17 家机场资料库', path: 'airports/', type: 'airports',
      seoTitle: '机场推荐：17 家机场资料、套餐与 Clash 订阅获取指引 | Clash Note',
      description: '按固定编辑顺序整理 17 家机场的节点地区、线路类型与套餐价格，并附 Clash 订阅获取指引；数据来自各品牌提供的资料，可按地区、预算和线路筛选。',
    },
  });

  airports.forEach((a, i) => {
    const ed = editorial[a.slug] || {};
    routes.push({
      path: `airports/${a.slug}/index.html`, layout: ['airport'],
      data: {
        title: ed.h1 || `${a.name}：套餐、节点与 Clash 订阅获取指引`,
        seoTitle: ed.seoTitle || `${a.name}套餐、节点与 Clash 订阅获取指引 | Clash Note`,
        description: ed.seoDesc || `${a.name}的节点地区、线路、套餐价格整理，附 Clash 订阅获取指引。`,
        path: `airports/${a.slug}/`, type: 'airport',
        airport: a, ed,
        prevA: airports[i - 1] || null, nextA: airports[i + 1] || null,
      },
    });
  });

  routes.push({
    path: 'compare/index.html', layout: ['compare'],
    data: {
      title: '机场套餐对比', path: 'compare/', type: 'compare',
      seoTitle: '机场套餐对比：2–4 家并排比较价格、流量与线路 | Clash Note',
      description: '选择 2–4 家机场并排比较月付起价、月流量、节点地区与线路，价格口径区分月付与年付，缺失数据明确标注。',
    },
  });

  routes.push({
    path: 'data/airports.json',
    data: JSON.stringify(airports.map(lite)),
  });

  routes.push({
    path: '404.html', layout: ['404'],
    data: { title: '页面未找到', path: '404.html', noindex: true, type: '404', description: '你访问的页面不存在，可使用搜索或返回首页。' },
  });

  // ---------- 搜索索引 ----------
  const index = [];
  locals.posts.forEach(p => {
    index.push({
      t: p.title, u: '/' + p.path.replace(/index\.html$/, ''), c: '教程',
      s: p.description || strip(p.excerpt || p.content, 120),
      k: [].concat(p.tags.map(t => t.name), p.categories.map(c => c.name), p.keywords || []).join(' '),
      b: strip(p.content, 900),
    });
  });
  const pageMeta = {
    'tutorials/': 'Clash 教程目录 新手入门 学习路径', 'clients/': '客户端下载 Windows macOS Android iOS Clash Verge Rev FlClash',
    'troubleshooting/': '故障排查 报错 401 403 404 超时 没有节点', 'wiki/': 'Mihomo 知识库 YAML DNS TUN 规则',
    'about/': '关于 编辑原则 数据来源 商业链接披露', 'privacy/': '隐私 数据处理 本地存储', 'faq/': '常见问题 FAQ',
    'speedtests/': '节点测速 测速方法 延迟 下载 凭证',
  };
  locals.pages.forEach(p => {
    const key = p.path.replace(/index\.html$/, '');
    if (pageMeta[key]) index.push({ t: p.title, u: '/' + key, c: '栏目', s: p.description || '', k: pageMeta[key], b: strip(p.content, 600) });
  });
  index.push({ t: '机场推荐：17 家机场资料库', u: '/airports/', c: '机场', s: '17 家机场固定顺序目录，可按地区、预算、线路筛选。', k: '机场推荐 机场列表 筛选', b: '' });
  index.push({ t: '机场套餐对比', u: '/compare/', c: '机场', s: '2–4 家机场并排比较价格、流量与线路。', k: '套餐对比 比较 价格', b: '' });
  airports.forEach(a => {
    const l = lite(a);
    index.push({
      t: `${a.name}${a.englishName ? '（' + a.englishName + '）' : ''}`, u: `/airports/${a.slug}/`, c: '机场',
      s: ((editorial[a.slug] || {}).intro) || a.positioning || '', k: [a.name, ...(a.aliases || []), a.regions, l.lines.join(' '), a.coupon ? a.coupon.code : ''].join(' '),
      b: [a.advantage, a.audience, a.lineTypeText].filter(Boolean).join(' '),
    });
  });
  (data.faq || []).forEach(g => (g.items || []).forEach(it => {
    index.push({ t: it.q, u: `/faq/#${it.id}`, c: 'FAQ', s: strip(it.a, 110), k: g.title, b: strip(it.a, 400) });
  }));
  routes.push({ path: 'search.json', data: JSON.stringify(index) });

  // ---------- sitemap.xml ----------
  const urls = [];
  const add = (loc, lastmod) => urls.push({ loc, lastmod });
  add('/', '2026-11-06');
  Object.keys(pageMeta).forEach(k => add('/' + k));
  add('/airports/'); add('/compare/');
  airports.forEach(a => add(`/airports/${a.slug}/`));
  locals.posts.forEach(p => add('/' + p.path.replace(/index\.html$/, ''), (p.updated || p.date).format('YYYY-MM-DD')));
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map(u => `  <url><loc>${SITE}${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`).join('\n') + '\n</urlset>\n';
  routes.push({ path: 'sitemap.xml', data: xml });

  return routes;
});
