// Khởi chạy app khi DOM sẵn sàng
// ================================================================
//  INIT
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initDisclaimer();
  renderCatFilter();
  renderCards();
  setupSearch();
  setupFilters();
  setupChat();
  // Home page default
  showHome();
});
