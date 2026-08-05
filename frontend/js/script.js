// =============================================
//  BLOG APP - MAIN SCRIPT
// =============================================

// --- HAMBURGER MENU ---
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// --- TOAST NOTIFICATION ---
function showToast(message, duration = 3000) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// =============================================
//  LOGIN PAGE
// =============================================
const loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    const email    = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');

    // Clear previous errors
    clearError(email);
    clearError(password);

    if (!email.value.trim() || !isValidEmail(email.value)) {
      showError(email, 'Please enter a valid email address.');
      valid = false;
    }
    if (!password.value || password.value.length < 6) {
      showError(password, 'Password must be at least 6 characters.');
      valid = false;
    }

    if (valid) {
      showToast('Logging you in… ✓');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1200);
    }
  });
}

// =============================================
//  REGISTER PAGE
// =============================================
const registerForm = document.getElementById('registerForm');

if (registerForm) {
  // Live character count for username
  const usernameInput = document.getElementById('regUsername');
  const usernameCount = document.getElementById('usernameCount');
  if (usernameInput && usernameCount) {
    usernameInput.addEventListener('input', () => {
      usernameCount.textContent = `${usernameInput.value.length}/30`;
    });
  }

  registerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    const name     = document.getElementById('regName');
    const username = document.getElementById('regUsername');
    const email    = document.getElementById('regEmail');
    const password = document.getElementById('regPassword');
    const confirm  = document.getElementById('regConfirm');

    [name, username, email, password, confirm].forEach(clearError);

    if (!name.value.trim()) {
      showError(name, 'Full name is required.'); valid = false;
    }
    if (!username.value.trim() || username.value.length < 3) {
      showError(username, 'Username must be at least 3 characters.'); valid = false;
    }
    if (!email.value.trim() || !isValidEmail(email.value)) {
      showError(email, 'Please enter a valid email address.'); valid = false;
    }
    if (!password.value || password.value.length < 6) {
      showError(password, 'Password must be at least 6 characters.'); valid = false;
    }
    if (confirm.value !== password.value) {
      showError(confirm, 'Passwords do not match.'); valid = false;
    }

    if (valid) {
      showToast('Account created! Redirecting… ✓');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1400);
    }
  });
}

// =============================================
//  DASHBOARD PAGE
// =============================================
const deleteButtons = document.querySelectorAll('.delete-post');

deleteButtons.forEach(btn => {
  btn.addEventListener('click', function () {
    const row = this.closest('.post-row');
    if (confirm('Delete this post?')) {
      row.style.transition = 'opacity 0.3s';
      row.style.opacity = '0';
      setTimeout(() => row.remove(), 300);
      showToast('Post deleted.');
    }
  });
});

// =============================================
//  CREATE BLOG PAGE
// =============================================
const blogForm   = document.getElementById('blogForm');
const titleInput = document.getElementById('blogTitle');
const titleCount = document.getElementById('titleCount');
const bodyInput  = document.getElementById('blogBody');
const bodyCount  = document.getElementById('bodyCount');

if (titleInput && titleCount) {
  titleInput.addEventListener('input', () => {
    titleCount.textContent = `${titleInput.value.length}/120`;
  });
}

if (bodyInput && bodyCount) {
  bodyInput.addEventListener('input', () => {
    bodyCount.textContent = `${bodyInput.value.length} characters`;
  });
}

if (blogForm) {
  blogForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    const title    = document.getElementById('blogTitle');
    const category = document.getElementById('blogCategory');
    const body     = document.getElementById('blogBody');

    [title, category, body].forEach(clearError);

    if (!title.value.trim()) {
      showError(title, 'Please add a title.'); valid = false;
    }
    if (!category.value) {
      showError(category, 'Please select a category.'); valid = false;
    }
    if (!body.value.trim() || body.value.trim().length < 50) {
      showError(body, 'Content must be at least 50 characters.'); valid = false;
    }

    if (valid) {
      showToast('Blog post published! ✓');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);
    }
  });

  // Save as Draft button
  const draftBtn = document.getElementById('saveDraft');
  if (draftBtn) {
    draftBtn.addEventListener('click', () => {
      showToast('Saved as draft.');
    });
  }
}

// =============================================
//  HELPERS
// =============================================
function showError(input, message) {
  input.classList.add('error');
  const errEl = input.parentElement.querySelector('.error-msg');
  if (errEl) {
    errEl.textContent = message;
    errEl.style.display = 'block';
  }
}

function clearError(input) {
  input.classList.remove('error');
  const errEl = input.parentElement.querySelector('.error-msg');
  if (errEl) {
    errEl.style.display = 'none';
    errEl.textContent = '';
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}