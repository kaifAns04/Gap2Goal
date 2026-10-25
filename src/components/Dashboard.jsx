import ATSScore from './ATSScore';
import SkillGap from './SkillGap';
import Roadmap from './Roadmap';
import ResumeBuilder from './ResumeBuilder';
import ResourceCards from './ResourceCards';

export default function Dashboard({ results, onReset }) {
  const { ats, skills, roadmap, resume, resources, meta } = results;

  return (
    <div className="dashboard">
      {/* Meta bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          padding: '16px 24px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          fontSize: 14,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--text-muted)' }}>
            📄 <strong style={{ color: 'var(--text)' }}>{meta.fileName}</strong>
          </span>
          <span style={{ color: 'var(--text-muted)' }}>
            🎯 <strong style={{ color: 'var(--text)' }}>{meta.jobTitle}</strong>
          </span>
          <span style={{ color: 'var(--text-subtle)', fontSize: 12 }}>
            Analyzed {new Date(meta.analyzedAt).toLocaleTimeString()}
          </span>
          {meta.source && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 100,
                background: meta.source === 'gemini'
                  ? 'rgba(16,185,129,0.12)'
                  : 'rgba(99,102,241,0.12)',
                color: meta.source === 'gemini'
                  ? 'var(--success)'
                  : 'var(--primary-light)',
                border: `1px solid ${meta.source === 'gemini'
                  ? 'rgba(16,185,129,0.3)'
                  : 'rgba(99,102,241,0.3)'}`,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {meta.source === 'gemini' ? '✦ Gemini AI' : '⚙ Local Analysis'}
            </span>
          )}
        </div>
        <button className="btn btn-outline btn-sm" onClick={onReset}>
          ↺ New Analysis
        </button>
      </div>

      {/* ATS Score */}
      <ATSScore data={ats} />

      {/* Skill Gap + Roadmap side-by-side on wide screens */}
      <div className="dashboard-grid">
        <SkillGap data={skills} />
        <Roadmap data={roadmap} />
      </div>

      {/* Resource Cards — full width */}
      <ResourceCards
        resources={resources || []}
        phases={roadmap?.phases || []}
      />

      {/* Resume Builder full-width */}
      <ResumeBuilder data={resume} />
    </div>
  );
}
