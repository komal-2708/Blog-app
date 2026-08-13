// =============================================
//  HOME PAGE - Load blogs from API
// =============================================

const API = '/api';

const blogGrid       = document.getElementById('blogGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const emptyState     = document.getElementById('emptyState');

const categoryEmoji = {
  technology: '💻',
  lifestyle:  '☕',
  learning:   '🧠',
  career:     '🚀',
  design:     '🎨',
  books:      '📖',
  other:      '✍️'
};

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[c]));
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

function createBlogCard(blog) {
  const emoji = categoryEmoji[blog.category] || '✍️';
  const preview = blog.body.substring(0, 100) + (blog.body.length > 100 ? '...' : '');
  return `
    <article class="blog-card">
      <div class="blog-card-img">${emoji}</div>
      <div class="blog-card-body">
        <span class="blog-tag">${escapeHtml(blog.category)}</span>
        <h3>${escapeHtml(blog.title)}</h3>
        <p>${escapeHtml(preview)}</p>
        <div class="blog-card-meta">
          <span>${formatDate(blog.created_at)} · By ${escapeHtml(blog.author)}</span>
          <a href="post.html?id=${encodeURIComponent(blog.id)}" class="read-more">Read →</a>
        </div>
      </div>
    </article>
  `;
}

async function loadBlogs() {
  try {
    const response = await fetch(`${API}/blogs`);
    const blogs    = await response.json();

    loadingSpinner.style.display = 'none';

    if (blogs.length === 0) {
      emptyState.style.display = 'block';
      return;
    }

    blogGrid.innerHTML = blogs.map(createBlogCard).join('');
  } catch (error) {
    loadingSpinner.textContent = 'Failed to load posts. Make sure the server is running.';
    console.error('Error loading blogs:', error);
  }
}

loadBlogs();