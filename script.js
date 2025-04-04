const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const prioritySelect = document.getElementById('priority');
const taskList = document.getElementById('task-list');
const themeToggle = document.getElementById('theme-toggle');
const languageSelect = document.getElementById('language-select');
const quoteText = document.getElementById('quote-text');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentLang = localStorage.getItem('language') || 'fa';

// نقل‌قول‌ها
const quotes = [
  { text: "زندگی کوتاه‌تر از آن است که به نفرت بگذرد.", author: "سعدی", lang: "fa" },
  { text: "Life is too short to be spent in hatred.", author: "Saadi", lang: "en" },
  { text: "خودت باش، بقیه نقش‌ها قبلاً گرفته شده.", author: "اسکار وایلد", lang: "fa" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde", lang: "en" },
  { text: "تنها راه انجام کارهای بزرگ، دوست داشتن آن است.", author: "استیو جابز", lang: "fa" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", lang: "en" },
  { text: "آرامش در درک محدودیت‌هاست.", author: "افلاطون", lang: "fa" },
  { text: "Peace is in understanding limitations.", author: "Plato", lang: "en" },
  { text: "جهان آیینه‌ای است که افکار ما را بازمی‌تاباند.", author: "خیام", lang: "fa" },
  { text: "The world is a mirror reflecting our thoughts.", author: "Khayyam", lang: "en" },
  { text: "شادی در داشتن نیست، در بودن است.", author: "سنeca", lang: "fa" },
  { text: "Happiness is not in having, but in being.", author: "Seneca", lang: "en" },
  { text: "هر روز فرصتی برای شروع دوباره است.", author: "گوته", lang: "fa" },
  { text: "Every day is a chance to begin again.", author: "Goethe", lang: "en" },
  { text: "عقل، چراغ راه زندگی است.", author: "مولوی", lang: "fa" },
  { text: "Reason is the lamp of life’s path.", author: "Rumi", lang: "en" },
  { text: "آنچه نمی‌توانی تغییر دهی را بپذیر.", author: "اپیکتتوس", lang: "fa" },
  { text: "Accept what you cannot change.", author: "Epictetus", lang: "en" },
  { text: "موفقیت، نتیجه تلاش مداوم است.", author: "کنفوسیوس", lang: "fa" },
  { text: "Success is the result of persistent effort.", author: "Confucius", lang: "en" },
  // می‌تونی تعداد بیشتری اضافه کنی!
];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.classList.add('task-item', task.priority);
    li.draggable = true;
    li.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
      <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
      <button data-lang="delete-btn" onclick="deleteTask(${index})">${currentLang === 'fa' ? 'حذف' : 'Delete'}</button>
    `;
    taskList.appendChild(li);
  });
  addDragAndDrop();
}

function addTask(text, priority) {
  tasks.push({ text, priority, completed: false });
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  const item = taskList.children[index];
  item.style.animation = 'fadeOut 0.4s ease forwards';
  setTimeout(() => {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }, 400);
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function addDragAndDrop() {
  const items = taskList.querySelectorAll('.task-item');
  items.forEach(item => {
    item.addEventListener('dragstart', () => item.classList.add('dragging'));
    item.addEventListener('dragend', () => item.classList.remove('dragging'));
  });

  taskList.addEventListener('dragover', (e) => {
    e.preventDefault();
    const draggingItem = taskList.querySelector('.dragging');
    const siblings = [...taskList.querySelectorAll('.task-item:not(.dragging)')];
    const nextSibling = siblings.find(sibling => 
      e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2
    );
    taskList.insertBefore(draggingItem, nextSibling);
  });

  taskList.addEventListener('drop', () => {
    const newOrder = [...taskList.querySelectorAll('.task-item')].map(item => {
      const index = tasks.findIndex(t => t.text === item.querySelector('span').textContent);
      return tasks[index];
    });
    tasks = newOrder;
    saveTasks();
  });
}

// مدیریت زبان
const translations = {
  fa: {
    title: "لیست کارهای من",
    placeholder: "تسک جدید رو بنویس...",
    "priority-low": "کم",
    "priority-medium": "متوسط",
    "priority-high": "زیاد",
    "add-btn": "اضافه کن",
    "delete-btn": "حذف"
  },
  en: {
    title: "My To-Do List",
    placeholder: "Write a new task...",
    "priority-low": "Low",
    "priority-medium": "Medium",
    "priority-high": "High",
    "add-btn": "Add",
    "delete-btn": "Delete"
  }
};

function updateLanguage() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll('[data-lang]').forEach(element => {
    const key = element.getAttribute('data-lang');
    element.textContent = translations[currentLang][key] || element.textContent;
    if (element.tagName === 'INPUT' && key === 'placeholder') {
      element.placeholder = translations[currentLang][key];
    }
  });
  renderTasks(); // برای به‌روزرسانی دکمه‌های حذف
}

languageSelect.value = currentLang;
languageSelect.addEventListener('change', () => {
  currentLang = languageSelect.value;
  localStorage.setItem('language', currentLang);
  updateLanguage();
});

// نقل‌قول تصادفی
function displayRandomQuote() {
  const availableQuotes = quotes.filter(q => q.lang === currentLang);
  const randomQuote = availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
  quoteText.textContent = `«${randomQuote.text}» - ${randomQuote.author}`;
}

setInterval(displayRandomQuote, 10000);
displayRandomQuote();

// رویدادها
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  const priority = prioritySelect.value;
  if (taskText) {
    addTask(taskText, priority);
    taskInput.value = '';
  }
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  themeToggle.textContent = '☀️';
}

// انیمیشن حذف
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes fadeOut {
    0% { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(0.9); }
  }
`, styleSheet.cssRules.length);

updateLanguage();
renderTasks();