const express = require('express');
const router = express.Router();

// Import route modules
// const authRoutes = require('./auth.routes');
// const userRoutes = require('./user.routes');
// const courseRoutes = require('./course.routes');

// API versioning
const apiVersion = process.env.API_VERSION || 'v1';

// Basic API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: `🎓 AI-LMS API ${apiVersion}`,
    version: apiVersion,
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      courses: '/api/courses',
      assignments: '/api/assignments',
      submissions: '/api/submissions',
      dashboard: '/api/dashboard'
    },
    documentation: '/api/docs',
    health: '/health',
    timestamp: new Date().toISOString()
  });
});

// Mount route modules (uncomment as you create them)
// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/courses', courseRoutes);

module.exports = router;