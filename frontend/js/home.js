// =============================================
//  HOME PAGE - Load blogs from API
// =============================================
 
const API = 'http://localhost:5000/api';
 
const blogGrid      = document.getElementById('blogGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const emptyState    = document.getElementById('emptyState');
 
// Emoji icons per category
const categoryEmoji = {
  technology: '💻',
  lifestyle:  '☕',
  learning:   '🧠',
  career:     '🚀',
  design:     '🎨',
  books:      '📖',
  other:      '✍️'
};
 
// Format date nicely
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
 
// Create a blog card HTML
function createBlogCard(blog) {
  const emoji = categoryEmoji[blog.category] || '✍️';
  return `
    <article class="blog-card">
      <div class="blog-card-img">${emoji}</div>
      <div class="blog-card-body">
        <span class="blog-tag">${blog.category}</span>
        <h3>${blog.title}</h3>
        <p>${blog.body.substring(0, 100)}${blog.body.length > 100 ? '...' : ''}</p>
        <div class="blog-card-meta">
          <span>${formatDate(blog.created_at)} · By ${blog.author}</span>
          <a href="#" class="read-more">Read →</a>
        </div>
      </div>
    </article>
  `;
}
 
// Fetch all blogs from the API
async function loadBlogs() {
  try {
    const response = await fetch(`${API}/blogs`);
    const blogs    = await response.json();
 
    // Hide loading spinner
    loadingSpinner.style.display = 'none';
 
    if (blogs.length === 0) {
      emptyState.style.display = 'block';
      return;
    }
 
    // Render each blog card
    blogGrid.innerHTML = blogs.map(createBlogCard).join('');
 
  } catch (error) {
    loadingSpinner.textContent = 'Failed to load posts. Make sure the server is running.';
    console.error('Error loading blogs:', error);
  }
}
 
// Run when page loads
loadBlogs();