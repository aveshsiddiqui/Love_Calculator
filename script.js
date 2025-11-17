// messages map
const messages = {
  0: "Start by entering both names!",
  20: "Maybe next time! 💔",
  40: "There's some potential here! 💑",
  60: "Great compatibility! 💗",
  80: "Amazing match! 🔥❤",
  100: "Perfect match! 👰💒"
};

// helper: stable 32-bit-ish hash
function safeHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // force to 32-bit integer
  }
  return hash;
}

// ripple effect creator
function createRipple(btn, clientX = null, clientY = null) {
  const rect = btn.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'ripple';

  const x = (typeof clientX === 'number') ? clientX - rect.left : rect.width / 2;
  const y = (typeof clientY === 'number') ? clientY - rect.top : rect.height / 2;

  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  btn.appendChild(ripple);

  // remove ripple after animation finishes
  setTimeout(() => {
    ripple.remove();
  }, 700);
}

// main calculate function
function calculateLove(e) {
  if (e && e.preventDefault) e.preventDefault();

  const name1 = document.getElementById('name1').value.trim();
  const name2 = document.getElementById('name2').value.trim();

  if (!name1 || !name2) {
    alert('Please enter both names!');
    return;
  }

  // get button reference and create ripple (works for click or keyboard)
  const btn = document.getElementById('calcBtn');
  const clientX = e && e.clientX ? e.clientX : null;
  const clientY = e && e.clientY ? e.clientY : null;
  createRipple(btn, clientX, clientY);

  // compute percentage
  const combined = (name1 + name2).toLowerCase();
  const hash = safeHash(combined);
  const percentage = Math.abs(hash % 101);

  // show result with slight delay for ripple
  setTimeout(() => displayResult(percentage, name1, name2), 300);
}

// display result
function displayResult(percentage, name1, name2) {
  const result = document.getElementById('result');
  const percentageEl = document.getElementById('percentage');
  const messageEl = document.getElementById('message');
  const namesEl = document.getElementById('names');
  const progressFill = document.getElementById('progressFill');

  let message = messages[20]; // default
  if (percentage >= 80) message = messages[100];
  else if (percentage >= 60) message = messages[80];
  else if (percentage >= 40) message = messages[60];
  else if (percentage >= 20) message = messages[40];
  else message = messages[20];

  percentageEl.textContent = percentage + '%';
  messageEl.textContent = message;
  namesEl.textContent = `${name1} ❤️ ${name2}`;

  // animate progress bar
  progressFill.style.width = percentage + '%';

  result.classList.add('show');
}

// reset view
function reset() {
  document.getElementById('name1').value = '';
  document.getElementById('name2').value = '';
  document.getElementById('result').classList.remove('show');
  document.getElementById('percentage').textContent = '0%';
  document.getElementById('progressFill').style.width = '0%';
  document.getElementById('name1').focus();
}

// dark mode toggle
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const pressed = document.body.classList.contains('dark-mode');
  const darkToggle = document.getElementById('darkToggle');
  if (darkToggle) darkToggle.setAttribute('aria-pressed', pressed);
  localStorage.setItem('darkMode', pressed);
}

// keyboard handler for inputs (Enter triggers calculate)
function handleKeyPress(e) {
  if (e.key === 'Enter') document.getElementById('calcBtn').click();
}

// --- event bindings (call once after DOM ready) ---
window.addEventListener('load', () => {
  // restore dark mode from localStorage
  if (localStorage.getItem('darkMode') === 'true') document.body.classList.add('dark-mode');

  // focus first input
  const name1 = document.getElementById('name1');
  if (name1) name1.focus();
});

// attach listeners (safe even if script loads in head after DOM ready)
document.addEventListener('DOMContentLoaded', () => {
  const calcBtn = document.getElementById('calcBtn');
  const resetBtn = document.getElementById('resetBtn');
  const darkToggle = document.getElementById('darkToggle');
  const themeBtn = document.getElementById('themeBtn');
  const colorPicker = document.getElementById('colorPicker');

  if (calcBtn) calcBtn.addEventListener('click', calculateLove);
  if (resetBtn) resetBtn.addEventListener('click', reset);
  if (darkToggle) darkToggle.addEventListener('click', toggleDarkMode);
  if (themeBtn && colorPicker) themeBtn.addEventListener('click', () => colorPicker.classList.toggle('show'));

  // delegate color option clicks
  if (colorPicker) {
    colorPicker.addEventListener('click', (e) => {
      const opt = e.target.closest('.color-option');
      if (!opt) return;
      // apply theme stored in data attributes (example: data-primary, data-secondary)
      const primary = opt.dataset.primary;
      const secondary = opt.dataset.secondary;
      if (primary) document.documentElement.style.setProperty('--primary', primary);
      if (secondary) document.documentElement.style.setProperty('--secondary', secondary);

      // mark selection
      document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      localStorage.setItem('theme', JSON.stringify({ primary, secondary, name: opt.dataset.name }));
    });
  }

  // allow Enter key on inputs
  document.querySelectorAll('input').forEach(inp => inp.addEventListener('keypress', handleKeyPress));

  // small touch support
  document.addEventListener('touchend', (e) => {
    const calcBtnEl = document.getElementById('calcBtn');
    if (e.target === calcBtnEl) calcBtnEl.style.transform = 'scale(1)';
  });
});
