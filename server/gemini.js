/**
 * Gemini API wrapper.
 *
 * Two exported functions:
 *   analyzeSkillGap(jobTitle, jobDesc, candidateSkills) → structured skill analysis + roadmap
 *   selectResources(missingSkills, jobTitle, catalogue)  → picks + prioritizes from verified catalogue
 *
 * Both functions gracefully degrade if GEMINI_API_KEY is absent —
 * callers receive a clearly-flagged "no_key" result so the frontend
 * can show appropriate messaging rather than crashing.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;

function getClient() {
  const key = process.env.GEMINI_API_KEY || '';
  if (!key || key.length <= 10 || key.startsWith('your_')) return null;
  if (!genAI) genAI = new GoogleGenerativeAI(key);
  return genAI;
}

/**
 * Parse JSON that may be wrapped in a markdown code fence.
 */
function parseGeminiJSON(raw) {
  const cleaned = raw.replace(/^```(?:json)?\n?/m, '').replace(/```\s*$/m, '').trim();
  return JSON.parse(cleaned);
}

/**
 * Ask Gemini to analyse the skill gap.
 *
 * Returns:
 * {
 *   missing: string[],
 *   partial: string[],
 *   matched: string[],
 *   ats: { score: number, breakdown: [{label, value}] },
 *   roadmap: { phases: [{title, duration, description, skills: string[]}] },
 *   resume: { tips: [{icon, title, description, priority}], keywords: string[] },
 *   source: 'gemini' | 'no_key' | 'error'
 * }
 */
export async function analyzeSkillGap({ jobTitle, jobDesc, resumeText }) {
  const client = getClient();

  if (!client) {
    return { source: 'no_key' };
  }

  const prompt = `
You are a professional career coach and ATS expert. Analyze the following resume text against the target job.

TARGET JOB TITLE: ${jobTitle}

JOB DESCRIPTION:
${jobDesc.slice(0, 4000)}

CANDIDATE RESUME TEXT:
${resumeText.slice(0, 4000)}

Return ONLY a single valid JSON object (no markdown, no explanation) with this exact structure:
{
  "missing": ["skill1", "skill2"],
  "partial": ["skill3"],
  "matched": ["skill4", "skill5"],
  "ats": {
    "score": 72,
    "breakdown": [
      {"label": "Keyword Match", "value": 78},
      {"label": "Formatting",    "value": 82},
      {"label": "Relevance",     "value": 68},
      {"label": "Completeness",  "value": 75}
    ]
  },
  "roadmap": {
    "phases": [
      {
        "title": "Phase title",
        "duration": "2–3 Weeks",
        "description": "What to do and why",
        "skills": ["skill1", "skill2"]
      }
    ]
  },
  "resume": {
    "tips": [
      {
        "icon": "📌",
        "title": "Short title",
        "description": "Concrete actionable advice",
        "priority": "high"
      }
    ],
    "keywords": ["keyword1", "keyword2"]
  }
}

Rules:
- missing: skills required by the job that are NOT in the resume
- partial: skills that appear in the resume but at a lower level than required
- matched: skills in both resume and job description
- ats.score: integer 0-100
- roadmap.phases: exactly 3 phases in learning order, each with 2-4 skills from the missing/partial lists
- resume.tips: exactly 5 tips, priority must be "high", "medium", or "low"
- resume.keywords: 10-15 high-value keywords from the job description to include in the resume
- Return ONLY valid JSON. No extra text.
`.trim();

  try {
    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const data = parseGeminiJSON(text);
    return { ...data, source: 'gemini' };
  } catch (err) {
    console.error('[Gemini analyzeSkillGap error]', err.message);
    return { source: 'error', error: err.message };
  }
}

/**
 * Ask Gemini to select and prioritize resources from the verified catalogue.
 *
 * Returns:
 * [
 *   {
 *     resourceId: string,    // must match an id in RESOURCE_CATALOGUE
 *     skill: string,
 *     why: string,           // Gemini's explanation
 *     phase: 1 | 2 | 3,     // which roadmap phase this belongs to
 *     priority: 'primary' | 'supplementary'
 *   }
 * ]
 */
export async function selectResources({ missingSkills, partialSkills, jobTitle, phases, catalogue }) {
  const client = getClient();

  if (!client) {
    return { source: 'no_key', selections: [] };
  }

  // Build a condensed catalogue string
  const catalogueStr = JSON.stringify(catalogue, null, 0);

  const prompt = `
You are a senior learning & development expert. A candidate is missing these skills for a "${jobTitle}" role:

MISSING SKILLS (priority): ${missingSkills.join(', ')}
PARTIAL SKILLS (secondary): ${partialSkills.join(', ')}

LEARNING PHASES:
${phases.map((p, i) => `Phase ${i + 1}: "${p.title}" — skills: ${(p.skills || []).join(', ')}`).join('\n')}

VERIFIED RESOURCE CATALOGUE (select ONLY from these — do NOT invent any resources):
${catalogueStr}

Task: Select the best 2-3 resources per missing skill and 1-2 per partial skill from the catalogue above.
For each selection, assign it to the most relevant phase (1, 2, or 3).
Mark the single best resource per skill as "primary", others as "supplementary".

Return ONLY a valid JSON array (no markdown) like this:
[
  {
    "resourceId": "exact-id-from-catalogue",
    "skill": "exact skill name",
    "why": "One sentence explaining why this resource is ideal for this candidate's gap",
    "phase": 1,
    "priority": "primary"
  }
]

Rules:
- resourceId MUST exactly match an "id" field from the catalogue above
- If no catalogue entry exists for a skill, omit that skill entirely
- why must be specific to WHY it helps close THIS gap
- Return ONLY valid JSON array. No extra text.
`.trim();

  try {
    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const selections = parseGeminiJSON(text);

    // Validate: filter out any selections with IDs not in the catalogue
    const validIds = new Set(catalogue.map(r => r.id));
    const validated = Array.isArray(selections)
      ? selections.filter(s => s.resourceId && validIds.has(s.resourceId))
      : [];

    return { source: 'gemini', selections: validated };
  } catch (err) {
    console.error('[Gemini selectResources error]', err.message);
    return { source: 'error', selections: [], error: err.message };
  }
}
