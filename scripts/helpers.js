/* global hexo */
'use strict';

const SITE = 'https://clashnote.blog';

function abs(p) {
  if (!p) return SITE + '/';
  if (/^https?:\/\//.test(p)) return p;
  let s = p.startsWith('/') ? p : '/' + p;
  s = s.replace(/index\.html$/, '');
  return SITE + s;
}

function yuan(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return '未提供';
  return '¥' + (Number.isInteger(n) ? n : String(+n.toFixed(2)));
}

function gb(n) {
  if (!n) return '未提供';
  return n >= 1000 && n % 100 === 0 ? `${n / 1000} TB` : `${n} GB`;
}

function stripHtml(html, max) {
  const t = String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ').trim();
  return max ? t.slice(0, max) : t;
}

hexo.extend.helper.register('abs', abs);
hexo.extend.helper.register('yuan', yuan);
hexo.extend.helper.register('gb', gb);
hexo.extend.helper.register('strip_html_text', stripHtml);
hexo.extend.helper.register('jsonld', function (obj) {
  return '<script type="application/ld+json">' + JSON.stringify(obj).replace(/</g, '\\u003c') + '</script>';
});
hexo.extend.helper.register('cycle_label', function (k) {
  return { month: '月付', quarter: '季付', halfyear: '半年付', year: '年付', twoyear: '两年付', threeyear: '三年付' }[k] || k;
});
hexo.extend.helper.register('clash_badge', function (c) {
  // 统一数据源 clashSupport；字段缺失时回退为「待核实」，绝不输出 undefined
  const MAP = { supported: ['ok', '支持导入 Clash'], unsupported: ['no', '暂不支持导入 Clash'], unknown: ['mid', 'Clash 兼容待核实'] };
  const st = c && MAP[c.status] ? c.status : 'unknown';
  const title = String((c && c.evidence) || '').replace(/"/g, '&quot;');
  return `<span class="badge badge-${MAP[st][0]}" title="${title}">${MAP[st][1]}</span>`;
});
hexo.extend.helper.register('post_url', function (slug) {
  return '/posts/' + slug + '/';
});
hexo.extend.helper.register('post_by_slug', function (slug) {
  return this.site.posts.toArray().find(p => p.slug === slug) || null;
});
hexo.extend.helper.register('hub_posts', function (hub) {
  return this.site.posts.toArray().filter(p => p.hub === hub).sort((a, b) => a.order - b.order || b.date - a.date);
});
const REGIONS = ['香港', '台湾', '日本', '新加坡', '美国', '韩国', '马来西亚', '越南', '菲律宾', '泰国', '印度', '英国', '法国', '德国', '阿根廷', '土耳其', '巴西'];
hexo.extend.helper.register('airport_regions', function (a) {
  const text = [a.regions, a.regionCounts].join(' ');
  return REGIONS.filter(r => text.includes(r));
});
hexo.extend.helper.register('airport_lines', function (a) {
  const t = [a.lineTypeText, a.lineDetail].join(' ');
  return ['IEPL', 'IPLC', 'BGP'].filter(k => t.includes(k));
});
hexo.extend.helper.register('fmt_date', function (d) {
  return d ? d.format('YYYY-MM-DD') : '';
});
