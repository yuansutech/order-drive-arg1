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
  notes.push({ text, time: new Date().toLocaleString('ja-JP') });
  localStorage.setItem('drive_notes', JSON.stringify(notes));
  renderNotebook();
}
function renderNotebook() {
  const panel = $('.notebook-panel');
  if (!panel) return;
  const notes = getNotes();
  if (!notes.length) {
    panel.innerHTML = '<h3>// ノート</h3><p class="empty">記録はまだありません。手がかりは自動保存されます。</p>';
    return;
  }
  panel.innerHTML = '<h3>// ノート</h3>' + notes.map(n =>
    `<div class="item">${n.text}<span class="time">${n.time}</span></div>`
  ).join('');
}
function toggleNotebook() { $('.notebook-panel').classList.toggle('open'); }
function isLateNight() {
  const h = new Date().getHours();
  return h >= 0 && h < 5;
}
function doSearch(q) {
  if (!q) return;
  const s = q.toLowerCase().trim();
  const routes = {
    '青川': 'home.html', '記憶': 'home.html', '沈黙': 'about.html',
    'シェン': 'about.html', 'モー': 'about.html',
    '日記': 'diary.html', 'diary': 'diary.html',
    '写真': 'photos.html', '画像': 'photos.html',
    'チャット': 'chat.html', '記録': 'chat.html',
    '掲示板': 'guestbook.html', '伝言': 'guestbook.html',
    'ニュース': 'news.html', '報道': 'news.html',
    '失踪': 'missing.html', 'ファイル': 'missing.html',
    'フォーラム': 'forum.html', 'スレッド': 'forum.html',
    'ターミナル': 'terminal.html', 'cmd': 'terminal.html',
    '解読': 'decode.html', 'パスワード': 'decode.html',
    '録音': 'final.html', '最後': 'final.html'
  };
  for (const k in routes) {
    if (s.includes(k) || k.includes(s)) { location.href = routes[k]; return; }
  }
  alert('該当するファイルが見つかりません。「日記」「写真」「ターミナル」「解読」を試してください。');
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
