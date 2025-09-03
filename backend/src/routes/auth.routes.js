const express = require('express');
const { register, login, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Base auth route - provides info about available endpoints
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Authentication endpoints',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      me: 'GET /api/auth/me (protected)'
    },
    timestamp: new Date().toISOString()
  });
});

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;