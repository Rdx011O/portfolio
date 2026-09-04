import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  CircuitBoard,
  Code2,
  Cpu,
  ExternalLink,
  Grid3X3,
  Mail,
  MousePointer2,
  PenTool,
  Sparkles,
  X,
  Zap
} from "lucide-react";
import "./styles.css";
import studioCollage from "./assets/studio-collage.png";

const navItems = [
  ["01", "Work"],
  ["02", "About"],
  ["03", "Experiments"],
  ["04", "Skills"],
  ["05", "Contact"]
];

const projects = [
  {
    id: "004",
    title: "Event Management Platform",
    meta: "Product / UX / Development",
    tone: "lime",
    span: "feature",
    copy: "A role-aware event workflow with dashboards, registrations, approvals, and calm operational screens for teams under pressure."
  },
  {
    id: "001",
    title: "Circuit Health Console",
    meta: "ECE / Embedded / Data UI",
    tone: "blue",
    span: "tall",
    copy: "Sensor readings become scan-friendly states, alerts, and tiny diagnostic stories."
  },
  {
    id: "002",
    title: "Brand System: Tech Fest",
    meta: "Identity / Posters / Motion",
    tone: "orange",
    span: "wide",
    copy: "A visual language for banners, stage screens, passes, social posts, and on-ground wayfinding."
  },
  {
    id: "003",
    title: "Prototype UI Lab",
    meta: "React / Interaction / Creative Code",
    tone: "lime",
    span: "small",
    copy: "Micro tools, interface sketches, odd controls, and polished experiments that started as curiosity."
  },
  {
    id: "005",
    title: "Hardware Notes Archive",
    meta: "Documentation / Engineering",
    tone: "neutral",
    span: "small",
    copy: "A visual archive of builds, diagrams, test notes, and practical learnings from real experiments."
  }
];

const skillGroups = [
  {
    title: "Build",
    icon: Code2,
    items: ["HTML", "CSS", "JavaScript", "React", "Python", "Java"]
  },
  {
    title: "Engineer",
    icon: Cpu,
    items: ["Electronics", "Embedded Systems", "Hardware", "Problem Solving", "Signals"]
  },
  {
    title: "Design",
    icon: PenTool,
    items: ["UI / UX", "Visual Design", "Branding", "Event Design", "Systems"]
  },
  {
    title: "Explore",
    icon: Sparkles,
    items: ["AI", "Creative Tech", "Prototyping", "Interaction", "Typography"]
  }
];

const experiments = [
  ["TYPE-01", "Kinetic poster grid", "Typography that reacts like a machine warming up."],
  ["LAB-18", "Micro dashboard", "Tiny operational screens for large messy systems."],
  ["AI-06", "Prompted interface moodboard", "Visual studies for impossible products."],
  ["HW-12", "Sensor signal sketch", "Turning invisible readings into visible rhythm."]
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

function ProjectVisual({ tone }) {
  return (
    <div className={`project-visual ${tone}`}>
      <div className="browser-dots">
        <span />
        <span />
        <span />
      </div>
      <div className="visual-grid">
        <span className="block a" />
        <span className="block b" />
        <span className="block c" />
        <span className="lines" />
      </div>
    </div>
  );
}

function Work() {
  const [active, setActive] = useState(projects[0]);

  return (
    <section className="work section-frame" id="work">
      <div className="section-head">
        <div className="section-label">01 / Work</div>
        <h2>PROJECTS AS SYSTEMS, NOT JUST THUMBNAILS.</h2>
      </div>
      <div className="project-grid">
        {projects.map((project) => (
          <article
            className={`project-card ${project.span} tone-${project.tone}`}
            key={project.id}
            onMouseEnter={() => setActive(project)}
            data-cursor="VIEW"
          >
            <div className="project-topline">
              <span>PROJECT / {project.id}</span>
              <ExternalLink size={17} />
            </div>
            <ProjectVisual tone={project.tone} />
            <div>
              <h3>{project.title}</h3>
              <p className="meta">{project.meta}</p>
              <p>{project.copy}</p>
            </div>
          </article>
        ))}
      </div>
      <aside className="hover-preview" aria-live="polite">
        <span>HOVER PREVIEW</span>
        <strong>{active.title}</strong>
        <p>{active.meta}</p>
      </aside>
    </section>
  );
}

function CaseStudyFrames() {
  const frames = ["Problem", "Thinking", "Design", "Build", "Result"];

  return (
    <section className="case-study section-frame">
      <div className="section-label">PROJECT 004 / Case Study Frames</div>
      <h2>EVENT MANAGEMENT PLATFORM</h2>
      <div className="frame-strip">
        {frames.map((frame, index) => (
          <article key={frame} data-cursor="OPEN">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{frame}</h3>
            <p>
              {frame === "Problem"
                ? "Messy coordination, scattered approvals, unclear ownership."
                : frame === "Thinking"
                  ? "Map the event as states, roles, deadlines, and decisions."
                  : frame === "Design"
                    ? "Create screens that can be scanned fast during pressure."
                    : frame === "Build"
                      ? "Prototype the dashboard, registration flow, and admin controls."
                      : "A calmer workflow that makes complexity visible and actionable."}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Skills() {
  const [selected, setSelected] = useState("React");

  return (
    <section className="skills section-frame" id="skills">
      <div className="section-head">
        <div className="section-label">04 / Skills</div>
        <h2>SKILL ECOSYSTEM</h2>
      </div>
      <div className="skill-grid">
        {skillGroups.map(({ title, icon: Icon, items }) => (
          <article className="skill-family" key={title}>
            <div className="skill-title">
              <Icon size={23} />
              <h3>{title}</h3>
            </div>
            <div className="chips">
              {items.map((item) => (
                <button
                  className={selected === item ? "chip active" : "chip"}
                  key={item}
                  onClick={() => setSelected(item)}
                  data-cursor="SELECT"
                >
                  {item}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="skill-note">
        <span>SELECTED SKILL</span>
        <strong>{selected}</strong>
        <p>Used as a practical tool, a design material, or a way to make an idea testable.</p>
      </div>
    </section>
  );
}

function Experiments() {
  const [found, setFound] = useState(false);
  const rotation = useMemo(() => experiments.map((_, index) => index * 5 - 7), []);

  return (
    <section className="experiments section-frame" id="experiments">
      <div className="section-head">
        <div className="section-label">03 / Lab</div>
        <h2>PLAYGROUND FOR UNFINISHED SIGNALS.</h2>
      </div>
      <div className="experiment-board">
        {experiments.map(([code, title, copy], index) => (
          <article
            className="experiment-note"
            key={code}
            style={{ rotate: `${rotation[index]}deg` }}
            data-cursor="DRAG"
          >
            <span>{code}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
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
        <CaseStudyFrames />
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
