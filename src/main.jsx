import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  ChevronDown,
  CircuitBoard,
  Code2,
  Cpu,
  Github,
  Globe,
  Grid3X3,
  Mail,
  MousePointer2,
  PenTool,
  Sparkles,
  Terminal,
  X,
  Zap
} from "lucide-react";
import "./styles.css";
import studioCollage from "./assets/studio-collage.png";
import { getExperiments, getPlayground, getProjects } from "./lib/store.js";

const navItems = [
  ["01", "Work"],
  ["02", "About"],
  ["03", "Experiments"],
  ["04", "Skills"],
  ["05", "Contact"]
];

// Static fallback shown before any admin data is set
const DEFAULT_PROJECTS = [
  {
    repoName: "portfolio",
    title: "This Portfolio",
    description: "Experimental engineering, software, UI/UX, branding, and creative technology portfolio.",
    githubUrl: "https://github.com/Rdx011O",
    liveUrl: "",
    language: "React",
    selected: true,
    tone: "lime",
    order: 0,
    stages: [
      { label: "Problem", content: "" },
      { label: "Thinking", content: "" },
      { label: "Design", content: "" },
      { label: "Build", content: "" },
      { label: "Result", content: "" },
    ]
  }
];

// Span assignment based on position index
const SPANS = ["feature", "tall", "wide", "small", "small"];

function useProjects() {
  const [projects] = useState(() => {
    const saved = getProjects().filter((p) => p.selected);
    return saved.length ? saved : DEFAULT_PROJECTS;
  });
  return projects;
}

function useExperiments() {
  const [cards] = useState(getExperiments);
  return cards;
}

// ── Skill data with detail text per skill ──────────────────────
const SKILL_OS = [
  {
    drive: "BUILD",
    icon: Code2,
    color: "lime",
    prefix: "01",
    skills: [
      { name: "HTML", level: 90, note: "Semantic, accessible markup. Structure first, always." },
      { name: "CSS", level: 88, note: "Grid, custom properties, animations, responsive layouts." },
      { name: "JavaScript", level: 85, note: "ES2024+, async patterns, DOM mastery, clean code." },
      { name: "React", level: 82, note: "Hooks, context, component design systems, SPA architecture." },
      { name: "Python", level: 72, note: "Scripts, data processing, automation, ML experiments." },
      { name: "Java", level: 60, note: "OOP, data structures, algorithmic problem solving." },
    ],
  },
  {
    drive: "ENGINEER",
    icon: Cpu,
    color: "blue",
    prefix: "02",
    skills: [
      { name: "Electronics", level: 80, note: "Circuits, components, schematics, PCB basics." },
      { name: "Embedded Systems", level: 75, note: "Microcontrollers, sensors, real-time logic." },
      { name: "Hardware Design", level: 70, note: "Prototyping, breadboard builds, signal analysis." },
      { name: "Problem Solving", level: 92, note: "Breaking complex systems into solvable parts." },
      { name: "Signal Processing", level: 65, note: "ADC/DAC, filters, oscilloscope analysis." },
    ],
  },
  {
    drive: "DESIGN",
    icon: PenTool,
    color: "orange",
    prefix: "03",
    skills: [
      { name: "UI / UX", level: 85, note: "User flows, wireframes, usability, accessibility." },
      { name: "Visual Design", level: 80, note: "Typography, color systems, layout, hierarchy." },
      { name: "Branding", level: 75, note: "Identity systems, logo design, brand guidelines." },
      { name: "Event Design", level: 78, note: "Stage screens, posters, wayfinding, motion." },
      { name: "Systems Thinking", level: 88, note: "Designing components that scale and connect." },
    ],
  },
  {
    drive: "EXPLORE",
    icon: Sparkles,
    color: "neutral",
    prefix: "04",
    skills: [
      { name: "AI / ML", level: 60, note: "Prompt engineering, model APIs, generative tools." },
      { name: "Creative Tech", level: 82, note: "Intersection of code, design, and physical media." },
      { name: "Prototyping", level: 87, note: "Idea to working demo, fast iteration, low friction." },
      { name: "Interaction Design", level: 78, note: "Micro-animations, haptics, feedback loops." },
      { name: "Typography", level: 72, note: "Type as texture, scale, rhythm, and personality." },
    ],
  },
];

function useContentProtection() {
  useEffect(() => {
    const block = (event) => event.preventDefault();
    const blockCopyKeys = (event) => {
      const key = event.key.toLowerCase();
      const hasModifier = event.ctrlKey || event.metaKey;
      const blockedKeys = ["c", "x", "a", "s", "p", "+", "-", "=", "0"];

      if (hasModifier && blockedKeys.includes(key)) {
        event.preventDefault();
      }
    };
    const blockZoomWheel = (event) => {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
      }
    };

    document.body.setAttribute("oncontextmenu", "return false");
    document.body.setAttribute("onselectstart", "return false");
    document.body.setAttribute("ondragstart", "return false");

    document.addEventListener("copy", block);
    document.addEventListener("cut", block);
    document.addEventListener("paste", block);
    document.addEventListener("contextmenu", block);
    document.addEventListener("selectstart", block);
    document.addEventListener("dragstart", block);
    window.addEventListener("keydown", blockCopyKeys);
    window.addEventListener("wheel", blockZoomWheel, { passive: false });

    return () => {
      document.body.removeAttribute("oncontextmenu");
      document.body.removeAttribute("onselectstart");
      document.body.removeAttribute("ondragstart");
      document.removeEventListener("copy", block);
      document.removeEventListener("cut", block);
      document.removeEventListener("paste", block);
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("selectstart", block);
      document.removeEventListener("dragstart", block);
      window.removeEventListener("keydown", blockCopyKeys);
      window.removeEventListener("wheel", blockZoomWheel);
    };
  }, []);
}

function usePointerLabel() {
  const [pointer, setPointer] = useState({ x: -120, y: -120, label: "EXPLORE" });

  useEffect(() => {
    const onMove = (event) => {
      const target = event.target.closest("[data-cursor]");
      setPointer({
        x: event.clientX,
        y: event.clientY,
        label: target?.dataset.cursor || "EXPLORE"
      });
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return pointer;
}

function Cursor() {
  const pointer = usePointerLabel();

  return (
    <div
      className="cursor"
      style={{ transform: `translate3d(${pointer.x}px, ${pointer.y}px, 0)` }}
      aria-hidden="true"
    >
      <span>{pointer.label}</span>
    </div>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close drawer on outside click
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className={`site-nav${scrolled ? " scrolled" : ""}`}>
        {/* Logo mark */}
        <a className="mark" href="#top" data-cursor="HOME" onClick={() => setOpen(false)}>
          <span>AK</span>
        </a>

        {/* Desktop nav */}
        <nav className="nav-desktop" aria-label="Primary navigation">
          {navItems.map(([number, label]) => (
            <a href={`#${label.toLowerCase()}`} key={label} data-cursor="JUMP">
              <em>{number}</em>
              <span>{label}</span>
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <a className="nav-cta" href="#contact" data-cursor="SEND">
          Let's Talk
          <ArrowUpRight size={15} />
        </a>

        {/* Mobile hamburger */}
        <button
          className={`nav-burger${open ? " is-open" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span /><span /><span />
        </button>
      </header>

      {/* Mobile drawer */}
      <div
        className={`nav-overlay${open ? " is-open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        ref={drawerRef}
        className={`nav-drawer${open ? " is-open" : ""}`}
        aria-label="Mobile navigation"
      >
        <div className="drawer-head">
          <span className="drawer-logo">AK</span>
          <button className="drawer-close" onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>
        <nav className="drawer-nav">
          {navItems.map(([number, label], i) => (
            <a
              href={`#${label.toLowerCase()}`}
              key={label}
              onClick={() => setOpen(false)}
              style={{ animationDelay: `${i * 55}ms` }}
            >
              <em>{number}</em>
              <strong>{label}</strong>
              <ArrowUpRight size={18} className="drawer-arrow" />
            </a>
          ))}
        </nav>
        <div className="drawer-foot">
          <span>STATUS</span>
          <strong>ACTIVE / CURIOUS</strong>
          <div className="drawer-meter"><i /></div>
        </div>
      </aside>
    </>
  );
}

function Hero() {
  return (
    <section className="hero section-frame" id="top">
      <div className="hero-media" aria-hidden="true">
        <img src={studioCollage} alt="" />
        <div className="scanline" />
      </div>
      <div className="hero-content">
        <p className="kicker">ECE X Software X Design / 2026</p>
        <h1>
          I BUILD
          <span>THINGS THAT</span>
          MAKE SENSE.
        </h1>
        <p className="intro">
          A portfolio for engineering projects, interface systems, visual identities, event
          experiences, and the experiments that happen between them.
        </p>
        <div className="hero-actions">
          <a className="button primary" href="#work" data-cursor="VIEW">
            View Work <ArrowUpRight size={18} />
          </a>
          <a className="button ghost" href="#experiments" data-cursor="OPEN">
            Open Lab <Grid3X3 size={18} />
          </a>
        </div>
      </div>
      <div className="hero-panel" data-cursor="INSPECT">
        <span>BUILD STATUS</span>
        <strong>ACTIVE / CURIOUS</strong>
        <div className="meter">
          <i />
        </div>
      </div>
    </section>
  );
}

function About() {
  const statements = [
    "Engineering student.",
    "Builder.",
    "Designer.",
    "Problem solver.",
    "Constantly experimenting."
  ];

  return (
    <section className="about section-frame" id="about">
      <div className="section-label">02 / About</div>
      <div className="about-grid">
        <div>
          <h2>WHO I AM</h2>
          <div className="statement-stack">
            {statements.map((statement) => (
              <span key={statement}>{statement}</span>
            ))}
          </div>
        </div>
        <div className="about-copy">
          <p>I like making complex things simple.</p>
          <p>I care about how things work and how they feel.</p>
          <p>I do not like leaving ideas as ideas.</p>
        </div>
        <div className="portrait-card" data-cursor="HELLO">
          <div className="portrait-grid">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <MousePointer2 size={42} />
          <p>Builder profile: still loading the next obsession.</p>
        </div>
      </div>
    </section>
  );
}

// ── Language-aware project visual ──────────────────────────
const LANG_TONE = {
  JavaScript: "lime", TypeScript: "lime", React: "lime", Vue: "lime",
  HTML: "lime", CSS: "lime", "Jupyter Notebook": "blue",
  Python: "blue", C: "orange", "C++": "orange", "C#": "orange",
  Java: "orange", Arduino: "orange", Rust: "blue",
};

function toneFromLanguage(lang) {
  return LANG_TONE[lang] || "neutral";
}

function ProjectVisual({ tone, language }) {
  const effectiveTone = tone || toneFromLanguage(language);
  return (
    <div className={`project-visual ${effectiveTone}`}>
      <div className="browser-dots">
        <span /><span /><span />
      </div>
      {/* Circuit trace layer — always shown */}
      <div className="visual-circuit">
        <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" className="circuit-svg">
          <path d="M10 60 L50 60 L50 30 L120 30" className="circuit-path" />
          <path d="M50 60 L50 90 L100 90" className="circuit-path" />
          <path d="M120 30 L150 30 L150 60 L190 60" className="circuit-path" />
          <path d="M100 90 L130 90 L130 60 L150 60" className="circuit-path" />
          <circle cx="50" cy="60" r="3" className="circuit-node" />
          <circle cx="120" cy="30" r="3" className="circuit-node" />
          <circle cx="100" cy="90" r="3" className="circuit-node" />
          <circle cx="150" cy="60" r="3" className="circuit-node" />
          <rect x="115" y="24" width="18" height="12" rx="2" className="circuit-chip" />
          <rect x="145" y="54" width="18" height="12" rx="2" className="circuit-chip" />
        </svg>
      </div>
      {/* Animated blocks */}
      <div className="visual-grid">
        <span className="block a" />
        <span className="block b" />
        <span className="block c" />
        <span className="lines" />
        {/* Language badge */}
        {language && (
          <span className="visual-lang-badge">{language}</span>
        )}
      </div>
    </div>
  );
}

// ── Expandable 5-stage accordion per project ─────────────────
function StageAccordion({ project }) {
  const [open, setOpen] = useState(false);
  const hasContent = project.stages?.some((s) => s.content?.trim());

  return (
    <div className="stage-accordion">
      <button
        className="stage-accordion-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        data-cursor="OPEN"
      >
        <span className="stage-repo-label">
          <Github size={12} />
          {project.repoName}
        </span>
        <span className="stage-trigger-label">How I Built This</span>
        <ChevronDown
          size={15}
          className="stage-chevron"
          style={{ rotate: open ? "180deg" : "0deg" }}
        />
      </button>

      {open && (
        <div className="stage-panel">
          {hasContent ? (
            <div className="stage-strip">
              {project.stages.map((stage, i) => (
                <div key={stage.label} className="stage-frame">
                  <span className="stage-num">{String(i + 1).padStart(2, "0")}</span>
                  <h4>{stage.label}</h4>
                  <p>{stage.content || <em className="stage-empty">Not filled in yet.</em>}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="stage-empty-msg">
              No breakdown written yet —{" "}
              <a href="/admin" target="_blank" rel="noreferrer">add it in the Admin panel</a>.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Work() {
  const projects = useProjects();
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (projects.length) setActive(projects[0]);
  }, [projects]);

  if (!projects.length) return null;

  return (
    <section className="work section-frame" id="work">
      <div className="section-head">
        <div className="section-label">01 / Work</div>
        <h2>PROJECTS AS SYSTEMS, NOT JUST THUMBNAILS.</h2>
      </div>
      <div className="project-grid">
        {projects.map((project, i) => (
          <article
            className={`project-card ${SPANS[i % SPANS.length]} tone-${project.tone}`}
            key={project.repoName}
            onMouseEnter={() => setActive(project)}
            data-cursor="VIEW"
          >
            <div className="project-topline">
              <span>PROJECT / {String(i + 1).padStart(2, "0")}</span>
              <div className="project-topline-links">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" data-cursor="OPEN"
                    onClick={(e) => e.stopPropagation()} title="Live demo">
                    <Globe size={15} />
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" data-cursor="OPEN"
                    onClick={(e) => e.stopPropagation()} title="View on GitHub">
                    <Github size={15} />
                  </a>
                )}
              </div>
            </div>
            <ProjectVisual tone={project.tone} language={project.language} />
            <div>
              <h3>{project.title}</h3>
              {project.language && <p className="meta">{project.language}</p>}
              <p>{project.description}</p>
            </div>
            <StageAccordion project={project} />
          </article>
        ))}
      </div>
      {active && (
        <aside className="hover-preview" aria-live="polite">
          <span>HOVER PREVIEW</span>
          <strong>{active.title}</strong>
          <p>{active.language || active.description?.slice(0, 60)}</p>
        </aside>
      )}
    </section>
  );
}

// CaseStudyFrames is now removed — stage breakdowns live inside each project card

// ── Skills OS ──────────────────────────────────────────────
// A terminal-style OS skill browser
function Skills() {
  const [activeDrive, setActiveDrive] = useState(0);
  const [activeSkill, setActiveSkill] = useState(SKILL_OS[0].skills[0]);
  const [typed, setTyped] = useState("");
  const inputRef = useRef();

  const drive = SKILL_OS[activeDrive];

  // Simulated terminal command
  const handleCmd = (e) => {
    if (e.key === "Enter" && typed.trim()) {
      // Find skill by name
      const all = SKILL_OS.flatMap((d) => d.skills);
      const match = all.find((s) => s.name.toLowerCase().includes(typed.toLowerCase()));
      if (match) setActiveSkill(match);
      setTyped("");
    }
  };

  return (
    <section className="skills section-frame" id="skills">
      <div className="section-head">
        <div className="section-label">04 / Skills</div>
        <h2>SKILL OPERATING SYSTEM</h2>
      </div>

      <div className="skill-os">
        {/* Drive selector — left sidebar */}
        <div className="skill-drives">
          <div className="skill-drives-label">DRIVES</div>
          {SKILL_OS.map((d, i) => (
            <button
              key={d.drive}
              className={`skill-drive-btn color-${d.color}${i === activeDrive ? " active" : ""}`}
              onClick={() => { setActiveDrive(i); setActiveSkill(d.skills[0]); }}
              data-cursor="SELECT"
            >
              <d.icon size={14} />
              <span>{d.prefix}</span>
              {d.drive}
            </button>
          ))}
          <div className="skill-drives-footer">
            <Terminal size={12} />
            {SKILL_OS.reduce((a, d) => a + d.skills.length, 0)} skills indexed
          </div>
        </div>

        {/* File list — centre */}
        <div className="skill-files">
          <div className="skill-files-header">
            <span className="skill-drive-path">{drive.prefix}:\ {drive.drive}\</span>
          </div>
          <div className="skill-file-list">
            {drive.skills.map((skill, i) => (
              <button
                key={skill.name}
                className={`skill-file${activeSkill.name === skill.name ? " active" : ""}`}
                onClick={() => setActiveSkill(skill)}
                style={{ animationDelay: `${i * 40}ms` }}
                data-cursor="OPEN"
              >
                <span className="skill-file-icon">{String(i + 1).padStart(2, "0")}</span>
                <span className="skill-file-name">{skill.name}</span>
                <div className="skill-mini-bar">
                  <div className="skill-mini-fill" style={{ width: `${skill.level}%` }} />
                </div>
                <span className="skill-pct">{skill.level}%</span>
              </button>
            ))}
          </div>
          {/* Terminal input */}
          <div className="skill-terminal">
            <span className="skill-prompt">C:\SKILLS&gt; search</span>
            <input
              ref={inputRef}
              className="skill-cmd"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              onKeyDown={handleCmd}
              placeholder="type skill name + Enter"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Detail panel — right */}
        <div className="skill-detail">
          <div className="skill-detail-header">
            <span>PROPERTIES</span>
            <span className="skill-detail-file">{activeSkill.name}.skill</span>
          </div>
          <div className="skill-detail-body">
            <div className="skill-ring-wrap">
              <svg viewBox="0 0 120 120" className="skill-ring-svg">
                <circle cx="60" cy="60" r="48" className="skill-ring-bg" />
                <circle
                  cx="60" cy="60" r="48"
                  className={`skill-ring-fill color-${drive.color}`}
                  style={{
                    strokeDasharray: `${2 * Math.PI * 48}`,
                    strokeDashoffset: `${2 * Math.PI * 48 * (1 - activeSkill.level / 100)}`,
                  }}
                />
                <text x="60" y="56" className="skill-ring-pct">{activeSkill.level}</text>
                <text x="60" y="72" className="skill-ring-label">/ 100</text>
              </svg>
            </div>
            <h3 className="skill-detail-name">{activeSkill.name}</h3>
            <p className="skill-detail-drive">Drive: {drive.drive}</p>
            <p className="skill-detail-note">{activeSkill.note}</p>
          </div>
          <div className="skill-detail-footer">
            <span>PROFICIENCY</span>
            <div className="skill-bar-full">
              <div className={`skill-bar-track color-${drive.color}`} style={{ width: `${activeSkill.level}%` }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Experiments() {
  const experiments = useExperiments();
  const [found, setFound] = useState(false);
  const [playgroundText] = useState(getPlayground);
  const rotation = useMemo(() => experiments.map((_, i) => i * 6 - 9), [experiments]);

  return (
    <section className="experiments section-frame" id="experiments">
      <div className="section-head">
        <div className="section-label">03 / Lab</div>
        <h2>PLAYGROUND FOR UNFINISHED SIGNALS.</h2>
      </div>
      <div className="experiment-board">
        {experiments.map((exp, index) => (
          <article
            className="experiment-note"
            key={exp.id}
            style={{ rotate: `${rotation[index]}deg` }}
            data-cursor="DRAG"
          >
            <span>{exp.id}</span>
            <h3>{exp.title}</h3>
            <p>{exp.copy}</p>
          </article>
        ))}
        <button
          className={found ? "easter-egg found" : "easter-egg"}
          onClick={() => setFound(true)}
          aria-label="Reveal hidden message"
          data-cursor="CLICK"
        >
          <Zap size={22} />
        </button>
        {found && <p className="found-message">YOU FOUND SOMETHING.</p>}
      </div>

      {/* Playground note — editable from /admin */}
      <div className="playground-note" data-cursor="INSPECT">
        <span className="playground-label">
          <Sparkles size={12} />
          CURRENTLY EXPLORING
        </span>
        <p>{playgroundText}</p>
        <a href="/admin" target="_blank" rel="noreferrer" className="playground-edit" data-cursor="OPEN">
          Edit in Admin →
        </a>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact section-frame" id="contact">
      <div>
        <div className="section-label">05 / Contact</div>
        <h2>
          HAVE AN IDEA?
          <span>LET'S BUILD IT.</span>
        </h2>
      </div>
      <a className="big-mail" href="mailto:hello@example.com" data-cursor="SEND">
        <Mail size={30} />
        <span>SEND A MESSAGE</span>
        <ArrowUpRight size={28} />
      </a>
      <div className="socials">
        <a href="https://www.linkedin.com" data-cursor="OPEN">LinkedIn</a>
        <a href="https://github.com" data-cursor="OPEN">GitHub</a>
        <a href="https://www.instagram.com" data-cursor="OPEN">Instagram</a>
      </div>
    </section>
  );
}

function App() {
  useContentProtection();

  return (
    <>
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Work />
        <About />
        <Experiments />
        <Skills />
        <Contact />
      </main>
      <footer>
        <CircuitBoard size={18} />
        <span>Designed like a studio. Built like a system.</span>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
