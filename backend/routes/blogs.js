// =============================================
//  BLOG ROUTES
//  Base URL: /api/blogs
// =============================================
 
const express = require('express');
const router  = express.Router();
 
// Temporary in-memory storage (until Module 4 adds a real database)
let blogs = [
  {
    id: '1',
    title: 'Getting Started with Web Development in 2025',
    category: 'technology',
    body: 'A beginner-friendly roadmap covering HTML, CSS, JavaScript, and your first project.',
    status: 'published',
    author: 'Komal',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'The Morning Routine That Changed How I Work',
    category: 'lifestyle',
    body: 'Small habits compounded over six months — here\'s what actually made a difference.',
    status: 'published',
    author: 'Komal',
    createdAt: new Date().toISOString()
  }
];
 
// ---- GET ALL BLOGS ----
// GET /api/blogs
router.get('/', (req, res) => {
  const published = blogs.filter(b => b.status === 'published');
  res.json(published);
});
 
// ---- GET SINGLE BLOG ----
// GET /api/blogs/:id
router.get('/:id', (req, res) => {
  const blog = blogs.find(b => b.id === req.params.id);
  if (!blog) {
    return res.status(404).json({ error: 'Blog not found.' });
  }
  res.json(blog);
});
 
// ---- CREATE BLOG ----
// POST /api/blogs
router.post('/', (req, res) => {
  const { title, category, body, status, author } = req.body;
 
  if (!title || !category || !body) {
    return res.status(400).json({ error: 'Title, category, and content are required.' });
  }
 
  const newBlog = {
    id: Date.now().toString(),
    title,
    category,
    body,
    status: status || 'published',
    author: author || 'Anonymous',
    createdAt: new Date().toISOString()
  };
 
  blogs.push(newBlog);
 
  res.status(201).json({
    message: 'Blog created successfully!',
    blog: newBlog
  });
});
 
// ---- UPDATE BLOG ----
// PUT /api/blogs/:id
router.put('/:id', (req, res) => {
  const index = blogs.findIndex(b => b.id === req.params.id);
 
  if (index === -1) {
    return res.status(404).json({ error: 'Blog not found.' });
  }
 
  const { title, category, body, status } = req.body;
 
  blogs[index] = {
    ...blogs[index],  // keep existing fields
    title:    title    || blogs[index].title,
    category: category || blogs[index].category,
    body:     body     || blogs[index].body,
    status:   status   || blogs[index].status,
    updatedAt: new Date().toISOString()
  };
 
  res.json({
    message: 'Blog updated successfully!',
    blog: blogs[index]
  });
});
 
// ---- DELETE BLOG ----
// DELETE /api/blogs/:id
router.delete('/:id', (req, res) => {
  const index = blogs.findIndex(b => b.id === req.params.id);
 
  if (index === -1) {
    return res.status(404).json({ error: 'Blog not found.' });
  }
 
  blogs.splice(index, 1);
 
  res.json({ message: 'Blog deleted successfully!' });
});
 
module.exports = router;