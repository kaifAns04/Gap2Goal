import { useState } from 'react';

const PLATFORM_COLORS = {
  'freeCodeCamp': '#0a0a23',
  'freeCodeCamp (YouTube)': '#ff0000',
  'MDN Web Docs': '#1d3163',
  'Microsoft Learn': '#0078d4',
  'Kaggle Learn': '#20beff',
  'GitHub Skills': '#24292e',
  'YouTube': '#ff0000',
  'TypeScript Official Docs': '#3178c6',
  'React Docs (react.dev)': '#087ea4',
  'Next.js (nextjs.org)': '#000000',
  'Docker Official Docs': '#2496ed',
  'Kubernetes Official Docs': '#326ce5',
  'HashiCorp Developer': '#000000',
  'AWS Skill Builder': '#ff9900',
  'Tailwind CSS Docs': '#06b6d4',
  'GraphQL Official Docs': '#e10098',
  'Jest Official Docs': '#c21325',
  'Webpack Official Docs': '#8dd6f9',
  'Net Ninja (YouTube)': '#ff6b6b',
  'Traversy Media (YouTube)': '#ff6b6b',
  'Vue.js Docs': '#42b883',
};

const TYPE_ICONS = {
  video: '▶️',
  course: '🎓',
  tutorial: '📝',
  documentation: '📖',
};

const LEVEL_BADGES = {
  beginner: { label: 'Beginner', color: 'var(--success)' },
  intermediate: { label: 'Intermediate', color: 'var(--warning)' },
};

function ResourceCard({ resource }) {
  const levelInfo = LEVEL_BADGES[resource.level] || LEVEL_BADGES.beginner;
  const typeIcon = TYPE_ICONS[resource.type] || '📚';
  const accentColor = PLATFORM_COLORS[resource.platform] || 'var(--primary)';

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="resource-card"
      aria-label={`${resource.title} on ${resource.platform}`}
    >
      <div className="resource-card-accent" style={{ background: accentColor }} />

      <div className="resource-card-body">
        {/* Header row */}
        <div className="resource-card-header">
          <span className="resource-type-icon">{typeIcon}</span>
          <span
            className="resource-level-badge"
            style={{ color: levelInfo.color, borderColor: levelInfo.color }}
          >
            {levelInfo.label}
          </span>
          {resource.priority === 'primary' && (
            <span className="resource-primary-badge">⭐ Top Pick</span>
          )}
        </div>

        {/* Title */}
        <h4 className="resource-card-title">{resource.title}</h4>

        {/* Platform + Skill */}
        <div className="resource-card-meta">
          <span className="resource-platform">
            {resource.platformIcon} {resource.platform}
          </span>
          <span className="resource-skill-tag">{resource.skill}</span>
        </div>

        {/* Why */}
        <p className="resource-card-why">{resource.why}</p>

        {/* Footer */}
        <div className="resource-card-footer">
          {resource.duration && (
            <span className="resource-duration">⏱ {resource.duration}</span>
          )}
          <span className="resource-link-label">Open resource →</span>
        </div>
      </div>
    </a>
  );
}

export default function ResourceCards({ resources, phases }) {
  const [activePhase, setActivePhase] = useState('all');

  if (!resources || resources.length === 0) {
    return (
      <div className="resource-cards-card fade-in">
        <div className="dashboard-section-title">
          <div className="section-icon">📚</div>
          Learning Resources
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: 14, padding: '24px 0' }}>
          No resources found for the identified skill gaps.
        </div>
      </div>
    );
  }

  // Group by phase
  const phases123 = [1, 2, 3];
  const byPhase = {};
  phases123.forEach(p => { byPhase[p] = []; });
  resources.forEach(r => {
    const ph = r.phase || 1;
    if (!byPhase[ph]) byPhase[ph] = [];
    byPhase[ph].push(r);
  });

  const filtered = activePhase === 'all'
    ? resources
    : byPhase[Number(activePhase)] || [];

  const phaseTitle = (phaseNum) => {
    const phase = phases?.[phaseNum - 1];
    return phase?.title || `Phase ${phaseNum}`;
  };

  return (
    <div className="resource-cards-card fade-in">
      <div className="dashboard-section-title">
        <div className="section-icon">📚</div>
        Learning Resources
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
        Hand-picked free resources for every skill gap — matched to your roadmap phases.
        All links open the actual course or tutorial page.
      </p>

      {/* Phase filter tabs */}
      <div className="resource-phase-tabs">
        <button
          className={`phase-tab${activePhase === 'all' ? ' active' : ''}`}
          onClick={() => setActivePhase('all')}
        >
          All ({resources.length})
        </button>
        {phases123.map(p => (
          byPhase[p].length > 0 && (
            <button
              key={p}
              className={`phase-tab${activePhase === String(p) ? ' active' : ''}`}
              onClick={() => setActivePhase(String(p))}
            >
              Phase {p} ({byPhase[p].length})
            </button>
          )
        ))}
      </div>

      {/* Phase label when filtering */}
      {activePhase !== 'all' && (
        <div className="resource-phase-label">
          {phaseTitle(Number(activePhase))}
        </div>
      )}

      {/* Cards grid */}
      <div className="resource-cards-grid">
        {filtered.map(resource => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>

      <p className="resource-disclaimer">
        🔒 All resources are free. Links open the official course or platform page —
        no invented URLs or video IDs.
      </p>
    </div>
  );
}
