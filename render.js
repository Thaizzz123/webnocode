// Render giao diện: routing, lọc, thẻ thuốc, chi tiết thuốc
// ================================================================
//  ROUTING
// ================================================================
function showHome() {
  document.getElementById('page-home').style.display = 'block';
  document.getElementById('page-search').style.display = 'none';
  if(typeof closeMobileFilters === 'function') closeMobileFilters();
}

function showSearch(tab) {
  document.getElementById('page-home').style.display = 'none';
  document.getElementById('page-search').style.display = 'flex';
  switchTab(tab || 'lookup');
}

// ================================================================
//  TAB SWITCHING
// ================================================================
function switchTab(tab) {
  state.currentTab = tab;
  if(typeof closeMobileFilters === 'function') closeMobileFilters();
  const tabs = ['lookup','chat','pharmacy'];
  tabs.forEach(t => {
    const btn = document.getElementById('tab-'+t);
    const view = document.getElementById('view-'+t);
    if(btn) {
      btn.className = 'flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-semibold text-xs border-b-2 whitespace-nowrap transition ' +
        (t === tab ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400');
    }
    if(view) view.style.display = (t === tab) ? 'flex' : 'none';
  });
}

// ================================================================
//  RENDER CATEGORIES
// ================================================================
function renderCatFilter() {
  const cats = [...new Set(MEDICINES.map(m=>m.cat))].sort();
  const container = document.getElementById('cat-filter');
  cats.forEach(c => {
    const label = document.createElement('label');
    label.className = 'radio-item';
    label.innerHTML = `<input type="radio" name="cat" value="${c}"> <span class="text-slate-700 dark:text-slate-300 text-xs truncate" title="${c}">${c}</span>`;
    container.appendChild(label);
  });
}

// ================================================================
//  FILTERING
// ================================================================
function getFiltered() {
  const q = state.query.toLowerCase().trim();
  return MEDICINES.filter(m => {
    const matchCat = !state.cat || m.cat === state.cat;
    const matchType = !state.type || m.type === state.type;
    const matchQ = !q || 
      m.name.toLowerCase().includes(q) ||
      m.active.toLowerCase().includes(q) ||
      m.indication.toLowerCase().includes(q) ||
      m.warning.toLowerCase().includes(q) ||
      (m.tags && m.tags.some(t => t.toLowerCase().includes(q)));
    return matchCat && matchType && matchQ;
  });
}

// ================================================================
//  RENDER CARDS
// ================================================================
function renderCards() {
  const results = getFiltered();
  const grid = document.getElementById('results-grid');
  const info = document.getElementById('result-info');
  info.textContent = `${results.length} kết quả trong database`;
  grid.innerHTML = '';
  if(results.length === 0) {
    grid.innerHTML = `<div class="col-span-full flex flex-col items-center justify-center py-16 text-slate-400">
      <i class="fa-solid fa-magnifying-glass text-4xl mb-3 opacity-40"></i>
      <p class="text-sm font-medium">Không tìm thấy thuốc phù hợp</p>
      <p class="text-xs mt-1">Thử từ khóa khác hoặc xóa bộ lọc</p>
    </div>`;
    return;
  }
  results.forEach(m => {
    const card = document.createElement('div');
    card.className = 'card-hover bg-white dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 rounded-xl p-4 cursor-pointer fade-up select-none';
    card.onclick = () => openDetail(m.id);
    const badgeClass = m.type === 'OTC' ? 'badge-otc' : 'badge-rx';
    card.innerHTML = `
      <div class="flex items-start justify-between gap-2 mb-2">
        <span class="${badgeClass} text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0">${m.type}</span>
        <span class="text-[10px] text-slate-400 dark:text-slate-500 text-right leading-tight">${m.form}</span>
      </div>
      <h3 class="font-bold text-sm text-slate-900 dark:text-white leading-tight mb-0.5">${m.name}</h3>
      <p class="text-[11px] text-teal-600 dark:text-teal-400 font-medium mb-2 leading-tight">${m.active}</p>
      <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">${m.indication}</p>
      <div class="mt-2.5 flex items-center justify-between">
        <span class="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">${m.cat}</span>
        <span class="text-[10px] text-teal-600 dark:text-teal-400 flex items-center gap-1">Chi tiết <i class="fa-solid fa-chevron-right text-[8px]"></i></span>
      </div>`;
    grid.appendChild(card);
  });
}

// ================================================================
//  DETAIL MODAL
// ================================================================
function openDetail(id) {
  const m = MEDICINES.find(x => x.id === id);
  if(!m) return;
  document.getElementById('d-name').textContent = m.name;
  document.getElementById('d-active').textContent = m.active;
  document.getElementById('d-indication').textContent = m.indication;
  document.getElementById('d-warning').textContent = m.warning;
  const typeBadge = document.getElementById('d-type-badge');
  typeBadge.textContent = m.type === 'OTC' ? 'OTC — Không kê đơn' : 'Rx — Cần kê đơn bác sĩ';
  typeBadge.className = `text-[11px] font-bold px-2 py-0.5 rounded-full border ${m.type === 'OTC' ? 'badge-otc' : 'badge-rx'}`;
  document.getElementById('d-cat-badge').textContent = m.cat;
  document.getElementById('detail-modal').style.display = 'flex';
}

function closeDetail() {
  document.getElementById('detail-modal').style.display = 'none';
}

// Click outside to close
document.getElementById('detail-modal').addEventListener('click', function(e) {
  if(e.target === this) closeDetail();
});
