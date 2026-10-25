/**
 * Fallback analysis — used when Gemini API key is absent or the call fails.
 * Derives results from job title + description keywords, same logic as the
 * original mockAnalyzer.js, so the frontend always has data to display.
 */

import { RESOURCE_CATALOGUE, getResourcesForSkill } from './resourceCatalogue.js';

const TECH_SKILLS = {
  frontend: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Vue.js', 'GraphQL', 'Webpack', 'Jest'],
  backend: ['Node.js', 'Python', 'PostgreSQL', 'Redis', 'REST APIs', 'Docker', 'AWS', 'Express'],
  data: ['Pandas', 'NumPy', 'TensorFlow', 'PyTorch', 'SQL', 'Spark', 'Tableau', 'scikit-learn'],
  devops: ['CI/CD', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Linux', 'Prometheus', 'Ansible'],
  general: ['Git', 'Agile', 'Communication', 'Problem Solving', 'Leadership', 'System Design', 'Code Review'],
};

function detectDomain(text) {
  const t = text.toLowerCase();
  if (/(react|frontend|front.end|ui|css|angular|vue)/.test(t)) return 'frontend';
  if (/(node|backend|back.end|api|server|database|sql|postgres)/.test(t)) return 'backend';
  if (/(data|machine learning|ml|ai|python|tensorflow|pandas|analytics)/.test(t)) return 'data';
  if (/(devops|kubernetes|docker|terraform|ci.cd|sre|cloud|aws|gcp|azure)/.test(t)) return 'devops';
  return 'general';
}

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
function pick(arr, n) { return shuffle(arr).slice(0, n); }

/**
 * Build curated resource selections for a list of skills from the catalogue,
 * without needing Gemini.
 */
function buildFallbackResources(missingSkills, partialSkills, phases) {
  const selections = [];
  const seen = new Set();

  const processSkill = (skill, phaseIndex, isPrimary) => {
    const matches = getResourcesForSkill(skill);
    if (matches.length === 0) return;

    const primary = matches[0];
    const supplementary = matches.slice(1, 3);

    if (!seen.has(primary.id)) {
      seen.add(primary.id);
      selections.push({
        resourceId: primary.id,
        skill,
        why: primary.why,
        phase: phaseIndex + 1,
        priority: 'primary',
      });
    }

    supplementary.forEach(res => {
      if (!seen.has(res.id)) {
        seen.add(res.id);
        selections.push({
          resourceId: res.id,
          skill,
          why: res.why,
          phase: phaseIndex + 1,
          priority: 'supplementary',
        });
      }
    });
  };

  // Assign missing skills to phase 1, partial to phase 2
  missingSkills.forEach((skill, i) => processSkill(skill, Math.min(i < 3 ? 0 : 1, 2), true));
  partialSkills.forEach(skill => processSkill(skill, 1, false));

  return { source: 'fallback', selections };
}

export function buildFallbackAnalysis({ jobTitle, jobDesc }) {
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

  const phases = [
    {
      title: `Foundation: Core ${jobTitle} Skills`,
      duration: '2–4 Weeks',
      description: `Start by filling the most critical missing skills. Focus on ${missing.slice(0, 3).join(', ')} to get your basics solid before moving on.`,
      skills: missing.slice(0, 3),
    },
    {
      title: 'Hands-On Projects',
      duration: '4–6 Weeks',
      description: `Build 2–3 portfolio projects that showcase ${partial.slice(0, 2).join(' and ')}. Real-world projects are far more convincing to hiring managers than certifications alone.`,
      skills: partial.slice(0, 3),
    },
    {
      title: 'Interview Prep & Networking',
      duration: '2–3 Weeks',
      description: `Practice system design, behavioral interviews, and role-specific coding challenges. Start applying while building — momentum matters.`,
      skills: ['System Design', 'Problem Solving'],
    },
  ];

  const resourceResult = buildFallbackResources(missing, partial, phases);

  return {
    source: 'fallback',
    missing,
    partial,
    matched,
    ats: {
      score: clampedScore,
      breakdown: [
        { label: 'Keyword Match', value: Math.min(95, clampedScore + Math.floor(Math.random() * 10)) },
        { label: 'Formatting', value: Math.floor(60 + Math.random() * 30) },
        { label: 'Relevance', value: Math.min(95, clampedScore + Math.floor(Math.random() * 8) - 4) },
        { label: 'Completeness', value: Math.floor(55 + Math.random() * 35) },
      ],
    },
    roadmap: { phases },
    resume: {
      tips: [
        { icon: '📌', title: 'Add Missing Keywords', description: `Naturally incorporate ${missing.slice(0, 3).join(', ')} into your experience bullets.`, priority: 'high' },
        { icon: '📏', title: 'Quantify Achievements', description: 'Add numbers, percentages, or outcomes to every bullet (e.g., "reduced load time by 40%").', priority: 'high' },
        { icon: '🗂️', title: 'Tailor Your Summary', description: `Rewrite your summary to mirror the ${jobTitle} job description language.`, priority: 'medium' },
        { icon: '🎨', title: 'Clean Up Formatting', description: 'Use a single-column layout with no graphics that ATS systems cannot parse.', priority: 'medium' },
        { icon: '🔗', title: 'Add Portfolio Links', description: 'Include links to GitHub, LinkedIn, or a personal portfolio site.', priority: 'low' },
      ],
      keywords: pick([...domainSkills, ...missing.slice(0, 4)], 12),
    },
    resourceSelections: resourceResult.selections,
  };
}
