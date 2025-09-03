const express = require('express');
const { protect, authorize } = require('../middleware/auth.middleware');
const { 
  getAllSubmissions, 
  getSubmissionById, 
  createSubmission, 
  updateSubmission, 
  deleteSubmission,
  getUserSubmissions,
  getProblemSubmissions,
  getSubmissionsByStatus
} = require('../controllers/submissions.controller');

const router = express.Router();

// Protected routes
router.use(protect);

// Student routes
router.post('/', createSubmission);
router.get('/my', getUserSubmissions);
router.get('/:id', getSubmissionById);

// Teacher/Admin routes
router.get('/', authorize(['teacher', 'admin']), getAllSubmissions);
router.get('/problem/:problemId', authorize(['teacher', 'admin']), getProblemSubmissions);
router.get('/status/:status', authorize(['teacher', 'admin']), getSubmissionsByStatus);
router.put('/:id', authorize(['teacher', 'admin']), updateSubmission);
router.delete('/:id', authorize(['teacher', 'admin']), deleteSubmission);

module.exports = router;
