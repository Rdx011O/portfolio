import React, { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  ChevronDown,
  CircuitBoard,
  ExternalLink,
  FlaskConical,
  Github,
  GripVertical,
  Loader2,
  Lock,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Settings,
  Sparkles,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
} from "lucide-react";
import { fetchGitHubRepos } from "./lib/github.js";
import {
  getExperiments,
  getGithubConfig,
  getPlayground,
  getProjects,
  mergeReposIntoProjects,
  saveExperiments,
  saveGithubConfig,
  savePlayground,
  saveProjects,
} from "./lib/store.js";
import "./admin.css";

// ── Change this to your secret PIN ────────────────────────────
const ADMIN_PIN = "0110";
const SESSION_KEY = "portfolio_admin_auth";

const TONES = ["lime", "orange", "blue", "neutral"];

// ─────────────────────────────────────────────────────────────
// PIN GATE
// ─────────────────────────────────────────────────────────────
function PinGate({ onUnlock }) {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [shake, setShake] = useState(false);
  const refs = [useRef(), useRef(), useRef(), useRef()];

  const handleDigit = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 3) refs[i + 1].current?.focus();
    if (next.every((d) => d !== "") && next.join("") === ADMIN_PIN) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onUnlock();
    } else if (next.every((d) => d !== "") && next.join("") !== ADMIN_PIN) {
      setShake(true);
      setTimeout(() => { setDigits(["", "", "", ""]); setShake(false); refs[0].current?.focus(); }, 600);
    }
  };

  const handleKey = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs[i - 1].current?.focus();
  };

  useEffect(() => { refs[0].current?.focus(); }, []);

  return (
    <div className="pin-gate">
      <div className="pin-card">
        <div className="pin-logo">
          <span>AK</span>
        </div>
        <Lock size={22} className="pin-lock-icon" />
        <h1>Admin Access</h1>
        <p>Enter your 4-digit PIN to continue</p>
        <div className={`pin-inputs${shake ? " shake" : ""}`}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={refs[i]}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleDigit(i, e.target.value)}
              onKeyDown={(e) => handleKey(i, e)}
              className="pin-input"
              autoComplete="off"
            />
          ))}
        </div>
        <p className="pin-hint">Default PIN is in <code>src/admin.jsx</code> — change <code>ADMIN_PIN</code></p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────────────────────
function Toast({ message, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, [onDone]);
  return <div className="ad-toast">{message}</div>;
}

// ─────────────────────────────────────────────────────────────
// STAGE EDITOR
// ─────────────────────────────────────────────────────────────
function StageEditor({ stages, onChange }) {
  return (
    <div className="ad-stages">
      {stages.map((stage, i) => (
        <div key={stage.label} className="ad-stage">
          <label className="ad-stage-label">
            <span className="ad-stage-num">{String(i + 1).padStart(2, "0")}</span>
            {stage.label}
          </label>
          <textarea
            className="ad-textarea"
            rows={3}
            placeholder={`Describe the ${stage.label} phase…`}
            value={stage.content}
            onChange={(e) => {
              const next = stages.map((s, j) => j === i ? { ...s, content: e.target.value } : s);
              onChange(next);
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PROJECT CARD
// ─────────────────────────────────────────────────────────────
function ProjectCard({ project, onChange }) {
  const [expanded, setExpanded] = useState(false);
  const update = (field, value) => onChange({ ...project, [field]: value });

  return (
    <article className={`ad-card ${project.selected ? "is-selected" : ""}`}>
      <div className="ad-card-top">
        <button
          className={`ad-toggle ${project.selected ? "on" : "off"}`}
          onClick={() => update("selected", !project.selected)}
          title={project.selected ? "Hide from portfolio" : "Show in portfolio"}
        >
          {project.selected ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
          <span>{project.selected ? "Visible" : "Hidden"}</span>
        </button>
        <div className="ad-card-meta">
          <span className="ad-repo-name"><CircuitBoard size={12} />{project.repoName}</span>
          {project.language && <span className="ad-lang">{project.language}</span>}
        </div>
        <button className="ad-expand" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}>
          <ChevronDown size={16} style={{ rotate: expanded ? "180deg" : "0deg", transition: "rotate 200ms" }} />
        </button>
      </div>

      <div className="ad-card-fields">
        <div className="ad-field-row">
          <div className="ad-field">
            <label>Display Title</label>
            <input className="ad-input" value={project.title} onChange={(e) => update("title", e.target.value)} />
          </div>
          <div className="ad-field ad-field-sm">
            <label>Accent</label>
            <select className="ad-select" value={project.tone} onChange={(e) => update("tone", e.target.value)}>
              {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="ad-field">
          <label>Description</label>
          <textarea className="ad-textarea" rows={2} value={project.description} onChange={(e) => update("description", e.target.value)} />
        </div>
        <div className="ad-field-row">
          <div className="ad-field">
            <label>Live URL</label>
            <input className="ad-input" value={project.liveUrl} onChange={(e) => update("liveUrl", e.target.value)} placeholder="https://…" />
          </div>
          <div className="ad-field">
            <label>GitHub URL</label>
            <input className="ad-input" value={project.githubUrl} onChange={(e) => update("githubUrl", e.target.value)} />
          </div>
        </div>
      </div>

      {expanded && (
        <div className="ad-card-stages">
          <div className="ad-stages-header">
            <span>5 — Stage Breakdown</span>
            <span className="ad-stages-hint">Shown when visitor taps this project card</span>
          </div>
          <StageEditor stages={project.stages} onChange={(next) => update("stages", next)} />
        </div>
      )}
    </article>
  );
}

// ─────────────────────────────────────────────────────────────
// EXPERIMENT CARD EDITOR
// ─────────────────────────────────────────────────────────────
function ExperimentEditor({ experiments, onChange }) {
  const addCard = () => {
    const id = `LAB-${String(Date.now()).slice(-4)}`;
    onChange([...experiments, { id, title: "New Experiment", copy: "Describe what you explored." }]);
  };

  const updateCard = (i, field, val) => {
    const next = experiments.map((e, j) => j === i ? { ...e, [field]: val } : e);
    onChange(next);
  };

  const removeCard = (i) => onChange(experiments.filter((_, j) => j !== i));

  const moveUp = (i) => {
    if (i === 0) return;
    const next = [...experiments];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    onChange(next);
  };

  const moveDown = (i) => {
    if (i === experiments.length - 1) return;
    const next = [...experiments];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    onChange(next);
  };

  return (
    <div className="ad-exp-editor">
      <div className="ad-exp-list">
        {experiments.map((exp, i) => (
          <div key={exp.id} className="ad-exp-card">
            <div className="ad-exp-drag">
              <button onClick={() => moveUp(i)} title="Move up" className="ad-grip-btn">▲</button>
              <GripVertical size={14} className="ad-grip" />
              <button onClick={() => moveDown(i)} title="Move down" className="ad-grip-btn">▼</button>
            </div>
            <div className="ad-exp-fields">
              <div className="ad-field-row">
                <div className="ad-field ad-field-sm">
                  <label>Code</label>
                  <input className="ad-input" value={exp.id} onChange={(e) => updateCard(i, "id", e.target.value)} placeholder="TYPE-01" />
                </div>
                <div className="ad-field">
                  <label>Title</label>
                  <input className="ad-input" value={exp.title} onChange={(e) => updateCard(i, "title", e.target.value)} />
                </div>
              </div>
              <div className="ad-field">
                <label>Description</label>
                <input className="ad-input" value={exp.copy} onChange={(e) => updateCard(i, "copy", e.target.value)} />
              </div>
            </div>
            <button className="ad-exp-delete" onClick={() => removeCard(i)} title="Remove card">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <button className="ad-add-btn" onClick={addCard}>
        <Plus size={15} />
        Add Lab Card
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN ADMIN APP
// ─────────────────────────────────────────────────────────────
function AdminApp() {
  const [config, setConfig] = useState(getGithubConfig);
  const [projects, setProjects] = useState(getProjects);
  const [playground, setPlayground] = useState(getPlayground);
  const [experiments, setExperiments] = useState(getExperiments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [tab, setTab] = useState("projects");

  const showToast = (msg) => setToast(msg);

  const syncGitHub = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const repos = await fetchGitHubRepos(config.username, config.token);
      const merged = mergeReposIntoProjects(projects, repos);
      setProjects(merged);
      saveProjects(merged);
      showToast(`Synced ${repos.length} repos ✓`);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [config, projects]);

  const saveAll = () => {
    saveGithubConfig(config);
    saveProjects(projects);
    savePlayground(playground);
    saveExperiments(experiments);
    showToast("All changes saved ✓");
  };

  const updateProject = (repoName, updated) =>
    setProjects((prev) => prev.map((p) => (p.repoName === repoName ? updated : p)));

  const selectedCount = projects.filter((p) => p.selected).length;

  return (
    <div className="ad-root">
      {toast && <Toast message={toast} onDone={() => setToast("")} />}

      {/* Sidebar */}
      <aside className="ad-sidebar">
        <div className="ad-sidebar-logo">
          <span>AK</span>
          <div><strong>Portfolio Admin</strong><p>Manage your showcase</p></div>
        </div>
        <nav className="ad-sidenav">
          <button className={tab === "projects" ? "active" : ""} onClick={() => setTab("projects")}>
            <CircuitBoard size={16} />Projects
            <span className="ad-badge">{selectedCount} visible</span>
          </button>
          <button className={tab === "lab" ? "active" : ""} onClick={() => setTab("lab")}>
            <FlaskConical size={16} />Lab Cards
            <span className="ad-badge">{experiments.length}</span>
          </button>
          <button className={tab === "playground" ? "active" : ""} onClick={() => setTab("playground")}>
            <Sparkles size={16} />Playground
          </button>
          <button className={tab === "settings" ? "active" : ""} onClick={() => setTab("settings")}>
            <Settings size={16} />GitHub Sync
          </button>
        </nav>
        <div className="ad-sidebar-foot">
          <a href="/" target="_blank" className="ad-view-site"><ExternalLink size={14} />View Site</a>
          <button className="ad-save-btn" onClick={saveAll}><Save size={15} />Save All</button>
        </div>
      </aside>

      {/* Main */}
      <main className="ad-main">

        {/* ── GitHub Sync */}
        {tab === "settings" && (
          <section className="ad-section">
            <div className="ad-section-head">
              <div><h1>GitHub Sync</h1><p>Connect your GitHub to pull in all your repos.</p></div>
            </div>
            <div className="ad-settings-card">
              <div className="ad-field">
                <label>GitHub Username</label>
                <input className="ad-input" value={config.username} onChange={(e) => setConfig((c) => ({ ...c, username: e.target.value }))} />
              </div>
              <div className="ad-field">
                <label>Personal Access Token <span className="ad-muted">(optional — for private repos)</span></label>
                <input className="ad-input" type="password" value={config.token}
                  onChange={(e) => setConfig((c) => ({ ...c, token: e.target.value }))}
                  placeholder="ghp_••••••••••••" />
                <p className="ad-hint">Saved only in your browser's localStorage — never committed to code.</p>
              </div>
              {error && <p className="ad-error">{error}</p>}
              <button className="ad-sync-btn" onClick={syncGitHub} disabled={loading || !config.username}>
                {loading ? <Loader2 size={16} className="ad-spin" /> : <RefreshCw size={16} />}
                {loading ? "Fetching…" : "Sync from GitHub"}
              </button>
            </div>
            <div className="ad-info-box">
              <Github size={16} />
              <div><strong>github.com/{config.username}</strong><p>{projects.length} repos · {selectedCount} visible</p></div>
              <a href={`https://github.com/${config.username}`} target="_blank" rel="noreferrer" className="ad-link"><ArrowUpRight size={14} /></a>
            </div>
          </section>
        )}

        {/* ── Projects */}
        {tab === "projects" && (
          <section className="ad-section">
            <div className="ad-section-head">
              <div><h1>Projects</h1><p>Toggle, edit details, and fill in 5-stage breakdowns.</p></div>
              <button className="ad-sync-btn sm" onClick={syncGitHub} disabled={loading}>
                {loading ? <Loader2 size={14} className="ad-spin" /> : <RefreshCw size={14} />}
                {loading ? "Syncing…" : "Re-sync"}
              </button>
            </div>
            {projects.length === 0 ? (
              <div className="ad-empty">
                <Github size={40} />
                <strong>No repos yet</strong>
                <p>Go to GitHub Sync and click "Sync from GitHub".</p>
                <button className="ad-sync-btn" onClick={() => setTab("settings")}>Go to GitHub Sync →</button>
              </div>
            ) : (
              <div className="ad-project-list">
                {[...projects]
                  .sort((a, b) => (b.selected ? 1 : 0) - (a.selected ? 1 : 0))
                  .map((project) => (
                    <ProjectCard key={project.repoName} project={project}
                      onChange={(updated) => updateProject(project.repoName, updated)} />
                  ))}
              </div>
            )}
          </section>
        )}

        {/* ── Lab Cards */}
        {tab === "lab" && (
          <section className="ad-section">
            <div className="ad-section-head">
              <div><h1>Lab Cards</h1><p>Add, edit, reorder, or delete the experiment cards in the Playground section.</p></div>
            </div>
            <ExperimentEditor
              experiments={experiments}
              onChange={(next) => { setExperiments(next); saveExperiments(next); showToast("Lab cards updated ✓"); }}
            />
          </section>
        )}

        {/* ── Playground */}
        {tab === "playground" && (
          <section className="ad-section">
            <div className="ad-section-head">
              <h1>Playground</h1>
              <p>What are you currently exploring? Shown in the Experiments section.</p>
            </div>
            <div className="ad-playground-editor">
              <div className="ad-editor-label"><Pencil size={14} />Currently Exploring</div>
              <textarea className="ad-textarea lg" rows={8} value={playground}
                onChange={(e) => setPlayground(e.target.value)}
                placeholder="Currently exploring AI interfaces, embedded systems…" />
              <div className="ad-editor-actions">
                <span className="ad-char-count">{playground.length} chars</span>
                <button className="ad-sync-btn sm" onClick={() => { savePlayground(playground); showToast("Playground saved ✓"); }}>
                  <Save size={14} />Save
                </button>
              </div>
              <div className="ad-preview-label">Preview</div>
              <div className="ad-playground-preview">{playground}</div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ROOT — PIN GATE WRAPPER
// ─────────────────────────────────────────────────────────────
function Root() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  if (!unlocked) return <PinGate onUnlock={() => setUnlocked(true)} />;
  return <AdminApp />;
}

createRoot(document.getElementById("admin-root")).render(<Root />);
