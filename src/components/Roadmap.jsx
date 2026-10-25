export default function Roadmap({ data }) {
  const { phases } = data;

  return (
    <div className="roadmap-card fade-in">
      <div className="dashboard-section-title">
        <div className="section-icon">🗺️</div>
        Learning Roadmap
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
        A structured, phase-by-phase plan to close your skill gaps.
        Each phase links directly to the curated resources below.
      </p>

      <div className="roadmap-phases">
        {phases.map((phase, i) => (
          <div className="roadmap-phase" key={phase.title}>
            <div className="phase-line-wrap">
              <div className={`phase-dot phase-${(i % 3) + 1}`}>
                {i + 1}
              </div>
              {i < phases.length - 1 && <div className="phase-connector" />}
            </div>
            <div className="phase-content">
              <div className="phase-header">
                <span className="phase-title">{phase.title}</span>
                <span className="phase-duration">{phase.duration}</span>
              </div>
              <p className="phase-desc">{phase.description}</p>

              {/* Skills targeted in this phase */}
              {phase.skills && phase.skills.length > 0 && (
                <div className="phase-skills">
                  {phase.skills.map(skill => (
                    <span key={skill} className="phase-skill-tag">{skill}</span>
                  ))}
                </div>
              )}

              {/* Legacy plain-text resources (fallback when no skills array) */}
              {(!phase.skills || phase.skills.length === 0) && phase.resources && (
                <div className="phase-resources">
                  {phase.resources.map(res => (
                    <span key={res} className="resource-tag">📚 {res}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
