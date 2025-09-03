const express = require('express');
const { protect, authorize } = require('../middleware/auth.middleware');
const { 
  getAllProblems, 
  getProblemById, 
  createProblem, 
  updateProblem, 
  deleteProblem,
  getProblemsByTrack,
  getProblemsByDifficulty
} = require('../controllers/problems.controller');

const router = express.Router();

// Public routes
router.get('/', getAllProblems);
router.get('/track/:track', getProblemsByTrack);
router.get('/difficulty/:difficulty', getProblemsByDifficulty);
router.get('/:id', getProblemById);

// Protected routes (teachers and admins only)
router.post('/', protect, authorize(['teacher', 'admin']), createProblem);
router.put('/:id', protect, authorize(['teacher', 'admin']), updateProblem);
router.delete('/:id', protect, authorize(['teacher', 'admin']), deleteProblem);

module.exports = router;
