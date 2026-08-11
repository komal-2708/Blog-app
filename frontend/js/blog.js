
// =============================================
//  CREATE BLOG PAGE - Save post to API
// =============================================
 
const API = 'http://localhost:5000/api';
 
// Character counters
const titleInput = document.getElementById('blogTitle');
const titleCount = document.getElementById('titleCount');
const bodyInput  = document.getElementById('blogBody');
const bodyCount  = document.getElementById('bodyCount');
 
if (titleInput) {
  titleInput.addEventListener('input', () => {
    titleCount.textContent = `${titleInput.value.length}/120`;
  });
}
 
if (bodyInput) {
  bodyInput.addEventListener('input', () => {
    bodyCount.textContent = `${bodyInput.value.length} characters`;
  });
}
 
// Submit form — save to Supabase via API
const blogForm = document.getElementById('blogForm');
 
if (blogForm) {
  blogForm.addEventListener('submit', async function (e) {
    e.preventDefault();
 
    const title    = document.getElementById('blogTitle');
    const category = document.getElementById('blogCategory');
    const body     = document.getElementById('blogBody');
    const status   = document.getElementById('blogStatus');
    const publishBtn = document.getElementById('publishBtn');
 
    // Clear errors
    [title, category, body].forEach(el => {
      el.classList.remove('error');
      const err = el.parentElement.querySelector('.error-msg');
      if (err) err.style.display = 'none';
    });
 
    // Validate
    let valid = true;
 
    if (!title.value.trim()) {
      showFieldError(title, 'Please add a title.'); valid = false;
    }
    if (!category.value) {
      showFieldError(category, 'Please select a category.'); valid = false;
    }
    if (!body.value.trim() || body.value.trim().length < 50) {
      showFieldError(body, 'Content must be at least 50 characters.'); valid = false;
    }
 
    if (!valid) return;
 
    // Disable button while saving
    publishBtn.disabled = true;
    publishBtn.textContent = 'Publishing…';
 
    try {
      const response = await fetch(`${API}/blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title:    title.value.trim(),
          category: category.value,
          body:     body.value.trim(),
          status:   status.value,
          author:   'Komal'   // Module 6 will replace with logged-in user
        })
      });
 
      const data = await response.json();
 
      if (!response.ok) {
        showToast('Error: ' + data.error);
        publishBtn.disabled = false;
        publishBtn.textContent = '🚀 Publish Post';
        return;
      }
 
      showToast('Blog published successfully! ✓');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1400);
 
    } catch (error) {
      showToast('Server error. Make sure the backend is running.');
      publishBtn.disabled = false;
      publishBtn.textContent = '🚀 Publish Post';
    }
  });
 
  // Save as draft button
  const draftBtn = document.getElementById('saveDraft');
  if (draftBtn) {
    draftBtn.addEventListener('click', async () => {
      const title    = document.getElementById('blogTitle').value.trim();
      const category = document.getElementById('blogCategory').value;
      const body     = document.getElementById('blogBody').value.trim();
 
      if (!title || !body) {
        showToast('Add a title and content before saving draft.');
        return;
      }
 
      try {
        await fetch(`${API}/blogs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            category: category || 'other',
            body,
            status: 'draft',
            author: 'Komal'
          })
        });
        showToast('Saved as draft.');
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 1400);
      } catch {
        showToast('Server error. Try again.');
      }
    });
  }
}
 
function showFieldError(input, message) {
  input.classList.add('error');
  const errEl = input.parentElement.querySelector('.error-msg');
  if (errEl) {
    errEl.textContent = message;
    errEl.style.display = 'block';
  }
}
 
