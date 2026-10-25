export default function ResumeBuilder({ data }) {
  const { tips, keywords } = data;

  return (
    <div className="resume-builder-card fade-in">
      <div className="dashboard-section-title">
        <div className="section-icon">✍️</div>
        Resume Builder Tips
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
        Actionable improvements to boost your resume's performance for this specific role.
      </p>

      <div className="resume-tips">
        {tips.map((tip, i) => (
          <div className="resume-tip" key={i}>
            <div className="tip-icon">{tip.icon}</div>
            <div className="tip-content">
              <h4>{tip.title}</h4>
              <p>{tip.description}</p>
            </div>
            <div className="tip-priority">
              <span className={`priority-badge ${tip.priority}`}>
                {tip.priority}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="resume-section-divider" />

      <div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 1,
            color: 'var(--primary-light)',
            marginBottom: 14,
          }}
        >
          🔑 High-Value Keywords to Include
        </div>
        <div className="keyword-list">
          {keywords.map(kw => (
            <span key={kw} className="keyword-tag">{kw}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
