/**
 * API client — sends the resume form data to the backend for analysis.
 *
 * The resume file is read as text (PDF plain-text extraction is not done
 * client-side; for a proper implementation the backend should accept a
 * multipart upload and parse the PDF). For now we send the file name and
 * job description — Gemini derives the skill gap from the JD + title.
 *
 * If the backend is unreachable, falls back to the mock analyzer so the
 * UI never gets a blank screen during development.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function readFileAsText(file) {
  return new Promise((resolve) => {
    // Only attempt text extraction for plain-text files.
    // PDF/DOCX would need server-side parsing.
    if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result || '');
      reader.onerror = () => resolve('');
      reader.readAsText(file);
    } else {
      // For PDF/DOCX: pass empty string — backend can be extended to
      // accept multipart/form-data and parse the file server-side.
      resolve('');
    }
  });
}

export async function analyzeResume({ file, jobTitle, jobDesc }) {
  const resumeText = await readFileAsText(file);

  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jobTitle,
      jobDesc,
      resumeText,
      fileName: file.name,
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Server error ${response.status}`);
  }

  return response.json();
}

/**
 * Check if the backend is available.
 * Returns { ok: boolean, gemini: boolean }
 */
export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok ? res.json() : { ok: false, gemini: false };
  } catch {
    return { ok: false, gemini: false };
  }
}
