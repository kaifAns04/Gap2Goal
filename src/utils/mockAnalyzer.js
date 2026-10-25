/**
 * Mock analyzer — simulates what an AI backend would return.
 * In production, replace this with a real API call.
 * Results are derived from keywords in the job title and description
 * so they feel relevant rather than completely random.
 */

const TECH_SKILLS = {
  frontend: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Vue.js', 'GraphQL', 'Webpack', 'Jest'],
  backend: ['Node.js', 'Python', 'PostgreSQL', 'Redis', 'REST APIs', 'Docker', 'AWS', 'Express'],
  data: ['Pandas', 'NumPy', 'TensorFlow', 'PyTorch', 'SQL', 'Spark', 'Tableau', 'scikit-learn'],
  devops: ['CI/CD', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Linux', 'Prometheus', 'Ansible'],
  general: ['Git', 'Agile', 'Communication', 'Problem Solving', 'Leadership', 'System Design', 'Code Review'],
};

const RESOURCES = {
  frontend: ['freeCodeCamp', 'Scrimba', 'Frontend Masters', 'The Odin Project', 'CSS-Tricks'],
  backend: ['Udemy', 'Backend.dev', 'Node.js Docs', 'DigitalOcean Tutorials', 'Fireship.io'],
  data: ['Kaggle', 'fast.ai', 'Coursera ML', 'DataCamp', 'Google ML Crash Course'],
  devops: ['Linux Foundation', 'KodeKloud', 'A Cloud Guru', 'Docker Docs', 'CNCF Training'],
  general: ['LinkedIn Learning', 'Pluralsight', 'YouTube', 'Medium', 'Dev.to'],
};

function detectDomain(text) {
  const t = text.toLowerCase();
  if (/(react|frontend|front.end|ui|css|angular|vue)/.test(t)) return 'frontend';
  if (/(node|backend|back.end|api|server|database|sql|postgres)/.test(t)) return 'backend';
  if (/(data|machine learning|ml|ai|python|tensorflow|pandas|analytics)/.test(t)) return 'data';
  if (/(devops|kubernetes|docker|terraform|ci.cd|sre|cloud|aws|gcp|azure)/.test(t)) return 'devops';
  return 'general';
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function pick(arr, n) {
  return shuffle(arr).slice(0, n);
}

export async function analyzeResume({ file, jobTitle, jobDesc }) {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 3200));

  const domain = detectDomain(jobTitle + ' ' + jobDesc);
  const domainSkills = TECH_SKILLS[domain];
  const generalSkills = TECH_SKILLS.general;
  const allSkills = [...domainSkills, ...generalSkills];
  const shuffled = shuffle(allSkills);

  const matchedCount = Math.floor(allSkills.length * 0.35);
  const partialCount = Math.floor(allSkills.length * 0.2);
  const missingCount = Math.floor(allSkills.length * 0.25);

  const matched = shuffled.slice(0, matchedCount);
  const partial = shuffled.slice(matchedCount, matchedCount + partialCount);
  const missing = shuffled.slice(matchedCount + partialCount, matchedCount + partialCount + missingCount);

  const score = Math.floor(
    (matched.length / (matched.length + partial.length * 0.5 + missing.length)) * 100
  );
  const clampedScore = Math.min(92, Math.max(28, score));

  const domainResources = RESOURCES[domain];
  const generalResources = RESOURCES.general;

  return {
    ats: {
      score: clampedScore,
      breakdown: [
        { label: 'Keyword Match', value: Math.min(95, clampedScore + Math.floor(Math.random() * 10)) },
        { label: 'Formatting',    value: Math.floor(60 + Math.random() * 30) },
        { label: 'Relevance',     value: Math.min(95, clampedScore + Math.floor(Math.random() * 8) - 4) },
        { label: 'Completeness',  value: Math.floor(55 + Math.random() * 35) },
      ],
    },
    skills: { missing, partial, matched },
    roadmap: {
      phases: [
        {
          title: `Foundation: Core ${jobTitle} Skills`,
          duration: '2–4 Weeks',
          description: `Start by filling the most critical missing skills. Focus on ${missing.slice(0, 3).join(', ')} to get your basics solid before moving on.`,
          resources: pick([...domainResources, ...generalResources], 3),
        },
        {
          title: 'Hands-On Projects',
          duration: '4–6 Weeks',
          description: `Build 2–3 portfolio projects that showcase ${partial.slice(0, 2).join(' and ')}. Real-world projects are far more convincing to hiring managers than certifications alone.`,
          resources: pick([...domainResources, 'GitHub', 'Portfolio Builder'], 3),
        },
        {
          title: 'Interview Prep & Networking',
          duration: '2–3 Weeks',
          description: `Practice system design, behavioral interviews, and role-specific coding challenges. Start applying while building — momentum matters.`,
          resources: pick(['LeetCode', 'Pramp', 'Glassdoor', 'LinkedIn', ...generalResources], 3),
        },
      ],
    },
    resume: {
      tips: [
        {
          icon: '📌',
          title: 'Add Missing Keywords',
          description: `Naturally incorporate ${missing.slice(0, 3).join(', ')} into your experience bullets and skills section to pass ATS filters.`,
          priority: 'high',
        },
        {
          icon: '📏',
          title: 'Quantify Achievements',
          description: 'Every bullet point should answer "so what?" — add numbers, percentages, or business outcomes (e.g., "reduced load time by 40%").',
          priority: 'high',
        },
        {
          icon: '🗂️',
          title: 'Tailor Your Summary',
          description: `Rewrite your professional summary to mirror the language in this ${jobTitle} job description. Use the exact job title they mention.`,
          priority: 'medium',
        },
        {
          icon: '🎨',
          title: 'Clean Up Formatting',
          description: 'Use a single-column layout, standard fonts, and no graphics/tables that ATS systems struggle to parse.',
          priority: 'medium',
        },
        {
          icon: '🔗',
          title: 'Add Portfolio Links',
          description: 'Include links to GitHub, LinkedIn, or a personal site. Hiring managers for this role will want to see your work.',
          priority: 'low',
        },
      ],
      keywords: pick([...domainSkills, ...missing.slice(0, 4)], 12),
    },
    meta: {
      fileName: file.name,
      jobTitle,
      analyzedAt: new Date().toISOString(),
    },
  };
}
