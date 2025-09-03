'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      // Associations will be added later when all models are properly loaded
    }
  }

  Course.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    course_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    track: {
      type: DataTypes.ENUM('python', 'java', 'javascript', 'cpp', 'csharp', 'go', 'rust', 'n8n'),
      allowNull: false
    },
    level: {
      type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
      allowNull: false,
      defaultValue: 'beginner'
    },
    visibility: {
      type: DataTypes.ENUM('public', 'private', 'archived'),
      allowNull: false,
      defaultValue: 'public'
    }
  }, {
    sequelize,
    modelName: 'Course',
    tableName: 'courses',
    timestamps: true,
    underscored: true
  });

  return Course;
};
