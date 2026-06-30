// Engine gợi ý thuốc từ triệu chứng (tự xây dựng, không gọi API ngoài)
// ================================================================
//  BẢN ĐỒ TRIỆU CHỨNG -> NHÃN TAG TRONG TỦ THUỐC
//  Mỗi nhóm là 1 "bệnh/triệu chứng" mà người dùng có thể nhập.
//  keywords: các cách gõ thường gặp (đem so khớp với câu nhập của người dùng)
//  tags: các nhãn trong MEDICINES.tags dùng để tìm thuốc phù hợp
// ================================================================
const SYMPTOM_MAP = [
  {id:'fever',        label:'sốt',              keywords:['sốt cao','sốt nhẹ','bị sốt','sốt'],                         tags:['sốt','hạ sốt']},
  {id:'headache',     label:'đau đầu',          keywords:['đau nửa đầu','nhức đầu','đau đầu'],                          tags:['đau đầu','nhức đầu','đau nửa đầu']},
  {id:'cough',        label:'ho',               keywords:['ho có đờm','ho khan','ho'],                                  tags:['ho','ho khan','đờm']},
  {id:'runny_nose',   label:'sổ mũi',           keywords:['chảy nước mũi','sổ mũi'],                                    tags:['sổ mũi']},
  {id:'stuffy_nose',  label:'nghẹt mũi',        keywords:['ngạt mũi','nghẹt mũi'],                                      tags:['nghẹt mũi']},
  {id:'sore_throat',  label:'đau họng',         keywords:['rát họng','viêm họng','đau họng'],                           tags:['đau họng','viêm họng','rát họng']},
  {id:'flu',          label:'cảm cúm',          keywords:['cảm lạnh','cảm cúm','bị cảm'],                               tags:['cảm cúm']},
  {id:'diarrhea',     label:'tiêu chảy',        keywords:['đi ngoài lỏng','đi ngoài','tiêu chảy'],                      tags:['tiêu chảy']},
  {id:'constipation', label:'táo bón',          keywords:['táo bón'],                                                   tags:['táo bón']},
  {id:'stomach_pain', label:'đau bụng / đau dạ dày', keywords:['đau bụng kinh','đau dạ dày','đau bụng'],               tags:['đau bụng','đau dạ dày','co thắt','đau quặn']},
  {id:'nausea',       label:'buồn nôn / nôn',   keywords:['nôn mửa','buồn nôn','nôn'],                                  tags:['buồn nôn','nôn']},
  {id:'bloating',     label:'đầy bụng, khó tiêu', keywords:['chướng bụng','đầy bụng','khó tiêu'],                       tags:['đầy bụng','khó tiêu','chướng hơi']},
  {id:'heartburn',    label:'ợ chua, trào ngược', keywords:['ợ nóng','ợ chua','trào ngược'],                            tags:['ợ chua','trào ngược']},
  {id:'allergy',      label:'dị ứng, mề đay',   keywords:['mẩn ngứa','mề đay','dị ứng'],                                tags:['dị ứng','mề đay']},
  {id:'itchy_skin',   label:'ngứa da',          keywords:['côn trùng cắn','ngứa da','ngứa'],                            tags:['ngứa da','côn trùng cắn','ngứa']},
  {id:'muscle_pain',  label:'đau cơ',           keywords:['đau nhức cơ','đau cơ'],                                      tags:['đau cơ']},
  {id:'joint_pain',   label:'đau khớp',         keywords:['đau khớp gối','thoái hóa khớp','viêm khớp','đau khớp'],      tags:['đau khớp','viêm khớp','thoái hóa khớp','đau khớp gối']},
  {id:'back_pain',    label:'đau lưng',         keywords:['đau lưng'],                                                  tags:['đau lưng','co cơ']},
  {id:'fatigue',      label:'mệt mỏi, suy nhược', keywords:['kiệt sức','suy nhược','mệt mỏi'],                          tags:['mệt mỏi','suy nhược']},
  {id:'ear_pain',     label:'đau tai, viêm tai', keywords:['viêm tai','đau tai'],                                       tags:['đau tai','viêm tai']},
  {id:'breath',       label:'khó thở, hen suyễn', keywords:['hen suyễn','khó thở','hen'],                               tags:['khó thở','hen','COPD']},
  {id:'toothache',    label:'đau răng',         keywords:['đau răng'],                                                  tags:['đau răng']},
  {id:'infection',    label:'nhiễm khuẩn',      keywords:['viêm nhiễm','nhiễm khuẩn'],                                  tags:['nhiễm khuẩn']},
  {id:'fungal',       label:'nấm da, hắc lào',  keywords:['nấm móng','hắc lào','nấm da'],                               tags:['nấm','nấm da','nấm móng']},
  {id:'hemorrhoid',   label:'trĩ, nặng chân',   keywords:['nặng chân','trĩ'],                                           tags:['trĩ','nặng chân','suy tĩnh mạch']},
  {id:'high_bp',      label:'tăng huyết áp',    keywords:['cao huyết áp','tăng huyết áp'],                              tags:['tăng huyết áp']},
  {id:'diabetes',     label:'tiểu đường',       keywords:['đái tháo đường','tiểu đường'],                               tags:['tiểu đường','đái tháo đường']},
  {id:'cramps',       label:'chuột rút',        keywords:['chuột rút'],                                                 tags:['chuột rút','thiếu magie']},
  {id:'worms',        label:'giun sán',         keywords:['tẩy giun','giun sán','giun'],                                tags:['giun sán','tẩy giun']},
  {id:'bad_breath',   label:'hôi miệng, viêm nướu', keywords:['viêm nướu','hôi miệng'],                                 tags:['hôi miệng','viêm nướu']},
  {id:'vaginal',      label:'viêm âm đạo, ngứa vùng kín', keywords:['ngứa vùng kín','viêm âm đạo','nấm âm đạo'],        tags:['viêm âm đạo','nấm âm đạo','ngứa']},
  {id:'anemia',       label:'thiếu máu, thiếu sắt', keywords:['thiếu sắt','thiếu máu'],                                 tags:['thiếu máu','thiếu sắt']},
  {id:'cold_sores',   label:'mụn rộp, zona, thủy đậu', keywords:['thủy đậu','mụn rộp','zona'],                          tags:['herpes','thủy đậu','zona']},

  // --- Nhóm bổ sung (đồng bộ với 100 thuốc mới 201-300) ---
  {id:'insomnia',     label:'mất ngủ, khó ngủ', keywords:['khó ngủ','mất ngủ'],                                         tags:['mất ngủ','an thần']},
  {id:'anxiety',      label:'lo âu, căng thẳng', keywords:['căng thẳng','hoảng sợ','lo âu'],                            tags:['lo âu','hoảng sợ','tâm thần']},
  {id:'dizziness',    label:'chóng mặt, hoa mắt', keywords:['hoa mắt','chóng mặt'],                                     tags:['chóng mặt','tiền đình','ù tai','say tàu xe']},
  {id:'memory',       label:'suy giảm trí nhớ, kém tập trung', keywords:['kém tập trung','suy giảm trí nhớ','hay quên'], tags:['suy giảm trí nhớ','suy giảm nhận thức','kém tập trung','đột quỵ']},
  {id:'cholesterol',  label:'mỡ máu cao',       keywords:['cholesterol cao','mỡ máu cao','mỡ máu'],                     tags:['mỡ máu','cholesterol cao','triglyceride cao']},
  {id:'liver',        label:'gan yếu, men gan cao', keywords:['men gan cao','gan yếu','viêm gan'],                      tags:['gan','men gan cao','viêm gan','xơ gan','gan nhiễm mỡ','sỏi mật']},
  {id:'acne',         label:'mụn trứng cá',     keywords:['mụn trứng cá','mụn viêm','nổi mụn'],                         tags:['mụn trứng cá','mụn viêm','mụn đầu đen']},
  {id:'skin_condition', label:'vảy nến, chàm, viêm da', keywords:['á sừng','vảy nến','chàm'],                           tags:['vảy nến','chàm','viêm da','á sừng']},
  {id:'scar',         label:'sẹo, sẹo thâm',    keywords:['sẹo lồi','sẹo thâm','sẹo'],                                   tags:['sẹo','sẹo lồi','sẹo phì đại','sẹo thâm','sẹo phẫu thuật','sẹo mụn']},
  {id:'mouth_ulcer',  label:'nhiệt miệng, loét miệng', keywords:['loét miệng','nhiệt miệng'],                           tags:['nhiệt miệng','loét miệng','viêm lợi','viêm nha chu']},
  {id:'dry_eyes',     label:'khô mắt, mỏi mắt', keywords:['mỏi mắt','khô mắt'],                                         tags:['khô mắt','mỏi mắt','mắt mệt']},
  {id:'osteoporosis', label:'loãng xương',      keywords:['loãng xương'],                                               tags:['loãng xương','gãy xương']},
  {id:'gout',         label:'gút',              keywords:['gout','gút'],                                                tags:['gút','acid uric']},
  {id:'hyperthyroid', label:'cường giáp',       keywords:['bướu giáp nhiễm độc','basedow','cường giáp'],                tags:['cường giáp']},
  {id:'hypothyroid',  label:'suy giáp',         keywords:['suy giáp','tuyến giáp'],                                     tags:['suy giáp','tuyến giáp']},
  {id:'pregnancy',    label:'bổ sung dinh dưỡng thai kỳ', keywords:['dinh dưỡng thai kỳ','bà bầu','mang thai'],         tags:['mang thai','dinh dưỡng thai kỳ','thiếu vitamin']},
  {id:'menstrual',    label:'rối loạn kinh nguyệt, tiền mãn kinh', keywords:['tiền mãn kinh','rối loạn kinh nguyệt'],   tags:['rối loạn kinh nguyệt','tiền mãn kinh','tránh thai']},
];

// ================================================================
//  TÁCH TRIỆU CHỨNG TỪ CÂU NHẬP CỦA NGƯỜI DÙNG
//  - So khớp từ khóa dài -> ngắn để tránh trùng lặp nhóm
//  - Mỗi nhóm (id) chỉ tính 1 lần, dù khớp nhiều từ khóa
// ================================================================
function tokenize(text) {
  return text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean);
}
function containsPhrase(tokens, phrase) {
  const ptoks = phrase.toLowerCase().split(/\s+/).filter(Boolean);
  for(let i = 0; i <= tokens.length - ptoks.length; i++) {
    let ok = true;
    for(let j = 0; j < ptoks.length; j++) {
      if(tokens[i+j] !== ptoks[j]) { ok = false; break; }
    }
    if(ok) return true;
  }
  return false;
}
function detectSymptoms(text) {
  const lower = text.toLowerCase();
  const tokens = tokenize(text);
  const allKeywords = [];
  SYMPTOM_MAP.forEach(group => group.keywords.forEach(kw => allKeywords.push({kw, group})));
  allKeywords.sort((a,b) => b.kw.length - a.kw.length);

  const matchedIds = new Set();
  const result = [];
  for(const {kw, group} of allKeywords) {
    if(matchedIds.has(group.id)) continue;
    if(containsPhrase(tokens, kw)) {
      matchedIds.add(group.id);
      let tags = [...group.tags];
      // Trường hợp đặc biệt: "sốt cao" -> bổ sung gợi ý bù nước/điện giải (Oresol)
      if(group.id === 'fever' && /sốt\s*(rất\s*)?cao/.test(lower)) {
        tags.push('mất nước');
      }
      result.push({...group, tags, matchedKeyword: kw});
    }
  }
  return result;
}

// ================================================================
//  ENGINE GỢI Ý THUỐC TỪ TỦ THUỐC NỘI BỘ
//  Thuật toán xếp ưu tiên:
//   1) Thuốc phải có danh sách "tags" (loại không có tags bị loại)
//   2) Phù hợp với càng nhiều triệu chứng còn lại càng được ưu tiên
//   3) Độ phổ biến cao hơn ưu tiên hơn
//   4) OTC (không kê đơn) ưu tiên hơn Rx khi vẫn ngang điểm
//  Sau khi chọn 1 thuốc, các triệu chứng đã được thuốc đó "phủ" sẽ bị
//  loại khỏi danh sách còn thiếu, rồi lặp lại quy trình cho đến khi
//  hết triệu chứng hoặc không còn thuốc phù hợp.
// ================================================================
function isBetterCandidate(a, b) {
  if(a.coverCount !== b.coverCount) return a.coverCount > b.coverCount;
  if(a.popularity !== b.popularity) return a.popularity > b.popularity;
  const aOtc = a.medicine.type === 'OTC' ? 1 : 0;
  const bOtc = b.medicine.type === 'OTC' ? 1 : 0;
  return aOtc > bOtc;
}

function recommendMedicines(symptoms) {
  let remaining = symptoms.map(s => s.id);
  const usedIds = new Set();
  const recommendations = [];

  while(remaining.length > 0) {
    let best = null;
    for(const med of MEDICINES) {
      if(usedIds.has(med.id)) continue;
      if(!med.tags || !med.tags.length) continue; // không có danh sách tags -> bỏ
      const covered = [];
      for(const symId of remaining) {
        const sym = symptoms.find(s => s.id === symId);
        if(sym.tags.some(t => med.tags.includes(t))) covered.push(symId);
      }
      if(covered.length === 0) continue;
      const candidate = { medicine: med, covered, coverCount: covered.length, popularity: popularityOf(med.id) };
      if(!best || isBetterCandidate(candidate, best)) best = candidate;
    }
    if(!best) break;
    recommendations.push(best);
    usedIds.add(best.medicine.id);
    remaining = remaining.filter(id => !best.covered.includes(id));
  }
  return { recommendations, uncovered: remaining };
}

// Tìm các thuốc liên quan tới 1 nhóm triệu chứng (để hiển thị "các loại thuốc như...")
function candidatesForSymptom(symptom, excludeIds = []) {
  return MEDICINES
    .filter(m => m.tags && m.tags.length && !excludeIds.includes(m.id) && symptom.tags.some(t => m.tags.includes(t)))
    .sort((a,b) => popularityOf(b.id) - popularityOf(a.id) || (a.type==='OTC'?-1:1) - (b.type==='OTC'?-1:1));
}

// ================================================================
//  RENDER 1 "THẺ THUỐC" — lấy nguyên khung như trong tủ thuốc
// ================================================================
function renderMedicineCard(med) {
  const typeBadgeClass = med.type === 'OTC' ? 'badge-otc' : 'badge-rx';
  const typeLabel = med.type === 'OTC' ? 'Không kê đơn (OTC)' : 'Kê đơn (Rx)';
  return `
    <div class="mt-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <div class="p-3 border-b border-slate-200 dark:border-slate-700">
        <div class="flex items-center gap-2 mb-1 flex-wrap">
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border ${typeBadgeClass}">${typeLabel}</span>
          <span class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">${med.cat}</span>
        </div>
        <h4 class="font-bold text-sm text-slate-900 dark:text-white leading-tight">${med.name}</h4>
        <p class="text-xs text-teal-600 dark:text-teal-400 mt-0.5 font-medium">${med.active}</p>
      </div>
      <div class="p-3 space-y-2">
        <div>
          <p class="text-[11px] font-bold text-slate-700 dark:text-slate-200 mb-1"><i class="fa-solid fa-stethoscope text-teal-500 mr-1"></i>Chỉ định</p>
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-teal-50 dark:bg-teal-950/20 p-2.5 rounded-lg border border-teal-100 dark:border-teal-900/30">${med.indication}</p>
        </div>
        <div>
          <p class="text-[11px] font-bold text-slate-700 dark:text-slate-200 mb-1"><i class="fa-solid fa-circle-exclamation text-amber-500 mr-1"></i>Cảnh báo quan trọng</p>
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-amber-50 dark:bg-amber-950/20 p-2.5 rounded-lg border border-amber-100 dark:border-amber-900/30">${med.warning}</p>
        </div>
      </div>
    </div>`;
}

// ================================================================
//  TẠO PHẢN HỒI TƯ VẤN DỰA TRÊN TỦ THUỐC
// ================================================================
function buildAdvice(message) {
  const symptoms = detectSymptoms(message);

  // Quá 5 bệnh / triệu chứng cùng lúc
  if(symptoms.length > APP_CONFIG.MAX_SYMPTOMS) {
    return `<div class="text-rose-500 font-medium">Hệ thống chỉ có thể xử lý tối đa ${APP_CONFIG.MAX_SYMPTOMS} bệnh 1 lần, xin quý khách thông cảm!</div>`;
  }

  // Không nhận diện được triệu chứng nào trong tủ thuốc
  if(symptoms.length === 0) {
    const q = message.toLowerCase().trim();
    const found = MEDICINES.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.active.toLowerCase().includes(q) ||
      m.indication.toLowerCase().includes(q) ||
      (m.tags && m.tags.some(t => t.toLowerCase().includes(q)))
    ).slice(0,3);
    if(found.length) {
      let html = `Hệ thống tìm thấy trong tủ thuốc các loại có liên quan đến "<strong>${escapeHtml(message)}</strong>":`;
      found.forEach(m => html += renderMedicineCard(m));
      return html;
    }
    return `Hệ thống chưa nhận diện được triệu chứng cụ thể trong câu của bạn. Hãy mô tả rõ hơn, ví dụ: <em>"tôi bị sốt, ho và sổ mũi"</em> (tối đa ${APP_CONFIG.MAX_SYMPTOMS} triệu chứng/lần).`;
  }

  const symptomLabels = symptoms.map(s => s.label).join(', ');
  const { recommendations, uncovered } = recommendMedicines(symptoms);

  if(!recommendations.length) {
    return `Theo như tình trạng <strong>${symptomLabels}</strong> của bạn, hiện tủ thuốc chưa có dữ liệu loại thuốc phù hợp tương ứng. Bạn nên hỏi trực tiếp dược sĩ tại nhà thuốc gần nhất.`;
  }

  // Danh sách "các loại thuốc như..." gom từ tất cả triệu chứng đã nhập
  const allCandidates = [];
  const seen = new Set();
  symptoms.forEach(sym => {
    candidatesForSymptom(sym).forEach(m => {
      if(!seen.has(m.id)) { seen.add(m.id); allCandidates.push(m); }
    });
  });
  const candidateNames = allCandidates.slice(0,6).map(m => m.name).join(', ');

  const first = recommendations[0];
  let html = `Theo như tình trạng <strong>${symptomLabels}</strong> của bạn, nó có thể đi kèm nhiều triệu chứng khác nhau. `
    + `Các loại thuốc như ${candidateNames} sẽ phù hợp với bạn. Với thông tin bạn cung cấp, đây là loại phù hợp nhất hiện tại: <strong>${first.medicine.name}</strong>.`;
  html += renderMedicineCard(first.medicine);

  // Nếu 1 thuốc chưa đủ phủ hết các triệu chứng -> gợi ý thêm
  for(let i = 1; i < recommendations.length; i++) {
    const rec = recommendations[i];
    const justCoveredLabels = rec.covered.map(id => symptoms.find(s=>s.id===id).label).join(', ');
    html += `<div class="mt-3 text-sm">Để bổ sung công dụng cho triệu chứng <strong>${justCoveredLabels}</strong>, có thể dùng thêm: <strong>${rec.medicine.name}</strong>.</div>`;
    html += renderMedicineCard(rec.medicine);
  }

  if(uncovered.length) {
    const stillMissing = uncovered.map(id => symptoms.find(s=>s.id===id).label).join(', ');
    html += `<div class="mt-3 text-xs text-amber-500">⚠ Tủ thuốc hiện chưa có lựa chọn riêng cho: ${stillMissing}. Vui lòng hỏi thêm dược sĩ.</div>`;
  }

  return html;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
