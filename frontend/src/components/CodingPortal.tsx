import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './CodingPortal.css';

interface Problem {
  id: number;
  title: string;
  statement: string;
  track: string;
  difficulty: string;
  tags: string[];
  test_cases: any[];
  time_limit: number;
  memory_limit: number;
}

interface Submission {
  id: number;
  problem_id: number;
  code: string;
  language: string;
  status: string;
  verdict?: string;
  score?: number;
  execution_time?: number;
  memory_used?: number;
  output?: string;
  error_message?: string;
  created_at: string;
}

const CodingPortal: React.FC = () => {
  const { user } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    track: '',
    difficulty: '',
    search: ''
  });

  const languages = [
    { value: 'python', label: 'Python 3', extension: '.py' },
    { value: 'javascript', label: 'JavaScript', extension: '.js' },
    { value: 'java', label: 'Java', extension: '.java' },
    { value: 'cpp', label: 'C++', extension: '.cpp' }
  ];

  useEffect(() => {
    fetchProblems();
    if (user) {
      fetchSubmissions();
    }
  }, [user]);

  const fetchProblems = async () => {
    try {
      const response = await fetch(`http://localhost:5002/api/problems?track=${filter.track}&difficulty=${filter.difficulty}&search=${filter.search}`);
      const data = await response.json();
      if (data.success) {
        setProblems(data.data.problems);
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5002/api/submissions/my', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSubmissions(data.data.submissions);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedProblem || !code.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5002/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          problem_id: selectedProblem.id,
          code: code,
          language: language
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Code submitted successfully! Check back in a few seconds for results.');
        fetchSubmissions();
        setCode('');
      } else {
        alert('Submission failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error submitting code:', error);
      alert('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return '#10b981';
      case 'wrong_answer': return '#ef4444';
      case 'time_limit_exceeded': return '#f59e0b';
      case 'runtime_error': return '#8b5cf6';
      case 'pending': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="coding-portal">
      <div className="portal-header">
        <h1>🚀 Coding Portal</h1>
        <p>Practice coding problems and improve your skills</p>
      </div>

      <div className="portal-content">
        {/* Problems List */}
        <div className="problems-section">
          <div className="section-header">
            <h2>📚 Problems</h2>
            <div className="filters">
              <select 
                value={filter.track} 
                onChange={(e) => setFilter({...filter, track: e.target.value})}
                className="filter-select"
              >
                <option value="">All Tracks</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="javascript">JavaScript</option>
                <option value="cpp">C++</option>
              </select>
              <select 
                value={filter.difficulty} 
                onChange={(e) => setFilter({...filter, difficulty: e.target.value})}
                className="filter-select"
              >
                <option value="">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <input
                type="text"
                placeholder="Search problems..."
                value={filter.search}
                onChange={(e) => setFilter({...filter, search: e.target.value})}
                className="search-input"
              />
              <button onClick={fetchProblems} className="filter-btn">Apply</button>
            </div>
          </div>

          <div className="problems-grid">
            {problems.map((problem) => (
              <div 
                key={problem.id} 
                className={`problem-card ${selectedProblem?.id === problem.id ? 'selected' : ''}`}
                onClick={() => setSelectedProblem(problem)}
              >
                <div className="problem-header">
                  <h3>{problem.title}</h3>
                  <div className="problem-meta">
                    <span className={`difficulty ${problem.difficulty}`}>
                      {problem.difficulty}
                    </span>
                    <span className="track">{problem.track}</span>
                  </div>
                </div>
                <p className="problem-statement">
                  {problem.statement.substring(0, 150)}...
                </p>
                <div className="problem-tags">
                  {problem.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
                <div className="problem-stats">
                  <span>⏱️ {problem.time_limit}ms</span>
                  <span>💾 {problem.memory_limit}MB</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Code Editor */}
        {selectedProblem && (
          <div className="editor-section">
            <div className="problem-details">
              <h2>{selectedProblem.title}</h2>
              <div className="problem-info">
                <span className={`difficulty ${selectedProblem.difficulty}`}>
                  {selectedProblem.difficulty}
                </span>
                <span className="track">{selectedProblem.track}</span>
                <span>⏱️ {selectedProblem.time_limit}ms</span>
                <span>💾 {selectedProblem.memory_limit}MB</span>
              </div>
              <div className="problem-description">
                <h3>Problem Statement:</h3>
                <p>{selectedProblem.statement}</p>
                
                <h3>Test Cases:</h3>
                <div className="test-cases">
                  {selectedProblem.test_cases.map((testCase, index) => (
                    <div key={index} className="test-case">
                      <strong>Input:</strong> {JSON.stringify(testCase.input)}
                      <strong>Expected Output:</strong> {JSON.stringify(testCase.output)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="code-editor">
              <div className="editor-header">
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="language-select"
                >
                  {languages.map(lang => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
                <button 
                  onClick={handleSubmit} 
                  disabled={loading || !code.trim()}
                  className="submit-btn"
                >
                  {loading ? 'Submitting...' : 'Submit Code'}
                </button>
              </div>
              
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`Write your ${language} code here...`}
                className="code-textarea"
                rows={20}
              />
              
              <div className="editor-footer">
                <span className="file-info">
                  {selectedProblem.title.toLowerCase().replace(/\s+/g, '_')}
                  {languages.find(l => l.value === language)?.extension}
                </span>
                <span className="char-count">
                  {code.length} characters
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Submissions History */}
        <div className="submissions-section">
          <h2>📝 My Submissions</h2>
          <div className="submissions-table">
            <table>
              <thead>
                <tr>
                  <th>Problem</th>
                  <th>Language</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th>Time</th>
                  <th>Memory</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission.id}>
                    <td>{problems.find(p => p.id === submission.problem_id)?.title || 'Unknown'}</td>
                    <td>{submission.language}</td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(submission.status) }}
                      >
                        {submission.status}
                      </span>
                    </td>
                    <td>{submission.score || '-'}</td>
                    <td>{submission.execution_time ? `${submission.execution_time}ms` : '-'}</td>
                    <td>{submission.memory_used ? `${Math.round(submission.memory_used / 1024)}MB` : '-'}</td>
                    <td>{new Date(submission.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingPortal;
