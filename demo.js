/* SmallWorks site demo. A fixed, scripted copy of the app: nothing here calls a model or a network. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- Icons (drawn for this site) ---------- */
  const FILL = {
    plane: '<path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/>',
    drop: '<path d="M12 2.5S5.5 9.6 5.5 14.5a6.5 6.5 0 0 0 13 0C18.5 9.6 12 2.5 12 2.5z"/>',
    book: '<path d="M2.5 5.5c2.8-1.1 5.8-1 8.500.6v13.400c-2.700-1.600-5.700-1.700-8.500-.6zM13 6.100c2.700-1.600 5.700-1.700 8.500-.6v13.400c-2.800-1.100-5.800-1-8.500.6z"/>',
    cup: '<path d="M4 8h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 9.500h1.500a2.500 2.500 0 0 1 0 5H17v-1.800h1.300a.7.7 0 0 0 0-1.400H17zM3 19.800h15v1.700H3z"/>',
    figure: '<circle cx="12" cy="4.500" r="2.200"/><path d="M4.500 9.200 12 7.800l7.500 1.400v2.100l-5.300.6v3l3 6.100h-2.600L12 16.300 9.400 21H6.800l3-6.100v-3l-5.300-.6z"/>',
    heart: '<path d="M12 21S3.500 15.600 3.500 9.400A4.700 4.700 0 0 1 12 6.600a4.700 4.700 0 0 1 8.500 2.800C20.500 15.600 12 21 12 21z"/>',
    quote: '<path d="M4.500 7h5.500v5c0 3-1.600 4.600-4.200 5.100v-2.100c1.100-.5 1.600-1.400 1.600-2.700H4.500zM14 7h5.500v5c0 3-1.600 4.600-4.200 5.100v-2.100c1.100-.5 1.600-1.400 1.600-2.700H14z"/>',
    dumbbell: '<path d="M1.500 10h2v4h-2zM4.300 7h3.200v10H4.300zM16.500 7h3.200v10h-3.200zM20.500 10h2v4h-2zM7.500 11h9v2h-9z"/>',
    sparkle: '<path d="M12 2.500c.7 6.300 2.900 8.800 9.500 9.500-6.600.7-8.800 3.200-9.500 9.500-.7-6.300-2.900-8.800-9.500-9.500 6.600-.7 8.800-3.200 9.500-9.500z"/>',
    lock: '<path fill-rule="evenodd" d="M7 10V8a5 5 0 0 1 10 0v2h1.500v10.500h-13V10zm2.200 0h5.600V8a2.800 2.800 0 0 0-5.600 0z"/>',
    dots: '<circle cx="5" cy="12" r="1.900"/><circle cx="12" cy="12" r="1.900"/><circle cx="19" cy="12" r="1.900"/>',
    coin: '<circle cx="12" cy="12" r="10"/><text x="12" y="16.800" text-anchor="middle" font-size="13.500" font-weight="800" font-family="-apple-system,Arial,sans-serif" fill="var(--cut,#fff)">$</text>',
    btc: '<circle cx="12" cy="12" r="10"/><text x="12" y="16.800" text-anchor="middle" font-size="13.500" font-weight="800" font-family="-apple-system,Arial,sans-serif" fill="var(--cut,#fff)">₿</text>',
    moon: '<path d="M20.500 14.300A8.600 8.600 0 0 1 9.700 3.500a8.600 8.600 0 1 0 10.800 10.800z"/>',
    calendar: '<path fill-rule="evenodd" d="M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 5.200V19h14V9.200z"/>',
    grid: '<rect x="3.500" y="3.500" width="7.500" height="7.500" rx="2"/><rect x="13" y="3.500" width="7.500" height="7.500" rx="2"/><rect x="3.500" y="13" width="7.500" height="7.500" rx="2"/><rect x="13" y="13" width="7.500" height="7.500" rx="2"/>',
    brush: '<path d="M4 20l1.100-4.700L16.400 4l3.600 3.600L8.700 18.900z"/>',
  };
  const STROKE = {
    plus: '<path d="M12 5v14M5 12h14"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    chev: '<path d="M9 5l7 7-7 7"/>',
    ne: '<path d="M7 17L17 7M9 7h8v8"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3.200 3 3.200 15 0 18M12 3c-3.200 3-3.200 15 0 18"/>',
    photo: '<path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/>',
  };
  const attrs = (n) => (FILL[n] ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="2.300" stroke-linecap="round" stroke-linejoin="round"');
  const icon = (n) => `<svg viewBox="0 0 24 24" ${attrs(n)} aria-hidden="true">${FILL[n] || STROKE[n] || ''}</svg>`;
  $$('svg[data-i]').forEach((el) => { el.outerHTML = icon(el.dataset.i).replace('<svg', `<svg class="${el.getAttribute('class') || ''}" style="${el.getAttribute('style') || ''}"`); });

  /* ---------- Widget specs ---------- */
  const START = () => [
    { key: 'water', title: 'Water', icon: 'drop', accent: '#0A84FF', surface: 'tinted', num: 5, goal: 8, unit: 'of 8', cap: 'glasses today', foot: 'fill', plus: true, kind: 'counter' },
    { key: 'reading', title: 'Reading', icon: 'book', accent: '#FF9F0A', surface: 'graphite', num: 12, unit: 'days', cap: 'Done today', foot: 'dots', p: 1, kind: 'streak' },
    { key: 'coffee', title: 'Coffee', icon: 'cup', accent: '#C07A3E', surface: 'paper', num: 2, unit: 'cups', foot: 'none', plus: true, kind: 'counter' },
    { key: 'yoga', title: 'Yoga', icon: 'figure', accent: '#FF375F', surface: 'night', num: 20, goal: 30, unit: 'of 30', foot: 'bar', plus: true, kind: 'goal' },
  ];
  const PRESETS = {
    lisbon: { title: 'Lisbon', icon: 'plane', accent: '#0A84FF', surface: 'white', num: 23, unit: 'days', foot: 'bar', p: 0.05, date: 'Sat, 5 Dec', since: 'Since 11 Nov', size: 'medium', kind: 'countdown' },
    payday: { title: 'Payday', icon: 'coin', accent: '#30D158', surface: 'tinted', num: 18, unit: 'days', foot: 'bar', p: 0.42, date: 'Mon, 30 Nov', since: 'Since 30 Oct', kind: 'countdown' },
    gym: { title: 'Gym', icon: 'dumbbell', accent: '#5E5CE6', surface: 'tinted', num: 6, unit: 'days', cap: 'in a row', foot: 'dots', p: 6 / 7, plus: true, kind: 'streak' },
    steps: { title: 'Steps', icon: 'figure', accent: '#30D158', surface: 'white', num: '6,482', cap: 'of 10,000 today', foot: 'bar', p: 0.65, kind: 'health', access: 'your steps' },
    sleep: { title: 'Sleep', icon: 'moon', accent: '#5E5CE6', surface: 'night', num: '7h 20', cap: 'last night', foot: 'none', kind: 'health', access: 'your sleep' },
    calendar: { title: 'Next up', icon: 'calendar', accent: '#FF375F', surface: 'white', num: '10:30', unit: 'Fri', cap: 'Dentist', foot: 'none', kind: 'calendar', access: 'your calendar', from: 'Calendar' },
    bitcoin: { title: 'Bitcoin', icon: 'btc', accent: '#FF9F0A', surface: 'graphite', num: '$98,420', cap: 'updated just now', foot: 'none', kind: 'live value', host: 'api.coinbase.com' },
    quote: { title: 'Note', icon: 'quote', accent: '#A2845E', surface: 'paper', note: 'Make it work, then make it lovely.', kind: 'note' },
    books: { title: 'Books', icon: 'book', accent: '#5E5CE6', surface: 'white', num: 14, unit: 'this year', foot: 'none', plus: true, kind: 'counter' },
    mum: { title: 'Mum', icon: 'heart', accent: '#FF375F', surface: 'tinted', num: 9, unit: 'days', cap: 'since we talked', foot: 'none', kind: 'days since' },
  };
  const RULES = [
    [/lisbon|trip|flight|holiday|vacation/, 'lisbon'], [/payday|salary|paid/, 'payday'], [/gym|streak|workout/, 'gym'],
    [/step|walk/, 'steps'], [/sleep|slept/, 'sleep'], [/calendar|event|meeting/, 'calendar'], [/bitcoin|btc|crypto|price/, 'bitcoin'],
    [/quote|note/, 'quote'], [/book|read/, 'books'], [/mum|mom|called|call /, 'mum'],
  ];
  const GUESS = [[/water|drink|glass/, 'drop'], [/coffee|tea|cup/, 'cup'], [/run|yoga|stretch/, 'figure'], [/love|kiss|hug/, 'heart'], [/sleep|nap/, 'moon'], [/money|save|spend/, 'coin']];
  const NAMES = { '#0A84FF': 'blue', '#FF9F0A': 'orange', '#30D158': 'green', '#5E5CE6': 'indigo', '#FF375F': 'pink', '#A2845E': 'brown', '#1C1C1E': 'ink', '#C07A3E': 'copper' };
  const COLOURS = ['#0A84FF', '#FF9F0A', '#30D158', '#5E5CE6', '#FF375F', '#A2845E', '#1C1C1E'];
  const SURFACES = ['white', 'tinted', 'paper', 'graphite', 'night', 'sky'];
  const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);

  function specFor(text) {
    const t = ' ' + text.toLowerCase() + ' ';
    const hit = RULES.find(([re]) => re.test(t));
    if (hit) return { key: hit[1], ...PRESETS[hit[1]] };
    // Anything else becomes a tap counter named after what was typed.
    const words = t.replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w) => w && !/^(a|an|the|my|i|of|to|for|how|many|much|days?|until|since|count|counter|countdown|widget|today|number|this|that|last|times?|me|show|with|and|in|on)$/.test(w));
    const title = cap(words.slice(0, 2).join(' ').slice(0, 14) || 'Counter');
    const g = GUESS.find(([re]) => re.test(t));
    return { key: 'custom-' + title.toLowerCase(), title, icon: g ? g[1] : 'sparkle', accent: '#5E5CE6', surface: 'white', num: 0, unit: 'so far', foot: 'none', plus: true, kind: 'counter' };
  }

  /* ---------- One renderer for every widget on the page ---------- */
  function W(s, o = {}) {
    const size = o.size || s.size || 'small';
    const layout = o.layout || s.layout || 'auto';
    let foot = s.note ? 'none' : layout === 'auto' ? s.foot : layout === 'bar' ? 'bar' : 'none';
    const p = s.goal ? Math.min(1, s.num / s.goal) : s.p ?? 0.5;
    const n = String(s.num);
    const tab = o.tab ? ` tabindex="0" role="button" aria-label="${esc(s.title)}, open"` : '';
    let h = `<div class="w s-${s.surface} sz-${size}${foot === 'fill' ? ' has-fill' : ''}" data-key="${s.key}"${tab} style="--a:${s.accent};--p:${foot === 'fill' ? 26 + p * 44 : p * 100}%">`;
    if (foot === 'fill') h += '<div class="w-fill"></div>';
    h += `<div class="w-head">${icon(s.icon)}<span>${esc(s.title)}</span>${s.date ? `<span class="w-date">${s.date}</span>` : ''}</div>`;
    if (s.plus) h += o.still ? `<span class="w-plus">${icon('plus')}</span>` : `<button class="w-plus" data-plus="${s.key}" aria-label="Add one to ${esc(s.title)}">${icon('plus')}</button>`;
    if (s.note) h += `<div class="w-note">${esc(s.note)}</div>`;
    else {
      h += `<div class="w-body"><span class="w-num${n.length > 4 ? ' long' : ''}">${n}</span>${s.unit ? `<span class="w-unit">${s.unit}</span>` : ''}</div>`;
      if (s.cap && foot !== 'bar' && foot !== 'dots') h += `<div class="w-cap">${s.cap}</div>`;
      if (foot === 'bar') h += '<div class="w-bar"><i></i></div>' + (s.since ? `<div class="w-row"><span>${s.since}</span><span>${s.date}</span></div>` : '');
      if (foot === 'dots') h += '<div class="w-dots">' + [0, 1, 2, 3, 4, 5, 6].map((k) => `<i${k < Math.round(p * 7) ? '' : ' class="off"'}></i>`).join('') + '</div>';
    }
    return h + '</div>';
  }

  /* ---------- Static pieces of the page ---------- */
  const all = { ...Object.fromEntries(START().map((s) => [s.key, s])), ...Object.fromEntries(Object.entries(PRESETS).map(([k, s]) => [k, { key: k, ...s }])) };
  const BELT = [['lisbon', 'days until my trip to Lisbon'], ['water', 'glasses of water today, goal of 8'], ['reading', 'my reading streak'], ['bitcoin', 'bitcoin price'], ['yoga', '30 days of yoga'], ['quote', 'a note to myself'], ['payday', 'days until payday', 'medium'], ['coffee', 'coffee counter'], ['steps', 'steps today'], ['mum', 'days since I last called Mum']];
  const beltSet = (hidden) => BELT.map(([k, said, size]) => `<div class="belt-item"${hidden ? ' aria-hidden="true"' : ''}>${W(all[k], { still: true, size })}<span class="mono">${said}</span></div>`).join('');
  $('#belt-track').innerHTML = beltSet(false) + beltSet(true);
  $('#spec-widget').innerHTML = W(all.lisbon, { still: true });

  /* ---------- Phone state ---------- */
  const screen = $('#screen'), grid = $('#grid'), sheet = $('#sheet'), body = $('#sheet-body');
  let widgets, cur, pending, change, flow = 0, askText = '';
  const find = (key) => widgets.find((w) => w.key === key);
  const pause = (ms) => new Promise((r) => setTimeout(r, reduce ? Math.min(ms, 80) : ms));

  function renderHome(fresh) {
    grid.innerHTML = widgets.map((s) => W(s, { tab: true })).join('');
    if (fresh) $(`.w[data-key="${fresh}"]`, grid)?.classList.add('new');
    const on = widgets.filter((w) => w.online).length;
    $('#home-count').textContent = `${widgets.length} widgets · ${on ? on + ' online' : 'all offline'}`;
  }
  function show(id) {
    $$('.scr.push, .scr.fade').forEach((s) => s.classList.toggle('on', s.id === id));
    screen.classList.toggle('light-status', id === 's-spring');
  }
  function goHome() {
    flow++;
    closeSheet();
    $('#compare').classList.remove('on');
    show(null);
    renderHome();
  }

  /* ---------- Counting ---------- */
  function addOne(key) {
    const s = find(key); if (!s) return;
    s.num++;
    if (s.kind === 'streak') s.p = 1;
    const fresh = document.createElement('div');
    fresh.innerHTML = W(s, { tab: true });
    const old = $(`.w[data-key="${key}"]`, grid);
    const el = fresh.firstChild;
    // Keep the old fill height for a frame so the water rises instead of jumping.
    const from = old.style.getPropertyValue('--p'), to = el.style.getPropertyValue('--p');
    el.style.setProperty('--p', from);
    old.replaceWith(el);
    el.classList.add('bump');
    requestAnimationFrame(() => requestAnimationFrame(() => el.style.setProperty('--p', to)));
  }

  /* ---------- Make sheet ---------- */
  const IDEAS = ['Days until payday', 'Gym streak', 'Countdown to my flight', 'Bitcoin price', 'Quote of the day'];
  const LOCAL = [['calendar', 'Next on my calendar'], ['figure', 'Steps today'], ['moon', "Last night's sleep"]];
  function openSheet(text = '') {
    flow++;
    renderAsk(text);
    sheet.classList.add('on'); sheet.setAttribute('aria-hidden', 'false');
    screen.classList.add('sheet-open');
  }
  function closeSheet() {
    sheet.classList.remove('on'); sheet.setAttribute('aria-hidden', 'true');
    screen.classList.remove('sheet-open');
  }
  function renderAsk(text) {
    $('#sheet-send').hidden = false;
    body.innerHTML = `<h3 class="sheet-h">What should<br>it show?</h3>
      <div class="ask-box"><textarea id="ask" placeholder="Days until my trip to Lisbon" aria-label="Describe a widget" enterkeyhint="send">${esc(text)}</textarea></div>
      <div class="row-chips"><span class="ph-chip brain">Apple on-device</span><span class="ph-chip">${icon('photo')}From a photo</span></div>
      <p class="lockline">${icon('lock')}Made on this iPhone. Your data stays here; websites only with your OK.</p>
      <p class="ph-label">Ideas</p>
      <div class="row-chips">${IDEAS.map((t) => `<button class="ph-chip" data-idea="${t}">${t}</button>`).join('')}</div>
      <p class="ph-label">From your iPhone</p>
      <div class="row-chips">${LOCAL.map(([i, t]) => `<button class="ph-chip" data-idea="${t}">${icon(i)}${t}</button>`).join('')}</div>`;
  }
  function send(text) {
    askText = (text ?? $('#ask')?.value ?? '').trim() || 'Days until my trip to Lisbon';
    pending = specFor(askText);
    $('#sheet-send').hidden = true;
    if (pending.access) renderAccess(); else if (pending.host) renderAllow(); else build();
  }
  function renderAccess() {
    const s = pending;
    body.innerHTML = `<h3 class="sheet-h">Okay. One<br>thing first.</h3>
      <p class="sheet-p">This widget reads ${s.access} from ${s.from || 'Health'}. iOS asks you next, and you can say no.</p>
      <ul class="ticks"><li>Read on this iPhone</li><li>Never sent anywhere</li><li>Yours to turn off in Settings</li></ul>
      <div class="spacer"></div>
      <button class="ink-btn" data-act="continue">Continue</button><button class="text-btn" data-act="notnow">Not Now</button>`;
  }
  function renderAllow() {
    const s = pending;
    body.innerHTML = `<h3 class="sheet-h">Get live data<br>for ${esc(s.title)}?</h3>
      <p class="sheet-p">Here's what I found. It keeps updating only if you allow it, and this is the only address it can ever reach.</p>
      <div class="wire"><div class="wire-box">${icon('grid')}</div><div class="wire-line"></div><div class="wire-host">${icon('globe')}${s.host}</div></div>
      <p class="found">${s.num}<small>read once from ${s.host}</small></p>
      <div class="spacer"></div>
      <button class="ink-btn" data-act="allow">Allow</button><button class="text-btn" data-act="notnow">Not Now</button>`;
  }
  async function build() {
    const me = ++flow, s = pending;
    body.innerHTML = `<div class="stage" id="b-stage"><div class="ghost">${icon('sparkle')}</div></div>
      <div class="ph-spec" id="b-spec"><b>WIDGET SPEC</b></div>
      <p class="lockline">${icon('lock')}Made privately on this iPhone with Apple on-device.</p>
      <div class="spacer"></div>`;
    const lines = [['kind', s.kind], ['title', s.title], ['symbol', s.icon], ['accent', NAMES[s.accent] || 'custom'], ['surface', s.surface], ['website', s.host || 'none']];
    for (const [k, v] of lines) {
      await pause(300); if (me !== flow) return;
      $('#b-spec').insertAdjacentHTML('beforeend', `<div><span>${k}</span>${esc(v)}</div>`);
    }
    await pause(500); if (me !== flow) return;
    $('#b-stage').innerHTML = W(s, { still: true });
    $('#b-stage .w').classList.add('new');
    $('#b-stage .w').style.animation = 'pop .55s var(--ease-out)';
    body.insertAdjacentHTML('beforeend', '<button class="ink-btn" data-act="keep">Keep</button><button class="text-btn" data-act="edit">Edit my request</button>');
  }
  function keep() {
    widgets = widgets.filter((w) => w.key !== pending.key);
    widgets.unshift(pending);
    closeSheet();
    renderHome(pending.key);
    $('#home-scroll').scrollTo({ top: 0 });
  }

  /* ---------- Detail ---------- */
  function openDetail(key) {
    cur = find(key); if (!cur) return;
    renderDetail();
    $('#d-scroll').scrollTop = 0;
    show('s-detail');
  }
  function renderDetail() {
    const s = cur, size = s.size || 'small', layout = s.layout || 'auto';
    $('#d-title').textContent = s.title;
    $('#d-stage').innerHTML = W(s, { still: true });
    $$('#d-size button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.size === size));
    $('#d-layouts').innerHTML = [['auto', 'Auto'], ['bar', 'Bar'], ['number', 'Number']].map(([k, name]) => `<button data-layout="${k}" aria-pressed="${k === layout}">${W(s, { still: true, size: 'small', layout: k })}${name}</button>`).join('');
    $('#d-swatches').innerHTML = COLOURS.map((c) => `<button style="--c:${c}" data-colour="${c}" aria-label="${NAMES[c]}" aria-pressed="${c === s.accent}"></button>`).join('');
    $('#d-look').textContent = cap(s.surface) + ', Rounded';
    $('#d-data').textContent = s.host ? s.host : s.access ? 'On this iPhone' : 'Offline';
  }
  const CHANGES = {
    calm: (s) => ({ surface: 'paper', accent: '#A2845E' }),
    dark: (s) => ({ surface: s.surface === 'graphite' ? 'night' : 'graphite' }),
    playful: (s) => (s.surface === 'sky' && s.accent === '#FF375F' ? { surface: 'sky', accent: '#5E5CE6' } : { surface: 'sky', accent: '#FF375F' }),
  };
  function changeFor(text) {
    const t = text.toLowerCase();
    if (/dark|black|night/.test(t)) return CHANGES.dark;
    if (/calm|quiet|soft|minimal|simple/.test(t)) return CHANGES.calm;
    const c = Object.entries(NAMES).find(([, name]) => t.includes(name)) || (/purple|violet/.test(t) && ['#5E5CE6']) || (/red|rose/.test(t) && ['#FF375F']) || (/yellow|gold/.test(t) && ['#FF9F0A']);
    if (c) return () => ({ accent: c[0] });
    if (/big|large|wide/.test(t)) return () => ({ size: 'medium' });
    return CHANGES.playful;
  }
  async function askChange(fn) {
    const me = ++flow;
    $('#d-working').hidden = false; $('#d-chips').hidden = true;
    await pause(1300);
    $('#d-working').hidden = true; $('#d-chips').hidden = false;
    if (me !== flow) return;
    change = { ...cur, ...fn(cur) };
    $('#c-old').innerHTML = W(cur, { still: true, size: 'small' });
    $('#c-new').innerHTML = W(change, { still: true, size: 'small' });
    $('#compare').classList.add('on');
  }

  /* ---------- Home Screen, Lock Screen, Settings ---------- */
  function openSpring() {
    const s = cur, size = s.size || 'small', cells = { small: 4, medium: 8, large: 16 }[size];
    $('#sb-grid').innerHTML = W(s, { still: true }) + '<div class="app"></div>'.repeat(24 - cells);
    const other = widgets.find((w) => w !== s && !w.note) || s;
    $('#ls-acc').innerHTML = [s, other].map((w) => `<div>${icon(w.icon)}${esc(w.title)}<b>${w.note ? 'Note' : w.num + (w.unit ? ' ' + w.unit : '')}</b></div>`).join('');
    setMode('home');
    show('s-spring');
  }
  function setMode(m) {
    $('#s-spring').dataset.mode = m;
    $$('.sb-foot [data-mode]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.mode === m));
  }
  function openSettings() {
    const on = widgets.filter((w) => w.online).length, n = widgets.length;
    $('#set-card').innerHTML = `<b>THIS IPHONE</b>${n} widgets · ${on} allowed online<br>${n - on} stay offline<div class="bars">${widgets.map((w) => `<i style="--c:${w.accent}"></i>`).join('')}</div>`;
    $('#set-sources').textContent = on === 1 ? '1 source' : on + ' sources';
    show('s-settings');
  }

  /* ---------- Taps ---------- */
  const ACTS = {
    settings: openSettings,
    make: () => openSheet(),
    close: () => { flow++; closeSheet(); },
    send: () => send(),
    continue: build,
    allow: () => { pending.online = true; build(); },
    notnow: () => renderAsk(askText),
    edit: () => { flow++; renderAsk(askText); },
    keep,
    back: () => { flow++; show(null); renderHome(); },
    look: () => { cur.surface = SURFACES[(SURFACES.indexOf(cur.surface) + 1) % SURFACES.length]; renderDetail(); },
    screens: openSpring,
    'keep-change': () => { Object.assign(cur, change); renderDetail(); $('#compare').classList.remove('on'); },
    'drop-change': () => $('#compare').classList.remove('on'),
  };
  screen.addEventListener('click', (e) => {
    const t = e.target;
    const plus = t.closest('[data-plus]');
    if (plus) return addOne(plus.dataset.plus);
    const act = t.closest('[data-act]');
    if (act) return ACTS[act.dataset.act]();
    const idea = t.closest('[data-idea]');
    if (idea) return sheet.classList.contains('on') ? send(idea.dataset.idea) : openSheet(idea.dataset.idea);
    const card = t.closest('#grid .w');
    if (card) return openDetail(card.dataset.key);
    const pick = t.closest('[data-size], [data-layout], [data-colour], [data-change], .sb-foot [data-mode]');
    if (!pick) return;
    const d = pick.dataset;
    if (d.mode) return setMode(d.mode);
    if (d.change) return askChange(CHANGES[d.change]);
    if (d.size) cur.size = d.size;
    if (d.layout) cur.layout = d.layout;
    if (d.colour) cur.accent = d.colour;
    renderDetail();
  });
  screen.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    if (e.target.id === 'ask') { e.preventDefault(); send(); }
    else if (e.target.matches('#grid .w')) openDetail(e.target.dataset.key);
  });
  $('#d-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const v = $('#d-input').value.trim(); if (!v) return;
    $('#d-input').value = ''; $('#d-input').blur();
    askChange(changeFor(v));
  });

  /* ---------- Scripted scenes ---------- */
  let run = 0;
  const dot = $('#tapdot');
  class Stopped extends Error {}
  function director() {
    const id = ++run;
    const wait = async (ms) => { await pause(ms); if (id !== run) throw new Stopped(); };
    const until = async (sel) => { for (let i = 0; i < 100; i++) { const el = $(sel, screen); if (el) return el; await wait(100); } throw new Stopped(); };
    // Scroll only inside the phone, never the page.
    const reveal = (el) => {
      for (let p = el.parentElement; p && p !== screen; p = p.parentElement) {
        const cs = getComputedStyle(p);
        if (!/auto|scroll/.test(cs.overflowY + cs.overflowX)) continue;
        const a = el.getBoundingClientRect(), b = p.getBoundingClientRect();
        // Leave it alone when it is already clear of the top stage and the bottom bar.
        if (a.top > b.top + b.height * 0.36 && a.bottom < b.bottom - b.height * 0.22 && a.left >= b.left && a.right <= b.right) continue;
        p.scrollBy({ top: a.top + a.height / 2 - (b.top + b.height * 0.42), left: a.left + a.width / 2 - (b.left + b.width / 2), behavior: reduce ? 'auto' : 'smooth' });
      }
    };
    const tap = async (target) => {
      const el = typeof target === 'string' ? await until(target) : target;
      reveal(el); await wait(420);
      const a = el.getBoundingClientRect(), b = screen.getBoundingClientRect(), k = b.width / screen.offsetWidth;
      dot.style.left = (a.left + a.width / 2 - b.left) / k + 'px';
      dot.style.top = (a.top + a.height / 2 - b.top) / k + 'px';
      dot.classList.add('on'); await wait(380);
      el.click(); dot.classList.remove('on'); await wait(420);
    };
    const type = async (sel, text) => { const el = await until(sel); for (const ch of text) { el.value += ch; await wait(26); } };
    return { wait, until, tap, type };
  }
  const need = (key) => { if (!find(key)) widgets.push(START().find((s) => s.key === key)); };
  const SCENES = [
    ['Days until my trip to Lisbon', 'A sentence goes in. A countdown comes out.', async (d) => {
      await d.tap('[data-act="make"]'); await d.wait(350);
      await d.type('#ask', 'Days until my trip to Lisbon'); await d.wait(350);
      await d.tap('#sheet-send'); await d.until('[data-act="keep"]'); await d.wait(900); await d.tap('[data-act="keep"]');
    }],
    ['Tap + to count', 'Water, coffee, streaks. One tap logs it.', async (d) => {
      need('water'); need('coffee'); renderHome();
      for (let i = 0; i < 3; i++) { await d.tap('[data-plus="water"]'); }
      await d.tap('[data-plus="coffee"]');
    }],
    ['Make it playful', 'Ask for a change. See old next to new, then keep one.', async (d) => {
      need('reading'); renderHome();
      await d.tap('#grid .w[data-key="reading"]'); await d.wait(300);
      await d.tap('[data-change="playful"]'); await d.until('#compare.on'); await d.wait(1500); await d.tap('[data-act="keep-change"]');
    }],
    ['Tweak it by hand', 'Size, layout, colour and surface, without typing.', async (d) => {
      need('yoga'); renderHome();
      await d.tap('#grid .w[data-key="yoga"]'); await d.wait(300);
      await d.tap('[data-size="medium"]'); await d.tap('[data-layout="number"]');
      await d.tap('[data-colour="#30D158"]'); await d.tap('[data-act="look"]'); await d.tap('[data-act="look"]');
    }],
    ['Bitcoin price', 'One website per widget, and only after you allow it.', async (d) => {
      await d.tap('#home-chips [data-idea="Bitcoin price"]'); await d.wait(500);
      await d.tap('#sheet-send'); await d.until('[data-act="allow"]'); await d.wait(1700);
      await d.tap('[data-act="allow"]'); await d.until('[data-act="keep"]'); await d.wait(900); await d.tap('[data-act="keep"]');
    }],
    ['Steps today', 'Read from Health on the iPhone. Sent nowhere.', async (d) => {
      await d.tap('#home-chips [data-idea="Steps today"]'); await d.wait(500);
      await d.tap('#sheet-send'); await d.until('[data-act="continue"]'); await d.wait(1500);
      await d.tap('[data-act="continue"]'); await d.until('[data-act="keep"]'); await d.wait(900); await d.tap('[data-act="keep"]');
    }],
    ['Put it on your screens', 'The Home Screen, then the Lock Screen.', async (d) => {
      need('water'); renderHome();
      await d.tap('#grid .w[data-key="water"]'); await d.wait(300);
      await d.tap('[data-act="screens"]'); await d.wait(2200); await d.tap('.sb-foot [data-mode="lock"]');
    }],
    ["See what's online", 'Settings counts the widgets that ever touch the web.', async (d) => {
      await d.tap('[data-act="settings"]');
    }],
  ];
  const list = $('#scenes');
  list.innerHTML = SCENES.map(([t, sub], i) => `<li><button data-scene="${i}"><b>${t}</b><span>${sub}</span>${icon('ne')}</button></li>`).join('');
  function stop() { run++; dot.classList.remove('on'); $$('.playing', list).forEach((b) => b.classList.remove('playing')); }
  async function play(i, btn) {
    stop();
    const d = director();
    btn.classList.add('playing');
    const r = $('#phone').getBoundingClientRect();
    if (r.top < 60 || r.bottom > innerHeight) $('#phone').scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
    try { goHome(); await d.wait(600); await SCENES[i][2](d); await d.wait(400); btn.classList.remove('playing'); }
    catch (e) { if (!(e instanceof Stopped)) throw e; }
  }
  list.addEventListener('click', (e) => { const b = e.target.closest('[data-scene]'); if (b) play(+b.dataset.scene, b); });
  // A real touch on the phone takes over from the script.
  screen.addEventListener('pointerdown', (e) => { if (e.isTrusted) stop(); }, true);

  function reset() {
    stop();
    widgets = START();
    $('#home-chips').innerHTML = ['Days until payday', 'Gym streak', 'Bitcoin price', 'Steps today', 'Quote of the day', 'Books read this year'].map((t) => `<button class="ph-chip" data-idea="${t}">${t}</button>`).join('');
    goHome();
    $('#home-scroll').scrollTop = 0;
  }
  $('#restart').addEventListener('click', reset);
  reset();

  const HINTS = ['Describe a new widget…', 'A countdown to my flight on Dec 14…', "How many books I've read this year…", 'Glasses of water, goal of 8…', 'Days since I last called Mum…'];
  let hint = 0;
  if (!reduce) setInterval(() => { $('#home-hint').textContent = HINTS[++hint % HINTS.length]; }, 3600);
})();
