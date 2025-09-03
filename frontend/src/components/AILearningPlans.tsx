import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './AILearningPlans.css';

interface AIPlan {
  id: number;
  track: string;
  days: number;
  title: string;
  status: string;
  created_at: string;
}

const AILearningPlans: React.FC = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<AIPlan[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    track: 'python',
    days: 30,
    title: ''
  });

  useEffect(() => {
    if (user) {
      fetchPlans();
    }
  }, [user]);

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5002/api/ai-plans/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setPlans(data.data.plans);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const handleCreatePlan = async () => {
    if (!formData.title.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5002/api/ai-plans/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        alert('AI Learning Plan generated successfully!');
        setShowCreateForm(false);
        setFormData({ track: 'python', days: 30, title: '' });
        fetchPlans();
      } else {
        alert('Failed to create plan: ' + data.message);
      }
    } catch (error) {
      console.error('Error creating plan:', error);
      alert('Failed to create plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-learning-plans">
      <div className="plans-header">
        <h1>🤖 AI Learning Plans</h1>
        <p>Get personalized learning paths tailored to your goals</p>
        <button onClick={() => setShowCreateForm(true)} className="create-plan-btn">
          ✨ Create New Plan
        </button>
      </div>

      <div className="plans-content">
        {showCreateForm && (
          <div className="create-plan-modal">
            <div className="modal-content">
              <h2>Create AI Learning Plan</h2>
              <div className="form-group">
                <label>Learning Track</label>
                <select 
                  value={formData.track} 
                  onChange={(e) => setFormData({...formData, track: e.target.value})}
                >
                  <option value="python">🐍 Python</option>
                  <option value="java">☕ Java</option>
                  <option value="javascript">🟨 JavaScript</option>
                  <option value="cpp">⚡ C++</option>
                </select>
              </div>
              <div className="form-group">
                <label>Duration (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={formData.days}
                  onChange={(e) => setFormData({...formData, days: parseInt(e.target.value)})}
                />
              </div>
              <div className="form-group">
                <label>Plan Title</label>
                <input
                  type="text"
                  placeholder="e.g., Python Web Development in 30 Days"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="form-actions">
                <button onClick={() => setShowCreateForm(false)}>Cancel</button>
                <button onClick={handleCreatePlan} disabled={loading || !formData.title.trim()}>
                  {loading ? 'Creating...' : 'Create Plan'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="plans-grid">
          {plans.map((plan) => (
            <div key={plan.id} className="plan-card">
              <h3>{plan.title}</h3>
              <p>Track: {plan.track}</p>
              <p>Duration: {plan.days} days</p>
              <p>Status: {plan.status}</p>
              <p>Created: {new Date(plan.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>

        {plans.length === 0 && (
          <div className="empty-state">
            <h3>No Learning Plans Yet</h3>
            <p>Create your first AI-powered learning plan!</p>
            <button onClick={() => setShowCreateForm(true)}>Create Your First Plan</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AILearningPlans;
