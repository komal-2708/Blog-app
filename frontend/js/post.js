// =============================================
//  SINGLE POST PAGE - Load one blog from API
// =============================================

const API = '/api';

const categoryEmoji = {
  technology: '💻', lifestyle: '☕', learning: '🧠',
  career: '🚀', design: '🎨', books: '📖', other: '✍️'
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

async function loadPost() {
  const loading  = document.getElementById('postLoading');
  const notFound = document.getElementById('postNotFound');
  const article  = document.getElementById('postArticle');

  const id = new URLSearchParams(window.location.search).get('id');

  if (!id) {
    loading.style.display = 'none';
    notFound.style.display = 'block';
    return;
  }

  try {
    const response = await fetch(`${API}/blogs/${encodeURIComponent(id)}`);

    if (!response.ok) {
      loading.style.display = 'none';
      notFound.style.display = 'block';
      return;
    }

    const blog = await response.json();

    document.title = `BlogSpace – ${blog.title}`;
    document.getElementById('postCategory').textContent =
      `${categoryEmoji[blog.category] || '✍️'} ${blog.category}`;
    document.getElementById('postTitle').textContent = blog.title;
    document.getElementById('postMeta').textContent =
      `${formatDate(blog.created_at)} · By ${blog.author}`;
    document.getElementById('postBody').innerHTML = escapeHtml(blog.body);

    loading.style.display = 'none';
    article.style.display = 'block';
  } catch (error) {
    loading.textContent = 'Failed to load this post. Make sure the server is running.';
  }
}

loadPost();