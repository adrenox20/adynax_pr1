'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Problem extends Model {
    static associate(models) {
      // Associations will be added later when all models are properly loaded
    }
  }

  Problem.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    statement: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    track: {
      type: DataTypes.ENUM('python', 'java', 'javascript', 'cpp', 'csharp', 'go', 'rust', 'n8n'),
      allowNull: false
    },
    difficulty: {
      type: DataTypes.ENUM('easy', 'medium', 'hard'),
      allowNull: false,
      defaultValue: 'easy'
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true
    },
    test_cases: {
      type: DataTypes.JSON,
      allowNull: true
    },
    time_limit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1000
    },
    memory_limit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 128
    }
  }, {
    sequelize,
    modelName: 'Problem',
    tableName: 'problems',
    timestamps: true,
    underscored: true
  });

  return Problem;
};
