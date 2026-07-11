(() => {
  'use strict';

  const DATA = window.VSTEP_DATA;
  const STORAGE_KEY = 'vstep-writing-lab-v1';
  const DEFAULT_STATE = {
    currentSetId: DATA.sets[0].id,
    currentPart: 'task1',
    mode: 'practice',
    drafts: {},
    timers: {},
    submissions: {},
    sharedTimer: { remaining: 3600, running: false, lastTick: null }
  };


  const CATEGORY_META = {
    education:{en:'Education & English',vi:'Giáo dục & Tiếng Anh'},
    career:{en:'Jobs & Careers',vi:'Việc làm & Sự nghiệp'},
    travel:{en:'Travel & Experiences',vi:'Du lịch & Trải nghiệm'},
    technology:{en:'Technology & Consumer Life',vi:'Công nghệ & Tiêu dùng'},
    society:{en:'Society & Daily Life',vi:'Xã hội & Đời sống'},
    health:{en:'Health & Community',vi:'Sức khỏe & Cộng đồng'}
  };
  const SET_META = {
    'education-1':{en:'English Poster & Online Learning',vi:'Poster tiếng Anh & Học trực tuyến'},
    'education-2':{en:'Learning Exhibition & Subject Choice',vi:'Triển lãm học tập & Chọn môn học'},
    'career-1':{en:'New Job & Vocational Education',vi:'Công việc mới & Trường nghề'},
    'career-2':{en:'Leave Request & Multitasking',vi:'Xin nghỉ phép & Làm nhiều việc cùng lúc'},
    'travel-1':{en:'Summer Plans & Studying Abroad',vi:'Kế hoạch nghỉ hè & Du học'},
    'travel-2':{en:'Hotel Feedback & Local Tourism',vi:'Phản hồi khách sạn & Du lịch địa phương'},
    'travel-3':{en:'Lost Luggage & Social Media',vi:'Hành lý thất lạc & Mạng xã hội'},
    'travel-4':{en:'Gap Year Visit & Light Pollution',vi:'Năm nghỉ học & Ô nhiễm ánh sáng'},
    'technology-1':{en:'Digital Marketing & Vietnamese Products',vi:'Khóa Digital Marketing & Sản phẩm Việt'},
    'technology-2':{en:'Taxi Complaint & Advertising',vi:'Phàn nàn taxi & Quảng cáo'},
    'society-1':{en:'Introducing a Friend & Fame',vi:'Giới thiệu bạn An & Sự nổi tiếng'},
    'society-2':{en:'Cancelling an Appointment & Late Parenthood',vi:'Xin lỗi hủy hẹn & Sinh con muộn'},
    'health-1':{en:'Sports Club & Stress',vi:'Câu lạc bộ thể thao & Căng thẳng'},
    'health-2':{en:'Volunteering & Historical Places',vi:'Tình nguyện & Địa điểm lịch sử'}
  };


  // Task 1 is grouped exactly as in the uploaded lesson material:
  // - Form thư đi trả lời: someone asks for information, feedback or advice.
  // - Form thư đi hỏi: requests, proposals, applications, apologies, thanks, invitations and complaints.
  const TASK1_FORM_META = {
    'education-1': {
      key:'ask', form:'Form thư đi hỏi', kind:'Thư yêu cầu / xin lời khuyên',
      signals:['ask where to find useful information','request tips'],
      memory:'Bạn là người chủ động viết để hỏi nguồn thông tin và xin mẹo.'
    },
    'education-2': {
      key:'reply', form:'Form thư đi trả lời', kind:'Thư cung cấp thông tin',
      signals:['A foreign student asks about an exhibition'],
      memory:'Người khác đã hỏi; bạn viết thư để cung cấp các thông tin được yêu cầu.'
    },
    'career-1': {
      key:'reply', form:'Form thư đi trả lời', kind:'Thư trả lời và cho lời khuyên',
      signals:['Jane asks about','advice for her job interview'],
      memory:'Jane hỏi nhiều câu và xin lời khuyên; nhiệm vụ của bạn là trả lời lần lượt.'
    },
    'career-2': {
      key:'ask', form:'Form thư đi hỏi', kind:'Thư đề nghị / yêu cầu',
      signals:['request time off','Ask about'],
      memory:'Bạn chủ động xin nghỉ và hỏi người quản lý về các điều kiện liên quan.'
    },
    'travel-1': {
      key:'reply', form:'Form thư đi trả lời', kind:'Thư trả lời thân mật',
      signals:['Your English friend Jane asks'],
      memory:'Bạn nhận câu hỏi từ Jane và cần trả lời từng ý trong thư.'
    },
    'travel-2': {
      key:'reply', form:'Form thư đi trả lời', kind:'Thư feedback / phản hồi',
      signals:['share your experience','suggest improvements','recommend the hotel'],
      memory:'Theo tài liệu, thư feedback được xếp vào form thư đi trả lời.'
    },
    'travel-3': {
      key:'reply', form:'Form thư đi trả lời', kind:'Thư trả lời cung cấp thông tin',
      signals:['has asked you to provide information','replying to the manager'],
      memory:'Quản lý đã gửi email hỏi thông tin trước; bạn trả lời lần lượt về hành lý, chuyến bay và cách liên hệ.'
    },
    'travel-4': {
      key:'reply', form:'Form thư đi trả lời', kind:'Thư trả lời và cho lời khuyên',
      signals:['has written to ask for your advice','responding to Tom'],
      memory:'Tom đã viết thư xin lời khuyên; bạn trả lời đủ ba nhóm ý về kỹ năng, hành lý/lịch trình và kỹ năng nên học trong gap year.'
    },
    'technology-1': {
      key:'ask', form:'Form thư đi hỏi', kind:'Thư hỏi thông tin',
      signals:['Ask about the duration','content and accommodation'],
      memory:'Bạn thấy quảng cáo và chủ động hỏi thêm thông tin về khóa học.'
    },
    'technology-2': {
      key:'ask', form:'Form thư đi hỏi', kind:'Thư phàn nàn',
      signals:['complaint','request action'],
      memory:'Theo tài liệu, thư phàn nàn nằm trong nhóm form thư đi hỏi.'
    },
    'society-1': {
      key:'reply', form:'Form thư đi trả lời', kind:'Thư cung cấp thông tin',
      signals:['Jane asks about your friend An'],
      memory:'Jane yêu cầu thông tin về An; bạn cần trả lời đúng các nội dung Jane hỏi.'
    },
    'society-2': {
      key:'ask', form:'Form thư đi hỏi', kind:'Thư xin lỗi',
      signals:['Apologise to a friend','suggest another time and place'],
      memory:'Theo tài liệu, thư xin lỗi được dùng theo form thư đi hỏi.'
    },
    'health-1': {
      key:'ask', form:'Form thư đi hỏi', kind:'Thư hỏi thông tin',
      signals:['Write a letter to the manager','Ask about facilities'],
      memory:'Bạn chủ động viết cho quản lý để hỏi cơ sở vật chất, hội viên và chi phí.'
    },
    'health-2': {
      key:'ask', form:'Form thư đi hỏi', kind:'Thư yêu cầu thông tin',
      signals:['need more information','Ask about the provided food'],
      memory:'Bạn đã thấy tờ rơi nhưng còn thiếu thông tin nên phải chủ động hỏi.'
    }
  };
  function getSetMeta(set){ return SET_META[set.id] || {en:set.title,vi:set.title}; }
  function getCategoryMeta(id, fallback=''){ return CATEGORY_META[id] || {en:fallback,vi:fallback}; }
  function getTask1Meta(setId=state?.currentSetId, task=null) {
    const preset = TASK1_FORM_META[setId];
    if (preset) return preset;
    const source = `${task?.type || ''} ${task?.prompt_en || ''}`;
    const reply = /reply|respond|feedback|provide information|asks? about|give advice/i.test(source);
    return reply
      ? {key:'reply',form:'Form thư đi trả lời',kind:'Thư trả lời / cung cấp thông tin',signals:['asks about'],memory:'Người khác hỏi trước; bạn trả lời các nội dung được yêu cầu.'}
      : {key:'ask',form:'Form thư đi hỏi',kind:'Thư chủ động viết đi',signals:['ask for'],memory:'Bạn chủ động viết để hỏi, yêu cầu, đề nghị, xin lỗi hoặc phàn nàn.'};
  }

  const $ = (id) => document.getElementById(id);
  const els = {
    sidebar: $('sidebar'), topicNav: $('topicNav'), breadcrumb: $('breadcrumb'), setTitle: $('setTitle'),
    setTitleTranslation: $('setTitleTranslation'), setSubtitle: $('setSubtitle'), taskType: $('taskType'), taskTitle: $('taskTitle'), timeBadge: $('timeBadge'),
    wordBadge: $('wordBadge'), promptInstruction: $('promptInstruction'), promptText: $('promptText'),
    requirements: $('requirements'), promptVietnamese: $('promptVietnamese'), outlinePanel: $('outlinePanel'),
    recognitionPanel: $('recognitionPanel'), essayFormBadge: $('essayFormBadge'), recognitionDetails: $('recognitionDetails'),
    answerBox: $('answerBox'), wordCount: $('wordCount'), charCount: $('charCount'), saveStatus: $('saveStatus'),
    wordProgressBar: $('wordProgressBar'), partTimer: $('partTimer'), timerToggle: $('timerToggle'),
    timerReset: $('timerReset'), liveChecklist: $('liveChecklist'), phraseList: $('phraseList'),
    resultSection: $('resultSection'), scoreGrid: $('scoreGrid'), reviewEngineLabel: $('reviewEngineLabel'),
    doneCount: $('doneCount'), draftCount: $('draftCount'), statusTask1: $('statusTask1'), statusTask2: $('statusTask2'),
    sharedTimerCard: $('sharedTimerCard'), sharedTimer: $('sharedTimer'), sharedTimerToggle: $('sharedTimerToggle'),
    modeLabel: $('modeLabel'), progressModal: $('progressModal'), progressContent: $('progressContent'),
    formHelpModal: $('formHelpModal'), formHelpCurrent: $('formHelpCurrent'), toast: $('toast'),
    sidebarOverlay: $('sidebarOverlay')
  };

  let state = loadState();
  let timerHandle = null;
  let autosaveHandle = null;
  let phraseOffset = 0;
  let promptViVisible = false;
  let outlineVisible = false;

  const phraseBanks = {
    task1Ask: [
      ['Today, I am writing this letter to ask for…', 'Hôm nay, tôi viết thư này để hỏi/yêu cầu về…'],
      ['Firstly, could you please let me know…?', 'Trước hết, bạn/Ông/Bà có thể cho tôi biết… không?'],
      ['Secondly, I would like to know…', 'Thứ hai, tôi muốn biết…'],
      ['I am particularly interested in knowing…', 'Tôi đặc biệt muốn biết…'],
      ['I would be grateful if you could tell me…', 'Tôi rất biết ơn nếu bạn/Ông/Bà có thể cho tôi biết…'],
      ['I am writing to complain about…', 'Tôi viết thư để phàn nàn về…'],
      ['I am writing to apologise for…', 'Tôi viết thư để xin lỗi về…'],
      ['I look forward to hearing from you.', 'Tôi mong sớm nhận được hồi âm.']
    ],
    task1Reply: [
      ['Today, I am writing this letter to answer your questions.', 'Hôm nay, tôi viết thư này để trả lời các câu hỏi của bạn.'],
      ['Firstly, in your letter, you asked me about…', 'Trước hết, trong thư bạn đã hỏi tôi về…'],
      ['Secondly, as for your question about…,', 'Thứ hai, về câu hỏi của bạn liên quan đến…'],
      ['Next, related to your question about…,', 'Tiếp theo, liên quan đến câu hỏi của bạn về…'],
      ['Finally, coming to the last question about…,', 'Cuối cùng, về câu hỏi cuối của bạn liên quan đến…'],
      ['I must say that…', 'Tôi phải nói rằng…'],
      ['I suppose that…', 'Tôi cho rằng…'],
      ['Do not hesitate to write to me if you want further information.', 'Đừng ngần ngại viết cho tôi nếu bạn muốn biết thêm thông tin.']
    ],
    task2: [
      ['It is widely believed that…', 'Nhiều người cho rằng…'],
      ['One of the main advantages is that…', 'Một trong những ưu điểm chính là…'],
      ['On the other hand, there are also several drawbacks.', 'Mặt khác, cũng có một số hạn chế.'],
      ['A clear example of this is…', 'Một ví dụ rõ ràng cho điều này là…'],
      ['Another important point is that…', 'Một điểm quan trọng khác là…'],
      ['This issue can be addressed in several ways.', 'Vấn đề này có thể được giải quyết bằng một số cách.'],
      ['Taking everything into consideration,…', 'Xét trên mọi phương diện,…'],
      ['In conclusion, although…, I believe…', 'Tóm lại, mặc dù…, tôi cho rằng…']
    ]
  };

  function clone(obj) { return JSON.parse(JSON.stringify(obj)); }
  function loadState() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return { ...clone(DEFAULT_STATE), ...stored, sharedTimer: { ...DEFAULT_STATE.sharedTimer, ...(stored?.sharedTimer || {}) } };
    } catch { return clone(DEFAULT_STATE); }
  }
  function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); updateCounts(); }
  function getSet() { return DATA.sets.find(s => s.id === state.currentSetId) || DATA.sets[0]; }
  function getTask() { return getSet()[state.currentPart]; }
  function taskKey(setId = state.currentSetId, part = state.currentPart) { return `${setId}:${part}`; }
  function getDraft() { return state.drafts[taskKey()] || ''; }
  function getTimer() {
    const key = taskKey();
    const task = getTask();
    if (!state.timers[key]) state.timers[key] = { remaining: task.time * 60, running: false, lastTick: null };
    return state.timers[key];
  }
  function countWords(text) { return (text.trim().match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) || []).length; }
  function countSentences(text) { return (text.match(/[.!?]+(?=\s|$)/g) || []).length; }
  function countParagraphs(text) { return text.trim() ? text.trim().split(/\n\s*\n/).filter(Boolean).length : 0; }
  function formatTime(seconds) {
    const s = Math.max(0, Math.floor(seconds));
    return `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;
  }
  function escapeHtml(value='') {
    return String(value).replace(/[&<>"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
  }
  function toast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add('show');
    clearTimeout(els.toast._timer);
    els.toast._timer = setTimeout(() => els.toast.classList.remove('show'), 2200);
  }

  function renderSidebar() {
    els.topicNav.innerHTML = DATA.categories.map((cat) => {
      const categorySets = DATA.sets.filter(s => s.categoryId === cat.id);
      const open = categorySets.some(s => s.id === state.currentSetId);
      const catMeta = getCategoryMeta(cat.id, cat.name);
      return `<div class="topic-group ${open ? 'open' : ''}" data-category="${cat.id}">
        <button class="topic-group-title"><span>${escapeHtml(catMeta.en)}<small>${escapeHtml(catMeta.vi)}</small></span><span class="chevron">›</span></button>
        <div class="topic-set-list">
          ${categorySets.map((set, i) => {
            const meta = getSetMeta(set);
            return `<div class="topic-set-wrap">
              <button class="topic-set-btn ${set.id === state.currentSetId ? 'active' : ''}" data-set="${set.id}">
                <span class="topic-index">${String(i+1).padStart(2,'0')}</span><span class="topic-set-text"><strong>${escapeHtml(meta.en)}</strong></span>
              </button>
              <details class="translation-reveal sidebar-translation"><summary>Xem bản dịch</summary><p>${escapeHtml(meta.vi)}</p></details>
            </div>`;
          }).join('')}
        </div>
      </div>`;
    }).join('');

    els.topicNav.querySelectorAll('.topic-group-title').forEach(btn => btn.addEventListener('click', () => btn.parentElement.classList.toggle('open')));
    els.topicNav.querySelectorAll('.topic-set-btn').forEach(btn => btn.addEventListener('click', () => openPractice(btn.dataset.set)));
  }

  function renderAll() {
    renderSidebar();
    renderTask();
    renderMode();
    updateCounts();
  }

  function getEssayMeta(task) {
    const type = String(task.essayKind || task.type || 'Essay').replace(/\s+Essay$/i, '');
    let form = task.essayForm || 'Form 2: Opinion–Discussion';
    if (/advantage/i.test(type)) form = 'Form 1: Advantage–Disadvantage';
    if (/problem|cause|effect|reason|impact|solution/i.test(type)) form = 'Form 3: Problem–Solution';
    return { kind: type, form, signals: task.recognitionPhrases || [] };
  }

  function highlightRecognition(text, phrases) {
    const source = String(text || '');
    const ranges = [];
    const lower = source.toLowerCase();
    [...phrases].sort((a,b)=>b.length-a.length).forEach(phrase => {
      const needle = String(phrase).toLowerCase();
      let from = 0;
      while (needle && from < lower.length) {
        const at = lower.indexOf(needle, from);
        if (at < 0) break;
        ranges.push([at, at + needle.length]);
        from = at + needle.length;
      }
    });
    if (!ranges.length) return escapeHtml(source);
    ranges.sort((a,b)=>a[0]-b[0] || b[1]-a[1]);
    const merged=[];
    ranges.forEach(r=>{
      const last=merged[merged.length-1];
      if(!last || r[0]>last[1]) merged.push(r.slice());
      else last[1]=Math.max(last[1],r[1]);
    });
    let out='', cursor=0;
    merged.forEach(([a,b])=>{
      out += escapeHtml(source.slice(cursor,a));
      out += `<mark class="recognition-mark">${escapeHtml(source.slice(a,b))}</mark>`;
      cursor=b;
    });
    return out + escapeHtml(source.slice(cursor));
  }

  function renderRecognition(task, isTask1) {
    els.recognitionPanel.classList.remove('hidden');
    if (isTask1) {
      const meta = getTask1Meta(state.currentSetId, task);
      const matched = matchedRecognitionSignals(task, meta);
      const visibleSignals = matched.length ? matched : meta.signals;
      els.essayFormBadge.textContent = `${meta.form} · ${meta.kind}`;
      els.recognitionDetails.innerHTML = `<p><strong>Bước 1:</strong> xem ai là người đặt câu hỏi trước. <strong>Bước 2:</strong> nếu bạn đang phản hồi thông tin/feedback/lời khuyên thì dùng <b>form thư đi trả lời</b>; nếu bạn chủ động yêu cầu, hỏi, xin lỗi hoặc phàn nàn thì dùng <b>form thư đi hỏi</b>.</p>
        <div>${visibleSignals.map(x=>`<span class="signal-chip">${escapeHtml(x)}</span>`).join('')}</div>
        <p class="recognition-memory"><strong>Nhớ nhanh:</strong> ${escapeHtml(meta.memory)}</p>
        <button type="button" class="recognition-more-btn" id="openFormHelpInline">Xem 2 form thư đầy đủ khi bí →</button>`;
    } else {
      const meta = getEssayMeta(task);
      const matched = matchedRecognitionSignals(task, meta);
      const visibleSignals = matched.length ? matched : meta.signals;
      els.essayFormBadge.textContent = `${meta.kind} · ${meta.form}`;
      els.recognitionDetails.innerHTML = `<p><strong>Bước 1:</strong> tìm cụm được bôi đỏ. <strong>Bước 2:</strong> xác định dạng <b>${escapeHtml(meta.kind)}</b>. <strong>Bước 3:</strong> dùng <b>${escapeHtml(meta.form)}</b>.</p>
        <div>${visibleSignals.map(x=>`<span class="signal-chip">${escapeHtml(x)}</span>`).join('')}</div>
        <button type="button" class="recognition-more-btn" id="openFormHelpInline">Xem bảng nhận biết đầy đủ khi bí →</button>`;
    }
    const inlineButton = $('openFormHelpInline');
    if (inlineButton) inlineButton.onclick = openFormHelp;
  }

  function renderTask() {
    const set = getSet();
    const task = getTask();
    const isTask1 = state.currentPart === 'task1';
    const task1Meta = isTask1 ? getTask1Meta(set.id, task) : null;
    const essayMeta = isTask1 ? null : getEssayMeta(task);
    const setMeta = getSetMeta(set);
    const categoryMeta = getCategoryMeta(set.categoryId, set.categoryName);
    els.breadcrumb.textContent = `${categoryMeta.en} / ${isTask1 ? 'Writing Task 1' : 'Writing Task 2'}`;
    els.setTitle.textContent = setMeta.en;
    if (els.setTitleTranslation) els.setTitleTranslation.textContent = setMeta.vi;
    els.setSubtitle.textContent = isTask1 ? `Question 1: Letter / Email · ${task1Meta.form}` : `Question 2: ${essayMeta.kind} · ${essayMeta.form}`;
    els.taskType.textContent = isTask1 ? task1Meta.form.toUpperCase() : essayMeta.kind.toUpperCase();
    els.taskTitle.textContent = isTask1 ? `Writing Task 1 · ${task1Meta.key === 'reply' ? 'Đi trả lời' : 'Đi hỏi'}` : `${essayMeta.kind} Essay`;
    els.timeBadge.textContent = `${task.time} minutes`;
    els.wordBadge.textContent = `At least ${task.minWords} words`;
    els.promptInstruction.textContent = isTask1
      ? 'You should spend about 20 minutes on this task. Write at least 120 words. You mustn’t include your name or address.'
      : 'You should spend about 40 minutes on this task. Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.';
    const activeSignals = isTask1 ? task1Meta.signals : essayMeta.signals;
    els.promptText.innerHTML = highlightRecognition(task.prompt_en, activeSignals);
    els.requirements.innerHTML = task.requirements.map((r, i) => `<div class="requirement-item"><span class="bullet">${i+1}</span><span>${highlightRecognition(r.en, activeSignals)}</span></div>`).join('');
    els.promptVietnamese.innerHTML = `<strong>Yêu cầu tiếng Việt</strong><p>${escapeHtml(task.prompt_vi)}</p><ul>${task.requirements.map(r => `<li>${escapeHtml(r.vi)}</li>`).join('')}</ul>`;
    els.outlinePanel.innerHTML = buildOutline(task, isTask1);
    els.promptVietnamese.classList.toggle('hidden', !promptViVisible);
    els.outlinePanel.classList.toggle('hidden', !outlineVisible);
    renderRecognition(task, isTask1);

    document.querySelectorAll('.part-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.part === state.currentPart));
    els.answerBox.value = getDraft();
    syncEditorStats();
    renderTimer();
    renderChecklist();
    renderPhrases();
    updatePartStatuses();

    const submission = state.submissions[taskKey()];
    if (submission) renderResults(submission, false); else els.resultSection.classList.add('hidden');
  }

  function buildOutline(task, isTask1) {
    if (isTask1) {
      const meta = getTask1Meta(state.currentSetId, task);
      if (meta.key === 'reply') {
        return `<strong>${escapeHtml(meta.form)} · ${escapeHtml(meta.kind)}</strong>
          <ul><li>Mở thư và nêu mục đích: <i>Today, I am writing this letter to answer your questions / give feedback.</i></li>${task.requirements.map((r,i) => `<li>${i===0?'Firstly, in your letter, you asked me about…':'As for your next question about…'} ${escapeHtml(r.vi)}</li>`).join('')}<li>Kết thư: mời người nhận hỏi thêm và dùng lời chào phù hợp.</li></ul>`;
      }
      return `<strong>${escapeHtml(meta.form)} · ${escapeHtml(meta.kind)}</strong>
        <ul><li>Mở thư và nêu mục đích: <i>Today, I am writing this letter to ask for / request / apologise for…</i></li><li>Cho thông tin nền cần thiết: <i>Let me give you some details.</i></li>${task.requirements.map((r,i) => `<li>${i===0?'Firstly, could you please let me know…?':'I would also like to know…'} ${escapeHtml(r.vi)}</li>`).join('')}<li>Kết thư: <i>I am looking forward to hearing from you.</i></li></ul>`;
    }
    const meta = getEssayMeta(task);
    if (meta.kind === 'Advantage–Disadvantage') {
      return `<strong>${escapeHtml(meta.form)}</strong><ul><li>Mở bài: paraphrase đề và giới thiệu sẽ bàn cả hai mặt.</li><li>Thân bài 1: advantages/benefits + giải thích + ví dụ.</li><li>Thân bài 2: disadvantages/drawbacks + giải thích + ví dụ.</li><li>Kết bài: tóm tắt hai mặt và nêu nhận định phù hợp.</li></ul>`;
    }
    if (meta.kind === 'Discussion') {
      return `<strong>${escapeHtml(meta.form)}</strong><ul><li>Mở bài: paraphrase hai quan điểm và nêu hướng thảo luận.</li><li>Thân bài 1: giải thích quan điểm thứ nhất.</li><li>Thân bài 2: giải thích quan điểm thứ hai và nêu ý kiến của mình.</li><li>Kết bài: tóm tắt và khẳng định quan điểm.</li></ul>`;
    }
    if (meta.kind === 'Opinion') {
      return `<strong>${escapeHtml(meta.form)}</strong><ul><li>Mở bài: paraphrase đề và nói rõ agree/disagree hoặc lựa chọn.</li><li>Thân bài 1: lý do chính thứ nhất + giải thích + ví dụ.</li><li>Thân bài 2: lý do chính thứ hai; có thể phản biện ý đối lập.</li><li>Kết bài: nhắc lại quan điểm nhất quán.</li></ul>`;
    }
    const prompt = task.prompt_en.toLowerCase();
    const asksSolutions = /solution|solve|what can be done|ways to|suggest/.test(prompt);
    const asksEffects = /effect|impact/.test(prompt);
    return `<strong>${escapeHtml(meta.form)}</strong><ul><li>Mở bài: paraphrase vấn đề và nêu các nội dung sẽ phân tích.</li><li>Thân bài 1: ${/cause|reason|why/.test(prompt) ? 'causes/reasons' : 'problems'} + giải thích + ví dụ.</li><li>Thân bài 2: ${asksSolutions ? 'solutions/ways to tackle the problem' : (asksEffects ? 'effects/impacts' : 'giải pháp hoặc tác động theo yêu cầu đề')}.</li><li>Kết bài: tóm tắt vấn đề và hướng xử lý/nhận định.</li></ul>`;
  }

  function getActivePhraseBank() {
    if (state.currentPart === 'task1') {
      return getTask1Meta(state.currentSetId, getTask()).key === 'reply' ? phraseBanks.task1Reply : phraseBanks.task1Ask;
    }
    return phraseBanks.task2;
  }

  function renderPhrases() {
    const bank = getActivePhraseBank();
    const chosen = Array.from({length:4}, (_,i) => bank[(phraseOffset+i) % bank.length]);
    els.phraseList.innerHTML = chosen.map(([en,vi]) => `<div class="phrase-item"><strong>${escapeHtml(en)}</strong><span>${escapeHtml(vi)}</span></div>`).join('');
  }

  function syncEditorStats() {
    const text = els.answerBox.value;
    const words = countWords(text);
    const min = getTask().minWords;
    els.wordCount.textContent = words;
    els.charCount.textContent = text.length;
    els.wordProgressBar.style.width = `${Math.min(100, words/min*100)}%`;
    els.saveStatus.textContent = text.trim() ? 'Đã lưu tự động' : 'Chưa có nội dung';
    renderChecklist();
  }

  function renderChecklist() {
    const text = els.answerBox.value;
    const task = getTask();
    const words = countWords(text);
    const paragraphs = countParagraphs(text);
    const lower = text.toLowerCase();
    const coverage = task.requirements.map(r => r.keywords.some(k => lower.includes(k.toLowerCase())));
    const items = [
      { ok: words >= task.minWords, label: `${words}/${task.minWords} từ tối thiểu` },
      { ok: state.currentPart === 'task1' ? paragraphs >= 3 : paragraphs >= 4, label: state.currentPart === 'task1' ? 'Có ít nhất 3 đoạn rõ ràng' : 'Có mở bài, thân bài và kết bài' },
      ...coverage.map((ok,i) => ({ ok, label: task.requirements[i].vi })),
      { ok: /[.!?]\s*$/.test(text.trim()), label: 'Kết thúc câu bằng dấu câu' }
    ];
    els.liveChecklist.innerHTML = items.map(x => `<div class="check-item ${x.ok ? 'ok' : ''}"><span class="check-icon">${x.ok ? '✓' : '•'}</span><span>${escapeHtml(x.label)}</span></div>`).join('');
  }

  function saveCurrentDraft() {
    state.drafts[taskKey()] = els.answerBox.value;
    saveState();
  }

  function renderTimer() {
    const timer = getTimer();
    els.partTimer.textContent = formatTime(timer.remaining);
    els.timerToggle.textContent = timer.running ? 'Tạm dừng' : (timer.remaining < getTask().time*60 ? 'Tiếp tục' : 'Bắt đầu');
    const box = els.partTimer.closest('.timer-box');
    box.classList.toggle('warning', timer.remaining <= 300 && timer.remaining > 60);
    box.classList.toggle('danger', timer.remaining <= 60);
    ensureTimerLoop();
  }

  function ensureTimerLoop() {
    if (timerHandle) return;
    timerHandle = setInterval(() => {
      let changed = false;
      const now = Date.now();
      Object.values(state.timers).forEach(t => {
        if (t.running) {
          const elapsed = Math.max(0, Math.floor((now - (t.lastTick || now))/1000));
          if (elapsed > 0) {
            t.remaining = Math.max(0, t.remaining - elapsed); t.lastTick = now; changed = true;
            if (t.remaining === 0) t.running = false;
          }
        }
      });
      if (state.sharedTimer.running) {
        const t = state.sharedTimer;
        const elapsed = Math.max(0, Math.floor((now - (t.lastTick || now))/1000));
        if (elapsed > 0) {
          t.remaining = Math.max(0, t.remaining - elapsed); t.lastTick = now; changed = true;
          if (t.remaining === 0) { t.running = false; toast('Đã hết 60 phút thi thử.'); }
        }
      }
      if (changed) {
        renderTimer(); renderSharedTimer();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    }, 500);
  }

  function togglePartTimer() {
    if (state.mode === 'exam') { toast('Đang dùng đồng hồ thi thử 60 phút.'); return; }
    const timer = getTimer();
    timer.running = !timer.running;
    timer.lastTick = Date.now();
    saveState(); renderTimer();
  }
  function stopPartTimer(save=true) {
    const timer = state.timers[taskKey()];
    if (timer) { timer.running = false; timer.lastTick = null; if(save) saveState(); }
  }
  function resetPartTimer() {
    const timer = getTimer();
    if (!confirm('Đặt lại đồng hồ của phần này?')) return;
    timer.remaining = getTask().time*60; timer.running = false; timer.lastTick = null; saveState(); renderTimer();
  }

  function renderMode() {
    const exam = state.mode === 'exam';
    els.modeLabel.textContent = exam ? 'Thi thử 60 phút' : 'Luyện từng phần';
    els.sharedTimerCard.classList.toggle('hidden', !exam);
    renderSharedTimer();
  }
  function renderSharedTimer() {
    els.sharedTimer.textContent = formatTime(state.sharedTimer.remaining);
    els.sharedTimerToggle.textContent = state.sharedTimer.running ? 'Tạm dừng' : (state.sharedTimer.remaining < 3600 ? 'Tiếp tục' : 'Bắt đầu');
  }
  function toggleMode() {
    state.mode = state.mode === 'practice' ? 'exam' : 'practice';
    if (state.mode === 'exam') Object.values(state.timers).forEach(t => t.running=false);
    else state.sharedTimer.running=false;
    saveState(); renderMode(); renderTimer(); toast(state.mode === 'exam' ? 'Đã bật thi thử 60 phút. Bạn vẫn chuyển tự do giữa hai phần.' : 'Đã chuyển về luyện từng phần.');
  }
  function toggleSharedTimer() {
    state.sharedTimer.running = !state.sharedTimer.running;
    state.sharedTimer.lastTick = Date.now(); saveState(); renderSharedTimer();
  }

  function updatePartStatuses() {
    ['task1','task2'].forEach(part => {
      const key = taskKey(state.currentSetId, part);
      const el = part === 'task1' ? els.statusTask1 : els.statusTask2;
      el.className = 'status-dot';
      if (state.submissions[key]) el.classList.add('done');
      else if ((state.drafts[key] || '').trim()) el.classList.add('draft');
    });
  }
  function updateCounts() {
    els.doneCount.textContent = Object.keys(state.submissions).length;
    els.draftCount.textContent = Object.entries(state.drafts).filter(([k,v]) => v.trim() && !state.submissions[k]).length;
  }

  const correctionRules = [
    { re:/\bi\b/g, to:'I', vi:'Đại từ “I” luôn phải viết hoa.', en:'The pronoun “I” must always be capitalized.' },
    { re:/\bamn['’]?t\b/gi, to:'am not', vi:'Không dùng “amn’t” trong tiếng Anh chuẩn; dùng “am not”.', en:'Use “am not” instead of “amn’t”.' },
    { re:/\binformations\b/gi, to:'information', vi:'“Information” là danh từ không đếm được, không thêm -s.', en:'“Information” is uncountable.' },
    { re:/\badvices\b/gi, to:'advice', vi:'“Advice” là danh từ không đếm được.', en:'“Advice” is uncountable.' },
    { re:/\bequipments\b/gi, to:'equipment', vi:'“Equipment” là danh từ không đếm được.', en:'“Equipment” is uncountable.' },
    { re:/\bpeople is\b/gi, to:'people are', vi:'“People” là danh từ số nhiều nên đi với “are”.', en:'“People” takes a plural verb.' },
    { re:/\bchildren is\b/gi, to:'children are', vi:'“Children” là số nhiều nên dùng “are”.', en:'“Children” takes “are”.' },
    { re:/\bdoesn['’]?t ([a-z]+)ed\b/gi, to:(m,v)=>`doesn’t ${v}`, vi:'Sau “doesn’t” dùng động từ nguyên mẫu.', en:'Use the base verb after “doesn’t”.' },
    { re:/\bdidn['’]?t ([a-z]+)ed\b/gi, to:(m,v)=>`didn’t ${v}`, vi:'Sau “didn’t” dùng động từ nguyên mẫu.', en:'Use the base verb after “didn’t”.' },
    { re:/\blook forward to hear\b/gi, to:'look forward to hearing', vi:'Sau “look forward to” dùng V-ing.', en:'Use a gerund after “look forward to”.' },
    { re:/\bdiscuss about\b/gi, to:'discuss', vi:'“Discuss” không đi với “about”.', en:'“Discuss” does not take “about”.' },
    { re:/\bmore easier\b/gi, to:'easier', vi:'Không dùng so sánh kép “more easier”.', en:'Avoid a double comparative.' },
    { re:/\bmore better\b/gi, to:'better', vi:'Không dùng so sánh kép “more better”.', en:'Avoid a double comparative.' },
    { re:/\bbenefit for\b/gi, to:'benefit of', vi:'Khi nói “lợi ích của…”, dùng “the benefit of…”.', en:'Use “the benefit of” for this meaning.' },
    { re:/\bthe reason is because\b/gi, to:'the reason is that', vi:'Dùng “the reason is that” để tránh lặp nghĩa.', en:'Prefer “the reason is that”.' },
    { re:/\bthere have many\b/gi, to:'there are many', vi:'Cấu trúc tồn tại dùng “there are”, không dùng “there have”.', en:'Use “there are” for existence.' },
    { re:/\bI very like\b/gi, to:'I really like', vi:'Không đặt “very” trước động từ “like”; dùng “really”.', en:'Use “really like”, not “very like”.' },
    { re:/\bcan helps\b/gi, to:'can help', vi:'Sau động từ khuyết thiếu “can” dùng động từ nguyên mẫu.', en:'Use the base verb after “can”.' },
    { re:/\bshould to\b/gi, to:'should', vi:'Sau “should” không dùng “to”.', en:'Do not use “to” after “should”.' },
    { re:/\bbecause ([^.!?]{3,80}),\s*so\b/gi, to:'because $1,', vi:'Không nên dùng đồng thời “because” và “so” trong cùng một cấu trúc nguyên nhân-kết quả.', en:'Avoid using “because” and “so” together in one clause.' },
    { re:/\s+([,.!?;:])/g, to:'$1', vi:'Không đặt khoảng trắng trước dấu câu.', en:'Remove spaces before punctuation.' },
    { re:/([,.!?;:])([^\s\n])/g, to:'$1 $2', vi:'Thêm khoảng trắng sau dấu câu.', en:'Add a space after punctuation.' }
  ];

  function correctText(input) {
    let text = input.trim().replace(/\r\n/g,'\n').replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n');
    const errors = [];
    correctionRules.forEach(rule => {
      const matches = [...text.matchAll(new RegExp(rule.re.source, rule.re.flags.includes('g') ? rule.re.flags : rule.re.flags+'g'))];
      if (matches.length) {
        matches.slice(0,4).forEach(m => {
          const replacement = typeof rule.to === 'function' ? rule.to(...m) : m[0].replace(rule.re, rule.to);
          errors.push({ original:m[0], suggestion:replacement, vi:rule.vi, en:rule.en });
        });
        text = text.replace(rule.re, rule.to);
      }
    });
    // Capitalize sentence starts and normalize paragraph openings.
    text = text.replace(/(^|[.!?]\s+|\n+)([a-z])/g, (m,p,c)=>p+c.toUpperCase());
    // Repeated words
    text = text.replace(/\b(\w+)\s+\1\b/gi, (m,w) => {
      errors.push({original:m,suggestion:w,vi:'Loại bỏ từ bị lặp.',en:'Remove the repeated word.'});
      return w;
    });
    return { text, errors };
  }

  function evaluateOffline(text, task) {
    const words = countWords(text), paragraphs = countParagraphs(text), sentences = countSentences(text);
    const lower = text.toLowerCase();
    const coverage = task.requirements.map(r => ({...r, met:r.keywords.some(k => lower.includes(k.toLowerCase()))}));
    const corrected = correctText(text);
    const unique = new Set((text.toLowerCase().match(/[a-z]+(?:['’-][a-z]+)*/g)||[]));
    const lexical = words ? unique.size / words : 0;
    const avgSentence = sentences ? words/sentences : words;
    const isTask1 = state.currentPart === 'task1';
    const hasGreeting = /^(dear|hi|hello)\b/im.test(text);
    const hasClosing = /(best wishes|best regards|kind regards|yours faithfully|yours sincerely|write back|look forward to hearing)/i.test(text);
    const hasConclusion = /(in conclusion|to conclude|overall|taking everything into consideration|all things considered)/i.test(text);
    const connectorCount = (text.match(/\b(first(?:ly)?|second(?:ly)?|moreover|however|in addition|on the other hand|for example|therefore|finally|in conclusion)\b/gi)||[]).length;

    let taskScore = 3.2 + coverage.filter(x=>x.met).length/coverage.length*4.6 + Math.min(1.2, words/task.minWords*1.2);
    if (words < task.minWords*.65) taskScore -= 1.5;
    let orgScore = 4.4 + Math.min(2.5, paragraphs*(isTask1?.7:.55)) + Math.min(1.5, connectorCount*.22);
    if (isTask1 && hasGreeting) orgScore += .5;
    if (isTask1 && hasClosing) orgScore += .5;
    if (!isTask1 && hasConclusion) orgScore += .7;
    let vocabScore = 4.6 + Math.min(3.2, lexical*7) + (words>=task.minWords ? .5:0);
    let grammarScore = 8.7 - Math.min(4.8, corrected.errors.length*.45) - (avgSentence>32?1:0) - (avgSentence<7 && sentences>3?.6:0);
    const scores = {
      task: clampScore(taskScore), organization: clampScore(orgScore), vocabulary: clampScore(vocabScore), grammar: clampScore(grammarScore)
    };
    const total = Math.round(((scores.task+scores.organization+scores.vocabulary+scores.grammar)/4)*10)/10;
    const strengths=[]; const improvements=[];
    if (words>=task.minWords) strengths.push(`Đã đạt yêu cầu độ dài ${task.minWords} từ.`); else improvements.push(`Cần viết thêm khoảng ${task.minWords-words} từ để đạt yêu cầu.`);
    const met = coverage.filter(x=>x.met);
    if (met.length===coverage.length) strengths.push('Đã đề cập đủ các ý chính của đề.'); else improvements.push(`Cần làm rõ thêm: ${coverage.filter(x=>!x.met).map(x=>x.vi).join(' ')}`);
    if (paragraphs >= (isTask1?3:4)) strengths.push('Bố cục đoạn văn tương đối rõ.'); else improvements.push(isTask1?'Nên chia bài thành mở thư, nội dung chính và kết thư.':'Nên chia thành mở bài, hai đoạn thân bài và kết bài.');
    if (connectorCount>=3) strengths.push('Đã sử dụng từ nối để liên kết ý.'); else improvements.push('Bổ sung từ nối như First, Moreover, However, For example và In conclusion.');
    if (corrected.errors.length===0) strengths.push('Không phát hiện lỗi ngữ pháp phổ biến trong bộ kiểm tra cơ bản.'); else improvements.push(`Có ${corrected.errors.length} vị trí nên sửa hoặc kiểm tra lại.`);
    if (avgSentence>32) improvements.push('Một số câu có thể quá dài; nên tách câu để Ngọc diễn đạt rõ hơn.');

    return {
      engine:'offline', scores:{...scores,total}, words, paragraphs, sentences, coverage,
      strengths, improvements, errors:corrected.errors.slice(0,12), correctedEnglish:corrected.text,
      translationVi:'', translationStatus:'pending'
    };
  }
  function clampScore(x){ return Math.max(1,Math.min(10,Math.round(x*10)/10)); }

  async function submitCurrent() {
    const text = els.answerBox.value.trim();
    const submissionKey = taskKey();
    const submissionPart = state.currentPart;
    if (countWords(text) < 20) { toast('Bài quá ngắn để chấm. Ngọc viết thêm một chút nhé.'); els.answerBox.focus(); return; }
    saveCurrentDraft(); stopPartTimer();
    const task = getTask();
    const result = evaluateOffline(text, task);
    result.submittedAt = new Date().toISOString();
    result.aiPending = true;
    state.submissions[submissionKey] = result;
    saveState(); renderResults(result, true); updatePartStatuses();

    // Keep the quick translation as a fallback, but never overwrite a later AI review.
    translateText(result.correctedEnglish).then(vi => {
      const current = state.submissions[submissionKey] || result;
      if (current.engine === 'ai' && current.translationVi) return;
      if (vi) {
        current.translationVi = vi; current.translationStatus='done';
      } else {
        current.translationStatus='failed';
      }
      state.submissions[submissionKey] = current; saveState();
      if (taskKey() === submissionKey) renderResults(current, false);
    });

    // Detailed bilingual review through Netlify AI Gateway.
    tryAIReview(text, task, submissionPart).then(ai => {
      const current = state.submissions[submissionKey] || result;
      current.aiPending = false;
      if (ai?.__aiError) {
        current.aiError = ai.__aiError;
        state.submissions[submissionKey] = current; saveState();
        if (taskKey() === submissionKey) renderResults(current, false);
        return;
      }
      if (ai) {
        const merged = {...current, ...ai, engine:'ai', aiPending:false, aiError:'', submittedAt:result.submittedAt};
        state.submissions[submissionKey] = merged; saveState();
        if (taskKey() === submissionKey) renderResults(merged, false);
      }
    });
  }

  async function translateText(text) {
    try {
      const r = await fetch('/.netlify/functions/translate', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text})});
      if (r.ok) { const d=await r.json(); if(d.translation) return d.translation; }
    } catch {}
    try {
      const url='https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q='+encodeURIComponent(text.slice(0,4500));
      const r=await fetch(url); if(!r.ok) return '';
      const d=await r.json(); return (d[0]||[]).map(x=>x[0]).join('');
    } catch { return ''; }
  }

  async function tryAIReview(text, task, part) {
    try {
      const r = await fetch('/.netlify/functions/review', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text,task,part})});
      const d = await r.json().catch(()=>({}));
      if(!r.ok) return {__aiError:d.detail || d.error || `AI service returned ${r.status}.`};
      if(!d || !d.correctedEnglish) return {__aiError:'AI did not return a complete corrected version.'};
      return d;
    } catch (error) {
      return {__aiError:error?.message || 'Không kết nối được với AI.'};
    }
  }

  function renderResults(result, scroll=true) {
    const task = getTask();
    els.resultSection.classList.remove('hidden');
    els.reviewEngineLabel.textContent = result.engine === 'ai'
      ? `Bài được AI sửa chi tiết, giải thích Anh – Việt${result.model ? ` · ${result.model}` : ''}.`
      : result.aiPending
        ? 'Đã có kết quả kiểm tra nhanh. AI đang đọc toàn bài để sửa kỹ hơn…'
        : result.aiError
          ? `Đang hiển thị kết quả kiểm tra nhanh. AI chưa chạy: ${result.aiError}`
          : 'Bài được kiểm tra bằng bộ sửa lỗi tích hợp.';
    const labels=[['task','Task fulfillment','Đáp ứng đề'],['organization','Organization','Tổ chức bài'],['vocabulary','Vocabulary','Từ vựng'],['grammar','Grammar','Ngữ pháp']];
    els.scoreGrid.innerHTML=labels.map(([k,en,vi])=>`<div class="score-card"><span>${en}<br>${vi}</span><strong>${result.scores[k]}/10</strong><div class="score-bar"><i style="width:${result.scores[k]*10}%"></i></div></div>`).join('');

    $('panel-overview').innerHTML=`<div class="overview-grid">
      <div class="feedback-box"><h4>Điểm mạnh / Strengths</h4><ul>${(result.strengths||[]).map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul></div>
      <div class="feedback-box"><h4>Cần cải thiện / Improvements</h4><ul>${(result.improvements||[]).map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul></div>
      <div class="feedback-box"><h4>Thống kê bài viết</h4><p>${result.words} từ · ${result.paragraphs} đoạn · ${result.sentences} câu<br>Điểm ước lượng: <strong>${result.scores.total}/10</strong> (chỉ dùng để luyện tập)</p></div>
      <div class="feedback-box"><h4>Mức độ trả lời đề</h4><ul>${result.coverage.map(x=>`<li>${x.met?'✓':'○'} ${escapeHtml(x.vi)}</li>`).join('')}</ul></div>
    </div>`;

    $('panel-errors').innerHTML = result.errors?.length ? `<div class="error-list">${result.errors.map(e=>`<div class="error-card">${e.category?`<span class="error-category">${escapeHtml(e.category)}</span>`:''}<div class="error-top"><div class="error-old">${escapeHtml(e.original)}</div><div class="error-new">${escapeHtml(e.suggestion)}</div></div><div class="error-note"><strong>Giải thích:</strong> ${escapeHtml(e.vi)}<br><strong>English:</strong> ${escapeHtml(e.en||'Please review this expression.')}</div></div>`).join('')}</div>` : `<div class="feedback-box"><h4>Chưa phát hiện lỗi phổ biến</h4><p>${result.engine==='ai'?'AI chưa tìm thấy lỗi đáng kể trong bài này. Ngọc vẫn nên đối chiếu phần góp ý tổng quan và mức độ trả lời đề.':'Bộ kiểm tra cơ bản chưa tìm thấy lỗi theo các quy tắc tích hợp. Ngọc vẫn nên đọc lại cách dùng thì, mạo từ và sự phù hợp của từ vựng.'}</p></div>`;

    $('panel-corrected').innerHTML=`<div class="output-heading"><h4>Suggested corrected version</h4><button class="secondary-btn copy-output" data-copy="corrected">Sao chép</button></div><div class="text-output" id="correctedOutput">${escapeHtml(result.correctedEnglish)}</div>`;
    $('panel-translation').innerHTML=result.translationVi ? `<div class="output-heading"><h4>Bản dịch tiếng Việt của bài đã sửa</h4><button class="secondary-btn copy-output" data-copy="translation">Sao chép</button></div><div class="text-output" id="translationOutput">${escapeHtml(result.translationVi)}</div>` : result.translationStatus==='failed' ? `<div class="feedback-box"><h4>Chưa tải được bản dịch tự động</h4><p>Hãy mở website khi có Internet hoặc triển khai lên Netlify. Bản dịch song ngữ của bài mẫu vẫn có trong thẻ “Bài mẫu tham khảo”.</p></div>` : `<div class="loading-line">Đang dịch bài đã sửa sang tiếng Việt…</div>`;
    $('panel-model').innerHTML=`<div class="bilingual-columns"><div><div class="output-heading"><h4>Model answer - English</h4></div><div class="text-output">${escapeHtml(task.sample_en)}</div></div><div><div class="output-heading"><h4>Bài mẫu - Tiếng Việt</h4></div><div class="text-output">${escapeHtml(task.sample_vi)}</div></div></div>`;

    document.querySelectorAll('.copy-output').forEach(btn=>btn.onclick=()=>{
      const txt=btn.dataset.copy==='corrected'?result.correctedEnglish:result.translationVi; navigator.clipboard.writeText(txt||''); toast('Đã sao chép.');
    });
    if(scroll) els.resultSection.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function matchedRecognitionSignals(task, meta) {
    const prompt = String(task?.prompt_en || '').toLowerCase();
    return (meta?.signals || []).filter(signal => prompt.includes(String(signal).toLowerCase()));
  }

  function renderFormHelp() {
    if (!els.formHelpCurrent) return;
    document.querySelectorAll('.recognition-type-card').forEach(card => card.classList.remove('current'));
    const task1Guide = $('task1RecognitionGuide');
    const task2Guide = $('task2RecognitionGuide');
    const eyebrow = $('formHelpEyebrow');
    const title = $('formHelpTitle');
    const intro = $('formHelpIntro');
    const note = $('formHelpNote');

    if (state.currentPart === 'task1') {
      const task = getTask();
      const meta = getTask1Meta(state.currentSetId, task);
      const matched = matchedRecognitionSignals(task, meta);
      const signals = matched.length ? matched : meta.signals;
      task1Guide?.classList.remove('hidden');
      task2Guide?.classList.add('hidden');
      if (eyebrow) eyebrow.textContent = 'CỨU NGUY TASK 1';
      if (title) title.textContent = 'Nhìn dấu hiệu để chọn đúng form thư';
      if (intro) intro.textContent = 'Theo tài liệu đã tải lên, Task 1 có 2 form: thư đi trả lời và thư đi hỏi. Hãy xác định ai là người đặt câu hỏi hoặc khởi xướng trước.';
      if (note) note.innerHTML = '<strong>Mẹo 5 giây:</strong> Có thư/email/câu hỏi gửi đến và bạn phải phản hồi → <b>thư đi trả lời</b>. Bạn là người chủ động yêu cầu, hỏi, xin lỗi, cảm ơn, mời hoặc phàn nàn → <b>thư đi hỏi</b>.';
      els.formHelpCurrent.innerHTML = `<div class="current-analysis-icon">✓</div><div><span class="current-analysis-label">PHÂN TÍCH ĐỀ HIỆN TẠI</span><h3>${escapeHtml(meta.form)} → ${escapeHtml(meta.kind)}</h3><p>Hệ thống nhận ra nhờ dấu hiệu: ${signals.length ? signals.map(x=>`<mark class="current-signal">${escapeHtml(x)}</mark>`).join(' ') : '<em>hãy xem ai đang yêu cầu thông tin</em>'}.</p><p>${escapeHtml(meta.memory)}</p></div>`;
      const currentCard = Array.from(document.querySelectorAll('[data-letter-kind]')).find(card => card.dataset.letterKind === meta.key);
      currentCard?.classList.add('current');
      return;
    }

    task1Guide?.classList.add('hidden');
    task2Guide?.classList.remove('hidden');
    if (eyebrow) eyebrow.textContent = 'CỨU NGUY TASK 2';
    if (title) title.textContent = 'Nhìn dấu hiệu để chọn đúng form luận';
    if (intro) intro.textContent = 'Khi bí, hãy tìm cụm từ khóa trong câu hỏi. Một số dạng khác nhau nhưng dùng chung một form.';
    if (note) note.innerHTML = '<strong>Mẹo:</strong> Cụm được bôi đỏ ngay trong đề hiện tại chính là dấu hiệu nhận biết. Hãy đọc đúng động từ yêu cầu trước khi lập dàn ý.';
    const task = getTask();
    const meta = getEssayMeta(task);
    const matched = matchedRecognitionSignals(task, meta);
    const signals = matched.length ? matched : meta.signals;
    els.formHelpCurrent.innerHTML = `<div class="current-analysis-icon">✓</div><div><span class="current-analysis-label">PHÂN TÍCH ĐỀ HIỆN TẠI</span><h3>${escapeHtml(meta.kind)} → ${escapeHtml(meta.form)}</h3><p>Hệ thống nhận ra nhờ dấu hiệu: ${signals.length ? signals.map(x=>`<mark class="current-signal">${escapeHtml(x)}</mark>`).join(' ') : '<em>hãy đọc động từ yêu cầu trong câu hỏi</em>'}.</p></div>`;
    const currentCard = Array.from(document.querySelectorAll('[data-guide-kind]')).find(card => card.dataset.guideKind === meta.kind);
    currentCard?.classList.add('current');
  }

  function openFormHelp() {
    renderFormHelp();
    els.formHelpModal?.classList.remove('hidden');
    document.body.classList.add('modal-open');
    $('closeFormHelpBtn')?.focus({preventScroll:true});
  }

  function closeFormHelp() {
    els.formHelpModal?.classList.add('hidden');
    document.body.classList.remove('modal-open');
    $('formHelpBtn')?.focus({preventScroll:true});
  }

  function renderProgress() {
    const done=Object.keys(state.submissions).length;
    const drafts=Object.entries(state.drafts).filter(([k,v])=>v.trim()&&!state.submissions[k]).length;
    const avgScores=Object.values(state.submissions).map(r=>r.scores?.total).filter(Number.isFinite);
    const avg=avgScores.length?(avgScores.reduce((a,b)=>a+b,0)/avgScores.length).toFixed(1):'--';
    els.progressContent.innerHTML=`<div class="progress-overview"><div class="progress-stat"><strong>${done}/24</strong><span>phần đã nộp</span></div><div class="progress-stat"><strong>${drafts}</strong><span>bản nháp đang viết</span></div><div class="progress-stat"><strong>${avg}</strong><span>điểm trung bình</span></div></div><div class="progress-list">${DATA.sets.map(set=>{
      const d1=!!state.submissions[taskKey(set.id,'task1')], d2=!!state.submissions[taskKey(set.id,'task2')];
      const meta=getSetMeta(set), cat=getCategoryMeta(set.categoryId,set.categoryName);
      return `<div class="progress-row"><div><strong>${escapeHtml(meta.en)}</strong><small>${escapeHtml(meta.vi)} · ${escapeHtml(cat.en)}</small></div><span class="progress-pill ${d1&&d2?'done':''}">${d1&&d2?'Hoàn thành':`${(d1?1:0)+(d2?1:0)}/2 phần`}</span></div>`;
    }).join('')}</div>`;
  }

  function clearCurrent() {
    if(!els.answerBox.value.trim() || confirm('Xóa toàn bộ bài viết hiện tại?')) {
      els.answerBox.value=''; state.drafts[taskKey()]=''; delete state.submissions[taskKey()]; saveState(); syncEditorStats(); updatePartStatuses(); els.resultSection.classList.add('hidden');
    }
  }
  function copyCurrent() { navigator.clipboard.writeText(els.answerBox.value).then(()=>toast('Đã sao chép bài viết.')); }
  function openSidebar(){ els.sidebar.classList.add('open'); els.sidebarOverlay.classList.remove('hidden'); }
  function closeSidebar(){ els.sidebar.classList.remove('open'); els.sidebarOverlay.classList.add('hidden'); }


  let currentPage = 'home';
  const pageEls = {
    home: $('homeView'),
    tests: $('testsView'),
    practice: $('practiceView')
  };

  function setPage(page) {
    currentPage = page;
    Object.entries(pageEls).forEach(([name, el]) => el?.classList.toggle('hidden', name !== page));
    document.querySelectorAll('[data-page]').forEach(btn => btn.classList.toggle('active', btn.dataset.page === page));
    if (page === 'tests') renderLibrary();
    if (page === 'practice') renderAll();
    window.scrollTo({top:0, behavior:'smooth'});
  }

  function openPractice(setId = state.currentSetId) {
    if (els.answerBox) saveCurrentDraft();
    stopPartTimer(false);
    state.currentSetId = setId;
    state.currentPart = 'task1';
    promptViVisible = false;
    outlineVisible = false;
    saveState();
    setPage('practice');
    closeSidebar();
  }

  function randomSetId() {
    return DATA.sets[Math.floor(Math.random() * DATA.sets.length)].id;
  }

  function renderLibrary() {
    const library = $('testLibrary');
    const search = String($('testSearchInput')?.value || '').trim().toLowerCase();
    const category = $('categoryFilter')?.value || 'all';
    const sets = DATA.sets.filter(set => {
      const meta = getSetMeta(set);
      const cat = getCategoryMeta(set.categoryId, set.categoryName);
      const haystack = `${meta.en} ${meta.vi} ${cat.en} ${cat.vi} ${set.task1.prompt_en} ${set.task2.prompt_en}`.toLowerCase();
      return (category === 'all' || set.categoryId === category) && (!search || haystack.includes(search));
    });
    library.innerHTML = sets.length ? sets.map((set, index) => {
      const meta = getSetMeta(set);
      const cat = getCategoryMeta(set.categoryId, set.categoryName);
      const essay = getEssayMeta(set.task2);
      return `<article class="test-card card">
        <div class="test-card-top"><span class="test-number">SET ${String(DATA.sets.indexOf(set)+1).padStart(2,'0')}</span><span class="category-pill">${escapeHtml(cat.en)}</span></div>
        <h3>${escapeHtml(meta.en)}</h3>
        <details class="translation-reveal"><summary>Xem bản dịch</summary><p>${escapeHtml(meta.vi)}</p></details>
        <div class="task-preview"><span><b>Task 1</b> Letter / Email · 20 minutes</span><span><b>Task 2</b> ${escapeHtml(essay.kind)} · ${escapeHtml(essay.form)}</span></div>
        <div class="test-card-actions"><small class="muted">120 + 250 words</small><button class="start-test-btn" data-start-set="${set.id}">Làm đề này</button></div>
      </article>`;
    }).join('') : '<div class="empty-library">Không tìm thấy chủ đề phù hợp.</div>';
    library.querySelectorAll('[data-start-set]').forEach(btn => btn.onclick = () => openPractice(btn.dataset.startSet));
  }

  function setupLibraryControls() {
    const select = $('categoryFilter');
    if (select && !select.options.length) {
      select.innerHTML = `<option value="all">Tất cả nhóm chủ đề</option>${DATA.categories.map(cat => {
        const meta = getCategoryMeta(cat.id,cat.name);
        return `<option value="${cat.id}">${escapeHtml(meta.en)}</option>`;
      }).join('')}`;
    }
    $('testSearchInput')?.addEventListener('input', renderLibrary);
    select?.addEventListener('change', renderLibrary);
  }

  const THEME_KEY = 'ngoc-writing-theme';
  const themeToggle = $('themeToggle');
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme, persist = true) {
    const next = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    if (persist) localStorage.setItem(THEME_KEY, next);
    if (themeToggle) {
      const dark = next === 'dark';
      themeToggle.setAttribute('aria-pressed', String(dark));
      themeToggle.setAttribute('aria-label', dark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối');
      themeToggle.title = dark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối';
      const icon = themeToggle.querySelector('.theme-icon');
      if (icon) icon.textContent = dark ? '☀' : '◐';
    }
    if (themeColorMeta) themeColorMeta.setAttribute('content', next === 'dark' ? '#1b1116' : '#d96b93');
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    applyTheme(saved === 'dark' ? 'dark' : 'light', false);
  }

  initTheme();

  // Events
  themeToggle?.addEventListener('click', () => {
    applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  document.querySelectorAll('.part-tab').forEach(tab => tab.addEventListener('click', () => {
    if(tab.dataset.part===state.currentPart) return;
    saveCurrentDraft(); stopPartTimer(false); state.currentPart=tab.dataset.part; promptViVisible=false; outlineVisible=false; saveState(); renderTask();
  }));
  els.answerBox.addEventListener('input', () => {
    syncEditorStats(); clearTimeout(autosaveHandle);
    els.saveStatus.textContent='Đang lưu…';
    autosaveHandle=setTimeout(()=>{state.drafts[taskKey()]=els.answerBox.value;saveState();els.saveStatus.textContent='Đã lưu tự động';updatePartStatuses();},350);
  });
  $('toggleVietnamesePrompt').onclick=()=>{promptViVisible=!promptViVisible;els.promptVietnamese.classList.toggle('hidden',!promptViVisible);$('toggleVietnamesePrompt').textContent=promptViVisible?'Ẩn bản dịch':'Xem bản dịch';};
  $('toggleOutline').onclick=()=>{outlineVisible=!outlineVisible;els.outlinePanel.classList.toggle('hidden',!outlineVisible);$('toggleOutline').textContent=outlineVisible?'Ẩn gợi ý dàn ý':'Gợi ý lập dàn ý';};
  els.timerToggle.onclick=togglePartTimer; els.timerReset.onclick=resetPartTimer;
  $('submitBtn').onclick=submitCurrent; $('clearBtn').onclick=clearCurrent; $('copyBtn').onclick=copyCurrent;
  $('shufflePhrases').onclick=()=>{const bank=getActivePhraseBank();phraseOffset=(phraseOffset+3)%bank.length;renderPhrases();};
  $('examModeBtn').onclick=toggleMode; els.sharedTimerToggle.onclick=toggleSharedTimer;
  $('formHelpBtn').onclick=openFormHelp;
  $('closeFormHelpBtn').onclick=closeFormHelp;
  els.formHelpModal.onclick=e=>{if(e.target===els.formHelpModal)closeFormHelp();};
  $('progressBtn').onclick=()=>{renderProgress();els.progressModal.classList.remove('hidden');};
  $('closeProgressBtn').onclick=()=>els.progressModal.classList.add('hidden');
  els.progressModal.onclick=e=>{if(e.target===els.progressModal)els.progressModal.classList.add('hidden');};
  $('openSidebarBtn').onclick=openSidebar; $('closeSidebarBtn').onclick=closeSidebar; els.sidebarOverlay.onclick=closeSidebar;
  $('closeResultBtn').onclick=()=>els.resultSection.classList.add('hidden');
  document.querySelectorAll('.result-tab').forEach(tab=>tab.addEventListener('click',()=>{
    document.querySelectorAll('.result-tab').forEach(x=>x.classList.toggle('active',x===tab));
    document.querySelectorAll('.result-panel').forEach(p=>p.classList.toggle('active',p.id===`panel-${tab.dataset.result}`));
  }));
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (!els.formHelpModal?.classList.contains('hidden')) closeFormHelp();
    if (!els.progressModal?.classList.contains('hidden')) els.progressModal.classList.add('hidden');
  });
  window.addEventListener('beforeunload',saveCurrentDraft);

  document.querySelectorAll('[data-page]').forEach(btn => btn.addEventListener('click', () => {
    const target = btn.dataset.page;
    if (target === 'practice') setPage('practice'); else setPage(target);
  }));
  $('brandHomeBtn').onclick = () => setPage('home');
  $('quickStartBtn').onclick = () => openPractice(randomSetId());
  $('chooseTestBtn').onclick = () => setPage('tests');
  $('homeOpenTestsBtn').onclick = () => setPage('tests');
  $('randomFromLibraryBtn').onclick = () => openPractice(randomSetId());
  $('backToTestsBtn').onclick = () => setPage('tests');
  $('globalProgressBtn').onclick = () => { renderProgress(); els.progressModal.classList.remove('hidden'); };
  setupLibraryControls();
  renderAll();
  setPage('home');
  if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));
})();
