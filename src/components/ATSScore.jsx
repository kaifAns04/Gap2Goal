import { useEffect, useState } from 'react';

function getScoreColor(score) {
  if (score >= 75) return 'var(--success)';
  if (score >= 50) return 'var(--warning)';
  return 'var(--error)';
}

function getScoreLabel(score) {
  if (score >= 80) return 'Excellent Match';
  if (score >= 65) return 'Good Match';
  if (score >= 50) return 'Moderate Match';
  return 'Needs Improvement';
}

function RingChart({ score }) {
  const [animated, setAnimated] = useState(0);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(t);
  }, [score]);

  const offset = circumference - (animated / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="ats-ring">
      <svg viewBox="0 0 120 120">
        <circle className="ats-ring-track" cx="60" cy="60" r={radius} />
        <circle
          className="ats-ring-fill"
          cx="60"
          cy="60"
          r={radius}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s ease' }}
        />
      </svg>
      <div className="ats-center">
        <span className="ats-num" style={{ color }}>{score}</span>
        <span className="ats-label">/ 100</span>
      </div>
    </div>
  );
}

export default function ATSScore({ data }) {
  const { score, breakdown } = data;
  const color = getScoreColor(score);

  return (
    <div className="ats-card fade-in">
      <div className="dashboard-section-title">
        <div className="section-icon">📊</div>
        ATS Compatibility Score
      </div>

      <div className="ats-score-wrap">
        <RingChart score={score} />
        <div className="ats-details">
          <h3 style={{ color }}>{getScoreLabel(score)}</h3>
          <p>
            Your resume scores <strong style={{ color }}>{score}/100</strong> for ATS
            compatibility with the target role. {score >= 70
              ? 'You have a strong foundation — fine-tune the keywords for an even better match.'
              : 'Focus on the skill gaps below to significantly improve this score.'}
          </p>
          <div className="ats-breakdown">
            {breakdown.map((item) => (
              <div className="breakdown-item" key={item.label}>
                <span className="breakdown-label">{item.label}</span>
                <div className="breakdown-bar">
                  <div
                    className="breakdown-fill"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
                <span className="breakdown-val">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
