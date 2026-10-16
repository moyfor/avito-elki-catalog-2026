// Prepares ONE archived Avito listing in the open edit form. Does NOT save.
// Runs in page main world. Progress/result -> <html data-job="{...}">
window.__job = async function (id, mode) {
  const R = document.documentElement;
  const st = { id, step: 'start', log: [], startedAt: new Date().toISOString() };
  const set = () => R.setAttribute('data-job', JSON.stringify(st));
  set();
  // MessageChannel ticks are not throttled in background tabs (unlike setTimeout).
  const mc = new MessageChannel(); const q = [];
  mc.port1.onmessage = () => { const f = q.shift(); f && f(); };
  const tick = () => new Promise(r => { q.push(r); mc.port2.postMessage(0); });
  const sleep = async ms => { const t = Date.now(); while (Date.now() - t < ms) await tick(); };
  const waitFor = async (fn, ms) => { const t = Date.now(); while (Date.now() - t < ms) { const v = fn(); if (v) return v; await sleep(40); } return null; };
  const descEl = () => document.querySelector('[data-marker="description-html-editor"] .public-DraftEditor-content');
  const previews = () => [...document.querySelectorAll('[data-marker="images"] img[data-marker^="preview("]')];
  try {
    const base = 'https://raw.githubusercontent.com/moyfor/avito-elki-catalog-2026/avito-photos-tmp/';
    const cards = await (await fetch(base + 'cards.json', { cache: 'no-store' })).json();
    const c = cards[id]; if (!c) throw 'card not in cards.json';
    const title = await waitFor(() => document.querySelector('input[name=title]'), 15000);
    if (!title || !descEl()) throw 'form not loaded';
    if (document.querySelector('input[name=itemId]').value !== id) throw 'wrong item in form';
    st.before = { title: title.value, price: (document.querySelector('input[name=price]') || {}).value,
      address: (document.querySelector('input[name=address]') || {}).value, photos: previews().length,
      desc: (descEl().innerText || '').trim().slice(0, 400) };
    if (st.before.price !== c.price) throw 'price differs from task: ' + st.before.price;
    if (st.before.title !== c.origTitle) st.warn = 'title differs from task original';
    // Avito refuses to save when the required "Особенности" group is empty; we must not invent attributes.
    const featLabel = [...document.querySelectorAll('*')].find(e => e.children.length === 0 && (e.textContent || '').trim() === 'Особенности');
    if (featLabel) {
      let box = featLabel; for (let k = 0; k < 6 && box && box.querySelectorAll('input[type=checkbox]').length === 0; k++) box = box.parentElement;
      const boxes = box ? [...box.querySelectorAll('input[type=checkbox]')] : [];
      st.features = boxes.filter(b => b.checked).length;
      if (boxes.length && st.features === 0) throw 'features_empty';
    }
    st.step = 'delete'; set();
    for (let n = 0; n < 15; n++) {
      const z = document.querySelector('[data-marker="images"]');
      const b = z.querySelector('[data-marker$="/actions-button"]'); if (!b) break;
      const mk = b.getAttribute('data-marker').replace('/actions-button', '');
      b.click();
      const del = await waitFor(() => [...document.querySelectorAll('[role=menuitem],button,li,div,span')]
        .find(e => (e.innerText || '').trim() === 'Удалить' && e.offsetParent !== null && e.querySelectorAll('*').length < 6), 5000);
      if (!del) throw 'delete menu did not open';
      (del.closest('[role=menuitem],button,li') || del).click();
      if (!await waitFor(() => !document.querySelector('[data-marker="' + mk + '/actions-button"]'), 5000)) throw 'photo was not removed';
      st.log.push('removed ' + mk); set();
    }
    if (previews().length) throw 'old photos remain';
    st.step = 'title'; set();
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    title.focus(); setter.call(title, c.title);
    title.dispatchEvent(new Event('input', { bubbles: true })); title.dispatchEvent(new Event('change', { bubbles: true })); title.blur();
    st.step = 'description'; set();
    const root = document.querySelector('[data-marker="description-html-editor"] .DraftEditor-root');
    const key = Object.keys(root).find(k => k.startsWith('__reactFiber$'));
    let f = root[key], hit = null;
    for (let i = 0; i < 40 && f; i++) { const p = f.memoizedProps; if (p && p.editorState && typeof p.onChange === 'function') { hit = p; break; } f = f.return; }
    if (!hit) throw 'description editor not found';
    const es = hit.editorState;
    hit.onChange(es.constructor.push(es, es.getCurrentContent().constructor.createFromText(c.desc), 'remove-range'));
    st.step = 'photos'; set();
    if (mode === 'manual') {
      st.sizes = c.sizes; st.step = 'waiting_photos'; set();
    } else {
    const files = [];
    for (let i = 0; i < c.photos.length; i++) {
      const r = await fetch(base + 'p/' + id + '/' + c.photos[i], { cache: 'force-cache' });
      if (!r.ok) throw 'photo fetch ' + c.photos[i] + ' ' + r.status;
      files.push(new File([await r.blob()], id + '_' + c.photos[i], { type: c.mime[i], lastModified: Date.now() }));
    }
    st.sizes = files.map(x => x.size);
    const inp = await waitFor(() => document.querySelector('[data-marker="images"] input[type=file][accept*="image"]'), 5000);
    if (!inp) throw 'image input not found';
    const dt = new DataTransfer(); files.forEach(x => dt.items.add(x));
    inp.files = dt.files; inp.dispatchEvent(new Event('change', { bubbles: true }));
    }
    const done = await waitFor(() => { const im = previews(); return im.length === 2 && im.every(i => /img\.avito\.st/.test(i.src)) ? im : null; }, mode === 'manual' ? 900000 : 90000);
    if (!done) throw 'photo upload did not finish';
    st.previews = done.map(i => i.getAttribute('data-marker'));
    st.orderOk = st.previews[0].includes(String(st.sizes[0])) && st.previews[1].includes(String(st.sizes[1]));
    await sleep(400);
    st.after = { title: title.value, desc: (descEl().innerText || '').trim(), photos: previews().length,
      price: document.querySelector('input[name=price]').value, address: document.querySelector('input[name=address]').value };
    st.ready = st.after.title === c.title && st.after.desc === c.desc && st.after.photos === 2 &&
      st.after.price === c.price && st.after.address === st.before.address && st.orderOk;
    st.step = st.ready ? 'prepared' : 'check_failed';
  } catch (e) { st.step = 'error'; st.error = String(e); }
  st.finishedAt = new Date().toISOString();
  set();
};
