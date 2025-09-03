'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AiPlan extends Model {
    static associate(models) {
      // Associations will be added later when all models are properly loaded
    }
  }

  AiPlan.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    track: {
      type: DataTypes.ENUM('python', 'java', 'javascript', 'cpp', 'csharp', 'go', 'rust', 'n8n'),
      allowNull: false
    },
    days: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    plan_json: {
      type: DataTypes.JSON,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'paused', 'cancelled'),
      allowNull: false,
      defaultValue: 'active'
    }
  }, {
    sequelize,
    modelName: 'AiPlan',
    tableName: 'ai_plans',
    timestamps: true,
    underscored: true
  });

  return AiPlan;
};
