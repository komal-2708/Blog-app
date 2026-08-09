// =============================================
//  BLOG APP - SERVER (Module 3)
// =============================================
 
const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');
const path    = require('path');
 
// Load environment variables from .env file
dotenv.config();
 
const app  = express();
const PORT = process.env.PORT || 5000;
 
// ---- MIDDLEWARE ----
// Allow requests from the frontend
app.use(cors());
 
// Parse incoming JSON data
app.use(express.json());
 
// Serve frontend HTML/CSS/JS files
app.use(express.static(path.join(__dirname, '../frontend')));
 
// ---- ROUTES ----
const userRoutes = require('./routes/users');
const blogRoutes = require('./routes/blogs');
 
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);
 
// ---- SERVE FRONTEND PAGES ----
// Any unknown route sends back the home page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/home.html'));
});
 
// ---- START SERVER ----
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
 