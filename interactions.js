// Tương tác người dùng: tìm kiếm, filter, chat, toast, theme, disclaimer
// ================================================================
//  QUICK CHIPS
// ================================================================
function quickSearch(btn, keyword) {
  document.querySelectorAll('#chips-area .chip').forEach(c => c.classList.remove('chip-active'));
  if(keyword) btn.classList.add('chip-active');
  state.query = keyword;
  const searchInput = document.getElementById('search-input');
  if(searchInput) searchInput.value = keyword;
  const searchInputMobile = document.getElementById('search-input-mobile');
  if(searchInputMobile) searchInputMobile.value = keyword;
  renderCards();
}

// ================================================================
//  SEARCH INPUT
// ================================================================
function setupSearch() {
  const handleInput = (e) => {
    state.query = e.target.value;
    // sync both inputs
    document.getElementById('search-input').value = state.query;
    document.getElementById('search-input-mobile').value = state.query;
    document.querySelectorAll('#chips-area .chip').forEach(c => c.classList.remove('chip-active'));
    renderCards();
  };
  document.getElementById('search-input').addEventListener('input', handleInput);
  document.getElementById('search-input-mobile').addEventListener('input', handleInput);
}

// ================================================================
//  RADIO FILTERS
// ================================================================
function setupFilters() {
  document.getElementById('cat-filter').addEventListener('change', e => {
    if(e.target.name === 'cat') {
      state.cat = e.target.value;
      renderCards();
      if(window.innerWidth < 1024) closeMobileFilters();
    }
  });
  document.getElementById('type-filter').addEventListener('change', e => {
    if(e.target.name === 'rtype') {
      state.type = e.target.value;
      renderCards();
      if(window.innerWidth < 1024) closeMobileFilters();
    }
  });
}

// ================================================================
//  MOBILE FILTER DRAWER
// ================================================================
function openMobileFilters() {
  const aside = document.getElementById('filter-sidebar');
  if(!aside) return;
  aside.classList.add('mobile-filter-open');
  document.body.style.overflow = 'hidden';
}
function closeMobileFilters() {
  const aside = document.getElementById('filter-sidebar');
  if(!aside) return;
  aside.classList.remove('mobile-filter-open');
  document.body.style.overflow = '';
}

// ================================================================
//  TOAST
// ================================================================
function toast(msg, type = 'info') {
  const container = document.getElementById('toast-area');
  const el = document.createElement('div');
  const colors = {success:'bg-emerald-600',error:'bg-rose-600',info:'bg-slate-800 dark:bg-slate-700'};
  const icons = {success:'fa-circle-check',error:'fa-circle-exclamation',info:'fa-circle-info'};
  el.className = `flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-xl text-xs font-medium text-white pointer-events-auto transition-all duration-300 translate-y-2 opacity-0 ${colors[type]||colors.info}`;
  el.innerHTML = `<i class="fa-solid ${icons[type]||icons.info}"></i> ${msg}`;
  container.appendChild(el);
  setTimeout(() => el.classList.remove('translate-y-2','opacity-0'), 10);
  setTimeout(() => {
    el.classList.add('opacity-0','translate-y-[-8px]');
    setTimeout(() => el.remove(), 300);
  }, 3500);
}

// ================================================================
//  AI CHAT (Gemini)
// ================================================================
function addMessage(role, text) {
  const feed = document.getElementById('chat-feed');
  const isAI = role === 'assistant';
  const div = document.createElement('div');
  div.className = `flex gap-3 ${isAI ? 'max-w-[88%]' : 'max-w-[88%] ml-auto flex-row-reverse'}`;
  const avatarClass = isAI ? 'bg-teal-600' : 'bg-slate-500 dark:bg-slate-600';
  const iconEl = isAI ? '<i class="fa-solid fa-robot text-xs"></i>' : '<i class="fa-solid fa-user text-xs"></i>';
  const bubbleClass = isAI 
    ? 'bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-tl-none' 
    : 'bg-teal-600 text-white rounded-2xl rounded-tr-none';
  div.innerHTML = `
    <div class="w-8 h-8 rounded-full ${avatarClass} text-white flex items-center justify-center text-sm shrink-0 shadow">${iconEl}</div>
    <div>
      <div class="${bubbleClass} p-3.5 text-sm leading-relaxed">${text}</div>
      <span class="text-[10px] text-slate-400 px-1 mt-1 block ${isAI ? '' : 'text-right'}">${isAI ? 'PharmDoc Chatbot' : 'Bạn'}</span>
    </div>`;
  feed.appendChild(div);
  feed.scrollTop = feed.scrollHeight;
}

async function sendChat(message) {
  if(!message.trim()) return;
  addMessage('user', escapeHtml(message));

  const typingEl = document.getElementById('chat-typing');
  typingEl.style.display = 'flex';

  // Check emergency
  if(APP_CONFIG.EMERGENCY_KEYWORDS.some(kw => message.toLowerCase().includes(kw))) {
    typingEl.style.display = 'none';
    addMessage('assistant', '⚠️ Đây có vẻ là tình huống <strong>khẩn cấp</strong>. Vui lòng <strong>gọi ngay 115</strong> hoặc đến cơ sở y tế gần nhất ngay lập tức!');
    return;
  }

  // Giả lập thời gian xử lý để có cảm giác "đang soạn phản hồi"
  setTimeout(() => {
    typingEl.style.display = 'none';
    try {
      const html = buildAdvice(message);
      addMessage('assistant', html);
    } catch(e) {
      addMessage('assistant', '⚠️ Có lỗi khi xử lý yêu cầu. Vui lòng thử lại với cách diễn đạt khác.');
    }
  }, 400);
}

function setupChat() {
  const input = document.getElementById('chat-input');
  const btn = document.getElementById('chat-send');
  const send = () => {
    const msg = input.value.trim();
    if(!msg) return;
    input.value = '';
    sendChat(msg);
  };
  btn.addEventListener('click', send);
  input.addEventListener('keydown', e => { if(e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send(); } });
}


// ================================================================
//  THEME
// ================================================================
function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  try { localStorage.setItem(APP_CONFIG.themeKey, isDark ? 'dark' : 'light'); } catch(e){}
}

function initTheme() {
  try {
    const saved = localStorage.getItem(APP_CONFIG.themeKey);
    if(saved === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  } catch(e) {}
}

// ================================================================
//  DISCLAIMER
// ================================================================
function initDisclaimer() {
  const modal = document.getElementById('modal-disclaimer');
  try {
    if(localStorage.getItem(APP_CONFIG.disclaimerKey) === 'true') {
      modal.style.display = 'none';
    }
  } catch(e) {}
  document.getElementById('btn-accept').addEventListener('click', () => {
    modal.style.display = 'none';
    try { localStorage.setItem(APP_CONFIG.disclaimerKey, 'true'); } catch(e){}
  });
}
