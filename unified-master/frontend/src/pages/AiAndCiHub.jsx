import React, { useState, useEffect } from 'react';
import { generateAiDescription, getAiStatus } from '../services/api';

export default function AiAndCiHub({ showToast }) {
  const [activeTab, setActiveTab] = useState('ai'); // 'ai' | 'cicd'

  // Practical 13 State
  const [promptTitle, setPromptTitle] = useState('Refactor authentication pipeline with JWT tokens');
  const [simulateOutage, setSimulateOutage] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState(null);

  // Practical 12 CI/CD Simulation State
  const [pipelineState, setPipelineState] = useState('idle'); // 'idle' | 'running' | 'success' | 'failed'
  const [pipelineLogs, setPipelineLogs] = useState([]);
  const [deliberateBreak, setDeliberateBreak] = useState(false);

  useEffect(() => {
    async function loadStatus() {
      try {
        const data = await getAiStatus();
        setAiStatus(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadStatus();
  }, []);

  const handleRunAi = async () => {
    if (!promptTitle.trim()) {
      showToast('warning', 'Please enter a task title first.');
      return;
    }
    setAiLoading(true);
    try {
      const data = await generateAiDescription(promptTitle, simulateOutage);
      setAiResult(data);
      if (data.fallback) {
        showToast('info', 'Graceful Degradation triggered: Intelligent fallback applied!');
      } else {
        showToast('success', `Generated description via ${data.source}!`);
      }
    } catch (err) {
      showToast('error', err.message || 'AI request failed');
    } finally {
      setAiLoading(false);
    }
  };

  const runCiPipelineSimulation = () => {
    setPipelineState('running');
    setPipelineLogs([]);
    const logs = [];

    const addLog = (msg) => {
      logs.push(`[${new Date().toLocaleTimeString()}] ${msg}`);
      setPipelineLogs([...logs]);
    };

    addLog('🚀 GitHub Actions Trigger: push event on branch "main"');
    setTimeout(() => {
      addLog('📦 Runner: ubuntu-latest | actions/checkout@v4 completed');
      addLog('⚙️ Setting up Node.js 18.x with cache: npm');
      addLog('▶️ Job 1: lint (ESLint Quality Gate)...');

      setTimeout(() => {
        addLog('✅ ESLint passed with 0 warnings and 0 errors.');
        addLog('▶️ Job 2: build-and-test (needs: [lint])...');

        setTimeout(() => {
          if (deliberateBreak) {
            addLog('❌ FAIL tests/broken.test.sample.js');
            addLog('   Expected status: 500 | Received: 200');
            addLog('🚫 Process completed with exit code 1. Pipeline FAILED (Red X).');
            setPipelineState('failed');
            showToast('error', 'Pipeline failed: Deliberately broken assertion triggered Red X!');
          } else {
            addLog('PASS tests/tasks.test.js (4 passing tests)');
            addLog('PASS tests/ai.test.js (5 passing tests)');
            addLog('PASS tests/test_unified_system.js (19 passing assertions)');
            addLog('🎉 All jobs succeeded! Pipeline PASSED (Green Checkmark).');
            setPipelineState('success');
            showToast('success', 'CI Pipeline completed successfully with Green Checkmark!');
          }
        }, 1200);
      }, 1000);
    }, 800);
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <div className="badge badge-low" style={{ marginBottom: '0.5rem' }}>
          Practicals 12 & 13 · DevOps & AI Engineering
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>
          CI/CD Pipeline & Applied AI Hub
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Interactive evaluation dashboard for GitHub Actions automated pipelines (Practical 12) and cloud AI integration with graceful degradation (Practical 13).
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <button
          className={`btn btn-sm ${activeTab === 'ai' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('ai')}
        >
          🤖 Practical 13: AI Assistant & Graceful Degradation
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'cicd' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('cicd')}
        >
          🚀 Practical 12: GitHub Actions CI/CD Pipeline
        </button>
      </div>

      {/* TAB 1: PRACTICAL 13 AI ASSISTANT */}
      {activeTab === 'ai' && (
        <div className="grid-2" style={{ alignItems: 'flex-start' }}>
          <div className="glass-panel">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              ✨ AI Task Description Generator
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Demonstrates backend-protected AI calls (Gemini/OpenAI), 5 req/min rate limiting, and rule-based fallback resilience.
            </p>

            <div className="form-group">
              <label>Task Title Prompt</label>
              <input
                className="form-control"
                value={promptTitle}
                onChange={(e) => setPromptTitle(e.target.value)}
                placeholder="e.g. Fix memory leak in Docker container"
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1rem 0' }}>
              <input
                type="checkbox"
                id="outageToggle"
                checked={simulateOutage}
                onChange={(e) => setSimulateOutage(e.target.checked)}
              />
              <label htmlFor="outageToggle" style={{ fontSize: '0.85rem', cursor: 'pointer', color: simulateOutage ? 'var(--warning)' : 'var(--text-secondary)' }}>
                ⚡ Simulate Third-Party AI Outage (Tests Graceful Degradation)
              </label>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)' }}
              onClick={handleRunAi}
              disabled={aiLoading}
            >
              {aiLoading ? '⏳ Generating suggestion...' : 'Generate Description via Backend'}
            </button>

            {/* AI Service Status */}
            {aiStatus && (
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.25)', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  📡 Backend AI Infrastructure Status:
                </div>
                <div style={{ color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div>• Google Gemini: <code>{aiStatus.providers?.gemini}</code></div>
                  <div>• OpenAI API: <code>{aiStatus.providers?.openai}</code></div>
                  <div>• Heuristic Fallback Engine: <strong style={{ color: 'var(--success)' }}>Active (100% Uptime)</strong></div>
                  <div>• Rate Limiter: <code>{aiStatus.rateLimit}</code></div>
                </div>
              </div>
            )}
          </div>

          <div className="glass-panel">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              📥 Response & Governance Inspection
            </h2>

            {aiResult ? (
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className={`badge ${aiResult.fallback ? 'badge-medium' : 'badge-low'}`}>
                    {aiResult.fallback ? '⚡ GRACEFUL FALLBACK' : '✅ CLOUD AI SUCCESS'}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Source: <code>{aiResult.source}</code>
                  </span>
                </div>

                <div className="form-group">
                  <label>Generated Description (Editable textarea for human-in-the-loop review)</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={aiResult.description}
                    onChange={(e) => setAiResult({ ...aiResult, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Suggested Priority:</span>
                  <span className={`badge badge-${aiResult.suggestedPriority}`}>
                    {aiResult.suggestedPriority}
                  </span>
                </div>

                <pre className="code-box">
                  {JSON.stringify(aiResult, null, 2)}
                </pre>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                Click "Generate Description" on the left to inspect the AI response and graceful fallback behavior.
              </div>
            )}

            <div style={{ marginTop: '1.5rem', padding: '0.85rem', background: 'rgba(245, 158, 11, 0.08)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.25)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <strong>🛡️ Responsible AI Principles:</strong>
              <ul style={{ paddingLeft: '1.2rem', marginTop: '0.35rem' }}>
                <li><strong>Backend Isolation:</strong> Keys never leak into client JavaScript bundles.</li>
                <li><strong>Human-in-the-Loop:</strong> All generated text remains in an editable textarea before saving.</li>
                <li><strong>Privacy Safeguards:</strong> No PII or credentials transmitted to external endpoints.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRACTICAL 12 CI/CD PIPELINE */}
      {activeTab === 'cicd' && (
        <div className="grid-2" style={{ alignItems: 'flex-start' }}>
          <div className="glass-panel">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              ⚙️ GitHub Actions Workflow Pipeline
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Defined in <code>.github/workflows/ci.yml</code> with dependent jobs enforcing quality gates.
            </p>

            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Pipeline Status Badge:</span>
                <span
                  style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: pipelineState === 'failed' ? '#ef4444' : '#10b981',
                    color: '#ffffff'
                  }}
                >
                  CI Pipeline {pipelineState === 'failed' ? 'failing' : 'passing'}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Trigger: <code>on: [push, pull_request] branches: [main]</code>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <input
                type="checkbox"
                id="breakToggle"
                checked={deliberateBreak}
                onChange={(e) => setDeliberateBreak(e.target.checked)}
              />
              <label htmlFor="breakToggle" style={{ fontSize: '0.85rem', cursor: 'pointer', color: deliberateBreak ? 'var(--danger)' : 'var(--text-secondary)' }}>
                Demonstrate Failing Test (Simulates Red X pipeline break)
              </label>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={runCiPipelineSimulation}
              disabled={pipelineState === 'running'}
            >
              {pipelineState === 'running' ? '⏳ Executing CI Workflow Runner...' : '▶️ Run GitHub Actions Simulation'}
            </button>

            <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <strong>Pipeline Architecture:</strong>
              <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                Job 1: lint (ESLint)<br />
                &nbsp;&nbsp;└── Checkout ➔ Setup Node 18 ➔ npm run lint<br />
                Job 2: build-and-test (needs: [lint])<br />
                &nbsp;&nbsp;└── npm install ➔ npm test (Jest + Supertest)
              </div>
            </div>
          </div>

          <div className="glass-panel">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🖥️ Live Runner Terminal Output</span>
              {pipelineState === 'success' && <span className="badge badge-low">PASSED (200 OK)</span>}
              {pipelineState === 'failed' && <span className="badge badge-high">FAILED (EXIT 1)</span>}
            </h2>

            {pipelineLogs.length > 0 ? (
              <pre className="code-box" style={{ height: '320px' }}>
                {pipelineLogs.join('\n')}
              </pre>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                Click "Run GitHub Actions Simulation" on the left to watch the multi-job CI runner execute.
              </div>
            )}

            <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: 'rgba(59, 130, 246, 0.08)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              💡 <strong>Fail-Fast Behavior:</strong> If Job 1 (Linting) fails, Job 2 (Build & Test) is automatically skipped by GitHub Actions due to the <code>needs: [lint]</code> declaration, saving server compute minutes.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

