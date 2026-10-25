import { useState, useRef } from 'react';

export default function UploadForm({ onAnalyze }) {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const MAX_DESC = 3000;

  function handleFile(f) {
    if (!f) return;
    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'];
    if (!allowed.includes(f.type) && !f.name.match(/\.(pdf|doc|docx|txt)$/i)) {
      setErrors(e => ({ ...e, file: 'Please upload a PDF, DOC, DOCX, or TXT file.' }));
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setErrors(e => ({ ...e, file: 'File must be under 10 MB.' }));
      return;
    }
    setFile(f);
    setErrors(e => ({ ...e, file: null }));
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  function validate() {
    const errs = {};
    if (!file) errs.file = 'Please upload your resume.';
    if (!jobTitle.trim()) errs.jobTitle = 'Job title is required.';
    if (jobDesc.trim().length < 50)
      errs.jobDesc = 'Please paste the full job description (at least 50 characters).';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onAnalyze({ file, jobTitle: jobTitle.trim(), jobDesc: jobDesc.trim() });
  }

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="upload-section">
        {/* Resume Upload */}
        <div className="card">
          <div className="card-title">
            <span>📄</span> Resume Upload
          </div>
          <div className="card-desc">
            Upload your current resume so we can analyze it.
          </div>

          <div
            className={`dropzone${dragOver ? ' drag-over' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => handleFile(e.target.files[0])}
              onClick={(e) => e.stopPropagation()}
              aria-label="Upload resume file"
            />
            <div className="dropzone-icon">📂</div>
            <p>
              <span className="drop-highlight">Click to browse</span> or drag & drop
            </p>
            <p className="drop-formats">PDF, DOC, DOCX, TXT · Max 10 MB</p>
          </div>

          {errors.file && (
            <div className="form-error">⚠ {errors.file}</div>
          )}

          {file && (
            <div className="file-selected">
              <span className="file-selected-icon">✅</span>
              <div className="file-selected-info">
                <p>{file.name}</p>
                <p>{formatBytes(file.size)}</p>
              </div>
              <button
                type="button"
                className="file-remove"
                onClick={() => { setFile(null); fileInputRef.current.value = ''; }}
                aria-label="Remove file"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Job Info */}
        <div className="card">
          <div className="card-title">
            <span>🎯</span> Target Role
          </div>
          <div className="card-desc">
            Tell us what job you're aiming for.
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="jobTitle">Job Title</label>
            <input
              id="jobTitle"
              type="text"
              className={`form-input${errors.jobTitle ? ' error' : ''}`}
              placeholder="e.g. Senior Software Engineer"
              value={jobTitle}
              onChange={(e) => {
                setJobTitle(e.target.value);
                if (errors.jobTitle) setErrors(er => ({ ...er, jobTitle: null }));
              }}
            />
            {errors.jobTitle && (
              <div className="form-error">⚠ {errors.jobTitle}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="jobDesc">Job Description</label>
            <textarea
              id="jobDesc"
              className={`form-textarea${errors.jobDesc ? ' error' : ''}`}
              placeholder="Paste the full job description here — the more detail, the better your analysis..."
              rows={7}
              maxLength={MAX_DESC}
              value={jobDesc}
              onChange={(e) => {
                setJobDesc(e.target.value);
                if (errors.jobDesc) setErrors(er => ({ ...er, jobDesc: null }));
              }}
            />
            <div className="char-count">{jobDesc.length} / {MAX_DESC}</div>
            {errors.jobDesc && (
              <div className="form-error">⚠ {errors.jobDesc}</div>
            )}
            <div className="form-hint">
              Tip: Include the full JD for the most accurate skill gap analysis.
            </div>
          </div>
        </div>
      </div>

      {/* Analyze Bar */}
      <div className="analyze-bar">
        <div className="analyze-info">
          <h3>Ready to analyze?</h3>
          <p>
            We'll score your resume, detect skill gaps, and build your roadmap instantly.
          </p>
        </div>
        <button type="submit" className="btn btn-primary btn-lg">
          🚀 Analyze Now
        </button>
      </div>
    </form>
  );
}
