// Cấu hình chung của app + state quản lý giao diện hiện tại
// ================================================================
//  CONFIG
// ================================================================
const APP_CONFIG = {
  disclaimerKey: 'pharmdoc_disclaimer',
  themeKey: 'pharmdoc_theme',
  MAX_SYMPTOMS: 5,
  EMERGENCY_KEYWORDS: ['khó thở','đau ngực','bất tỉnh','ngã xuống','nhồi máu','đột quỵ','co giật','mất ý thức','cấp cứu']
};

// ================================================================
//  STATE
// ================================================================
const state = {
  query: '',
  cat: '',
  type: '',
  activeChip: null,
  currentTab: 'lookup'
};
