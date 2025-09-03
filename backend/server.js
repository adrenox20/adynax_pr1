const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5002;

// Basic middleware
app.use(helmet());

// CORS: allow both default CRA port and alternate dev port
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Basic routes
app.get('/', (req, res) => {
  res.json({ 
    message: '🎓 Welcome to AI-LMS Backend API',
    version: '2.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100 + ' MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100 + ' MB'
    }
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'AI-LMS API v2.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      courses: '/api/courses',
      problems: '/api/problems',
      submissions: '/api/submissions',
      aiPlans: '/api/ai-plans',
      calendar: '/api/calendar',
      chat: '/api/chat',
      admin: '/api/admin'
    },
    features: [
      'User Authentication & RBAC',
      'Coding Problems Portal',
      'Code Submissions & Execution',
      'AI-Powered Learning Plans',
      'Calendar & Assignment Management',
      'Real-time Chat & Collaboration',
      'Teacher Analytics & Grading',
      'Admin Portal & Monitoring'
    ],
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/problems', require('./src/routes/problems.routes'));
app.use('/api/submissions', require('./src/routes/submissions.routes'));
app.use('/api/ai-plans', require('./src/routes/aiPlans.routes'));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log('🚀 ================================');
  console.log(`🚀 AI-LMS Backend Server Started`);
  console.log(`🚀 Port: ${PORT}`);
  console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('🚀 ================================');
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log(`💚 Health: http://localhost:${PORT}/health`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log('🚀 ================================');
  console.log('🎯 Features Available:');
  console.log('   ✅ User Authentication & RBAC');
  console.log('   ✅ Coding Problems Portal');
  console.log('   ✅ Code Submissions & Execution');
  console.log('   ✅ AI-Powered Learning Plans');
  console.log('   ✅ Calendar & Assignment Management');
  console.log('   ✅ Real-time Chat & Collaboration');
  console.log('   ✅ Teacher Analytics & Grading');
  console.log('   ✅ Admin Portal & Monitoring');
  console.log('🚀 ================================');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received');
  server.close(() => {
    console.log('💥 Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received');
  server.close(() => {
    console.log('💥 Server closed');
    process.exit(0);
  });
});

module.exports = app;