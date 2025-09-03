'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create courses table
    await queryInterface.createTable('courses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      course_id: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      track: {
        type: Sequelize.ENUM('python', 'java', 'javascript', 'cpp', 'csharp', 'go', 'rust', 'n8n'),
        allowNull: false
      },
      level: {
        type: Sequelize.ENUM('beginner', 'intermediate', 'advanced'),
        allowNull: false,
        defaultValue: 'beginner'
      },
      visibility: {
        type: Sequelize.ENUM('public', 'private', 'archived'),
        allowNull: false,
        defaultValue: 'public'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Create lessons table
    await queryInterface.createTable('lessons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      course_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'courses',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      url: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      duration: {
        type: Sequelize.INTEGER, // in minutes
        allowNull: true
      },
      order_index: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Create problems table
    await queryInterface.createTable('problems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      statement: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      track: {
        type: Sequelize.ENUM('python', 'java', 'javascript', 'cpp', 'csharp', 'go', 'rust', 'n8n'),
        allowNull: false
      },
      difficulty: {
        type: Sequelize.ENUM('easy', 'medium', 'hard'),
        allowNull: false,
        defaultValue: 'easy'
      },
      tags: {
        type: Sequelize.JSON,
        allowNull: true
      },
      test_cases: {
        type: Sequelize.JSON,
        allowNull: true
      },
      time_limit: {
        type: Sequelize.INTEGER, // in milliseconds
        allowNull: false,
        defaultValue: 1000
      },
      memory_limit: {
        type: Sequelize.INTEGER, // in MB
        allowNull: false,
        defaultValue: 128
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Create assignments table
    await queryInterface.createTable('assignments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      course_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'courses',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      type: {
        type: Sequelize.ENUM('code', 'lab', 'essay', 'project', 'quiz'),
        allowNull: false,
        defaultValue: 'code'
      },
      due_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      meta_json: {
        type: Sequelize.JSON,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Create submissions table
    await queryInterface.createTable('submissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      problem_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'problems',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      assignment_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'assignments',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      code: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      language: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'running', 'accepted', 'wrong_answer', 'time_limit_exceeded', 'memory_limit_exceeded', 'runtime_error', 'compilation_error'),
        allowNull: false,
        defaultValue: 'pending'
      },
      verdict: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      execution_time: {
        type: Sequelize.INTEGER, // in milliseconds
        allowNull: true
      },
      memory_used: {
        type: Sequelize.INTEGER, // in KB
        allowNull: true
      },
      output: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      error_message: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Create grades table
    await queryInterface.createTable('grades', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      assignment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'assignments',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      score: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      max_score: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 100.00
      },
      rubric_json: {
        type: Sequelize.JSON,
        allowNull: true
      },
      feedback: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      graded_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      graded_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Create ai_plans table
    await queryInterface.createTable('ai_plans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      track: {
        type: Sequelize.ENUM('python', 'java', 'javascript', 'cpp', 'csharp', 'go', 'rust', 'n8n'),
        allowNull: false
      },
      days: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      plan_json: {
        type: Sequelize.JSON,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('active', 'completed', 'paused', 'cancelled'),
        allowNull: false,
        defaultValue: 'active'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Create calendar_events table
    await queryInterface.createTable('calendar_events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      source: {
        type: Sequelize.ENUM('ai_plan', 'assignment', 'manual', 'help_buddy'),
        allowNull: false
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      start: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end: {
        type: Sequelize.DATE,
        allowNull: false
      },
      payload_json: {
        type: Sequelize.JSON,
        allowNull: true
      },
      is_completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Create chat_channels table
    await queryInterface.createTable('chat_channels', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      is_private: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Create chat_messages table
    await queryInterface.createTable('chat_messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      channel_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'chat_channels',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      thread_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'chat_messages',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      read_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Create notifications table
    await queryInterface.createTable('notifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      type: {
        type: Sequelize.ENUM('assignment_due', 'grade_posted', 'ai_plan_ready', 'chat_mention', 'system'),
        allowNull: false
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      payload_json: {
        type: Sequelize.JSON,
        allowNull: true
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      read_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Create audit_logs table
    await queryInterface.createTable('audit_logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      actor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      action: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      target: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      target_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      data_json: {
        type: Sequelize.JSON,
        allowNull: true
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Add indexes for better performance
    await queryInterface.addIndex('courses', ['track', 'level']);
    await queryInterface.addIndex('lessons', ['course_id', 'order_index']);
    await queryInterface.addIndex('problems', ['track', 'difficulty']);
    await queryInterface.addIndex('submissions', ['user_id', 'problem_id']);
    await queryInterface.addIndex('submissions', ['status']);
    await queryInterface.addIndex('grades', ['assignment_id', 'user_id']);
    await queryInterface.addIndex('ai_plans', ['user_id', 'status']);
    await queryInterface.addIndex('calendar_events', ['user_id', 'start']);
    await queryInterface.addIndex('chat_messages', ['channel_id', 'created_at']);
    await queryInterface.addIndex('notifications', ['user_id', 'is_read']);
    await queryInterface.addIndex('audit_logs', ['actor_id', 'created_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('audit_logs');
    await queryInterface.dropTable('notifications');
    await queryInterface.dropTable('chat_messages');
    await queryInterface.dropTable('chat_channels');
    await queryInterface.dropTable('calendar_events');
    await queryInterface.dropTable('ai_plans');
    await queryInterface.dropTable('grades');
    await queryInterface.dropTable('submissions');
    await queryInterface.dropTable('assignments');
    await queryInterface.dropTable('problems');
    await queryInterface.dropTable('lessons');
    await queryInterface.dropTable('courses');
  }
};
