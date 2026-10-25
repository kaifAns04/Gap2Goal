import { useState, useEffect } from 'react';

const STEPS = [
  { id: 1, label: 'Parsing resume content…' },
  { id: 2, label: 'Scanning job description…' },
  { id: 3, label: 'Running ATS compatibility check…' },
  { id: 4, label: 'Detecting skill gaps…' },
  { id: 5, label: 'Building learning roadmap…' },
  { id: 6, label: 'Generating resume tips…' },
];

export default function LoadingState() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => {
        if (prev < STEPS.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-overlay fade-in">
      <div className="spinner" />
      <div>
        <h3>Analyzing your profile…</h3>
        <p>This takes just a few seconds</p>
      </div>
      <div className="loading-steps">
        {STEPS.map((step, i) => (
          <div
            key={step.id}
            className={`loading-step${i === activeStep ? ' active' : i < activeStep ? ' done' : ''}`}
          >
            <div className="step-dot" />
            {i < activeStep ? '✓ ' : ''}{step.label}
          </div>
        ))}
      </div>
    </div>
  );
}
