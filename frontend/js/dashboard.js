// =============================================
//  DASHBOARD PAGE - Real CRUD from API
// =============================================
 
const API = 'http://localhost:5000/api';
 
let allBlogs = [];
 
// Format date
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}
 
// Build a post row
function createPostRow(blog) {
  const badgeClass = blog.status === 'published' ? 'badge-published' : 'badge-draft';
  const badgeText  = blog.status === 'published' ? 'Published' : 'Draft';
 
  return `
    <div class="post-row" id="row-${blog.id}">
      <span class="post-row-title">${blog.title}</span>
      <span class="badge ${badgeClass}">${badgeText}</span>
      <span class="post-row-date">${formatDate(blog.created_at)}</span>
      <div class="post-row-actions">
        <button class="btn btn-outline btn-sm" onclick="openEditModal('${blog.id}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deletePost('${blog.id}')">Delete</button>
      </div>
    </div>
  `;
}
 
// Load all blogs
async function loadDashboard() {
  const dashLoading = document.getElementById('dashLoading');
  const postsList   = document.getElementById('postsList');
  const dashEmpty   = document.getElementById('dashEmpty');
 
  try {
    // Fetch ALL blogs (including drafts) — we use /api/blogs
    const response = await fetch(`${API}/blogs/all`);
    const blogs    = await response.json();
 
    allBlogs = blogs;
    dashLoading.style.display = 'none';
 
    if (blogs.length === 0) {
      dashEmpty.style.display = 'block';
      return;
    }
 
    // Update stats
    document.getElementById('totalPosts').textContent     = blogs.length;
    document.getElementById('publishedPosts').textContent = blogs.filter(b => b.status === 'published').length;
    document.getElementById('draftPosts').textContent     = blogs.filter(b => b.status === 'draft').length;
 
    // Render post rows
    postsList.innerHTML = blogs.map(createPostRow).join('');
 
  } catch (error) {
    dashLoading.textContent = 'Failed to load. Make sure the server is running.';
    console.error(error);
  }
}
 
// Delete a post
async function deletePost(id) {
  if (!confirm('Delete this post? This cannot be undone.')) return;
 
  try {
    const response = await fetch(`${API}/blogs/${id}`, { method: 'DELETE' });
    const data     = await response.json();
 
    if (!response.ok) {
      showToast('Error: ' + data.error);
      return;
    }
 
    // Remove row from UI
    const row = document.getElementById(`row-${id}`);
    if (row) {
      row.style.transition = 'opacity 0.3s';
      row.style.opacity = '0';
      setTimeout(() => { row.remove(); updateStats(); }, 300);
    }
 
    showToast('Post deleted.');
  } catch {
    showToast('Server error. Try again.');
  }
}
 
// Update stats after delete
function updateStats() {
  const rows = document.querySelectorAll('.post-row');
  document.getElementById('totalPosts').textContent = rows.length;
}
 
// Open edit modal
function openEditModal(id) {
  const blog = allBlogs.find(b => b.id === id);
  if (!blog) return;
 
  document.getElementById('editId').value       = blog.id;
  document.getElementById('editTitle').value    = blog.title;
  document.getElementById('editCategory').value = blog.category;
  document.getElementById('editBody').value     = blog.body;
  document.getElementById('editStatus').value   = blog.status;
 
  const modal = document.getElementById('editModal');
  modal.style.display = 'flex';
}
 
// Close edit modal
function closeEditModal() {
  document.getElementById('editModal').style.display = 'none';
}
 
// Save edited post
async function saveEdit() {
  const id       = document.getElementById('editId').value;
  const title    = document.getElementById('editTitle').value.trim();
  const category = document.getElementById('editCategory').value;
  const body     = document.getElementById('editBody').value.trim();
  const status   = document.getElementById('editStatus').value;
 
  if (!title || !body) {
    showToast('Title and content are required.');
    return;
  }
 
  try {
    const response = await fetch(`${API}/blogs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, body, status })
    });
 
    const data = await response.json();
 
    if (!response.ok) {
      showToast('Error: ' + data.error);
      return;
    }
 
    showToast('Post updated! ✓');
    closeEditModal();
    loadDashboard(); // Reload the list
 
  } catch {
    showToast('Server error. Try again.');
  }
}
 
// Close modal when clicking outside
document.getElementById('editModal').addEventListener('click', function(e) {
  if (e.target === this) closeEditModal();
});
 
// Load on page start
loadDashboard();