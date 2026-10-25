export default function SkillGap({ data }) {
  const { missing, partial, matched } = data;

  return (
    <div className="skill-gap-card fade-in">
      <div className="dashboard-section-title">
        <div className="section-icon">🔍</div>
        Skill Gap Analysis
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
        Comparing your resume against the job description requirements. 
        Address the missing skills first for maximum impact.
      </p>

      {missing.length > 0 && (
        <div>
          <div className="skill-section-label missing">
            ✕ Missing Skills ({missing.length})
          </div>
          <div className="skills-list">
            {missing.map(skill => (
              <span key={skill} className="skill-tag missing">✕ {skill}</span>
            ))}
          </div>
        </div>
      )}

      {partial.length > 0 && (
        <div>
          <div className="skill-section-label partial">
            ◑ Partial Match ({partial.length})
          </div>
          <div className="skills-list">
            {partial.map(skill => (
              <span key={skill} className="skill-tag partial">~ {skill}</span>
            ))}
          </div>
        </div>
      )}

      {matched.length > 0 && (
        <div>
          <div className="skill-section-label matched">
            ✓ Already Matched ({matched.length})
          </div>
          <div className="skills-list">
            {matched.map(skill => (
              <span key={skill} className="skill-tag matched">✓ {skill}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
