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
  notes.push({ text, time: new Date().toLocaleString('ko-KR') });
  localStorage.setItem('drive_notes', JSON.stringify(notes));
  renderNotebook();
}
function renderNotebook() {
  const panel = $('.notebook-panel');
  if (!panel) return;
  const notes = getNotes();
  if (!notes.length) {
    panel.innerHTML = '<h3>// 노트</h3><p class="empty">기록이 없습니다. 단서는 자동 저장됩니다.</p>';
    return;
  }
  panel.innerHTML = '<h3>// 노트</h3>' + notes.map(n =>
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
    '청천': 'home.html', '기억': 'home.html', '선모': 'about.html',
    '소개': 'about.html', '일기': 'diary.html', 'diary': 'diary.html',
    '사진': 'photos.html', '이미지': 'photos.html',
    '채팅': 'chat.html', '기록': 'chat.html',
    '방명록': 'guestbook.html', '메시지': 'guestbook.html',
    '뉴스': 'news.html', '보도': 'news.html',
    '실종': 'missing.html', '파일': 'missing.html',
    '포럼': 'forum.html', '스레드': 'forum.html',
    '터미널': 'terminal.html', 'cmd': 'terminal.html',
    '해독': 'decode.html', '비밀번호': 'decode.html',
    '녹음': 'final.html', '마지막': 'final.html'
  };
  for (const k in routes) {
    if (s.includes(k) || k.includes(s)) { location.href = routes[k]; return; }
  }
  alert('해당 파일을 찾을 수 없습니다. "일기", "사진", "터미널", "해독"을 시도해보세요.');
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
