import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { analyzeSkillGap, selectResources } from './gemini.js';
import { buildFallbackAnalysis } from './fallback.js';
import { RESOURCE_CATALOGUE, getCatalogueForPrompt } from './resourceCatalogue.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'] }));
app.use(express.json({ limit: '2mb' }));

/**
 * Health check
 */
app.get('/api/health', (_req, res) => {
  const key = process.env.GEMINI_API_KEY || '';
  const geminiReady = key.length > 10 && !key.startsWith('your_');
  res.json({
    ok: true,
    gemini: geminiReady,
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /api/analyze
 *
 * Body: { jobTitle: string, jobDesc: string, resumeText: string, fileName: string }
 *
 * Returns the full analysis including resourceSelections.
 */
app.post('/api/analyze', async (req, res) => {
  const { jobTitle, jobDesc, resumeText = '', fileName = 'resume' } = req.body;

  if (!jobTitle?.trim() || !jobDesc?.trim()) {
    return res.status(400).json({ error: 'jobTitle and jobDesc are required.' });
  }

  try {
    let analysis;
    const rawKey = process.env.GEMINI_API_KEY || '';
    const hasKey = rawKey.length > 10 && !rawKey.startsWith('your_');

    if (!hasKey) {
      // No API key — use the deterministic fallback (already includes resourceSelections)
      console.log('[analyze] No GEMINI_API_KEY — using fallback');
      analysis = buildFallbackAnalysis({ jobTitle, jobDesc });
    } else {
      // Step 1: Gemini skill gap analysis
      console.log('[analyze] Calling Gemini for skill gap analysis…');
      const geminiResult = await analyzeSkillGap({ jobTitle, jobDesc, resumeText });

      if (geminiResult.source === 'error' || geminiResult.source === 'no_key') {
        console.warn('[analyze] Gemini failed, falling back:', geminiResult.error);
        analysis = buildFallbackAnalysis({ jobTitle, jobDesc });
      } else {
        // Step 2: Gemini picks resources from the verified catalogue
        console.log('[analyze] Calling Gemini for resource selection…');
        const catalogue = getCatalogueForPrompt();
        const resourceResult = await selectResources({
          missingSkills: geminiResult.missing || [],
          partialSkills: geminiResult.partial || [],
          jobTitle,
          phases: geminiResult.roadmap?.phases || [],
          catalogue,
        });

        analysis = {
          source: 'gemini',
          ...geminiResult,
          resourceSelections: resourceResult.selections || [],
        };
      }
    }

    // Hydrate resourceSelections with full catalogue data
    const catalogueById = Object.fromEntries(RESOURCE_CATALOGUE.map(r => [r.id, r]));
    const hydratedResources = (analysis.resourceSelections || [])
      .map(sel => {
        const catalogueEntry = catalogueById[sel.resourceId];
        if (!catalogueEntry) return null;
        return {
          ...catalogueEntry,
          why: sel.why || catalogueEntry.why,
          phase: sel.phase || 1,
          priority: sel.priority || 'supplementary',
        };
      })
      .filter(Boolean);

    const response = {
      ats: analysis.ats,
      skills: {
        missing: analysis.missing || [],
        partial: analysis.partial || [],
        matched: analysis.matched || [],
      },
      roadmap: analysis.roadmap,
      resume: analysis.resume,
      resources: hydratedResources,
      meta: {
        fileName,
        jobTitle,
        analyzedAt: new Date().toISOString(),
        source: analysis.source,
      },
    };

    res.json(response);
  } catch (err) {
    console.error('[/api/analyze error]', err);
    res.status(500).json({ error: 'Analysis failed. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`\n✅ Gap2Goal API server running on http://localhost:${PORT}`);
  console.log(`   Gemini API key: ${process.env.GEMINI_API_KEY ? '✓ configured' : '✗ not set (fallback mode)'}\n`);
});
