const { Problem } = require('../../models');

// @desc    Get all problems
// @route   GET /api/problems
// @access  Public
const getAllProblems = async (req, res) => {
  try {
    const { page = 1, limit = 10, track, difficulty, search } = req.query;
    
    const whereClause = {};
    if (track) whereClause.track = track;
    if (difficulty) whereClause.difficulty = difficulty;
    if (search) {
      whereClause.title = { [require('sequelize').Op.like]: `%${search}%` };
    }

    const problems = await Problem.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: {
        problems: problems.rows,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(problems.count / limit),
          total_items: problems.count,
          items_per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get problems error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Get problem by ID
// @route   GET /api/problems/:id
// @access  Public
const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findByPk(req.params.id);
    
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { problem }
    });
  } catch (error) {
    console.error('Get problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Create new problem
// @route   POST /api/problems
// @access  Private (Teachers & Admins)
const createProblem = async (req, res) => {
  try {
    const { title, statement, track, difficulty, tags, test_cases, time_limit, memory_limit } = req.body;

    // Validation
    if (!title || !statement || !track || !difficulty) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const problem = await Problem.create({
      title,
      statement,
      track,
      difficulty,
      tags: tags || [],
      test_cases: test_cases || [],
      time_limit: time_limit || 1000,
      memory_limit: memory_limit || 128
    });

    res.status(201).json({
      success: true,
      message: 'Problem created successfully',
      data: { problem }
    });
  } catch (error) {
    console.error('Create problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Update problem
// @route   PUT /api/problems/:id
// @access  Private (Teachers & Admins)
const updateProblem = async (req, res) => {
  try {
    const problem = await Problem.findByPk(req.params.id);
    
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    const updatedProblem = await problem.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Problem updated successfully',
      data: { problem: updatedProblem }
    });
  } catch (error) {
    console.error('Update problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Delete problem
// @route   DELETE /api/problems/:id
// @access  Private (Teachers & Admins)
const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findByPk(req.params.id);
    
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    await problem.destroy();

    res.status(200).json({
      success: true,
      message: 'Problem deleted successfully'
    });
  } catch (error) {
    console.error('Delete problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Get problems by track
// @route   GET /api/problems/track/:track
// @access  Public
const getProblemsByTrack = async (req, res) => {
  try {
    const { track } = req.params;
    const { page = 1, limit = 10, difficulty } = req.query;
    
    const whereClause = { track };
    if (difficulty) whereClause.difficulty = difficulty;

    const problems = await Problem.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [['difficulty', 'ASC'], ['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: {
        problems: problems.rows,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(problems.count / limit),
          total_items: problems.count,
          items_per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get problems by track error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Get problems by difficulty
// @route   GET /api/problems/difficulty/:difficulty
// @access  Public
const getProblemsByDifficulty = async (req, res) => {
  try {
    const { difficulty } = req.params;
    const { page = 1, limit = 10, track } = req.query;
    
    const whereClause = { difficulty };
    if (track) whereClause.track = track;

    const problems = await Problem.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: {
        problems: problems.rows,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(problems.count / limit),
          total_items: problems.count,
          items_per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get problems by difficulty error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemsByTrack,
  getProblemsByDifficulty
};
