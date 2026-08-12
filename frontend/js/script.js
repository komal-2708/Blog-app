const API_BASE = '/api';

// SESSION HELPERS
function getAuthToken() {
  return localStorage.getItem('blogToken');
}

function saveSession(token, user) {
  localStorage.setItem('blogToken', token);
  localStorage.setItem('blogUser', JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem('blogToken');
  localStorage.removeItem('blogUser');
}

function requireAuth() {
  if (!getAuthToken()) {
    window.location.replace('login.html');
    return false;
  }

  return true;
}

async function authFetch(url, options = {}) {
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${getAuthToken()}`
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (response.status === 401) {
    clearSession();
    window.location.replace('login.html');
  }

  return response;
}

// HAMBURGER MENU
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

// TOAST MESSAGE
function showToast(message, duration = 3000) {
  const toast = document.querySelector('.toast');

  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// FORM ERROR HELPERS
function showError(input, message) {
  input.classList.add('error');

  const errorMessage = input.parentElement.querySelector('.error-msg');

  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
  }
}

function clearError(input) {
  input.classList.remove('error');

  const errorMessage = input.parentElement.querySelector('.error-msg');

  if (errorMessage) {
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

// LOGOUT
const logoutLink = document.getElementById('logoutLink');

if (logoutLink) {
  logoutLink.addEventListener('click', (event) => {
    event.preventDefault();

    clearSession();
    window.location.replace('login.html');
  });
}

// LOGIN
const loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');

    clearError(email);
    clearError(password);

    let valid = true;

    if (!isValidEmail(email.value.trim())) {
      showError(email, 'Please enter a valid email address.');
      valid = false;
    }

    if (!isStrongPassword(password.value)) {
  showError(
    password,
    'Password needs 6+ characters, uppercase, lowercase, number, and special symbol.'
  );
  valid = false;
}

    if (!valid) return;

    try {
      const response = await fetch(`${API_BASE}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email.value.trim(),
          password: password.value
        })
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.error || 'Login failed.');
        return;
      }

      saveSession(data.token, data.user);
      window.location.replace('dashboard.html');
    } catch (error) {
      showToast('Server error. Make sure the backend is running.');
    }
  });
}

// REGISTER
const registerForm = document.getElementById('registerForm');

if (registerForm) {
  const username = document.getElementById('regUsername');
  const usernameCount = document.getElementById('usernameCount');

  username.addEventListener('input', () => {
    usernameCount.textContent = `${username.value.length}/30`;
  });

  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('regName');
    const email = document.getElementById('regEmail');
    const password = document.getElementById('regPassword');
    const confirmPassword = document.getElementById('regConfirm');

    [name, username, email, password, confirmPassword].forEach(clearError);

    let valid = true;

    if (!name.value.trim()) {
      showError(name, 'Full name is required.');
      valid = false;
    }

    if (username.value.trim().length < 3) {
      showError(username, 'Username must be at least 3 characters.');
      valid = false;
    }

    if (!isValidEmail(email.value.trim())) {
      showError(email, 'Please enter a valid email address.');
      valid = false;
    }

    if (password.value.length < 6) {
      showError(password, 'Password must be at least 6 characters.');
      valid = false;
    }

    if (password.value !== confirmPassword.value) {
      showError(confirmPassword, 'Passwords do not match.');
      valid = false;
    }

    if (!valid) return;

    try {
      const response = await fetch(`${API_BASE}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name.value.trim(),
          username: username.value.trim(),
          email: email.value.trim(),
          password: password.value
        })
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.error || 'Registration failed.');
        return;
      }

      saveSession(data.token, data.user);
      window.location.replace('dashboard.html');
    } catch (error) {
      showToast('Server error. Make sure the backend is running.');
    }
  });
}