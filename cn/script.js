function $(s) { return document.querySelector(s); }
function $$(s) { return document.querySelectorAll(s); }

// 状态管理
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

// 笔记本
function getNotes() {
  try { return JSON.parse(localStorage.getItem('drive_notes') || '[]'); }
  catch { return []; }
}
function saveNote(text) {
  const notes = getNotes();
  if (notes.some(n => n.text === text)) return;
  notes.push({ text, time: new Date().toLocaleString('zh-CN') });
  localStorage.setItem('drive_notes', JSON.stringify(notes));
  renderNotebook();
}
function renderNotebook() {
  const panel = $('.notebook-panel');
  if (!panel) return;
  const notes = getNotes();
  if (!notes.length) {
    panel.innerHTML = '<h3>// 笔记本</h3><p class="empty">还没有记录。线索会自动保存。</p>';
    return;
  }
  panel.innerHTML = '<h3>// 笔记本</h3>' + notes.map(n =>
    `<div class="item">${n.text}<span class="time">${n.time}</span></div>`
  ).join('');
}
function toggleNotebook() { $('.notebook-panel').classList.toggle('open'); }

// 打字机
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

// 深夜检查
function isLateNight() {
  const h = new Date().getHours();
  return h >= 0 && h < 5;
}

// 搜索路由
function doSearch(q) {
  if (!q) return;
  const s = q.toLowerCase().trim();
  const routes = {
    '青川': 'home.html', '记忆': 'home.html', '沈默': 'about.html',
    '关于': 'about.html', '日记': 'diary.html', 'diary': 'diary.html',
    '照片': 'photos.html', '图片': 'photos.html', 'photo': 'photos.html',
    '聊天': 'chat.html', '记录': 'chat.html', 'qq': 'chat.html',
    '留言': 'guestbook.html', '留言板': 'guestbook.html',
    '新闻': 'news.html', '报道': 'news.html',
    '失踪': 'missing.html', '档案': 'missing.html',
    '论坛': 'forum.html', '帖子': 'forum.html',
    '终端': 'terminal.html', 'terminal': 'terminal.html', 'cmd': 'terminal.html',
    '解码': 'decode.html', '密码': 'decode.html', 'decode': 'decode.html',
    '录音': 'final.html', '最后': 'final.html'
  };
  for (const k in routes) {
    if (s.includes(k) || k.includes(s)) { location.href = routes[k]; return; }
  }
  alert('没有找到相关文件。试试"日记"、"照片"、"终端"、"解码"。');
}

// 全局绑定
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