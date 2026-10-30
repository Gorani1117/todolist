/**
 * CYBER//TASKFLOW - Cyberpunk Magenta Edition
 * Vanilla JS + LocalStorage 기반 오프라인 완결형 스마트 할 일 관리
 * + Web Audio API 8-Bit Retro 게임 효과음 (뿅뿅 사운드) 내장
 */

// =============================================================
// Retro 8-bit Arcade Sound Synthesizer (Web Audio API)
// 외부 오디오 파일 없이 순수 브라우저 오디오 신디사이저로 생성되는 레트로 뿅뿅 사운드
// =============================================================
const RetroAudio = {
  ctx: null,
  enabled: true,

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  },

  // 뿅! 뿅! (레트로 아케이드 2단 코인/파워업 뿅뿅 효과음)
  playBbyong() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;

      // 1st "뿅!" (경쾌한 급상승 주파수 스윕)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "square"; // 8-bit 오락실 사운드의 상징
      osc1.frequency.setValueAtTime(540, now);
      osc1.frequency.exponentialRampToValueAtTime(1180, now + 0.065);

      gain1.gain.setValueAtTime(0.14, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.07);

      // 2nd "뿅!" (더 높은 피치로 통통 튀는 피니시 뿅!)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine"; // 맑고 통통 튀는 울림
      osc2.frequency.setValueAtTime(880, now + 0.06);
      osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.16);

      gain2.gain.setValueAtTime(0.2, now + 0.06);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.20);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.06);
      osc2.stop(now + 0.20);
    } catch (err) {
      console.warn("Sound error:", err);
    }
  },

  // 서브태스크 완료 시 미니 "뿅!" 사운드
  playSubBbyong() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.06);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch (err) {
      console.warn("Sound error:", err);
    }
  },

  // 뽀-용 (체크 해제 / 복원 시 부드러운 하강 효과음)
  playRestore() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(950, now);
      osc.frequency.exponentialRampToValueAtTime(360, now + 0.12);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    } catch (err) {
      console.warn("Sound error:", err);
    }
  },

  // 띠링! (신규 할 일 추가 시 8비트 접속 사운드)
  playAdd() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;

      const notes = [440, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.035);
        gain.gain.setValueAtTime(0.1, now + idx * 0.035);
        gain.gain.exponentialRampToValueAtTime(0.001, now + (idx + 1) * 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.035);
        osc.stop(now + (idx + 1) * 0.05);
      });
    } catch (err) {
      console.warn("Sound error:", err);
    }
  }
};

// Initial Sample Data (사이버펑크 테마 기본 예시 데이터)
const DEFAULT_TASKS = [
  {
    id: "task-1",
    title: "[CORE] 뉴럴 인터페이스 동기화 프로토콜 점검",
    completed: false,
    priority: "high",
    dueDate: new Date().toISOString().split("T")[0], // 오늘
    category: "업무",
    memo: "사이버덱 v2.4 펌웨어 패치 및 버퍼 오버플로우 방지 점검",
    subtasks: [
      { id: "sub-1", text: "신경망 링크 대역폭 측정", completed: true },
      { id: "sub-2", text: "방화벽 침투 방지 테스트", completed: false }
    ],
    createdAt: new Date().toISOString(),
    completedAt: null
  },
  {
    id: "task-2",
    title: "[NET] 서브넷 데이터 암호화 키 로테이션",
    completed: false,
    priority: "medium",
    dueDate: null,
    category: "인프라",
    memo: "256비트 양자 암호화 모듈 교체",
    subtasks: [],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    completedAt: null
  },
  {
    id: "task-3",
    title: "[SYS] 마젠타 네온 HUD 인터페이스 구축 완료",
    completed: true,
    priority: "high",
    dueDate: new Date().toISOString().split("T")[0],
    category: "개인",
    memo: "사이버펑크 네온 마젠타 & 시안 컬러 시스템 적용 완료",
    subtasks: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    completedAt: new Date().toISOString()
  }
];

const DEFAULT_CATEGORIES = ["업무", "개인", "공부", "인프라"];

// Application State
const state = {
  tasks: [],
  categories: [],
  currentFilter: "all", // 'all' | 'today' | 'important' | 'completed' | category name
  searchQuery: "",
  sortBy: "created-desc",
  completedCollapsed: false,
  theme: "dark",
  soundEnabled: true,
  lastDeletedTask: null,
  editingTaskId: null
};

// DOM Elements
const elements = {
  // Navigation & Counts
  sidebar: document.getElementById("sidebar"),
  mobileMenuBtn: document.getElementById("mobileMenuBtn"),
  sidebarBackdrop: document.getElementById("sidebarBackdrop"),
  navItems: document.querySelectorAll(".nav-item"),
  countAll: document.getElementById("countAll"),
  countToday: document.getElementById("countToday"),
  countImportant: document.getElementById("countImportant"),
  countCompletedNav: document.getElementById("countCompletedNav"),
  categoryNavList: document.getElementById("categoryNavList"),
  addCategoryBtn: document.getElementById("addCategoryBtn"),
  
  // Header & Controls
  currentFilterTitle: document.getElementById("currentFilterTitle"),
  taskSummaryText: document.getElementById("taskSummaryText"),
  searchInput: document.getElementById("searchInput"),
  clearSearchBtn: document.getElementById("clearSearchBtn"),
  sortSelect: document.getElementById("sortSelect"),
  soundToggleBtn: document.getElementById("soundToggleBtn"),
  soundIcon: document.getElementById("soundIcon"),
  soundStatusText: document.getElementById("soundStatusText"),
  mobileSoundToggleBtn: document.getElementById("mobileSoundToggleBtn"),
  mobileSoundIcon: document.getElementById("mobileSoundIcon"),
  mobileSoundText: document.getElementById("mobileSoundText"),
  
  // Quick Add Form
  quickAddForm: document.getElementById("quickAddForm"),
  taskInput: document.getElementById("taskInput"),
  prioritySelect: document.getElementById("prioritySelect"),
  dueDateInput: document.getElementById("dueDateInput"),
  categorySelect: document.getElementById("categorySelect"),
  
  // Task Lists
  activeCount: document.getElementById("activeCount"),
  activeTaskList: document.getElementById("activeTaskList"),
  activeEmptyState: document.getElementById("activeEmptyState"),
  
  // Completed Section
  completedSection: document.getElementById("completedSection"),
  toggleCompletedBtn: document.getElementById("toggleCompletedBtn"),
  completedChevronIcon: document.getElementById("completedChevronIcon"),
  completedCount: document.getElementById("completedCount"),
  completedTasksContainer: document.getElementById("completedTasksContainer"),
  completedTaskList: document.getElementById("completedTaskList"),
  completedEmptyNotice: document.getElementById("completedEmptyNotice"),
  clearCompletedBtn: document.getElementById("clearCompletedBtn"),
  
  // Modals
  detailModal: document.getElementById("detailModal"),
  closeDetailModal: document.getElementById("closeDetailModal"),
  cancelModalBtn: document.getElementById("cancelModalBtn"),
  detailForm: document.getElementById("detailForm"),
  editTaskId: document.getElementById("editTaskId"),
  editTitle: document.getElementById("editTitle"),
  editPriority: document.getElementById("editPriority"),
  editDueDate: document.getElementById("editDueDate"),
  editCategory: document.getElementById("editCategory"),
  editMemo: document.getElementById("editMemo"),
  subtaskList: document.getElementById("subtaskList"),
  newSubtaskInput: document.getElementById("newSubtaskInput"),
  addSubtaskBtn: document.getElementById("addSubtaskBtn"),
  subtaskProgress: document.getElementById("subtaskProgress"),
  createdDateText: document.getElementById("createdDateText"),
  completedDateText: document.getElementById("completedDateText"),
  deleteTaskFromModal: document.getElementById("deleteTaskFromModal"),
  
  // Stats & Backup
  statsModalBtn: document.getElementById("statsModalBtn"),
  statsModal: document.getElementById("statsModal"),
  closeStatsModal: document.getElementById("closeStatsModal"),
  statsPercent: document.getElementById("statsPercent"),
  statsProgressBar: document.getElementById("statsProgressBar"),
  statsActiveCount: document.getElementById("statsActiveCount"),
  statsCompletedCount: document.getElementById("statsCompletedCount"),
  exportJsonBtn: document.getElementById("exportJsonBtn"),
  importJsonInput: document.getElementById("importJsonInput"),
  resetAllDataBtn: document.getElementById("resetAllDataBtn"),
  
  // Toast
  toast: document.getElementById("toast"),
  toastMessage: document.getElementById("toastMessage"),
  toastUndoBtn: document.getElementById("toastUndoBtn")
};

// -------------------------------------------------------------
// Initialization & Storage
// -------------------------------------------------------------
function initApp() {
  loadData();
  setupEventListeners();
  applyCyberTheme();
  updateSoundUI();
  renderAll();
}

function loadData() {
  const savedTasks = localStorage.getItem("cyber_taskflow_tasks");
  const savedCategories = localStorage.getItem("cyber_taskflow_categories");
  const savedCollapse = localStorage.getItem("cyber_taskflow_completed_collapsed");
  const savedSound = localStorage.getItem("cyber_taskflow_sound");

  state.tasks = savedTasks ? JSON.parse(savedTasks) : DEFAULT_TASKS;
  state.categories = savedCategories ? JSON.parse(savedCategories) : DEFAULT_CATEGORIES;
  state.completedCollapsed = savedCollapse === "true";
  state.soundEnabled = savedSound !== null ? savedSound === "true" : true;
  RetroAudio.enabled = state.soundEnabled;
  state.theme = "dark";
}

function saveData() {
  localStorage.setItem("cyber_taskflow_tasks", JSON.stringify(state.tasks));
  localStorage.setItem("cyber_taskflow_categories", JSON.stringify(state.categories));
  localStorage.setItem("cyber_taskflow_completed_collapsed", state.completedCollapsed);
  localStorage.setItem("cyber_taskflow_sound", state.soundEnabled);
}

function applyCyberTheme() {
  document.documentElement.classList.add("dark");
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  RetroAudio.enabled = state.soundEnabled;
  saveData();
  updateSoundUI();
  if (state.soundEnabled) {
    RetroAudio.playBbyong();
    showToast("SFX ONLINE // 뿅뿅 사운드 활성화 🔊");
  } else {
    showToast("SFX MUTED // 효과음 음소거 🔇");
  }
}

function updateSoundUI() {
  if (elements.soundStatusText) {
    elements.soundStatusText.textContent = state.soundEnabled ? "FX: ON" : "FX: MUTE";
  }
  if (elements.soundIcon) {
    elements.soundIcon.setAttribute("data-lucide", state.soundEnabled ? "volume-2" : "volume-x");
  }
  if (elements.mobileSoundText) {
    elements.mobileSoundText.textContent = state.soundEnabled ? "FX" : "MUTE";
  }
  if (elements.mobileSoundIcon) {
    elements.mobileSoundIcon.setAttribute("data-lucide", state.soundEnabled ? "volume-2" : "volume-x");
  }
  if (window.lucide) lucide.createIcons();
}

// -------------------------------------------------------------
// Rendering Core
// -------------------------------------------------------------
function renderAll() {
  renderCategories();
  renderCounts();
  renderTasks();
  updateCompletedSectionVisibility();
  if (window.lucide) {
    lucide.createIcons();
  }
}

function renderCategories() {
  elements.categorySelect.innerHTML = state.categories
    .map(c => `<option value="${escapeHtml(c)}">${getCategoryBadge(c)} ${escapeHtml(c)}</option>`)
    .join("");

  elements.editCategory.innerHTML = state.categories
    .map(c => `<option value="${escapeHtml(c)}">${getCategoryBadge(c)} ${escapeHtml(c)}</option>`)
    .join("");

  elements.categoryNavList.innerHTML = state.categories
    .map(cat => {
      const count = state.tasks.filter(t => t.category === cat && !t.completed).length;
      const isActive = state.currentFilter === `cat:${cat}`;
      return `
        <button data-filter="cat:${escapeHtml(cat)}" class="nav-item ${isActive ? 'active' : ''} w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all">
          <span class="flex items-center gap-2">
            <span>${getCategoryBadge(cat)}</span>
            <span class="truncate font-mono">${escapeHtml(cat)}</span>
          </span>
          <span class="px-2 py-0.5 text-xs rounded font-mono font-bold bg-cyber-bg border border-cyber-border text-slate-300">${count}</span>
        </button>
      `;
    })
    .join("");
}

function getCategoryBadge(cat) {
  if (cat.includes("업무")) return "💼";
  if (cat.includes("개인")) return "⚡";
  if (cat.includes("공부")) return "📚";
  if (cat.includes("인프라") || cat.includes("보안")) return "🛡️";
  return "🏷️";
}

function renderCounts() {
  const todayStr = new Date().toISOString().split("T")[0];
  
  const allActive = state.tasks.filter(t => !t.completed).length;
  const todayActive = state.tasks.filter(t => !t.completed && t.dueDate === todayStr).length;
  const importantActive = state.tasks.filter(t => !t.completed && t.priority === "high").length;
  const completedTotal = state.tasks.filter(t => t.completed).length;

  elements.countAll.textContent = allActive;
  elements.countToday.textContent = todayActive;
  elements.countImportant.textContent = importantActive;
  elements.countCompletedNav.textContent = completedTotal;

  elements.activeCount.textContent = allActive;
  elements.completedCount.textContent = completedTotal;

  elements.taskSummaryText.textContent = `STATUS: ACTIVE [${allActive}] · COMPLETED [${completedTotal}]`;
}

function getFilteredTasks() {
  const todayStr = new Date().toISOString().split("T")[0];
  const query = state.searchQuery.trim().toLowerCase();

  return state.tasks.filter(task => {
    if (query) {
      const matchTitle = task.title.toLowerCase().includes(query);
      const matchMemo = (task.memo || "").toLowerCase().includes(query);
      const matchSub = (task.subtasks || []).some(s => s.text.toLowerCase().includes(query));
      if (!matchTitle && !matchMemo && !matchSub) return false;
    }

    if (state.currentFilter === "all") return true;
    if (state.currentFilter === "today") return task.dueDate === todayStr;
    if (state.currentFilter === "important") return task.priority === "high";
    if (state.currentFilter === "completed") return task.completed === true;
    if (state.currentFilter.startsWith("cat:")) {
      const category = state.currentFilter.replace("cat:", "");
      return task.category === category;
    }

    return true;
  });
}

function sortTasks(taskList) {
  const sorted = [...taskList];
  switch (state.sortBy) {
    case "due-asc":
      return sorted.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
    case "priority-desc":
      const rank = { high: 3, medium: 2, low: 1 };
      return sorted.sort((a, b) => (rank[b.priority] || 0) - (rank[a.priority] || 0));
    case "title-asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "created-desc":
    default:
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
}

function renderTasks() {
  const filtered = getFilteredTasks();
  const sorted = sortTasks(filtered);

  const activeTasks = sorted.filter(t => !t.completed);
  const completedTasks = sorted.filter(t => t.completed);

  const isCompletedNavView = state.currentFilter === "completed";

  // Active Tasks
  if (activeTasks.length === 0 && !isCompletedNavView) {
    elements.activeTaskList.innerHTML = "";
    elements.activeEmptyState.classList.remove("hidden");
  } else {
    elements.activeEmptyState.classList.add("hidden");
    elements.activeTaskList.innerHTML = activeTasks
      .map(task => createTaskCardHtml(task, false))
      .join("");
  }

  // Completed Tasks (하단 완료한 목록)
  elements.completedCount.textContent = completedTasks.length;
  if (completedTasks.length === 0) {
    elements.completedTaskList.innerHTML = "";
    elements.completedEmptyNotice.classList.remove("hidden");
    elements.clearCompletedBtn.classList.add("hidden");
  } else {
    elements.completedEmptyNotice.classList.add("hidden");
    elements.clearCompletedBtn.classList.remove("hidden");
    elements.completedTaskList.innerHTML = completedTasks
      .map(task => createTaskCardHtml(task, true))
      .join("");
  }

  if (isCompletedNavView) {
    elements.completedTasksContainer.classList.remove("hidden");
    elements.completedChevronIcon.classList.add("rotate-180");
  }

  updateHeaderTitle();
}

function updateHeaderTitle() {
  let title = "모든 할 일";
  if (state.currentFilter === "today") title = "오늘 마감 일정 // DUE.TODAY";
  else if (state.currentFilter === "important") title = "중요 태스크 // PRIORITY.CRITICAL";
  else if (state.currentFilter === "completed") title = "완료된 아카이브 // ARCHIVE";
  else if (state.currentFilter.startsWith("cat:")) {
    const cat = state.currentFilter.replace("cat:", "");
    title = `SECTOR: ${cat}`;
  }

  if (state.searchQuery) {
    title = `SCAN_QUERY: "${state.searchQuery}"`;
  }

  elements.currentFilterTitle.textContent = title;
}

function createTaskCardHtml(task, isCompleted) {
  const priorityClass = `priority-${task.priority || "medium"}`;
  const priorityLabel = task.priority === "high" ? "CRIT [긴급]" : (task.priority === "low" ? "LOW [낮음]" : "MED [보통]");
  const priorityBadgeColor = task.priority === "high" 
    ? "bg-rose-950/80 text-rose-300 border border-rose-500/70"
    : (task.priority === "low" ? "bg-cyan-950/80 text-cyan-300 border border-cyan-500/70" : "bg-amber-950/80 text-amber-300 border border-amber-500/70");

  let dueDateBadge = "";
  if (task.dueDate) {
    const todayStr = new Date().toISOString().split("T")[0];
    const isOverdue = task.dueDate < todayStr && !task.completed;
    const isToday = task.dueDate === todayStr;
    const badgeBg = isOverdue 
      ? "bg-rose-950/90 text-rose-300 border border-rose-500 shadow-sm shadow-rose-900" 
      : (isToday ? "bg-neon-magenta/20 text-neon-magentaBright border border-neon-magenta shadow-sm shadow-neon-magenta/30" : "bg-cyber-bg text-slate-400 border border-cyber-border");
    const dDayText = isOverdue ? "OVERDUE [기한 초과]" : (isToday ? "DUE: TODAY [오늘 마감]" : `DUE: ${task.dueDate}`);
    
    dueDateBadge = `
      <span class="inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded ${badgeBg}">
        <i data-lucide="clock" class="w-3 h-3"></i> ${dDayText}
      </span>
    `;
  }

  let subtaskTag = "";
  if (task.subtasks && task.subtasks.length > 0) {
    const done = task.subtasks.filter(s => s.completed).length;
    subtaskTag = `
      <span class="inline-flex items-center gap-1 font-mono text-[10px] text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/40 px-2 py-0.5 rounded">
        <i data-lucide="check-square" class="w-3 h-3"></i> ${done}/${task.subtasks.length}
      </span>
    `;
  }

  return `
    <div id="card-${task.id}" data-task-id="${task.id}" class="task-item ${isCompleted ? 'task-completed' : ''} ${priorityClass} rounded-xl p-3 sm:p-3.5 flex items-center justify-between gap-3 transition-all group">
      
      <!-- Left: Checkbox + Content -->
      <div class="flex items-center gap-3 min-w-0 flex-1 cursor-pointer" onclick="openDetailModal('${task.id}')">
        <input type="checkbox" ${task.completed ? "checked" : ""} 
               onclick="event.stopPropagation(); toggleTaskCompletion('${task.id}', event)"
               class="task-checkbox flex-shrink-0"
               title="${task.completed ? '다시 진행 중으로 복원' : '임무 완료 처리 (뿅뿅 사운드!)'}">

        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <span class="task-title text-sm sm:text-base font-semibold text-slate-100 truncate ${task.completed ? 'line-through text-slate-500' : ''}">
              ${escapeHtml(task.title)}
            </span>
          </div>

          <!-- Badges & Meta Row -->
          <div class="flex flex-wrap items-center gap-2 mt-1.5 font-mono">
            <span class="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded ${priorityBadgeColor}">
              ${priorityLabel}
            </span>
            <span class="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded bg-cyber-bg border border-cyber-border text-slate-300">
              ${escapeHtml(task.category)}
            </span>
            ${dueDateBadge}
            ${subtaskTag}
            ${task.memo ? `<i data-lucide="file-text" class="w-3 h-3 text-neon-magenta/70" title="메모 기록 있음"></i>` : ""}
          </div>
        </div>
      </div>

      <!-- Right: Cyber Action Buttons -->
      <div class="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
        <button onclick="openDetailModal('${task.id}')" title="상세 정보 수정" 
                class="p-1.5 rounded-lg text-slate-400 hover:text-neon-cyan hover:bg-neon-cyan/10 border border-transparent hover:border-neon-cyan/40 transition">
          <i data-lucide="edit-3" class="w-4 h-4"></i>
        </button>
        <button onclick="deleteTask('${task.id}')" title="임무 삭제" 
                class="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-500/40 transition">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>

    </div>
  `;
}

// -------------------------------------------------------------
// Completed Section Toggle Behavior
// -------------------------------------------------------------
function updateCompletedSectionVisibility() {
  if (state.completedCollapsed) {
    elements.completedTasksContainer.classList.add("hidden");
    elements.completedChevronIcon.classList.remove("rotate-180");
  } else {
    elements.completedTasksContainer.classList.remove("hidden");
    elements.completedChevronIcon.classList.add("rotate-180");
  }
}

function toggleCompletedAccordion() {
  state.completedCollapsed = !state.completedCollapsed;
  saveData();
  updateCompletedSectionVisibility();
}

// -------------------------------------------------------------
// Task Actions (Create, Toggle, Edit, Delete)
// -------------------------------------------------------------
function handleQuickAdd(e) {
  e.preventDefault();
  const title = elements.taskInput.value.trim();
  if (!title) return;

  const newTask = {
    id: "task-" + Date.now(),
    title: title,
    completed: false,
    priority: elements.prioritySelect.value,
    dueDate: elements.dueDateInput.value || null,
    category: elements.categorySelect.value,
    memo: "",
    subtasks: [],
    createdAt: new Date().toISOString(),
    completedAt: null
  };

  state.tasks.unshift(newTask);
  saveData();
  elements.taskInput.value = "";

  // 띠링! 사운드 재생
  RetroAudio.playAdd();

  renderAll();
  showToast("NEW TASK REGISTERED // 신규 임무 등록 완료 ⚡");
}

function toggleTaskCompletion(taskId, event) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;

  task.completed = !task.completed;
  task.completedAt = task.completed ? new Date().toISOString() : null;

  // Visual pop animation on card
  const cardElem = document.getElementById(`card-${taskId}`);
  if (cardElem) {
    cardElem.classList.add("sound-pop");
  }

  // 뿅뿅 게임 사운드 재생!
  if (task.completed) {
    RetroAudio.playBbyong(); // 뿅! 뿅!
  } else {
    RetroAudio.playRestore(); // 뽀-용
  }

  saveData();

  // Small delay for smooth pop visual before re-render
  setTimeout(() => {
    renderAll();
  }, 100);

  if (task.completed) {
    showToast(`'${task.title}' 완료! [뿅뿅 사운드 🎮] 아카이브로 이동했습니다.`, () => {
      task.completed = false;
      task.completedAt = null;
      RetroAudio.playRestore();
      saveData();
      renderAll();
    });
  } else {
    showToast(`'${task.title}' 활성 임무로 복원되었습니다.`);
  }
}

function deleteTask(taskId) {
  const index = state.tasks.findIndex(t => t.id === taskId);
  if (index === -1) return;

  const removed = state.tasks.splice(index, 1)[0];
  state.lastDeletedTask = { task: removed, index };
  saveData();
  renderAll();

  showToast(`OBJECTIVE PURGED // 임무가 제거되었습니다.`, () => {
    state.tasks.splice(state.lastDeletedTask.index, 0, state.lastDeletedTask.task);
    saveData();
    renderAll();
  });
}

function clearAllCompleted() {
  const completedCount = state.tasks.filter(t => t.completed).length;
  if (completedCount === 0) return;

  if (!confirm(`완료된 임무 ${completedCount}개를 아카이브에서 영구 파기하시겠습니까?`)) {
    return;
  }

  state.tasks = state.tasks.filter(t => !t.completed);
  saveData();
  renderAll();
  showToast("ARCHIVE PURGE COMPLETE // 모든 완료 기록이 정리되었습니다.");
}

// -------------------------------------------------------------
// Detail Modal Management
// -------------------------------------------------------------
window.openDetailModal = function(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;

  state.editingTaskId = taskId;
  elements.editTaskId.value = task.id;
  elements.editTitle.value = task.title;
  elements.editPriority.value = task.priority;
  elements.editDueDate.value = task.dueDate || "";
  elements.editCategory.value = task.category;
  elements.editMemo.value = task.memo || "";

  const created = new Date(task.createdAt).toLocaleString("ko-KR", { dateStyle: "medium", timeStyle: "short" });
  elements.createdDateText.textContent = `INIT: ${created}`;

  if (task.completedAt) {
    const doneDate = new Date(task.completedAt).toLocaleString("ko-KR", { dateStyle: "medium", timeStyle: "short" });
    elements.completedDateText.textContent = `COMPLETED: ${doneDate}`;
  } else {
    elements.completedDateText.textContent = "STATUS: ACTIVE // IN PROGRESS";
  }

  renderSubtasks(task.subtasks || []);

  elements.detailModal.classList.remove("hidden");
  if (window.lucide) lucide.createIcons();
};

function closeDetailModal() {
  elements.detailModal.classList.add("hidden");
  state.editingTaskId = null;
}

function handleSaveDetail(e) {
  e.preventDefault();
  const task = state.tasks.find(t => t.id === state.editingTaskId);
  if (!task) return;

  task.title = elements.editTitle.value.trim();
  task.priority = elements.editPriority.value;
  task.dueDate = elements.editDueDate.value || null;
  task.category = elements.editCategory.value;
  task.memo = elements.editMemo.value.trim();

  saveData();
  renderAll();
  closeDetailModal();
  showToast("SPECS UPDATED // 변경사항이 저장되었습니다.");
}

// Subtask Logic
function renderSubtasks(subtasks) {
  const done = subtasks.filter(s => s.completed).length;
  elements.subtaskProgress.textContent = `${done}/${subtasks.length}`;

  elements.subtaskList.innerHTML = subtasks
    .map(sub => `
      <div class="flex items-center justify-between gap-2 p-2 rounded-lg bg-cyber-bg border border-cyber-border text-xs">
        <label class="flex items-center gap-2 cursor-pointer flex-1 min-w-0 font-sans">
          <input type="checkbox" ${sub.completed ? "checked" : ""} 
                 onchange="toggleSubtask('${sub.id}')"
                 class="task-checkbox flex-shrink-0">
          <span class="${sub.completed ? 'line-through text-slate-500' : 'text-slate-200'} truncate font-mono">${escapeHtml(sub.text)}</span>
        </label>
        <button type="button" onclick="deleteSubtask('${sub.id}')" class="text-slate-500 hover:text-rose-400 p-1">
          <i data-lucide="x" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    `)
    .join("");

  if (window.lucide) lucide.createIcons();
}

window.toggleSubtask = function(subId) {
  const task = state.tasks.find(t => t.id === state.editingTaskId);
  if (!task || !task.subtasks) return;

  const sub = task.subtasks.find(s => s.id === subId);
  if (sub) {
    sub.completed = !sub.completed;
    if (sub.completed) {
      RetroAudio.playSubBbyong(); // 미니 뿅!
    } else {
      RetroAudio.playRestore();
    }
    saveData();
    renderSubtasks(task.subtasks);
  }
};

window.deleteSubtask = function(subId) {
  const task = state.tasks.find(t => t.id === state.editingTaskId);
  if (!task || !task.subtasks) return;

  task.subtasks = task.subtasks.filter(s => s.id !== subId);
  saveData();
  renderSubtasks(task.subtasks);
};

function handleAddSubtask() {
  const text = elements.newSubtaskInput.value.trim();
  if (!text) return;

  const task = state.tasks.find(t => t.id === state.editingTaskId);
  if (!task) return;

  if (!task.subtasks) task.subtasks = [];
  task.subtasks.push({
    id: "sub-" + Date.now(),
    text: text,
    completed: false
  });

  elements.newSubtaskInput.value = "";
  RetroAudio.playAdd();
  saveData();
  renderSubtasks(task.subtasks);
}

// -------------------------------------------------------------
// Category & Filter Management
// -------------------------------------------------------------
function handleAddCategory() {
  const newCat = prompt("새로운 섹터(카테고리) 명칭을 입력하십시오 (예: 사이버덱, 암호화, 네트워크):");
  if (!newCat || !newCat.trim()) return;

  const trimmed = newCat.trim();
  if (state.categories.includes(trimmed)) {
    alert("이미 등록된 섹터입니다.");
    return;
  }

  state.categories.push(trimmed);
  saveData();
  renderAll();
  showToast(`SECTOR REGISTERED: '${trimmed}'`);
}

function handleFilterClick(e) {
  const navBtn = e.target.closest("button[data-filter]");
  if (!navBtn) return;

  const filter = navBtn.getAttribute("data-filter");
  state.currentFilter = filter;

  elements.navItems.forEach(item => item.classList.remove("active"));
  document.querySelectorAll("#categoryNavList button").forEach(item => item.classList.remove("active"));
  navBtn.classList.add("active");

  closeMobileSidebar();
  renderTasks();
}

// -------------------------------------------------------------
// Stats & Data Backup
// -------------------------------------------------------------
function openStatsModal() {
  const total = state.tasks.length;
  const completed = state.tasks.filter(t => t.completed).length;
  const active = total - completed;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  elements.statsPercent.textContent = `${percent}%`;
  elements.statsProgressBar.style.width = `${percent}%`;
  elements.statsActiveCount.textContent = active;
  elements.statsCompletedCount.textContent = completed;

  elements.statsModal.classList.remove("hidden");
  if (window.lucide) lucide.createIcons();
}

function exportDataAsJson() {
  const backup = {
    version: "2.0-CYBER",
    exportDate: new Date().toISOString(),
    tasks: state.tasks,
    categories: state.categories
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `cyber_taskflow_${new Date().toISOString().split("T")[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function importDataFromJson(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      if (Array.isArray(data.tasks)) {
        state.tasks = data.tasks;
        if (Array.isArray(data.categories)) {
          state.categories = data.categories;
        }
        saveData();
        renderAll();
        showToast("CORE RESTORE COMPLETE // 데이터 복원 완료");
        elements.statsModal.classList.add("hidden");
      } else {
        alert("유효하지 않은 백업 프로토콜 형식입니다.");
      }
    } catch (err) {
      alert("JSON 파싱 에러 발생");
    }
  };
  reader.readAsText(file);
}

function resetAllData() {
  if (confirm("경고: 코어 메모리를 초기화하면 모든 임무가 영구 삭제됩니다. 진행하시겠습니까?")) {
    state.tasks = [];
    saveData();
    renderAll();
    elements.statsModal.classList.add("hidden");
    showToast("CORE PURGED // 모든 데이터가 초기화되었습니다.");
  }
}

// -------------------------------------------------------------
// Toast Notifications
// -------------------------------------------------------------
let toastTimer = null;
function showToast(message, undoCallback = null) {
  if (toastTimer) clearTimeout(toastTimer);

  elements.toastMessage.textContent = message;
  elements.toast.classList.remove("hidden");
  elements.toast.classList.add("flex");

  if (undoCallback) {
    elements.toastUndoBtn.classList.remove("hidden");
    elements.toastUndoBtn.onclick = () => {
      undoCallback();
      elements.toast.classList.add("hidden");
      elements.toast.classList.remove("flex");
    };
  } else {
    elements.toastUndoBtn.classList.add("hidden");
  }

  if (window.lucide) lucide.createIcons();

  toastTimer = setTimeout(() => {
    elements.toast.classList.add("hidden");
    elements.toast.classList.remove("flex");
  }, 4000);
}

// -------------------------------------------------------------
// Event Listeners & Setup
// -------------------------------------------------------------
function setupEventListeners() {
  // Sound FX Toggles
  if (elements.soundToggleBtn) {
    elements.soundToggleBtn.addEventListener("click", toggleSound);
  }
  if (elements.mobileSoundToggleBtn) {
    elements.mobileSoundToggleBtn.addEventListener("click", toggleSound);
  }

  // Mobile Sidebar
  elements.mobileMenuBtn.addEventListener("click", openMobileSidebar);
  elements.sidebarBackdrop.addEventListener("click", closeMobileSidebar);

  // Filter Delegation
  document.addEventListener("click", (e) => {
    if (e.target.closest("button[data-filter]")) {
      handleFilterClick(e);
    }
  });

  // Quick Add Form
  elements.quickAddForm.addEventListener("submit", handleQuickAdd);

  // Completed Accordion Toggle
  elements.toggleCompletedBtn.addEventListener("click", toggleCompletedAccordion);
  elements.clearCompletedBtn.addEventListener("click", clearAllCompleted);

  // Search Input
  elements.searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    if (state.searchQuery) {
      elements.clearSearchBtn.classList.remove("hidden");
    } else {
      elements.clearSearchBtn.classList.add("hidden");
    }
    renderTasks();
  });

  elements.clearSearchBtn.addEventListener("click", () => {
    state.searchQuery = "";
    elements.searchInput.value = "";
    elements.clearSearchBtn.classList.add("hidden");
    renderTasks();
  });

  // Sort Select
  elements.sortSelect.addEventListener("change", (e) => {
    state.sortBy = e.target.value;
    renderTasks();
  });

  // Add Category
  elements.addCategoryBtn.addEventListener("click", handleAddCategory);

  // Detail Modal Actions
  elements.closeDetailModal.addEventListener("click", closeDetailModal);
  elements.cancelModalBtn.addEventListener("click", closeDetailModal);
  elements.detailForm.addEventListener("submit", handleSaveDetail);
  elements.addSubtaskBtn.addEventListener("click", handleAddSubtask);
  elements.newSubtaskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSubtask();
    }
  });
  elements.deleteTaskFromModal.addEventListener("click", () => {
    if (state.editingTaskId) {
      deleteTask(state.editingTaskId);
      closeDetailModal();
    }
  });

  // Stats Modal
  elements.statsModalBtn.addEventListener("click", openStatsModal);
  elements.closeStatsModal.addEventListener("click", () => elements.statsModal.classList.add("hidden"));
  elements.exportJsonBtn.addEventListener("click", exportDataAsJson);
  elements.importJsonInput.addEventListener("change", importDataFromJson);
  elements.resetAllDataBtn.addEventListener("click", resetAllData);

  // Close modals on ESC
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDetailModal();
      elements.statsModal.classList.add("hidden");
    }
  });
}

function openMobileSidebar() {
  elements.sidebar.classList.remove("-translate-x-full");
  elements.sidebarBackdrop.classList.remove("hidden");
}

function closeMobileSidebar() {
  elements.sidebar.classList.add("-translate-x-full");
  elements.sidebarBackdrop.classList.add("hidden");
}

// Utility: XSS prevention
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", initApp);
