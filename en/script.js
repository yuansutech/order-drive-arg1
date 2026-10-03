function $(s) { return document.querySelector(s); }
function $$(s) { return document.querySelectorAll(s); }
function getState() {
  try { return JSON.parse(localStorage.getItem('drive_state') || '{}'); }
  catch { return {}; }
}
function setState(patch) {
  const s = getState(); Object.assign(s, patch);
  localStorage.setItem('drive_state', JSON.stringify(s));
}
function resetState() {
  localStorage.removeItem('drive_state');
  localStorage.removeItem('drive_notes');
}
function getNotes() {
  try { return JSON.parse(localStorage.getItem('drive_notes') || '[]'); }
  catch { return []; }
}
function saveNote(text) {
  const notes = getNotes();
  if (notes.some(n => n.text === text)) return;
  notes.push({ text, time: new Date().toLocaleString('en-US') });
  localStorage.setItem('drive_notes', JSON.stringify(notes));
  renderNotebook();
}
function renderNotebook() {
  const panel = $('.notebook-panel');
  if (!panel) return;
  const notes = getNotes();
  if (!notes.length) {
    panel.innerHTML = '<h3>// NOTEBOOK</h3><p class="empty">No notes yet. Clues will be saved automatically.</p>';
    return;
  }
  panel.innerHTML = '<h3>// NOTEBOOK</h3>' + notes.map(n =>
    `<div class="item">${n.text}<span class="time">${n.time}</span></div>`
  ).join('');
}
function toggleNotebook() { $('.notebook-panel').classList.toggle('open'); }
function typewriter(el, text, speed = 25) {
  el.textContent = '';
  let i = 0;
  return new Promise(resolve => {
    (function tick() {
      if (i < text.length) { el.textContent += text[i++]; setTimeout(tick, speed); }
      else resolve();
    })();
  });
}
function isLateNight() {
  const h = new Date().getHours();
  return h >= 0 && h < 5;
}
function doSearch(q) {
  if (!q) return;
  const s = q.toLowerCase().trim();
  const routes = {
    'qingchuan': 'home.html', 'memory': 'home.html', 'shen': 'about.html',
    'about': 'about.html', 'diary': 'diary.html',
    'photo': 'photos.html', 'picture': 'photos.html',
    'chat': 'chat.html', 'log': 'chat.html',
    'guestbook': 'guestbook.html', 'message': 'guestbook.html',
    'news': 'news.html', 'article': 'news.html',
    'missing': 'missing.html', 'file': 'missing.html',
    'forum': 'forum.html', 'thread': 'forum.html',
    'terminal': 'terminal.html', 'cmd': 'terminal.html',
    'decode': 'decode.html', 'code': 'decode.html', 'password': 'decode.html',
    'recording': 'final.html', 'final': 'final.html'
  };
  for (const k in routes) {
    if (s.includes(k) || k.includes(s)) { location.href = routes[k]; return; }
  }
  alert('No matching files found. Try "diary", "photo", "terminal", or "decode".');
}
document.addEventListener('DOMContentLoaded', () => {
  $$('.searchbar input').forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') doSearch(input.value);
    });
  });
  $$('.searchbar button').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      doSearch(input.value);
    });
  });
  if (!$('.notebook')) {
    const nb = document.createElement('div');
    nb.className = 'notebook';
    nb.innerHTML = `<button class="notebook-btn" onclick="toggleNotebook()">📓</button><div class="notebook-panel"></div>`;
    document.body.appendChild(nb);
  }
  renderNotebook();
});
