'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CalendarEvent extends Model {
    static associate(models) {
      // Associations will be added later when all models are properly loaded
    }
  }

  CalendarEvent.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    source: {
      type: DataTypes.ENUM('ai_plan', 'assignment', 'manual', 'help_buddy'),
      allowNull: false
    },
    source_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    start: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end: {
      type: DataTypes.DATE,
      allowNull: false
    },
    payload_json: {
      type: DataTypes.JSON,
      allowNull: true
    },
    is_completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'CalendarEvent',
    tableName: 'calendar_events',
    timestamps: true,
    underscored: true
  });

  return CalendarEvent;
};
