/* ============================================================
 *  打工充能站 · 主逻辑
 * ============================================================ */

// ===== 全局状态 =====
const STORAGE_KEY = 'work_energy_booster_user';
const TODO_KEY = 'work_energy_booster_todos';

let userData = null;
let currentMBTIGroup = 'analyst';
let selectedMBTI = null;
let avatarData = null;
let todayChallenge = null;
let dailyContent = null;

// ===== 初始化 =====
function init() {
  loadUserData();
  renderMBTIGrid();
  bindSetupEvents();

  if (userData && userData.mbti) {
    showMainApp();
  } else {
    showPage('setup');
  }
}

// ===== 数据持久化 =====
function loadUserData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    userData = raw ? JSON.parse(raw) : null;
  } catch (e) {
    userData = null;
  }
}

function saveUserData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
}

function getTodos() {
  try {
    const raw = localStorage.getItem(TODO_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveTodos(todos) {
  localStorage.setItem(TODO_KEY, JSON.stringify(todos));
}

// ===== 页面路由 =====
function showPage(pageName) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + pageName);
  if (page) page.classList.add('active');

  // 底部导航
  const nav = document.getElementById('bottomNav');
  if (pageName === 'setup') {
    nav.style.display = 'none';
  } else {
    nav.style.display = 'flex';
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const navItem = document.querySelector(`.nav-item[data-page="${pageName}"]`);
    if (navItem) navItem.classList.add('active');
  }

  window.scrollTo(0, 0);
}

function navigate(page) {
  showPage(page);
  if (page === 'home') renderHome();
  if (page === 'tarot') initTarot();
  if (page === 'answer') resetBook();
  if (page === 'challenge') renderChallenge();
  if (page === 'daily') renderDaily();
  if (page === 'heal') initHeal();
}

// ===== 引导页 =====
function renderMBTIGrid() {
  // 分组标签
  const tabsContainer = document.getElementById('mbtiGroupTabs');
  tabsContainer.innerHTML = '';
  Object.entries(MBTI_GROUPS).forEach(([key, group]) => {
    const tab = document.createElement('div');
    tab.className = 'mbti-group-tab' + (key === currentMBTIGroup ? ' active' : '');
    tab.textContent = `${group.emoji} ${group.name}`;
    tab.onclick = () => {
      currentMBTIGroup = key;
      renderMBTIGrid();
    };
    tabsContainer.appendChild(tab);
  });

  // MBTI 卡片
  const grid = document.getElementById('mbtiGrid');
  grid.innerHTML = '';
  Object.entries(MBTI_DATA).forEach(([code, data]) => {
    if (data.group !== currentMBTIGroup) return;
    const card = document.createElement('div');
    card.className = 'mbti-card' + (selectedMBTI === code ? ' selected' : '');
    card.innerHTML = `
      <div class="mbti-emoji">${data.emoji}</div>
      <div class="mbti-code" style="color:${data.color}">${code}</div>
      <div class="mbti-nick">${data.nickname}</div>
    `;
    card.onclick = () => {
      selectedMBTI = code;
      renderMBTIGrid();
      checkSetupComplete();
    };
    grid.appendChild(card);
  });
}

function checkSetupComplete() {
  const nickname = document.getElementById('nicknameInput').value.trim();
  const btn = document.getElementById('setupCompleteBtn');
  btn.disabled = !(nickname && selectedMBTI);
}

function bindSetupEvents() {
  // 头像上传
  const avatarUpload = document.getElementById('avatarUpload');
  const avatarInput = document.getElementById('avatarInput');
  avatarUpload.onclick = () => avatarInput.click();
  avatarInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      avatarData = ev.target.result;
      const hint = document.getElementById('avatarHint');
      hint.style.display = 'none';
      let img = avatarUpload.querySelector('img');
      if (!img) {
        img = document.createElement('img');
        avatarUpload.appendChild(img);
      }
      img.src = avatarData;
    };
    reader.readAsDataURL(file);
  };

  // 昵称输入
  document.getElementById('nicknameInput').addEventListener('input', checkSetupComplete);

  // 完成按钮
  document.getElementById('setupCompleteBtn').onclick = () => {
    const nickname = document.getElementById('nicknameInput').value.trim();
    const industry = document.getElementById('industryInput').value.trim();
    if (!nickname || !selectedMBTI) return;

    userData = {
      nickname,
      industry: industry || '打工人',
      mbti: selectedMBTI,
      avatar: avatarData || null,
      createdAt: new Date().toISOString(),
      lastVisit: new Date().toISOString()
    };
    saveUserData();
    showToast('🎉 欢迎来到充能站！');
    setTimeout(() => showMainApp(), 500);
  };
}

function showMainApp() {
  // 更新最后访问时间
  if (userData) {
    userData.lastVisit = new Date().toISOString();
    saveUserData();
  }
  showPage('home');
  renderHome();
}

// ===== 主页 =====
function renderHome() {
  const mbtiData = MBTI_DATA[userData.mbti];
  if (!mbtiData) return;

  // 头像
  const homeAvatar = document.getElementById('homeAvatar');
  if (userData.avatar) {
    homeAvatar.innerHTML = `<img src="${userData.avatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover">`;
  } else {
    homeAvatar.textContent = mbtiData.emoji;
  }

  // 问候语
  const hour = new Date().getHours();
  let period, greetings, emoji;
  if (hour < 6) { period = 'lateNight'; greetings = GREETINGS.lateNight; emoji = '🌙'; }
  else if (hour < 11) { period = 'morning'; greetings = GREETINGS.morning; emoji = '☀️'; }
  else if (hour < 14) { period = 'noon'; greetings = GREETINGS.noon; emoji = '🍱'; }
  else if (hour < 18) { period = 'afternoon'; greetings = GREETINGS.afternoon; emoji = '☕'; }
  else if (hour < 23) { period = 'evening'; greetings = GREETINGS.evening; emoji = '🌆'; }
  else { period = 'lateNight'; greetings = GREETINGS.lateNight; emoji = '🌙'; }

  document.getElementById('greetingText').textContent = greetings[Math.floor(Math.random() * greetings.length)];
  document.getElementById('greetingSub').textContent = `${userData.nickname}，你的${mbtiData.nickname}能量正在充能中...`;
  document.getElementById('greetingEmoji').textContent = emoji;
  document.getElementById('greetingCard').style.background = mbtiData.bgGradient;

  // 用户卡片
  const userCard = document.getElementById('userCard');
  const energyLevel = getDailyEnergy();
  userCard.innerHTML = `
    <div class="user-avatar">
      ${userData.avatar ? `<img src="${userData.avatar}">` : mbtiData.emoji}
    </div>
    <div class="user-info">
      <div class="user-name">${userData.nickname}</div>
      <div class="user-mbti">
        <span class="mbti-badge" style="background:${mbtiData.color}">${userData.mbti}</span>
        <span>${mbtiData.nickname} · ${userData.industry}</span>
      </div>
      <div class="energy-bar">
        <div class="energy-fill" style="width:${energyLevel}%;background:${mbtiData.bgGradient}"></div>
      </div>
    </div>
  `;

  // 运势速览
  const fortunePreview = document.getElementById('fortunePreview');
  const todayKey = getTodayKey();
  const fortuneIdx = hashStr(todayKey + userData.mbti) % FORTUNE_SUMMARIES.length;
  const stars = '⭐'.repeat(3 + (fortuneIdx % 3));
  fortunePreview.innerHTML = `
    <div class="fortune-header">
      <div class="fortune-title">🔮 今日运势速览</div>
      <div class="fortune-date">${formatDate(new Date())}</div>
    </div>
    <div class="fortune-text">${FORTUNE_SUMMARIES[fortuneIdx]}</div>
    <div class="fortune-stars">${stars}</div>
  `;
}

function getDailyEnergy() {
  const hour = new Date().getHours();
  if (hour < 9) return 45 + Math.random() * 15;
  if (hour < 12) return 70 + Math.random() * 20;
  if (hour < 14) return 50 + Math.random() * 15;
  if (hour < 18) return 60 + Math.random() * 20;
  if (hour < 22) return 75 + Math.random() * 15;
  return 30 + Math.random() * 15;
}

// ===== 塔罗占卜 =====
let tarotDrawn = false;
let currentCard = null;
let tarotUserQuestion = '';

function initTarot() {
  tarotDrawn = false;
  currentCard = null;
  tarotUserQuestion = '';
  document.getElementById('tarotCardBack').style.display = 'flex';
  document.getElementById('tarotResult').style.display = 'none';
  document.getElementById('tarotResult').innerHTML = '';
  document.getElementById('tarotQuestionArea').style.display = 'block';
  document.getElementById('tarotQuestionInput').value = '';
}

function drawTarotCard() {
  if (tarotDrawn) return;
  tarotDrawn = true;

  // 获取用户问题
  tarotUserQuestion = document.getElementById('tarotQuestionInput').value.trim();

  // 随机抽牌
  const cardIdx = Math.floor(Math.random() * TAROT_CARDS.length);
  const card = TAROT_CARDS[cardIdx];
  const isReversed = Math.random() < 0.3; // 30%概率逆位
  currentCard = { ...card, isReversed };

  // 隐藏问题输入区
  document.getElementById('tarotQuestionArea').style.display = 'none';

  // 隐藏牌背
  document.getElementById('tarotCardBack').style.display = 'none';

  // 生成解读
  const reading = generateTarotReading(tarotUserQuestion, currentCard);

  const resultDiv = document.getElementById('tarotResult');
  resultDiv.style.display = 'block';
  resultDiv.innerHTML = `
    <div class="tarot-card-flipped">
      <div class="card-emoji">${card.emoji}</div>
      <div class="card-name">${card.name}</div>
      <div class="card-keyword">${card.keyword}</div>
      <div class="card-orientation ${isReversed ? 'reversed' : 'upright'}">
        ${isReversed ? '⚡ 逆位' : '✨ 正位'}
      </div>
    </div>
    <div class="tarot-reading">
      <div class="reading-label">🔮 塔罗解读</div>
      <div class="reading-text">${reading}</div>
    </div>
    <div style="text-align:center;margin-top:16px;display:flex;gap:10px;justify-content:center">
      <button class="btn-secondary" onclick="drawAgain()">🔄 再抽一牌</button>
      <button class="btn-secondary" onclick="showMeme()">🎁 领梗图</button>
    </div>
    <div id="memeContainer"></div>
  `;
}

function generateTarotReading(question, card) {
  const isReversed = card.isReversed;
  const cardReading = isReversed ? card.reversed : card.upright;

  // 分析问题类型
  let qType = 'general';
  if (/工作|事业|职场|升职|加薪|跳槽|项目|领导|同事|辞职|打工/.test(question)) qType = 'career';
  else if (/感情|喜欢|爱|男|女|朋友|恋|追|TA |他/ .test(question)) qType = 'love';
  else if (/学|考试|成绩|升学|考研|毕业|论文/.test(question)) qType = 'study';
  else if (/健康|身体|病|累|休息|压力/.test(question)) qType = 'health';
  else if (/金钱|钱|财运|投资|理财|收入|奖金/.test(question)) qType = 'money';
  else if (/家|父母|爸|妈|亲|家人|亲戚/.test(question)) qType = 'family';
  else if (/决|该不|要不要|选|选择|怎么/.test(question)) qType = 'decision';

  // 通用前缀（如果用户填写了问题）
  let prefix = '';
  if (question && question.length > 0) {
    const qPrefixes = [
      `关于「${question}」——`,
      `你问的「${question}」，牌面显示：`,
      `针对你的问题「${question}」，塔罗这样说：`,
      `那张牌在回应「${question}」时，这样说：`
    ];
    prefix = qPrefixes[Math.floor(Math.random() * qPrefixes.length)];
  }

  // 根据问题类型和牌面能量生成解读
  const templates = buildReadingTemplate(card, qType, isReversed);
  const body = templates[Math.floor(Math.random() * templates.length)];

  return prefix + body;
}

function buildReadingTemplate(card, qType, isReversed) {
  const cardName = card.name;
  const keyword = card.keyword;
  const energy = isReversed ? '逆位能量' : '正位能量';

  // 通用解读库
  const generalTemplates = [
    `这张「${cardName}」${energy}在告诉你：牌面暗示这件事正在一个关键节点，结果会受你的态度影响。保持开放，结果也许比你预期的好。`,
    `「${cardName}」出现了。结合你的问题——牌面表示这件事需要你更加耐心，不要急于求成。时机到了，自然会有答案。`,
    `从「${cardName}」来看，${energy}显示这件事背后有更深层的意义。表面的困扰可能只是假象，真正的答案藏在牌给你的暗示里。`,
    `抽到了「${cardName}」——牌面指向一个关键词：${keyword}。这可能是你现在最需要的心态或行动。`,
    `「${cardName}」${energy}告诉你：不要太执着于结果本身。过程中的成长，才是这张牌真正想给你的礼物。`
  ];

  // 职业相关
  const careerTemplates = [
    `「${cardName}」在工作这件事上，暗示你需要更多主动行动。牌面显示机会存在，但需要你伸手去拿。`,
    `关于职场，「${cardName}」${energy}表示：不要害怕变化，勇敢迈出下一步会看到新的可能。`,
    `从职业角度看，「${cardName}」在说：你的能力和价值被低估了，是时候让正确的人看到你了。`,
    `工作上，「${cardName}」暗示目前是一个过渡期。保持专业，积累能量，下一个阶段会感谢现在的你。`
  ];

  // 感情相关
  const loveTemplates = [
    `关于感情，「${cardName}」${energy}显示：关系中有一方在犹豫，你需要给对方一些时间和空间。`,
    `感情问题上，抽到了「${cardName}」。牌面暗示这段关系需要更多真诚的沟通，心结不解开，难以前进。`,
    `从「${cardName}」看感情运——牌面显示积极信号，但需要你主动一点，别让机会白白溜走。`,
    `感情中，「${cardName}」在说：不要着急定义关系，顺其自然反而会有意想不到的发展。`
  ];

  // 学习相关
  const studyTemplates = [
    `「${cardName}」${energy}在学业上暗示：之前的方法可能需要调整，找到适合自己的节奏比硬撑更重要。`,
    `学习方面，抽到了「${cardName}」。牌面显示你正在一个积累期，坚持下去会看到进步。`,
    `考试或学业问题，「${cardName}」在说：相信自己，你的准备比你以为的充分。`
  ];

  // 健康相关
  const healthTemplates = [
    `「${cardName}」${energy}提醒你：身体已经在发出信号，别忽视。休息不是偷懒，是战斗力的一部分。`,
    `健康方面，抽到了「${cardName}」。牌面暗示调整作息和心态，比吃药更有效。`
  ];

  // 金钱相关
  const moneyTemplates = [
    `「${cardName}」在财运上${energy}：财务状况会有好转，但需要你更加审慎地做决定。`,
    `关于金钱，「${cardName}」暗示不要太冒险，稳扎稳打才是现在最好的策略。`
  ];

  // 家庭相关
  const familyTemplates = [
    `「${cardName}」${energy}在家庭事务上：沟通是关键，试着理解长辈的立场，也表达你的想法。`,
    `家庭问题，「${cardName}」在说：有些事需要时间，别急于在当下解决，耐心是美德。`
  ];

  // 决定相关
  const decisionTemplates = [
    `关于你的决定，「${cardName}」${energy}暗示：相信你的直觉，它比你以为的更聪明。`,
    `做选择时抽到「${cardName}」——牌面显示没有绝对的对错，但每个选择都会带来不同的成长。`,
    `决定困难户看过来！「${cardName}」在说：选那个让你心跳加速的，而不是让你焦虑的。`
  ];

  // 根据问题类型选择模板库
  let pool;
  switch (qType) {
    case 'career': pool = careerTemplates; break;
    case 'love': pool = loveTemplates; break;
    case 'study': pool = studyTemplates; break;
    case 'health': pool = healthTemplates; break;
    case 'money': pool = moneyTemplates; break;
    case 'family': pool = familyTemplates; break;
    case 'decision': pool = decisionTemplates; break;
    default: pool = generalTemplates;
  }

  return pool;
}

function drawAgain() {
  tarotDrawn = false;
  initTarot();
  showToast('🔮 重新洗牌中...');
}

function showMeme() {
  const mbti = userData.mbti;
  const memes = MEME_LIBRARY[mbti] || [];
  if (memes.length === 0) return;

  const meme = memes[Math.floor(Math.random() * memes.length)];
  const container = document.getElementById('memeContainer');
  container.innerHTML = `
    <div class="meme-card">
      <div class="meme-label">🎁 MBTI 专属梗图</div>
      <div class="meme-text">${meme}</div>
      <div class="meme-mbti">— ${mbti} · ${MBTI_DATA[mbti].nickname} —</div>
    </div>
  `;
  container.scrollIntoView({ behavior: 'smooth', block: 'center' });
  showToast('😂 梗图已送达！');
}

// ===== 答案之书 =====
let bookFlipped = false;

function flipBook() {
  if (bookFlipped) return;
  bookFlipped = true;

  const cover = document.getElementById('bookCover');
  const page = document.getElementById('bookPage');

  cover.classList.add('flipping');

  setTimeout(() => {
    cover.style.display = 'none';
    const answer = ANSWER_BOOK[Math.floor(Math.random() * ANSWER_BOOK.length)];
    document.getElementById('pageAnswer').textContent = answer;
    page.classList.add('show');
    showToast('📖 答案已揭晓！');
  }, 800);
}

function resetBook() {
  bookFlipped = false;
  const cover = document.getElementById('bookCover');
  const page = document.getElementById('bookPage');
  cover.classList.remove('flipping');
  cover.style.display = 'flex';
  page.classList.remove('show');
  document.getElementById('answerInput').value = '';
}

// ===== 今日大挑战 + Todo =====
function renderChallenge() {
  const mbti = userData.mbti;
  const mbtiData = MBTI_DATA[mbti];
  const todayKey = getTodayKey();

  // 每日固定一个挑战（基于日期+MBTI哈希）
  const mbtiChallenges = mbtiData.challenges || [];
  const allChallenges = [...mbtiChallenges, ...GENERAL_CHALLENGES.map(c => c.title)];
  const challengeIdx = hashStr(todayKey + mbti) % allChallenges.length;
  const isMbtiSpecific = challengeIdx < mbtiChallenges.length;

  let challenge;
  if (isMbtiSpecific) {
    challenge = {
      title: allChallenges[challengeIdx],
      desc: `这是为${mbtiData.nickname}定制的旺己挑战——做完了今天的运气会变好（大概）。`,
      icon: mbtiData.emoji
    };
  } else {
    const genChallenge = GENERAL_CHALLENGES[challengeIdx - mbtiChallenges.length];
    challenge = { ...genChallenge };
  }

  todayChallenge = challenge;

  // 渲染挑战卡
  const hero = document.getElementById('challengeHero');
  hero.style.background = mbtiData.bgGradient;
  hero.innerHTML = `
    <div class="ch-emoji">${challenge.icon}</div>
    <div class="ch-title">${challenge.title}</div>
    <div class="ch-desc">${challenge.desc}</div>
    <button class="ch-btn" onclick="addChallengeToTodo()">📋 加入今日待办</button>
  `;

  renderTodos();
}

function addChallengeToTodo() {
  const todos = getTodos();
  const exists = todos.some(t => t.text === todayChallenge.title);
  if (exists) {
    showToast('已经在待办里啦！');
    return;
  }
  todos.unshift({
    id: Date.now(),
    text: todayChallenge.title,
    done: false,
    tag: '🎯 今日挑战',
    isChallenge: true
  });
  saveTodos(todos);
  renderTodos();
  showToast('✅ 已加入待办！');
}

function renderTodos() {
  const todos = getTodos();
  const list = document.getElementById('todoList');

  if (todos.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-emoji">📝</div>
        <div class="empty-text">今天还没有待办<br>把上面的挑战加进来吧！</div>
      </div>
    `;
    return;
  }

  list.innerHTML = todos.map(todo => `
    <div class="todo-item ${todo.done ? 'done' : ''}">
      <div class="todo-check ${todo.done ? 'done' : ''}" onclick="toggleTodo(${todo.id})">
        ${todo.done ? '✓' : ''}
      </div>
      <div class="todo-content">
        <div class="todo-text">${escapeHtml(todo.text)}</div>
        ${todo.tag ? `<span class="todo-tag">${todo.tag}</span>` : ''}
      </div>
      <span class="todo-delete" onclick="deleteTodo(${todo.id})">×</span>
    </div>
  `).join('');
}

function toggleTodo(id) {
  const todos = getTodos();
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.done = !todo.done;
    if (todo.done && todo.isChallenge) {
      showToast('🎉 挑战完成！运气+10！');
    }
    saveTodos(todos);
    renderTodos();
  }
}

function deleteTodo(id) {
  let todos = getTodos();
  todos = todos.filter(t => t.id !== id);
  saveTodos(todos);
  renderTodos();
}

function toggleAddTodo() {
  const row = document.getElementById('todoAddRow');
  row.classList.toggle('show');
  if (row.classList.contains('show')) {
    document.getElementById('todoInput').focus();
  }
}

function addTodo() {
  const input = document.getElementById('todoInput');
  const text = input.value.trim();
  if (!text) return;

  const todos = getTodos();
  todos.push({
    id: Date.now(),
    text,
    done: false,
    tag: null,
    isChallenge: false
  });
  saveTodos(todos);
  input.value = '';
  document.getElementById('todoAddRow').classList.remove('show');
  renderTodos();
  showToast('✅ 待办已添加！');
}

// ===== 每日推荐 =====
function renderDaily() {
  const todayKey = getTodayKey();
  const mbti = userData.mbti;
  const mbtiData = MBTI_DATA[mbti];

  // 基于日期决定推电影还是歌曲
  const showMovie = hashStr(todayKey) % 2 === 0;
  const contentDiv = document.getElementById('dailyContent');

  if (showMovie) {
    const idx = hashStr(todayKey + 'movie') % DAILY_MOVIES.length;
    const movie = DAILY_MOVIES[idx];
    contentDiv.innerHTML = `
      <div class="daily-card">
        <div class="daily-type movie">🎬 今日电影</div>
        <div class="daily-body">
          <div class="daily-emoji">${movie.emoji}</div>
          <div class="daily-title">${movie.title}</div>
          <div class="daily-subtitle">${movie.titleEn}</div>
          <div class="daily-quote">${movie.quote}</div>
          <div class="daily-desc">${movie.desc}</div>
          <div class="daily-mood">🎭 ${movie.mood}</div>
        </div>
      </div>
      <div style="text-align:center;padding:16px;color:var(--text-light);font-size:13px">
        ${mbtiData.nickname}，今晚看完记得来充能站打卡 📝
      </div>
    `;
  } else {
    const idx = hashStr(todayKey + 'song') % DAILY_SONGS.length;
    const song = DAILY_SONGS[idx];
    contentDiv.innerHTML = `
      <div class="daily-card">
        <div class="daily-type song">🎵 今日歌曲</div>
        <div class="daily-body">
          <div class="daily-emoji">${song.emoji}</div>
          <div class="daily-title">${song.title}</div>
          <div class="daily-subtitle">${song.artist}</div>
          <div class="daily-quote">${song.lyric}</div>
          <div class="daily-desc">${song.desc}</div>
          <div class="daily-mood">🎧 ${song.mood}</div>
        </div>
      </div>
      <div style="text-align:center;padding:16px;color:var(--text-light);font-size:13px">
        ${mbtiData.nickname}，戴上耳机，世界就是你的 🎧
      </div>
    `;
  }
}

// ===== 治愈页 =====
const KITTEN_LITERATURE = [
  "你这么可爱，怎么可以一个人扛这么多呢？抱抱你。",
  "世界很坏，但你好可爱。不要难过了，好吗？",
  "今天也很努力了呢。累了就休息，休息不是浪费时间哦。",
  "小猫咪告诉你：有些事努力了就好，结果不是全部的你。",
  "你不需要很厉害才开始，你需要开始才会很厉害。",
  "今天有没有好好吃饭？有没有喝水？有没有对自己说一声辛苦了？",
  "小猫咪不理解什么叫'必须完美'，它只知道晒太阳和打呼噜。",
  "你已经很棒了。这句话，小猫咪说的，不接受反驳。",
  "难过的时候，就摸摸自己的头吧。就像摸小猫咪一样。",
  "今天的你，是世界上独一无二的你。没有人可以代替。",
  "小猫咪不需要意义，它只需要阳光、罐头和你。",
  "你不需要向任何人证明什么。你存在，就已经很好了。",
  "如果累了，就躺一会儿。地球不会因为休息一天就停止转动。",
  "小猫咪想对你说：你值得被爱，就像你爱它一样。",
  "今天有没有发现什么小事让你开心？哪怕是一缕阳光？",
  "不要苛责自己了。你已经做得很好了，真的。",
  "小猫咪没有焦虑，因为它只活在当下。你也可以试试。",
  "你不需要变成谁，做你自己就好。小猫咪永远喜欢你原本的样子。",
  "如果今天有点难，那也没关系。明天又是新的一天。",
  "小猫咪说：抱抱你，你会没事的。",
  "你很重要。你是被需要的。你是被爱着的。",
  "今天也要对自己温柔一点哦。你已经够辛苦了。",
  "小猫咪不懂什么叫'不够好'，它只知道陪伴和爱。",
  "难过的时候就来找小猫咪吧，虽然我只是一段文字，但我在这里。",
  "你是独一无二的。就像每只猫咪都有不同的花纹一样。",
  "小猫咪想告诉你：放轻松，一切都会好的。",
  "不需要每天都元气满满，偶尔的低落是被允许的。",
  "小猫咪的呼噜声有治愈魔法，你要听听吗？呼噜噜~",
  "你比自己以为的更勇敢、更可爱、更值得被爱。",
  "今天天气好吗？有没有晒到太阳？就像小猫咪一样，晒晒太阳吧。"
];

const PUPPY_LITERATURE = [
  "汪！今天的你也很棒！虽然我不知道发生了什么，但我想让你开心！",
  "人类啊，不要一个人闷着！有什么事，告诉汪星人！",
  "汪汪汪！快乐是一种选择，今天也要开开心心的哦！",
  "你知道吗？尾巴摇一摇可以让烦恼少一半。你要不要试试？",
  "小狗狗不会想太多，它只知道：看到你，就很开心了！",
  "今天有没有对自己好一点？买了好吃的给自己吗？",
  "汪！不管发生什么，你都是我的好朋友！抱抱！",
  "小狗狗的天赋是：无论发生什么，都相信明天会更好。",
  "难过的时候，就想想小狗狗吧。它每天都在等你回家。",
  "你是最棒的人类！汪汪队给你加油！",
  "小狗狗想告诉你：不要太在意别人怎么想，你已经很好了。",
  "汪！记得喝水、记得吃饭、记得对自己说一声辛苦了！",
  "这个世界可能不完美，但你让世界变得更好了。汪！",
  "小狗狗没有烦恼，因为它总是活在当下。你也可以试试哦。",
  "今天的小狗狗也要努力摇尾巴呢！希望你的今天有好事发生！",
  "汪星人永远爱你！不管你做了什么，都爱你！",
  "如果没有人告诉你，你很棒，那我现在告诉你：你很棒！汪！",
  "小狗狗的天天任务是：让喜欢的人开心。你今天开心了吗？",
  "不管今天多累，明天又是新的一天！汪汪！",
  "小狗狗相信你，就像我相信明天会有零食一样坚定。",
  "你不是在一个人哦！有汪星人在远方为你加油！",
  "今天够辛苦了吗？休息一下吧，小狗狗会帮你看着门。",
  "汪！你是独一无二的人类，就像每只狗都是独一无二的狗一样。",
  "小狗狗不懂什么叫'失败'，它只知道继续前进和摇尾巴。",
  "如果累了，就靠着我吧。虽然我只是一段文字，但我很温暖。",
  "今天有没有做什么让自己骄傲的事？有的对吧！汪！",
  "小狗狗想告诉你：你值得所有的美好，包括休息和快乐。",
  "汪汪队出击！今天的烦恼全部赶走！",
  "你比你想象的更厉害。小狗狗从来不会看错人！",
  "无论发生什么，请记住：你很重要，汪星人永远支持你！"
];

function initHeal() {
  renderHealMeme();
  renderHealPet();
}

function renderHealMeme() {
  const mbti = userData.mbti;
  const mbtiData = MBTI_DATA[mbti];
  const memes = MEME_LIBRARY[mbti] || [];
  const meme = memes[Math.floor(Math.random() * memes.length)];

  const emojis = ['😂', '🤣', '😅', '🙈', '🐾', '✨', '💫', '🌟'];

  document.getElementById('healMemeEmoji').textContent = emojis[Math.floor(Math.random() * emojis.length)];
  document.getElementById('healMemeText').textContent = meme;
  document.getElementById('healMemeTag').textContent = `— ${mbti} · ${mbtiData.nickname} —`;
}

function renderHealPet() {
  const isKitten = Math.random() < 0.5;
  const texts = isKitten ? KITTEN_LITERATURE : PUPPY_LITERATURE;
  const text = texts[Math.floor(Math.random() * texts.length)];

  const kittenEmojis = ['🐱', '😺', '😸', '😻', '🙀', '😹', '🐈', '✨'];
  const puppyEmojis = ['🐶', '🐕', '🦮', '🐩', '🐕‍🦺', '💛', '🐾', '✨'];

  const emojis = isKitten ? kittenEmojis : puppyEmojis;
  document.getElementById('healPetBadge').textContent = isKitten ? '🐱 小猫文学' : '🐶 小狗文学';
  document.getElementById('healPetEmoji').textContent = emojis[Math.floor(Math.random() * emojis.length)];
  document.getElementById('healPetText').textContent = text;
  document.getElementById('healPetAuthor').textContent = isKitten ? '— 小猫文学 · 治愈版 —' : '— 小狗文学 · 治愈版 —';
}

function refreshHeal(type) {
  if (type === 'meme') {
    renderHealMeme();
    showToast('😂 梗图已刷新！');
  } else {
    renderHealPet();
    showToast('🐾 文学已刷新！');
  }
}

// ===== 工具函数 =====
function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function hashStr(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function formatDate(d) {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  return `${d.getMonth() + 1}月${d.getDate()}日 周${days[d.getDay()]}`;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showToast(msg) {
  // 移除已有toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// ===== 启动 =====
document.addEventListener('DOMContentLoaded', init);
