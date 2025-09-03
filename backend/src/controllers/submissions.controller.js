const { Submission, Problem, User } = require('../../models');

// @desc    Get all submissions (Admin/Teacher only)
// @route   GET /api/submissions
// @access  Private (Teachers & Admins)
const getAllSubmissions = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, problem_id, user_id } = req.query;
    
    const whereClause = {};
    if (status) whereClause.status = status;
    if (problem_id) whereClause.problem_id = problem_id;
    if (user_id) whereClause.user_id = user_id;

    const submissions = await Submission.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: {
        submissions: submissions.rows,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(submissions.count / limit),
          total_items: submissions.count,
          items_per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Get submission by ID
// @route   GET /api/submissions/:id
// @access  Private
const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findByPk(req.params.id);
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Check if user can access this submission
    if (req.user.role === 'student' && submission.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this submission'
      });
    }

    res.status(200).json({
      success: true,
      data: { submission }
    });
  } catch (error) {
    console.error('Get submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Create new submission
// @route   POST /api/submissions
// @access  Private (Students)
const createSubmission = async (req, res) => {
  try {
    const { problem_id, code, language, assignment_id } = req.body;

    // Validation
    if (!problem_id || !code || !language) {
      return res.status(400).json({
        success: false,
        message: 'Please provide problem_id, code, and language'
      });
    }

    // Check if problem exists
    const problem = await Problem.findByPk(problem_id);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Create submission
    const submission = await Submission.create({
      user_id: req.user.id,
      problem_id,
      assignment_id,
      code,
      language,
      status: 'pending'
    });

    // TODO: Add code execution logic here
    // This would integrate with Judge0 or custom Docker runner
    // For now, we'll simulate execution

    // Simulate code execution
    setTimeout(async () => {
      try {
        // Simulate random verdict for demo
        const verdicts = ['accepted', 'wrong_answer', 'time_limit_exceeded', 'runtime_error'];
        const randomVerdict = verdicts[Math.floor(Math.random() * verdicts.length)];
        
        const updateData = {
          status: randomVerdict === 'accepted' ? 'accepted' : 'wrong_answer',
          verdict: randomVerdict,
          score: randomVerdict === 'accepted' ? 100 : 0,
          execution_time: Math.floor(Math.random() * 1000),
          memory_used: Math.floor(Math.random() * 128000)
        };

        if (randomVerdict === 'accepted') {
          updateData.output = 'All test cases passed!';
        } else {
          updateData.error_message = 'Test case failed';
        }

        await submission.update(updateData);
      } catch (error) {
        console.error('Code execution error:', error);
      }
    }, 2000);

    res.status(201).json({
      success: true,
      message: 'Submission created successfully. Code is being executed...',
      data: { 
        submission,
        message: 'Your code is being evaluated. Check back in a few seconds for results.'
      }
    });
  } catch (error) {
    console.error('Create submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Update submission
// @route   PUT /api/submissions/:id
// @access  Private (Teachers & Admins)
const updateSubmission = async (req, res) => {
  try {
    const submission = await Submission.findByPk(req.params.id);
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    const updatedSubmission = await submission.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Submission updated successfully',
      data: { submission: updatedSubmission }
    });
  } catch (error) {
    console.error('Update submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Delete submission
// @route   DELETE /api/submissions/:id
// @access  Private (Teachers & Admins)
const deleteSubmission = async (req, res) => {
  try {
    const submission = await Submission.findByPk(req.params.id);
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    await submission.destroy();

    res.status(200).json({
      success: true,
      message: 'Submission deleted successfully'
    });
  } catch (error) {
    console.error('Delete submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Get user's own submissions
// @route   GET /api/submissions/my
// @access  Private (Students)
const getUserSubmissions = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, problem_id } = req.query;
    
    const whereClause = { user_id: req.user.id };
    if (status) whereClause.status = status;
    if (problem_id) whereClause.problem_id = problem_id;

    const submissions = await Submission.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: {
        submissions: submissions.rows,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(submissions.count / limit),
          total_items: submissions.count,
          items_per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get user submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Get submissions for a specific problem
// @route   GET /api/submissions/problem/:problemId
// @access  Private (Teachers & Admins)
const getProblemSubmissions = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { page = 1, limit = 10, status } = req.query;
    
    const whereClause = { problem_id: problemId };
    if (status) whereClause.status = status;

    const submissions = await Submission.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: {
        submissions: submissions.rows,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(submissions.count / limit),
          total_items: submissions.count,
          items_per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get problem submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Get submissions by status
// @route   GET /api/submissions/status/:status
// @access  Private (Teachers & Admins)
const getSubmissionsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const { page = 1, limit = 10, problem_id } = req.query;
    
    const whereClause = { status };
    if (problem_id) whereClause.problem_id = problem_id;

    const submissions = await Submission.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: {
        submissions: submissions.rows,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(submissions.count / limit),
          total_items: submissions.count,
          items_per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get submissions by status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllSubmissions,
  getSubmissionById,
  createSubmission,
  updateSubmission,
  deleteSubmission,
  getUserSubmissions,
  getProblemSubmissions,
  getSubmissionsByStatus
};
