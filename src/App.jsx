import { useState, useEffect } from 'react';
import './App.css';

import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import UploadForm from './components/UploadForm';
import LoadingState from './components/LoadingState';
import Dashboard from './components/Dashboard';
import { analyzeResume, checkHealth } from './utils/apiClient';

const STEPS = [
  { label: 'Upload Resume' },
  { label: 'Add Job Details' },
  { label: 'View Results' },
];

function StepIndicator({ current }) {
  return (
    <div className="progress-steps">
      {STEPS.map((step, i) => {
        const done = current > i;
        const active = current === i;
        return (
          <div key={step.label} style={{ display: 'flex', alignItems: 'center' }}>
            <div className={`step${active ? ' active' : done ? ' done' : ''}`}>
              <div className="step-num">{done ? '✓' : i + 1}</div>
              <span className="step-label">{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`step-divider${done ? ' done' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function BackendBanner({ health }) {
  if (health === null) return null; // still checking

  if (!health.ok) {
    return (
      <div className="backend-banner backend-banner--warn">
        <span>⚠️</span>
        <span>
          Backend server not detected. Start it with{' '}
          <code>node server/index.js</code> in the project root for AI-powered results.
        </span>
      </div>
    );
  }

  if (!health.gemini) {
    return (
      <div className="backend-banner backend-banner--info">
        <span>ℹ️</span>
        <span>
          Backend running in <strong>local fallback mode</strong> — add a{' '}
          <code>GEMINI_API_KEY</code> to <code>server/.env</code> to enable AI analysis.
        </span>
      </div>
    );
  }

  return (
    <div className="backend-banner backend-banner--success">
      <span>✦</span>
      <span>Gemini AI is connected — your analysis will be powered by real AI.</span>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState('landing');
  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [results, setResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [health, setHealth] = useState(null); // null=checking, object=result

  useEffect(() => {
    checkHealth().then(setHealth);
  }, []);

  async function handleAnalyze(formData) {
    setStatus('loading');
    try {
      const data = await analyzeResume(formData);
      setResults(data);
      setStatus('done');
      setPage('dashboard');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  function handleReset() {
    setStatus('idle');
    setResults(null);
    setErrorMsg('');
    setPage('app');
  }

  const currentStep = status === 'done' ? 2 : 0;

  return (
    <>
      <Navbar page={page} setPage={setPage} hasResults={status === 'done'} />

      {page === 'landing' && (
        <LandingPage onGetStarted={() => setPage('app')} />
      )}

      {(page === 'app' || page === 'dashboard') && (
        <div className="app-page">
          <div className="app-header">
            <div className="container">
              <h1>
                {status === 'done'
                  ? '🎉 Your Analysis is Ready'
                  : '🚀 Analyze Your Resume'}
              </h1>
              <p>
                {status === 'done'
                  ? `Results for ${results?.meta?.jobTitle} — review each section below.`
                  : 'Upload your resume and paste the job description to get started.'}
              </p>
            </div>
          </div>

          <div className="app-content">
            <div className="container">
              {/* Backend status banner — show on the analyze page before results */}
              {status !== 'done' && <BackendBanner health={health} />}

              <StepIndicator current={currentStep} />

              {status === 'idle' && (
                <div className="slide-up">
                  <UploadForm onAnalyze={handleAnalyze} />
                </div>
              )}

              {status === 'loading' && <LoadingState />}

              {status === 'error' && (
                <div className="error-state fade-in">
                  <div className="error-icon">⚠️</div>
                  <h3>Analysis Failed</h3>
                  <p>{errorMsg}</p>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button className="btn btn-primary" onClick={handleReset}>
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {status === 'done' && results && (
                <div className="slide-up">
                  <Dashboard results={results} onReset={handleReset} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
