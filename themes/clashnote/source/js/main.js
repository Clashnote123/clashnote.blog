(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function h(tag, attrs, kids) {
    var el = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') el.textContent = attrs[k]; else if (k === 'class') el.className = attrs[k]; else el.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return el;
  }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* ---------- theme ---------- */
  var root = document.documentElement;
  var tt = $('#themeToggle');
  if (tt) tt.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next); store('cn-theme', next);
  });

  /* ---------- drawer ---------- */
  var drawer = $('#drawer'), menuBtn = $('#menuBtn');
  function setDrawer(open) {
    if (!drawer) return; drawer.hidden = !open; menuBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (menuBtn) menuBtn.addEventListener('click', function () { setDrawer(true); });
  $$('[data-close-drawer]').forEach(function (b) { b.addEventListener('click', function () { setDrawer(false); }); });

  /* ---------- search engine ---------- */
  var indexPromise = null, seq = 0;
  function loadIndex() {
    if (!indexPromise) indexPromise = fetch('/search.json').then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).catch(function (e) { indexPromise = null; throw e; });
    return indexPromise;
  }
  function norm(s) { return String(s || '').toLowerCase(); }
  function bigrams(s) { var out = [], t = s.replace(/\s+/g, ''); for (var i = 0; i < t.length - 1; i++) out.push(t.slice(i, i + 2)); return out; }
  function search(index, q) {
    var query = norm(q).trim(); if (!query) return [];
    var terms = query.split(/\s+/).filter(Boolean);
    var res = [];
    index.forEach(function (it) {
      var t = norm(it.t), k = norm(it.k), s = norm(it.s), b = norm(it.b), score = 0, ok = true;
      terms.forEach(function (w) {
        var sc = 0; if (t.indexOf(w) > -1) sc += 10; if (k.indexOf(w) > -1) sc += 5; if (s.indexOf(w) > -1) sc += 3; if (b.indexOf(w) > -1) sc += 1;
        if (!sc) ok = false; score += sc;
      });
      if (ok) res.push({ it: it, score: score });
    });
    if (!res.length) {
      var grams = bigrams(query);
      if (grams.length > 1) index.forEach(function (it) {
        var hay = norm(it.t + ' ' + it.k + ' ' + it.s + ' ' + it.b), hit = 0, th = 0;
        grams.forEach(function (g) { if (hay.indexOf(g) > -1) hit++; if (norm(it.t).indexOf(g) > -1) th++; });
        if (hit / grams.length >= 0.6) res.push({ it: it, score: hit + th * 2 });
      });
    }
    res.sort(function (a, b) { return b.score - a.score; });
    return res.map(function (r) { return r.it; });
  }
  function hl(text, terms) {
    var frag = document.createDocumentFragment(), s = String(text), lower = s.toLowerCase(), i = 0;
    var ranges = [];
    terms.forEach(function (w) { if (!w) return; var p = 0, x; while ((x = lower.indexOf(w, p)) > -1) { ranges.push([x, x + w.length]); p = x + w.length; } });
    ranges.sort(function (a, b) { return a[0] - b[0]; });
    ranges.forEach(function (r) {
      if (r[0] < i) return; frag.appendChild(document.createTextNode(s.slice(i, r[0]))); frag.appendChild(h('mark', { text: s.slice(r[0], r[1]) })); i = r[1];
    });
    frag.appendChild(document.createTextNode(s.slice(i))); return frag;
  }
  function renderResults(box, items, q, limit) {
    box.textContent = '';
    var terms = norm(q).trim().split(/\s+/);
    if (!items.length) { box.appendChild(h('div', { class: 'sr-empty', text: '没有找到「' + q + '」相关内容。试试更短的关键词，如：订阅、DNS、TUN、灵动云。' })); return; }
    items.slice(0, limit || 8).forEach(function (it) {
      var a = h('a', { class: 'sr-item', href: it.u });
      var strong = h('strong'); strong.appendChild(h('em', { text: it.c })); strong.appendChild(hl(it.t, terms));
      a.appendChild(strong);
      var sm = h('span'); sm.appendChild(hl((it.s || '').slice(0, 90), terms)); a.appendChild(sm);
      box.appendChild(a);
    });
  }
  function bindLive(input, box, limit) {
    var timer;
    function run() {
      var q = input.value, my = ++seq;
      if (!q.trim()) { box.textContent = ''; return; }
      loadIndex().then(function (idx) { if (my !== seq) return; renderResults(box, search(idx, q), q, limit); })
        .catch(function () { if (my === seq) { box.textContent = ''; box.appendChild(h('div', { class: 'sr-empty', text: '搜索索引加载失败，请刷新页面重试。' })); } });
    }
    input.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(run, 80); });
    input.addEventListener('focus', function () { loadIndex().catch(function () {}); });
    return run;
  }

  /* modal */
  var modal = $('#searchModal'), mInput = $('#modalSearchInput'), mBox = $('#modalResults'), lastFocus = null;
  function openSearch() { if (!modal) return; setDrawer(false); lastFocus = document.activeElement; modal.hidden = false; document.body.style.overflow = 'hidden'; mInput.focus(); mInput.select(); loadIndex().catch(function () {}); }
  function closeSearch() { if (!modal || modal.hidden) return; modal.hidden = true; document.body.style.overflow = ''; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  if (modal) {
    bindLive(mInput, mBox, 10);
    $$('[data-open-search]').forEach(function (b) { b.addEventListener('click', openSearch); });
    $$('[data-close-search]').forEach(function (b) { b.addEventListener('click', closeSearch); });
    modal.addEventListener('keydown', function (e) {
      var items = $$('.sr-item', mBox); if (!items.length) return;
      var cur = items.findIndex(function (x) { return x.classList.contains('sel'); });
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault(); var n = e.key === 'ArrowDown' ? Math.min(cur + 1, items.length - 1) : Math.max(cur - 1, 0);
        items.forEach(function (x) { x.classList.remove('sel'); }); items[n].classList.add('sel'); items[n].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter' && cur > -1) { e.preventDefault(); location.href = items[cur].getAttribute('href'); }
    });
  }
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); }
    else if (e.key === 'Escape') { closeSearch(); setDrawer(false); }
  });

  /* hero inline search */
  var hero = $('[data-search-form][data-inline]');
  if (hero) {
    var hi = $('input', hero), hb = $('.inline-results', hero); bindLive(hi, hb, 6);
    document.addEventListener('click', function (e) { if (!hero.contains(e.target)) hb.textContent = ''; });
  }
  /* search page */
  var sp = $('[data-search-page]');
  if (sp) {
    var si = $('#pageSearchInput'), sr = $('#pageSearchResults'), sm = $('#pageSearchMeta');
    var q0 = new URLSearchParams(location.search).get('q') || ''; si.value = q0;
    function doPage(q) {
      var my = ++seq; if (!q.trim()) { sr.textContent = ''; sm.textContent = '请输入关键词。'; return; }
      loadIndex().then(function (idx) {
        if (my !== seq) return; var r = search(idx, q); sm.textContent = '「' + q + '」共 ' + r.length + ' 条结果';
        renderResults(sr, r, q, 50);
      }).catch(function () { sm.textContent = '搜索索引加载失败，请刷新重试。'; });
    }
    sp.addEventListener('submit', function (e) { e.preventDefault(); var q = si.value; history.replaceState(null, '', '/search/?q=' + encodeURIComponent(q)); doPage(q); });
    doPage(q0);
  }

  /* ---------- airports filter ---------- */
  var grid = $('#airGrid');
  if (grid) {
    var cards = $$('[data-airport]', grid), F = { q: $('#fQ'), region: $('#fRegion'), clash: $('#fClash'), budget: $('#fBudget'), line: $('#fLine'), sort: $('#fSort') };
    var count = $('#fCount'), empty = $('#fEmpty');
    function applyF() {
      var q = norm(F.q.value).trim(), n = 0;
      cards.forEach(function (c) {
        var d = c.dataset, show = true;
        if (q && d.name.indexOf(q) === -1) show = false;
        if (F.region.value && d.regions.split(',').indexOf(F.region.value) === -1) show = false;
        if (F.clash.value && d.clash !== F.clash.value) show = false;
        if (F.budget.value && !(d.min !== '' && parseFloat(d.min) <= parseFloat(F.budget.value))) show = false;
        if (F.line.value && d.lines.split(',').indexOf(F.line.value) === -1) show = false;
        c.hidden = !show; if (show) n++;
      });
      var s = F.sort.value, sorted = cards.slice().sort(function (a, b) {
        if (s === 'price') return (parseFloat(a.dataset.min) || 1e9) - (parseFloat(b.dataset.min) || 1e9);
        if (s === 'gb') return (parseFloat(b.dataset.maxgb) || 0) - (parseFloat(a.dataset.maxgb) || 0);
        return a.dataset.rank - b.dataset.rank;
      });
      sorted.forEach(function (c) { grid.appendChild(c); });
      count.textContent = (n === cards.length ? '共 ' : '符合条件 ') + n + ' 家' + (n === cards.length ? '' : '（共 ' + cards.length + ' 家）');
      empty.hidden = n !== 0;
    }
    Object.keys(F).forEach(function (k) { F[k].addEventListener('input', applyF); F[k].addEventListener('change', applyF); });
    $('#fReset').addEventListener('click', function () { Object.keys(F).forEach(function (k) { F[k].value = k === 'sort' ? 'rank' : ''; }); applyF(); });
    $('#airFilters').addEventListener('submit', function (e) { e.preventDefault(); });
  }

  /* ---------- compare ---------- */
  var cmp = $('#compareApp');
  if (cmp) {
    var chips = $$('.chip-btn', cmp), sel = [], data = null, tbl = $('#cmpTable'), res = $('#cmpResult'), msg = $('#cmpMsg'), cc = $('#cmpCount');
    var money = function (n) { return n === null || n === undefined ? '未提供' : '¥' + (Math.round(n * 100) / 100); };
    var gbt = function (n) { return n ? (n >= 1000 && n % 100 === 0 ? n / 1000 + ' TB' : n + ' GB') : '未提供'; };
    function bestPerGb(a) { var m = null; (a.plans || []).forEach(function (p) { if (p.perGbMonthly && (!m || p.perGbMonthly < m.v)) m = { v: p.perGbMonthly, n: p.name }; }); return m; }
    function render() {
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(sel.indexOf(c.dataset.slug) > -1)); });
      cc.textContent = '已选 ' + sel.length + ' / 4';
      history.replaceState(null, '', sel.length ? '?s=' + sel.join(',') : location.pathname);
      if (sel.length < 2 || !data) { res.hidden = true; msg.textContent = sel.length ? '再选至少 ' + (2 - sel.length) + ' 家即可对比。' : '至少选择 2 家开始对比。'; return; }
      msg.textContent = '正在对比 ' + sel.length + ' 家。'; res.hidden = false;
      var list = sel.map(function (s) { return data.filter(function (a) { return a.slug === s; })[0]; });
      var mins = list.map(function (a) { return a.minMonthly ? a.minMonthly.price : null; });
      var gbs = list.map(function (a) { return a.maxMonthlyGB; });
      var pgs = list.map(function (a) { var b = bestPerGb(a); return b ? b.v : null; });
      function bestIdx(arr, low) { var v = arr.filter(function (x) { return x !== null && x !== undefined; }); if (v.length < 2) return -1; var t = low ? Math.min.apply(null, v) : Math.max.apply(null, v); return arr.indexOf(t); }
      var rows = [
        ['编辑顺序', function (a) { return '#' + String(a.rank).padStart(2, '0'); }],
        ['Clash 兼容', function (a) { return (a.clashSupport && a.clashSupport.displayName) || 'Clash 兼容待核实'; }],
        ['月付起价', function (a, i) { return a.minMonthly ? money(a.minMonthly.price) + '（' + a.minMonthly.plan + ' · ' + gbt(a.minMonthly.gb) + '）' : '未提供'; }, bestIdx(mins, true)],
        ['最低月付 ¥/GB', function (a, i) { var b = bestPerGb(a); return b ? '¥' + b.v + '（' + b.n + '）' : '未提供'; }, bestIdx(pgs, true)],
        ['最大月流量', function (a) { return gbt(a.maxMonthlyGB); }, bestIdx(gbs, false)],
        ['节点地区', function (a) { return a.regions.length ? a.regions.join('、') : '未提供'; }],
        ['线路类型', function (a) { return a.lines.length ? a.lines.join(' / ') : '未提供'; }],
        ['倍率', function (a) { return a.multiplier || '未提供'; }],
        ['同时在线设备', function (a) { return a.devices || '未提供'; }],
        ['订阅链接', function (a) { return a.subscription || '未提供'; }],
        ['优惠码（资料所列）', function (a) { return a.coupon ? a.coupon.code + (a.coupon.discount ? '（' + a.coupon.discount + '）' : '') : '未提供'; }],
        ['详情', function (a) { return null; }]
      ];
      tbl.textContent = '';
      var thead = h('thead'), hr = h('tr', {}, [h('th', { text: '项目' })]);
      list.forEach(function (a) { hr.appendChild(h('th', {}, [h('a', { href: a.url, text: a.name })])); }); thead.appendChild(hr); tbl.appendChild(thead);
      var tb = h('tbody');
      rows.forEach(function (r) {
        var tr = h('tr', {}, [h('td', { text: r[0] }), ]);
        list.forEach(function (a, i) {
          var td = h('td'); var v = r[1](a, i);
          if (v === null) td.appendChild(h('a', { href: a.url, text: '查看详情 →' })); else td.textContent = v;
          if (r[2] !== undefined && r[2] === i) td.className = 'best';
          tr.appendChild(td);
        });
        tb.appendChild(tr);
      });
      tbl.appendChild(tb);
    }
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        var s = c.dataset.slug, i = sel.indexOf(s);
        if (i > -1) sel.splice(i, 1); else if (sel.length >= 4) { msg.textContent = '最多同时对比 4 家，请先取消一家。'; return; } else sel.push(s);
        render();
      });
    });
    $('#cmpClear').addEventListener('click', function () { sel = []; render(); });
    fetch('/data/airports.json').then(function (r) { return r.json(); }).then(function (d) {
      data = d; var p = new URLSearchParams(location.search), pre = (p.get('s') || '').split(',').filter(Boolean);
      if (p.get('add')) pre.push(p.get('add'));
      pre.forEach(function (s) { if (sel.length < 4 && sel.indexOf(s) === -1 && d.some(function (a) { return a.slug === s; })) sel.push(s); });
      render();
    }).catch(function () { msg.textContent = '对比数据加载失败，请刷新页面重试。'; });
  }

  /* ---------- article features ---------- */
  $$('.prose pre').forEach(function (pre) {
    var b = h('button', { type: 'button', class: 'copy-btn', 'aria-label': '复制代码', text: '复制' });
    b.addEventListener('click', function () {
      var text = pre.querySelector('code') ? pre.querySelector('code').innerText : pre.innerText;
      function done(ok) { b.textContent = ok ? '已复制' : '复制失败'; setTimeout(function () { b.textContent = '复制'; }, 1600); }
      function legacy() { var ta = h('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); var ok = false; try { ok = document.execCommand('copy'); } catch (e) {} document.body.removeChild(ta); done(ok); }
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(function () { done(true); }, legacy);
      else legacy();
    });
    pre.appendChild(b);
  });
  var prog = $('#readProgress'), art = $('#articleBody'), top = $('#toTop');
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (top) top.hidden = y < 600;
    if (prog && art) { var r = art.getBoundingClientRect(), tot = r.height - window.innerHeight * 0.5; prog.style.width = Math.max(0, Math.min(100, (-r.top / Math.max(tot, 1)) * 100)) + '%'; }
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if (top) top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  var tocLinks = $$('.toc-details a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var map = {}; tocLinks.forEach(function (a) { map[decodeURIComponent(a.getAttribute('href').slice(1))] = a; });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { tocLinks.forEach(function (x) { x.classList.remove('on'); }); var a = map[e.target.id]; if (a) a.classList.add('on'); } });
    }, { rootMargin: '-80px 0px -70% 0px' });
    $$('.prose h2[id], .prose h3[id]').forEach(function (hd) { io.observe(hd); });
  }
  /* 移动端默认收起目录 */
  var td = $('.toc-details'); if (td && window.matchMedia('(max-width:1024px)').matches) td.removeAttribute('open');
})();
