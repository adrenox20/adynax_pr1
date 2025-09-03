const { AiPlan, User, CalendarEvent } = require('../../models');

// @desc    Get all AI plans (Admin only)
// @route   GET /api/ai-plans
// @access  Private (Admin)
const getAllPlans = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, track } = req.query;
    
    const whereClause = {};
    if (status) whereClause.status = status;
    if (track) whereClause.track = track;

    const plans = await AiPlan.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: {
        plans: plans.rows,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(plans.count / limit),
          total_items: plans.count,
          items_per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Get user's AI plans
// @route   GET /api/ai-plans/my
// @access  Private
const getUserPlans = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, track } = req.query;
    
    const whereClause = { user_id: req.user.id };
    if (status) whereClause.status = status;
    if (track) whereClause.track = track;

    const plans = await AiPlan.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: {
        plans: plans.rows,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(plans.count / limit),
          total_items: plans.count,
          items_per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get user plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Get AI plan by ID
// @route   GET /api/ai-plans/:id
// @access  Private
const getPlanById = async (req, res) => {
  try {
    const plan = await AiPlan.findByPk(req.params.id);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'AI Plan not found'
      });
    }

    // Check if user can access this plan
    if (req.user.role === 'student' && plan.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this plan'
      });
    }

    res.status(200).json({
      success: true,
      data: { plan }
    });
  } catch (error) {
    console.error('Get plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Create new AI plan
// @route   POST /api/ai-plans
// @access  Private
const createPlan = async (req, res) => {
  try {
    const { track, days, title, description } = req.body;

    // Validation
    if (!track || !days || !title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide track, days, and title'
      });
    }

    if (days < 1 || days > 365) {
      return res.status(400).json({
        success: false,
        message: 'Days must be between 1 and 365'
      });
    }

    // Generate personalized learning plan
    const planJson = generateLearningPlan(track, days, req.user);

    // Create the plan
    const plan = await AiPlan.create({
      user_id: req.user.id,
      track,
      days,
      title,
      description,
      plan_json: planJson,
      status: 'active'
    });

    // Generate calendar events for the plan
    await generateCalendarEvents(plan, req.user.id);

    res.status(201).json({
      success: true,
      message: 'AI Learning Plan created successfully',
      data: { 
        plan,
        message: `Your ${days}-day ${track} learning plan has been created and added to your calendar!`
      }
    });
  } catch (error) {
    console.error('Create plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Generate new AI plan
// @route   POST /api/ai-plans/generate
// @access  Private
const generatePlan = async (req, res) => {
  try {
    const { track, days, title, description } = req.body;

    // Validation
    if (!track || !days || !title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide track, days, and title'
      });
    }

    if (days < 1 || days > 365) {
      return res.status(400).json({
        success: false,
        message: 'Days must be between 1 and 365'
      });
    }

    // Generate personalized learning plan
    const planJson = generateLearningPlan(track, days, req.user);

    // Create the plan
    const plan = await AiPlan.create({
      user_id: req.user.id,
      track,
      days,
      title,
      description,
      plan_json: planJson,
      status: 'active'
    });

    // Generate calendar events for the plan
    await generateCalendarEvents(plan, req.user.id);

    res.status(201).json({
      success: true,
      message: 'AI Learning Plan generated successfully',
      data: { 
        plan,
        message: `Your ${days}-day ${track} learning plan has been created and added to your calendar!`
      }
    });
  } catch (error) {
    console.error('Generate plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Update AI plan
// @route   PUT /api/ai-plans/:id
// @access  Private
const updatePlan = async (req, res) => {
  try {
    const plan = await AiPlan.findByPk(req.params.id);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'AI Plan not found'
      });
    }

    // Check if user can update this plan
    if (req.user.role === 'student' && plan.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this plan'
      });
    }

    const updatedPlan = await plan.update(req.body);

    res.status(200).json({
      success: true,
      message: 'AI Plan updated successfully',
      data: { plan: updatedPlan }
    });
  } catch (error) {
    console.error('Update plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Delete AI plan
// @route   DELETE /api/ai-plans/:id
// @access  Private
const deletePlan = async (req, res) => {
  try {
    const plan = await AiPlan.findByPk(req.params.id);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'AI Plan not found'
      });
    }

    // Check if user can delete this plan
    if (req.user.role === 'student' && plan.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this plan'
      });
    }

    // Delete associated calendar events
    await CalendarEvent.destroy({
      where: {
        user_id: req.user.id,
        source: 'ai_plan',
        source_id: plan.id
      }
    });

    await plan.destroy();

    res.status(200).json({
      success: true,
      message: 'AI Plan deleted successfully'
    });
  } catch (error) {
    console.error('Delete plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Activate AI plan
// @route   POST /api/ai-plans/:id/activate
// @access  Private
const activatePlan = async (req, res) => {
  try {
    const plan = await AiPlan.findByPk(req.params.id);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'AI Plan not found'
      });
    }

    if (plan.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to activate this plan'
      });
    }

    await plan.update({ status: 'active' });

    res.status(200).json({
      success: true,
      message: 'AI Plan activated successfully',
      data: { plan }
    });
  } catch (error) {
    console.error('Activate plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Pause AI plan
// @route   POST /api/ai-plans/:id/pause
// @access  Private
const pausePlan = async (req, res) => {
  try {
    const plan = await AiPlan.findByPk(req.params.id);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'AI Plan not found'
      });
    }

    if (plan.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to pause this plan'
      });
    }

    await plan.update({ status: 'paused' });

    res.status(200).json({
      success: true,
      message: 'AI Plan paused successfully',
      data: { plan }
    });
  } catch (error) {
    console.error('Pause plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Helper function to generate learning plan
const generateLearningPlan = (track, days, user) => {
  const plan = {
    overview: {
      track,
      totalDays: days,
      dailyGoal: '60-90 minutes',
      focusAreas: getFocusAreas(track),
      milestones: []
    },
    dailySchedule: [],
    weeklyReviews: [],
    resources: getResources(track)
  };

  // Generate daily schedule
  for (let day = 1; day <= days; day++) {
    const dailyTask = {
      day,
      date: new Date(Date.now() + day * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tasks: generateDailyTasks(track, day, days),
      estimatedTime: Math.floor(Math.random() * 30) + 60, // 60-90 minutes
      difficulty: getDifficulty(day, days)
    };
    plan.dailySchedule.push(dailyTask);
  }

  // Generate milestones
  const milestoneDays = [Math.floor(days * 0.25), Math.floor(days * 0.5), Math.floor(days * 0.75), days];
  milestoneDays.forEach((day, index) => {
    plan.overview.milestones.push({
      day,
      title: `Milestone ${index + 1}`,
      description: `Complete ${getMilestoneDescription(track, index + 1)}`
    });
  });

  return plan;
};

// Helper function to get focus areas for a track
const getFocusAreas = (track) => {
  const focusAreas = {
    python: ['Basic Syntax', 'Data Structures', 'OOP', 'Web Development', 'Data Science'],
    java: ['Core Java', 'OOP Concepts', 'Collections', 'Spring Framework', 'Android Development'],
    javascript: ['ES6+', 'DOM Manipulation', 'Async Programming', 'React/Vue', 'Node.js'],
    cpp: ['Basic Syntax', 'STL', 'OOP', 'Memory Management', 'Competitive Programming'],
    n8n: ['Workflow Basics', 'Node Types', 'API Integration', 'Automation', 'Advanced Workflows']
  };
  return focusAreas[track] || ['Fundamentals', 'Intermediate Concepts', 'Advanced Topics'];
};

// Helper function to generate daily tasks
const generateDailyTasks = (track, day, totalDays) => {
  const tasks = [];
  
  if (day === 1) {
    tasks.push({
      type: 'setup',
      title: 'Environment Setup',
      description: `Set up your ${track} development environment`,
      duration: 30
    });
  }

  if (day % 7 === 0) {
    tasks.push({
      type: 'review',
      title: 'Weekly Review',
      description: 'Review and practice concepts from the past week',
      duration: 45
    });
  }

  tasks.push({
    type: 'learning',
    title: `Day ${day} Learning`,
    description: `Learn new ${track} concepts and practice`,
    duration: 60
  });

  if (day % 3 === 0) {
    tasks.push({
      type: 'practice',
      title: 'Practice Problems',
      description: 'Solve coding problems to reinforce learning',
      duration: 30
    });
  }

  return tasks;
};

// Helper function to get difficulty based on day
const getDifficulty = (day, totalDays) => {
  if (day <= totalDays * 0.3) return 'beginner';
  if (day <= totalDays * 0.7) return 'intermediate';
  return 'advanced';
};

// Helper function to get milestone descriptions
const getMilestoneDescription = (track, milestone) => {
  const descriptions = {
    python: ['Basic Python concepts', 'Intermediate Python skills', 'Advanced Python applications', 'Python mastery'],
    java: ['Core Java fundamentals', 'OOP and collections', 'Framework basics', 'Java expertise'],
    javascript: ['ES6+ fundamentals', 'DOM and async programming', 'Framework basics', 'Full-stack JS skills'],
    cpp: ['Basic C++ syntax', 'STL and OOP', 'Memory management', 'C++ expertise'],
    n8n: ['Workflow basics', 'Node mastery', 'Advanced automation', 'n8n expertise']
  };
  return descriptions[track]?.[milestone - 1] || `Milestone ${milestone} completion`;
};

// Helper function to get resources for a track
const getResources = (track) => {
  const resources = {
    python: [
      { name: 'Python Official Docs', url: 'https://docs.python.org/', type: 'documentation' },
      { name: 'Real Python', url: 'https://realpython.com/', type: 'tutorials' },
      { name: 'LeetCode Python', url: 'https://leetcode.com/', type: 'practice' }
    ],
    java: [
      { name: 'Java Official Docs', url: 'https://docs.oracle.com/javase/', type: 'documentation' },
      { name: 'Baeldung', url: 'https://www.baeldung.com/', type: 'tutorials' },
      { name: 'HackerRank Java', url: 'https://www.hackerrank.com/', type: 'practice' }
    ],
    javascript: [
      { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/', type: 'documentation' },
      { name: 'JavaScript.info', url: 'https://javascript.info/', type: 'tutorials' },
      { name: 'Codewars JS', url: 'https://www.codewars.com/', type: 'practice' }
    ],
    cpp: [
      { name: 'C++ Reference', url: 'https://en.cppreference.com/', type: 'documentation' },
      { name: 'LearnCpp', url: 'https://www.learncpp.com/', type: 'tutorials' },
      { name: 'Codeforces', url: 'https://codeforces.com/', type: 'practice' }
    ],
    n8n: [
      { name: 'n8n Documentation', url: 'https://docs.n8n.io/', type: 'documentation' },
      { name: 'n8n Academy', url: 'https://academy.n8n.io/', type: 'tutorials' },
      { name: 'n8n Community', url: 'https://community.n8n.io/', type: 'community' }
    ]
  };
  return resources[track] || [];
};

// Helper function to generate calendar events
const generateCalendarEvents = async (plan, userId) => {
  try {
    const events = [];
    const planData = plan.plan_json;

    planData.dailySchedule.forEach((daySchedule) => {
      const startDate = new Date(daySchedule.date);
      const endDate = new Date(startDate.getTime() + daySchedule.estimatedTime * 60 * 1000);

      events.push({
        user_id: userId,
        source: 'ai_plan',
        source_id: plan.id,
        title: daySchedule.tasks[0]?.title || `Day ${daySchedule.day} Learning`,
        description: daySchedule.tasks.map(task => `${task.title}: ${task.description}`).join('\n'),
        start: startDate,
        end: endDate,
        payload_json: {
          day: daySchedule.day,
          tasks: daySchedule.tasks,
          estimatedTime: daySchedule.estimatedTime,
          difficulty: daySchedule.difficulty
        }
      });
    });

    // Create calendar events in batches
    for (let i = 0; i < events.length; i += 10) {
      const batch = events.slice(i, i + 10);
      await CalendarEvent.bulkCreate(batch);
    }
  } catch (error) {
    console.error('Error generating calendar events:', error);
  }
};

module.exports = {
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  getUserPlans,
  generatePlan,
  activatePlan,
  pausePlan
};
