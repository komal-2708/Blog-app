const API = '/api';

// Block this page if no user is logged in.
if (!requireAuth()) {
  throw new Error('Authentication required');
}

const titleInput = document.getElementById('blogTitle');
const categoryInput = document.getElementById('blogCategory');
const bodyInput = document.getElementById('blogBody');
const statusInput = document.getElementById('blogStatus');

const titleCount = document.getElementById('titleCount');
const bodyCount = document.getElementById('bodyCount');

titleInput.addEventListener('input', () => {
  titleCount.textContent = `${titleInput.value.length}/120`;
});

bodyInput.addEventListener('input', () => {
  bodyCount.textContent = `${bodyInput.value.length} characters`;
});

function getBlogValues() {
  return {
    title: titleInput.value.trim(),
    category: categoryInput.value,
    body: bodyInput.value.trim()
  };
}

function validateBlog(values, isDraft = false) {
  [titleInput, categoryInput, bodyInput].forEach(clearError);

  let valid = true;

  if (!values.title) {
    showError(titleInput, 'Please add a title.');
    valid = false;
  }

  if (!values.category && !isDraft) {
    showError(categoryInput, 'Please select a category.');
    valid = false;
  }

  if (!values.body) {
    showError(bodyInput, 'Please add content.');
    valid = false;
  } else if (!isDraft && values.body.length < 50) {
    showError(bodyInput, 'Content must be at least 50 characters.');
    valid = false;
  }

  return valid;
}

async function saveBlog(status) {
  const values = getBlogValues();
  const isDraft = status === 'draft';

  if (!validateBlog(values, isDraft)) {
    return;
  }

  try {
    const response = await authFetch(`${API}/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: values.title,
        category: values.category || 'other',
        body: values.body,
        status
      })
    });

    const data = await response.json();

    if (!response.ok) {
      showToast(data.error || 'Could not save the post.');
      return;
    }

    showToast(
      status === 'draft'
        ? 'Draft saved successfully!'
        : 'Blog published successfully!'
    );

    setTimeout(() => {
      window.location.replace('dashboard.html');
    }, 900);
  } catch (error) {
    showToast('Server error. Make sure the backend is running.');
  }
}

// PUBLISH OR SAVE ACCORDING TO DROPDOWN
const blogForm = document.getElementById('blogForm');

blogForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  await saveBlog(statusInput.value);
});

// SAVE DRAFT BUTTON
const saveDraftButton = document.getElementById('saveDraft');

saveDraftButton.addEventListener('click', async () => {
  await saveBlog('draft');
});