const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { 
  getAllPlans, 
  getPlanById, 
  createPlan, 
  updatePlan, 
  deletePlan,
  getUserPlans,
  generatePlan,
  activatePlan,
  pausePlan
} = require('../controllers/aiPlans.controller');

const router = express.Router();

// All routes are protected
router.use(protect);

// User routes
router.get('/my', getUserPlans);
router.post('/generate', generatePlan);
router.post('/:id/activate', activatePlan);
router.post('/:id/pause', pausePlan);
router.get('/:id', getPlanById);
router.put('/:id', updatePlan);
router.delete('/:id', deletePlan);

// Admin routes (for viewing all plans)
router.get('/', getAllPlans);

module.exports = router;
