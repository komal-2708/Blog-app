const API = '/api';

let allBlogs = [];

// Protect dashboard page.
if (!requireAuth()) {
  throw new Error('Authentication required');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => {
    const characters = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    };

    return characters[character];
  });
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function createPostRow(blog) {
  const badgeClass =
    blog.status === 'published'
      ? 'badge-published'
      : 'badge-draft';

  const badgeText =
    blog.status === 'published'
      ? 'Published'
      : 'Draft';

  return `
    <div class="post-row" id="row-${blog.id}">
      <span class="post-row-title">${escapeHtml(blog.title)}</span>
      <span class="badge ${badgeClass}">${badgeText}</span>
      <span class="post-row-date">${formatDate(blog.created_at)}</span>

      <div class="post-row-actions">
        <button
          class="btn btn-outline btn-sm"
          onclick="openEditModal('${blog.id}')"
        >
          Edit
        </button>

        <button
          class="btn btn-danger btn-sm"
          onclick="deletePost('${blog.id}')"
        >
          Delete
        </button>
      </div>
    </div>
  `;
}

async function loadDashboard() {
  const loading = document.getElementById('dashLoading');
  const postsList = document.getElementById('postsList');
  const emptyState = document.getElementById('dashEmpty');

  const currentUser = JSON.parse(
    localStorage.getItem('blogUser') || '{}'
  );

  const greeting = document.getElementById('userGreeting');

  if (greeting) {
    greeting.textContent = `Hello, ${
      currentUser.name || currentUser.username || 'Writer'
    }!`;
  }

  try {
    const response = await authFetch(`${API}/blogs/mine`);

    if (!response.ok) {
      return;
    }

    allBlogs = await response.json();

    loading.style.display = 'none';

    document.getElementById('totalPosts').textContent =
      allBlogs.length;

    document.getElementById('publishedPosts').textContent =
      allBlogs.filter((blog) => blog.status === 'published').length;

    document.getElementById('draftPosts').textContent =
      allBlogs.filter((blog) => blog.status === 'draft').length;

    if (allBlogs.length === 0) {
      emptyState.style.display = 'block';
      postsList.innerHTML = '';
      return;
    }

    emptyState.style.display = 'none';
    postsList.innerHTML = allBlogs.map(createPostRow).join('');
  } catch (error) {
    loading.textContent =
      'Failed to load your posts. Make sure the server is running.';
  }
}

// DELETE OWN POST
async function deletePost(id) {
  const confirmed = confirm(
    'Delete this post? This cannot be undone.'
  );

  if (!confirmed) return;

  try {
    const response = await authFetch(`${API}/blogs/${id}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (!response.ok) {
      showToast(data.error || 'Could not delete the post.');
      return;
    }

    showToast('Post deleted.');
    loadDashboard();
  } catch (error) {
    showToast('Server error. Try again.');
  }
}

// OPEN EDIT POPUP
function openEditModal(id) {
  const blog = allBlogs.find((item) => item.id === id);

  if (!blog) return;

  document.getElementById('editId').value = blog.id;
  document.getElementById('editTitle').value = blog.title;
  document.getElementById('editCategory').value = blog.category;
  document.getElementById('editBody').value = blog.body;
  document.getElementById('editStatus').value = blog.status;

  document.getElementById('editModal').style.display = 'flex';
}

function closeEditModal() {
  document.getElementById('editModal').style.display = 'none';
}

// SAVE EDITED POST
async function saveEdit() {
  const id = document.getElementById('editId').value;
  const title = document.getElementById('editTitle').value.trim();
  const category = document.getElementById('editCategory').value;
  const body = document.getElementById('editBody').value.trim();
  const status = document.getElementById('editStatus').value;

  if (!title || !body) {
    showToast('Title and content are required.');
    return;
  }

  try {
    const response = await authFetch(`${API}/blogs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        category,
        body,
        status
      })
    });

    const data = await response.json();

    if (!response.ok) {
      showToast(data.error || 'Could not update the post.');
      return;
    }

    closeEditModal();
    showToast('Post updated successfully!');
    loadDashboard();
  } catch (error) {
    showToast('Server error. Try again.');
  }
}

// Close popup when user clicks outside it.
const editModal = document.getElementById('editModal');

editModal.addEventListener('click', (event) => {
  if (event.target === editModal) {
    closeEditModal();
  }
});

loadDashboard();