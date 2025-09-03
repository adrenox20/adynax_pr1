import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <div>Loading...</div>;
  }

  const features = [
    {
      title: '🚀 Coding Portal',
      description: 'Practice coding problems and improve your skills',
      path: '/coding',
      color: '#667eea',
      icon: '💻'
    },
    {
      title: '🤖 AI Learning Plans',
      description: 'Get personalized learning paths tailored to your goals',
      path: '/ai-plans',
      color: '#10b981',
      icon: '🎯'
    },
    {
      title: '📚 Courses',
      description: 'Browse and enroll in structured learning courses',
      path: '/courses',
      color: '#f59e0b',
      icon: '📖',
      comingSoon: true
    },
    {
      title: '📅 Calendar',
      description: 'Manage your learning schedule and assignments',
      path: '/calendar',
      color: '#ef4444',
      icon: '📅',
      comingSoon: true
    },
    {
      title: '💬 Chat & Collaboration',
      description: 'Connect with peers and mentors',
      path: '/chat',
      color: '#8b5cf6',
      icon: '💬',
      comingSoon: true
    },
    {
      title: '📊 Analytics',
      description: 'Track your progress and performance',
      path: '/analytics',
      color: '#06b6d4',
      icon: '📈',
      comingSoon: true
    }
  ];

  const handleFeatureClick = (feature: any) => {
    if (feature.comingSoon) {
      alert('This feature is coming soon! 🚀');
    } else {
      navigate(feature.path);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="user-info">
          <h1>Welcome back, {user.firstName}! 👋</h1>
          <p>Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
          <p>Ready to continue your learning journey?</p>
        </div>
        <button onClick={logout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>🎓 AI-LMS Platform</h2>
          <p>Your comprehensive learning management system with AI-powered features</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`feature-card ${feature.comingSoon ? 'coming-soon' : ''}`}
              onClick={() => handleFeatureClick(feature)}
              style={{ borderLeftColor: feature.color }}
            >
              <div className="feature-icon" style={{ backgroundColor: feature.color }}>
                {feature.icon}
              </div>
              <div className="feature-content">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                {feature.comingSoon && (
                  <span className="coming-soon-badge">Coming Soon</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="quick-stats">
          <h2>📊 Quick Overview</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-info">
                <h3>Active Plans</h3>
                <p>0</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💻</div>
              <div className="stat-info">
                <h3>Problems Solved</h3>
                <p>0</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-info">
                <h3>Study Time</h3>
                <p>0 hrs</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-info">
                <h3>Streak</h3>
                <p>0 days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="recent-activity">
          <h2>🕒 Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">🎉</div>
              <div className="activity-content">
                <p>Welcome to AI-LMS! Start exploring the platform.</p>
                <span className="activity-time">Just now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
