const features = [
  {
    icon: '📊',
    title: 'ATS Score Analysis',
    desc: 'Instantly score your resume against Applicant Tracking Systems to maximize your chances of getting past the first filter.',
  },
  {
    icon: '🔍',
    title: 'Skill Gap Detection',
    desc: 'Compare your current skills against your target role and see exactly what you need to learn to close the gap.',
  },
  {
    icon: '🗺️',
    title: 'Learning Roadmap',
    desc: 'Get a personalized, phase-by-phase plan with recommended resources, timelines, and milestones.',
  },
  {
    icon: '✍️',
    title: 'Resume Builder Tips',
    desc: 'Receive targeted suggestions to optimize keywords, formatting, and content for your specific target job.',
  },
];

export default function LandingPage({ onGetStarted }) {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-glow hero-glow-1" />
          <div className="hero-glow hero-glow-2" />
        </div>

        <div className="hero-badge">
          <span>✨</span>
          <span>AI-Powered Career Intelligence</span>
        </div>

        <h1>
          Bridge the Gap
          <br />
          <span className="gradient-text">Between You & Your Dream Job</span>
        </h1>

        <p className="hero-tagline">
          Upload your resume, paste the job description, and get instant ATS scoring,
          skill gap analysis, and a personalized learning roadmap — all in seconds.
        </p>

        <div className="hero-cta">
          <button className="btn btn-primary btn-lg" onClick={onGetStarted}>
            Analyze My Resume →
          </button>
          <button
            className="btn btn-ghost btn-lg"
            onClick={() =>
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            See How It Works
          </button>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-value">93%</div>
            <div className="stat-label">ATS Pass Rate</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">4×</div>
            <div className="stat-label">More Interviews</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">2 min</div>
            <div className="stat-label">Analysis Time</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">Free</div>
            <div className="stat-label">No Credit Card</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <div className="section-label">What You Get</div>
            <h2>
              Everything you need to
              <br />
              <span className="gradient-text">land your next role</span>
            </h2>
            <p>Four powerful tools working together to supercharge your job search.</p>
          </div>
          <div className="features-grid">
            {features.map((f) => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 56 }}>
            <button className="btn btn-primary btn-lg" onClick={onGetStarted}>
              Start For Free →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>
            Built with ❤️ at the hackathon ·{' '}
            <span>Gap2Goal AI</span> · {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </>
  );
}
