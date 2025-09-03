'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Submission extends Model {
    static associate(models) {
      // Associations will be added later when all models are properly loaded
    }
  }

  Submission.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    problem_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    assignment_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    code: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    language: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'running', 'accepted', 'wrong_answer', 'time_limit_exceeded', 'memory_limit_exceeded', 'runtime_error', 'compilation_error'),
      allowNull: false,
      defaultValue: 'pending'
    },
    verdict: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    execution_time: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    memory_used: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    output: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    error_message: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Submission',
    tableName: 'submissions',
    timestamps: true,
    underscored: true
  });

  return Submission;
};
