import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircuitBoard,
  Code2,
  Copy,
  Cpu,
  Database,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Github,
  Globe,
  Layers,
  Linkedin,
  Mail,
  Menu,
  MessageSquare,
  Play,
  Printer,
  RefreshCw,
  Search,
  Send,
  Share2,
  Sliders,
  Sparkles,
  Terminal as TerminalIcon,
  UserCheck,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import "./styles.css";
import studioCollage from "./assets/studio-collage.png";
import { getExperiments, getPlayground, getProjects, getGithubConfig } from "./lib/store.js";

// ── Navigation Items ──────────────────────────────────────────
const navLinks = [
  { label: "Systems & Work", href: "#work" },
  { label: "Competencies", href: "#skills" },
  { label: "Lab Sandboxes", href: "#lab" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

// ── Realistic, High-Signal Skills Structure ───────────────────
const SKILLS_DATA = {
  cpp_systems: {
    id: "cpp_systems",
    label: "ACTIVE FOCUS: C++ & System Architecture",
    icon: Cpu,
    color: "cyan",
    summary: "Current primary deep-dive: Modern C++ (C++17/20), low-latency concurrency, memory management, and robust system architecture design.",
    skills: [
      {
        name: "Modern C++ (C++17 / C++20)",
        tier: "Active Deep Dive",
        status: "deep",
        note: "RAII, smart pointers, move semantics, STL algorithms, custom memory allocators, and templates."
      },
      {
        name: "System Architecture & Concurrency",
        tier: "Active Deep Dive",
        status: "deep",
        note: "Thread pools, lock-free ring buffers, event loops, cache-line alignment, and distributed state patterns."
      },
      {
        name: "Embedded Systems & FreeRTOS",
        tier: "Active Focus & Applied",
        status: "deep",
        note: "ESP32 dual-core firmware, real-time task scheduling, ISR handlers, DMA buffers, and I2C/SPI protocols."
      },
      {
        name: "Data Structures & Algorithms",
        tier: "Solid Foundation",
        status: "proficient",
        note: "Topological graphs, custom heaps, trees, memory-efficient spatial indexing, and time complexity profiling."
      },
    ],
  },
  fullstack: {
    id: "fullstack",
    label: "PROVEN FOUNDATION: Full-Stack & Web",
    icon: Code2,
    color: "lime",
    summary: "Hands-on experience architecting full-stack production platforms with sub-second response times and real-time state synchronization.",
    skills: [
      {
        name: "TypeScript & JavaScript",
        tier: "Production Tested",
        status: "proficient",
        note: "Strict typing, async event loop mechanics, modular ES2024+ architecture, and clean abstractions."
      },
      {
        name: "React 19 & Next.js",
        tier: "Production Tested",
        status: "proficient",
        note: "Custom hooks, server/client boundaries, state machines, and high-performance render tree optimization."
      },
      {
        name: "Node.js & WebSocket",
        tier: "Production Tested",
        status: "proficient",
        note: "Bidirectional real-time streaming, clustered worker processes, and robust RESTful microservice APIs."
      },
      {
        name: "PostgreSQL & Redis",
        tier: "Working Knowledge",
        status: "practical",
        note: "Relational schema design, transactions, in-memory caching layers, and Redis pub/sub queue pipelines."
      },
    ],
  },
  ui_design: {
    id: "ui_design",
    label: "SYSTEM CRAFT: UI/UX & Design Tokens",
    icon: Layers,
    color: "orange",
    summary: "Crafting accessible component design systems, fluid micro-interactions, and high-density dashboard layouts.",
    skills: [
      {
        name: "Design Systems & Token Architecture",
        tier: "Hands-on Applied",
        status: "practical",
        note: "Semantic CSS custom property pipelines, scalable component primitives, and Figma token synchronization."
      },
      {
        name: "Web Accessibility (WCAG AA)",
        tier: "Hands-on Applied",
        status: "practical",
        note: "Keyboard navigation traps, ARIA roles, high-contrast states, and screen reader semantic structure."
      },
      {
        name: "Micro-interactions & Physics",
        tier: "Practical Craft",
        status: "practical",
        note: "Spring transitions, haptic visual feedback cues, and sub-frame layout stability."
      },
    ],
  },
  tooling_explorations: {
    id: "tooling_explorations",
    label: "TOOLING & EXPLORATIONS: Python & AI",
    icon: Sparkles,
    color: "cyan",
    summary: "Automation scripts, Linux systems, terminal tooling, and AI API integrations.",
    skills: [
      {
        name: "Linux, Bash & Git Workflows",
        tier: "Everyday Workflow",
        status: "practical",
        note: "POSIX utilities, CLI automation, build watchers, and disciplined Git commit architectures."
      },
      {
        name: "Python Automation & Tooling",
        tier: "Working Knowledge",
        status: "practical",
        note: "Fast automation scripts, data formatting pipelines, and test harness execution."
      },
      {
        name: "Interactive Web Canvas / AI APIs",
        tier: "Active Exploration",
        status: "exploring",
        note: "HTML5 2D canvas simulation mathematics, OpenAI/LLM model API integration pipelines."
      },
    ],
  },
};

// ── Interactive Particle Canvas ───────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles = [];
    const count = 35;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 * (1 - dist / 100)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(56, 189, 248, 0.6)";
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="project-canvas-preview" />;
}

// ── Interactive Logic Gate Mini-Sim ───────────────────────────
function LogicGateSimulator() {
  const [inA, setInA] = useState(true);
  const [inB, setInB] = useState(false);
  const [gate, setGate] = useState("AND");

  const output = useMemo(() => {
    if (gate === "AND") return inA && inB;
    if (gate === "OR") return inA || inB;
    if (gate === "XOR") return inA !== inB;
    if (gate === "NAND") return !(inA && inB);
    return false;
  }, [inA, inB, gate]);

  return (
    <div className="logic-sim-container">
      <div className="logic-inputs">
        <button
          className={`logic-toggle-btn ${inA ? "on" : ""}`}
          onClick={() => setInA(!inA)}
          title="Toggle Input A"
        >
          <span>INPUT A:</span>
          <strong>{inA ? "1 (HIGH)" : "0 (LOW)"}</strong>
        </button>

        <button
          className={`logic-toggle-btn ${inB ? "on" : ""}`}
          onClick={() => setInB(!inB)}
          title="Toggle Input B"
        >
          <span>INPUT B:</span>
          <strong>{inB ? "1 (HIGH)" : "0 (LOW)"}</strong>
        </button>
      </div>

      <div className="logic-gate-visual">
        <select
          value={gate}
          onChange={(e) => setGate(e.target.value)}
          className="gate-badge"
          style={{ cursor: "pointer", background: "rgba(56, 189, 248, 0.15)", border: "1px solid var(--cyan)" }}
        >
          <option value="AND">GATE: AND</option>
          <option value="OR">GATE: OR</option>
          <option value="XOR">GATE: XOR</option>
          <option value="NAND">GATE: NAND</option>
        </select>
        <ArrowRight size={18} color="var(--text-muted)" />
        <div className="logic-output-led">
          <div className={`led-lamp ${output ? "active" : ""}`} />
          <span>OUT: {output ? "1 (ACTIVE)" : "0 (IDLE)"}</span>
        </div>
      </div>
    </div>
  );
}

// ── Interactive Telemetry Gauge ───────────────────────────────
function TelemetrySimulator() {
  const [telemetry, setTelemetry] = useState({ cpu: 42, fps: 60, latency: 28, temp: 36.4 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry({
        cpu: Math.floor(30 + Math.random() * 25),
        fps: Math.floor(58 + Math.random() * 3),
        latency: Math.floor(22 + Math.random() * 12),
        temp: +(35.0 + Math.random() * 3.5).toFixed(1),
      });
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
      <div style={{ background: "rgba(255,255,255,0.04)", padding: "10px", borderRadius: "8px" }}>
        <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>SAMPLING RATE</div>
        <div style={{ fontSize: "16px", fontWeight: "700", color: "var(--cyan)" }}>50.0 Hz</div>
      </div>
      <div style={{ background: "rgba(255,255,255,0.04)", padding: "10px", borderRadius: "8px" }}>
        <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>P95 LATENCY</div>
        <div style={{ fontSize: "16px", fontWeight: "700", color: "var(--lime)" }}>{telemetry.latency} ms</div>
      </div>
      <div style={{ background: "rgba(255,255,255,0.04)", padding: "10px", borderRadius: "8px" }}>
        <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>ESP32 TEMP</div>
        <div style={{ fontSize: "16px", fontWeight: "700", color: "var(--orange)" }}>{telemetry.temp} °C</div>
      </div>
      <div style={{ background: "rgba(255,255,255,0.04)", padding: "10px", borderRadius: "8px" }}>
        <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>FRAME TIMING</div>
        <div style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)" }}>{telemetry.fps} FPS</div>
      </div>
    </div>
  );
}

// ── Hero Interactive Terminal ─────────────────────────────────
function HeroTerminal({ onOpenResume, onScrollToContact }) {
  const [logs, setLogs] = useState([
    { prompt: "focus", text: "Currently deep in Modern C++ (C++20, RAII, Concurrency) & System Architecture" },
    { prompt: "stack", text: "Core: C++, Systems Architecture, TypeScript, React 19, ESP32/FreeRTOS, Node.js" },
  ]);

  const runCommand = (cmd) => {
    let res = "";
    if (cmd === "focus") {
      res = "Active Deep Dive: Modern C++ (C++20, Smart Pointers, Memory Allocators, Concurrency) & System Architecture (Event Dispatchers, Distributed Queues).";
    } else if (cmd === "stack") {
      res = "C++20, System Architecture, TypeScript, Node.js, React 19, FreeRTOS/ESP32, PostgreSQL, Redis";
    } else if (cmd === "projects") {
      res = "1. Vortex C++ Async Engine\n2. Nexus Distributed Event OS\n3. EdgePulse IoT Telemetry Gateway";
    } else if (cmd === "resume") {
      onOpenResume();
      res = "Opening ATS-ready Resume Preview modal...";
    } else if (cmd === "hire") {
      onScrollToContact();
      res = "Scrolling to contact & recruiter booking section...";
    } else if (cmd === "clear") {
      setLogs([]);
      return;
    }
    setLogs((prev) => [...prev, { prompt: cmd, text: res }]);
  };

  return (
    <div className="hero-visual-card">
      <div className="terminal-header">
        <div className="terminal-dots">
          <span />
          <span />
          <span />
        </div>
        <span className="terminal-title">systems-engineer ~ bash</span>
        <span className="terminal-chip">C++ &amp; ARCHITECTURE</span>
      </div>

      <div className="terminal-body">
        {logs.map((log, idx) => (
          <div key={idx} className="terminal-row">
            <div>
              <span className="terminal-prompt">$</span>
              <span className="terminal-cmd">{log.prompt}</span>
            </div>
            <div className="terminal-output">{log.text}</div>
          </div>
        ))}

        <div className="terminal-quick-cmds">
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Quick inspect:</span>
          <button className="terminal-quick-btn" onClick={() => runCommand("focus")}>focus</button>
          <button className="terminal-quick-btn" onClick={() => runCommand("stack")}>stack</button>
          <button className="terminal-quick-btn" onClick={() => runCommand("projects")}>projects</button>
          <button className="terminal-quick-btn" onClick={() => runCommand("resume")}>resume</button>
          <button className="terminal-quick-btn" onClick={() => runCommand("hire")}>hire-me</button>
          <button className="terminal-quick-btn" onClick={() => runCommand("clear")}>clear</button>
        </div>
      </div>
    </div>
  );
}

// ── Case Study Modal ──────────────────────────────────────────
function CaseStudyModal({ project, onClose }) {
  if (!project) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="section-tag cyan" style={{ marginBottom: "6px" }}>{project.language} • {project.category.toUpperCase()}</span>
            <h3 style={{ fontSize: "22px", margin: 0 }}>{project.title}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: "15px", color: "var(--text-secondary)", marginBottom: "20px", lineHeight: "1.6" }}>
            {project.description}
          </p>

          {project.metrics && (
            <div className="project-metrics-pill" style={{ marginBottom: "24px" }}>
              <Zap size={14} />
              <span><strong>Key Benchmark / Metric:</strong> {project.metrics}</span>
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "28px" }}>
            {project.tags?.map((t) => (
              <span key={t} className="tag-pill">{t}</span>
            ))}
          </div>

          <h4 style={{ fontSize: "16px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--cyan)", marginBottom: "12px" }}>
            System Architecture &amp; Engineering Process
          </h4>

          <div className="stage-timeline">
            {project.stages?.map((stage, idx) => (
              <div key={stage.label} className="stage-item">
                <div className="stage-badge">{String(idx + 1).padStart(2, "0")}</div>
                <div className="stage-content">
                  <h4>{stage.label}</h4>
                  <p>{stage.content || "Detailed architectural phase documented."}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "14px", marginTop: "36px", paddingTop: "20px", borderTop: "1px solid var(--border-subtle)" }}>
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn-primary">
                <Github size={16} /> View GitHub Source
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-secondary">
                <ExternalLink size={16} /> Open Live System
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Recruiter Resume Modal ────────────────────────────────────
function ResumeModal({ onClose, onToast }) {
  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const summary = `Software & Systems Engineer | Focus: C++, System Architecture & Full-Stack\nGitHub: https://github.com/Rdx011O\nActive Focus: C++20, Concurrency, Systems Architecture\nProven Stack: TypeScript, React 19, Node.js, ESP32/FreeRTOS, PostgreSQL`;
    navigator.clipboard.writeText(summary);
    onToast("Resume summary copied to clipboard!");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="resume-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FileText size={18} color="var(--cyan)" />
            <strong style={{ fontSize: "16px" }}>Candidate Profile / Recruiter Resume</strong>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button className="btn-secondary" style={{ padding: "6px 14px", fontSize: "12px" }} onClick={handleCopySummary}>
              <Copy size={14} /> Copy Summary
            </button>
            <button className="btn-primary" style={{ padding: "6px 14px", fontSize: "12px" }} onClick={handlePrint}>
              <Printer size={14} /> Print / Save PDF
            </button>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close resume">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="resume-paper">
          <div className="resume-header">
            <div>
              <h2 className="resume-name">Software &amp; Systems Engineer</h2>
              <div className="resume-title">C++ &bull; Systems Architecture &bull; Full-Stack Software &bull; Embedded Systems</div>
            </div>
            <div className="resume-contact-info">
              <div>Bengaluru, India &bull; Open to Remote &amp; Relocation</div>
              <div>GitHub: <a href="https://github.com/Rdx011O" target="_blank" rel="noreferrer" style={{ color: "var(--cyan)" }}>github.com/Rdx011O</a></div>
              <div>Email: <a href="mailto:contact@engineer.dev" style={{ color: "var(--lime)" }}>contact@engineer.dev</a></div>
            </div>
          </div>

          <div className="resume-section">
            <div className="resume-section-title">Professional Summary &amp; Core Focus</div>
            <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
              Systems-oriented Software Engineer currently focused on <strong>Modern C++ (C++17/C++20)</strong> and <strong>System Architecture</strong> (concurrency, low-latency queues, thread-safety, and distributed state). Possesses strong, proven full-stack and embedded hardware foundations with real-world experience building high-throughput web platforms and microcontroller telemetry nodes.
            </p>
          </div>

          <div className="resume-section">
            <div className="resume-section-title">Technical Skill Matrix</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "13px" }}>
              <div><strong>Active Deep Dive:</strong> Modern C++ (C++20, RAII, Smart Pointers, STL), Systems Architecture, Concurrency, FreeRTOS</div>
              <div><strong>Proven &amp; Applied:</strong> TypeScript, JavaScript, React 19, Next.js, Node.js, WebSocket, Data Structures</div>
              <div><strong>Systems &amp; Database:</strong> PostgreSQL, Redis, I2C/SPI/UART, Digital Logic, Memory Profiling</div>
              <div><strong>Tooling:</strong> Linux / Bash, Git, CMake, GDB, Figma Tokens, CI/CD pipelines</div>
            </div>
          </div>

          <div className="resume-section">
            <div className="resume-section-title">Highlighted Systems &amp; Engineering Projects</div>
            <div className="resume-item">
              <div className="resume-item-top">
                <span>Vortex C++ Async Engine — Multithreaded Dispatcher</span>
                <span style={{ color: "var(--cyan)", fontFamily: "var(--font-mono)", fontSize: "12px" }}>C++20, System Architecture, Multithreading</span>
              </div>
              <ul>
                <li>Engineered a lock-free worker thread pool with cache-line aligned ring buffers, achieving sub-microsecond task dispatch.</li>
                <li>Eliminated heap fragmentation through custom arena allocators and deterministic RAII lifecycle management.</li>
              </ul>
            </div>

            <div className="resume-item">
              <div className="resume-item-top">
                <span>Nexus Distributed Event OS — Real-Time State Architecture</span>
                <span style={{ color: "var(--lime)", fontFamily: "var(--font-mono)", fontSize: "12px" }}>System Architecture, React, Node.js, Redis</span>
              </div>
              <ul>
                <li>Architected full-stack event check-in platform handling 10k+ concurrent requests with sub-100ms socket updates.</li>
                <li>Decreased average check-in bottleneck by 92% utilizing cryptographic offline QR payloads and Redis caching.</li>
              </ul>
            </div>

            <div className="resume-item">
              <div className="resume-item-top">
                <span>EdgePulse IoT Telemetry Gateway</span>
                <span style={{ color: "var(--orange)", fontFamily: "var(--font-mono)", fontSize: "12px" }}>ESP32, Embedded C++, FreeRTOS, MQTT</span>
              </div>
              <ul>
                <li>Developed dual-core FreeRTOS firmware streaming multi-channel 50Hz sensor data with Kalman DSP filtering.</li>
                <li>Engineered ultra-low-power sleep modes achieving 14+ days uninterrupted continuous field operation.</li>
              </ul>
            </div>
          </div>

          <div className="resume-section">
            <div className="resume-section-title">Education &amp; Academic Foundation</div>
            <div className="resume-item">
              <div className="resume-item-top">
                <span>Bachelor of Technology (B.Tech) &mdash; Electronics &amp; Communication / Engineering</span>
                <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>2022 &ndash; 2026</span>
              </div>
              <div className="resume-item-sub">Relevant Coursework: Data Structures &amp; Algorithms, Computer Architecture, Operating Systems, Embedded Systems, Computer Networks, VLSI &amp; Digital Design.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main App Component ────────────────────────────────────────
export default function App() {
  const [projects] = useState(getProjects);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCaseStudy, setActiveCaseStudy] = useState(null);
  const [activeSkillDrive, setActiveSkillDrive] = useState("cpp_systems");
  const [showResume, setShowResume] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll listener for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("contact@engineer.dev");
    triggerToast("Email address copied to clipboard!");
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchCategory = selectedCategory === "all" || p.category === selectedCategory;
      const matchSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.language?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <>
      <div className="bg-grid-layer" />

      {/* Toast Banner */}
      {toastMsg && (
        <div className="toast-notice">
          <CheckCircle2 size={16} color="var(--cyan)" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Case Study Modal */}
      {activeCaseStudy && (
        <CaseStudyModal project={activeCaseStudy} onClose={() => setActiveCaseStudy(null)} />
      )}

      {/* Recruiter Resume Modal */}
      {showResume && (
        <ResumeModal onClose={() => setShowResume(false)} onToast={triggerToast} />
      )}

      {/* ── NAVBAR ────────────────────────────────────────── */}
      <header className={`navbar-wrapper ${scrolled ? "scrolled" : ""}`}>
        <div className="container">
          <div className="navbar-inner">
            <a href="#top" className="nav-brand">
              <div className="nav-logo-badge">AK</div>
              <div className="nav-brand-text">
                <span className="nav-brand-name">ENGINEER // SYSTEMS</span>
                <span className="nav-brand-status">
                  <span className="pulse-dot" /> C++ &amp; SYSTEMS FOCUS
                </span>
              </div>
            </a>

            <nav className="nav-desktop" aria-label="Main Navigation">
              <ul className="nav-links">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="nav-link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="nav-actions">
              <button className="btn-nav-resume" onClick={() => setShowResume(true)}>
                <FileText size={14} /> Resume
              </button>
              <a href="#contact" className="btn-nav-talk">
                Let's Talk <ArrowUpRight size={14} />
              </a>
              <button
                className="nav-mobile-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER ─────────────────────────────────── */}
      {mobileMenuOpen && (
        <>
          <div
            className="mobile-drawer-overlay"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <aside className="mobile-drawer-panel" aria-label="Mobile Navigation">
            <div className="mobile-drawer-header">
              <div className="nav-brand">
                <div className="nav-logo-badge">AK</div>
                <div className="nav-brand-text">
                  <span className="nav-brand-name">ENGINEER // SYSTEMS</span>
                  <span className="nav-brand-status">
                    <span className="pulse-dot" /> ACTIVE
                  </span>
                </div>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="mobile-drawer-links">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="mobile-drawer-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{link.label}</span>
                  <ChevronRight size={16} color="var(--cyan)" />
                </a>
              ))}
            </nav>

            <div className="mobile-drawer-footer">
              <button
                className="btn-secondary"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowResume(true);
                }}
              >
                <FileText size={15} /> Candidate Resume
              </button>
              <a
                href="#contact"
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Let's Talk <ArrowUpRight size={15} />
              </a>
            </div>
          </aside>
        </>
      )}

      <main id="top">
        {/* ── HERO SECTION ─────────────────────────────────── */}
        <section className="hero-section">
          <div className="container">
            <div className="hero-grid">
              <div>
                <div className="hero-badge-row">
                  <span className="badge-focus">
                    <Workflow size={13} /> ACTIVE FOCUS: C++ &amp; SYSTEM ARCHITECTURE
                  </span>
                  <span className="badge-status">
                    <span className="pulse-dot" /> 2026 ROLES
                  </span>
                </div>

                <h1 className="hero-title">
                  Building Systems with <span className="text-gradient-cyan">Modern C++</span>, Robust Architecture &amp; Full-Stack Craft.
                </h1>

                <p className="hero-lead">
                  Software and systems engineer currently diving deep into <strong>Modern C++ (C++20, Concurrency, Memory Models)</strong> and <strong>System Architecture</strong>, backed by hands-on production experience in full-stack platforms and embedded firmware.
                </p>

                <div className="hero-cta-group">
                  <a href="#work" className="btn-primary">
                    Explore Systems &amp; Work <ArrowRight size={16} />
                  </a>
                  <button className="btn-secondary" onClick={() => setShowResume(true)}>
                    <FileText size={16} /> Candidate Resume
                  </button>
                </div>

                <div className="hero-metrics">
                  <div className="metric-item">
                    <span className="metric-num">C++20</span>
                    <span className="metric-label">Active Core Focus</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-num">&lt;8<span>μs</span></span>
                    <span className="metric-label">Low-Latency Dispatch</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-num">10k<span>+</span></span>
                    <span className="metric-label">Full-Stack Sync Events</span>
                  </div>
                </div>
              </div>

              {/* Terminal / Live Inspect */}
              <HeroTerminal
                onOpenResume={() => setShowResume(true)}
                onScrollToContact={() => {
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }}
              />
            </div>
          </div>
        </section>

        {/* ── FEATURED WORK SECTION ─────────────────────────── */}
        <section className="section" id="work">
          <div className="container">
            <div className="section-header">
              <span className="section-tag cyan">01 // PRODUCTION &amp; SYSTEM ARCHITECTURES</span>
              <h2 className="section-title">Systems as Code, Built with Architectural Rigor.</h2>
              <p className="section-desc">
                Case studies highlighting low-latency C++ concurrency frameworks, distributed event orchestration, and embedded multi-sensor firmware.
              </p>
            </div>

            {/* Filter Bar */}
            <div className="projects-filter-bar">
              <div className="filter-pills">
                {[
                  { id: "all", label: "All Systems" },
                  { id: "cpp", label: "C++ & Concurrency" },
                  { id: "architecture", label: "System Architecture" },
                  { id: "embedded", label: "Embedded & IoT" },
                  { id: "web", label: "Web & UI Systems" },
                ].map((f) => (
                  <button
                    key={f.id}
                    className={`filter-pill ${selectedCategory === f.id ? "active" : ""}`}
                    onClick={() => setSelectedCategory(f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="search-box">
                <Search size={15} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="Filter by language, tag or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} aria-label="Clear search">
                    <X size={14} color="var(--text-muted)" />
                  </button>
                )}
              </div>
            </div>

            {/* Projects Grid */}
            <div className="projects-grid">
              {filteredProjects.map((project, idx) => (
                <article
                  key={project.repoName || idx}
                  className={`project-card ${idx === 0 ? "featured-card" : ""}`}
                >
                  <div className="project-card-visual">
                    <ParticleCanvas />
                    <div className="project-badge-float">
                      <CircuitBoard size={12} color="var(--cyan)" />
                      <span>{project.language || "C++"}</span>
                    </div>

                    <div className="project-links-float">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="icon-link-btn"
                          title="GitHub Repository"
                        >
                          <Github size={15} />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="icon-link-btn"
                          title="Live Demo"
                        >
                          <ExternalLink size={15} />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="project-card-content">
                    <h3 className="project-card-title">{project.title}</h3>
                    <div className="project-card-tagline">{project.tagline}</div>
                    <p className="project-card-desc">{project.description}</p>

                    {project.metrics && (
                      <div className="project-metrics-pill">
                        <Zap size={13} />
                        <span>{project.metrics}</span>
                      </div>
                    )}

                    <div className="project-tags">
                      {project.tags?.map((t) => (
                        <span key={t} className="tag-pill">{t}</span>
                      ))}
                    </div>

                    <div className="project-card-actions">
                      <button
                        className="btn-case-study"
                        onClick={() => setActiveCaseStudy(project)}
                      >
                        Deep Case Study &amp; Architecture <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── SKILLS OPERATING SYSTEM (HONEST TIERS) ─────────── */}
        <section className="section" id="skills">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">02 // COMPETENCY TIERS &amp; ACTIVE FOCUS</span>
              <h2 className="section-title">Skill Operating System</h2>
              <p className="section-desc">
                Honest, high-signal representation of engineering proficiencies&mdash;distinguishing active deep-dive focus from production-tested foundations.
              </p>
            </div>

            <div className="skills-container">
              {/* Sidebar Tabs */}
              <div className="skills-sidebar">
                {Object.values(SKILLS_DATA).map((drive) => {
                  const Icon = drive.icon;
                  const isActive = activeSkillDrive === drive.id;
                  const activeClass = isActive
                    ? drive.color === "cyan"
                      ? "active"
                      : drive.color === "lime"
                      ? "active lime-active"
                      : "active orange-active"
                    : "";
                  return (
                    <button
                      key={drive.id}
                      className={`skills-tab-btn ${activeClass}`}
                      onClick={() => setActiveSkillDrive(drive.id)}
                    >
                      <Icon size={18} />
                      <span>{drive.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Main Panel */}
              <div className="skills-main-panel">
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "20px", marginBottom: "6px" }}>
                    {SKILLS_DATA[activeSkillDrive].label}
                  </h3>
                  <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                    {SKILLS_DATA[activeSkillDrive].summary}
                  </p>
                </div>

                <div className="skills-grid-cards">
                  {SKILLS_DATA[activeSkillDrive].skills.map((s) => (
                    <div key={s.name} className="skill-node-card">
                      <div className="skill-node-head">
                        <span className="skill-node-name">{s.name}</span>
                        <span className={`skill-status-tag ${s.status}`}>{s.tier}</span>
                      </div>
                      <div className="skill-node-note">{s.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── INTERACTIVE LAB / PLAYGROUND ───────────────────── */}
        <section className="section" id="lab">
          <div className="container">
            <div className="section-header">
              <span className="section-tag orange">03 // INTERACTIVE LAB &amp; SANDBOXES</span>
              <h2 className="section-title">Live Hardware &amp; Code Sandboxes</h2>
              <p className="section-desc">
                Hands-on mini-demonstrations illustrating digital logic gates, real-time telemetry streams, and systems experiments.
              </p>
            </div>

            <div className="lab-grid">
              {/* Sandbox 1: Logic Gates */}
              <div className="lab-card">
                <div className="lab-card-title">
                  <CircuitBoard size={18} color="var(--cyan)" />
                  <span>Digital Logic Gate Simulator</span>
                </div>
                <div className="lab-card-desc">
                  Interactive boolean algebra simulator. Toggle binary inputs (A, B) to evaluate real-time gate propagation.
                </div>
                <div className="lab-interactive-area">
                  <LogicGateSimulator />
                </div>
              </div>

              {/* Sandbox 2: Telemetry DSP */}
              <div className="lab-card">
                <div className="lab-card-title">
                  <Cpu size={18} color="var(--lime)" />
                  <span>Real-time Telemetry Monitor</span>
                </div>
                <div className="lab-card-desc">
                  Simulated multi-channel telemetry node monitoring ESP32 thermals, 50Hz DSP sampling, and socket latency.
                </div>
                <div className="lab-interactive-area">
                  <TelemetrySimulator />
                </div>
              </div>

              {/* Sandbox 3: Lab Philosophy */}
              <div className="lab-card">
                <div className="lab-card-title">
                  <Sparkles size={18} color="var(--orange)" />
                  <span>Current Exploration Playground</span>
                </div>
                <div className="lab-card-desc">
                  {getPlayground()}
                </div>
                <div className="lab-interactive-area" style={{ justifyContent: "center", textAlign: "center" }}>
                  <a href="/admin.html" className="btn-secondary" style={{ fontSize: "13px" }}>
                    <Sliders size={14} /> Open Admin Lab Panel
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── EXPERIENCE & EDUCATION ─────────────────────────── */}
        <section className="section" id="experience">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">04 // JOURNEY &amp; FOUNDATIONS</span>
              <h2 className="section-title">Experience, Education &amp; Achievements</h2>
              <p className="section-desc">
                Rigorous grounding through engineering coursework, hands-on production builds, and hackathon wins.
              </p>
            </div>

            <div className="timeline-grid">
              {/* Column 1: Engineering Projects & Experience */}
              <div className="timeline-column">
                <h3 style={{ fontSize: "20px", display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <Briefcase size={18} color="var(--cyan)" /> Engineering Experience
                </h3>

                <div className="timeline-card">
                  <div className="timeline-header">
                    <span className="timeline-role">Systems &amp; Full-Stack Builder</span>
                    <span className="timeline-period">2024 &ndash; PRESENT</span>
                  </div>
                  <div className="timeline-org">Campus Tech &amp; Event Platforms</div>
                  <ul className="timeline-bullets">
                    <li>Led development of Nexus Event OS, orchestrating live state synchronizations for 3,500+ attendees.</li>
                    <li>Designed an offline-first state machine that eliminated check-in latency bottlenecks under congestion.</li>
                  </ul>
                </div>

                <div className="timeline-card">
                  <div className="timeline-header">
                    <span className="timeline-role">IoT &amp; Embedded Firmware Builder</span>
                    <span className="timeline-period">2023 &ndash; 2024</span>
                  </div>
                  <div className="timeline-org">Hardware &amp; Microcontroller Projects</div>
                  <ul className="timeline-bullets">
                    <li>Constructed multi-sensor environmental telemetry nodes on ESP32 with MQTT cloud synchronization.</li>
                    <li>Wrote low-power FreeRTOS tasks and digital filter algorithms for real-time sensor processing.</li>
                  </ul>
                </div>
              </div>

              {/* Column 2: Education & Awards */}
              <div className="timeline-column">
                <h3 style={{ fontSize: "20px", display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <BookOpen size={18} color="var(--lime)" /> Education &amp; Hackathons
                </h3>

                <div className="timeline-card">
                  <div className="timeline-header">
                    <span className="timeline-role">Bachelor of Technology (B.Tech)</span>
                    <span className="timeline-period">2022 &ndash; 2026</span>
                  </div>
                  <div className="timeline-org">Electronics &amp; Communication Engineering</div>
                  <ul className="timeline-bullets">
                    <li>Core focus: Embedded Systems, Digital Signal Processing, Computer Networks, Operating Systems.</li>
                    <li>Active contributor to campus developer societies, robotics projects, and technical workshops.</li>
                  </ul>
                </div>

                <div className="timeline-card">
                  <div className="timeline-header">
                    <span className="timeline-role">Hackathon Winner &amp; Finalist</span>
                    <span className="timeline-period">2024</span>
                  </div>
                  <div className="timeline-org">National Technical Hackathons</div>
                  <ul className="timeline-bullets">
                    <li>Built functional prototypes in under 36 hours solving real-world telemetry and accessibility challenges.</li>
                    <li>Awarded Best Hardware-Software Integration for real-time sensor visualization dashboard.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ABOUT ME ──────────────────────────────────────── */}
        <section className="section" id="about">
          <div className="container">
            <div className="about-box">
              <div className="about-text">
                <span className="section-tag">05 // ABOUT THE ENGINEER</span>
                <h3>Passionate about understanding systems from the silicon level up to the user interface.</h3>
                <p>
                  I enjoy working at the boundary between low-level hardware performance and modern software architecture. Focusing on C++ and system design teaches me how memory hierarchies, CPU caches, and concurrency really work&mdash;which directly translates to writing cleaner, more efficient software across the entire stack.
                </p>
                <p>
                  I value clarity over hype, measurable benchmarks over buzzwords, and intentional engineering craft over bloated dependencies.
                </p>

                <div className="about-highlights">
                  <div className="about-highlight-card">
                    <strong>Systems Thinking</strong>
                    <span>Deep focus on concurrency, memory safety, and predictable execution.</span>
                  </div>
                  <div className="about-highlight-card">
                    <strong>Pragmatic Execution</strong>
                    <span>Ship working prototypes rapidly, then profile and optimize where it counts.</span>
                  </div>
                </div>
              </div>

              <div className="about-visual-badge">
                <div className="studio-photo-frame">
                  <img src={studioCollage} alt="Studio Work Collage" />
                </div>
                <div style={{ textAlign: "center", fontSize: "12px", color: "var(--text-muted)" }}>
                  Snapshot of experimental prototypes &amp; studio workspace
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTACT & RECRUITER ACTION ────────────────────── */}
        <section className="section" id="contact">
          <div className="container">
            <div className="contact-grid">
              <div className="contact-info-col">
                <span className="section-tag cyan">06 // CONNECT &amp; RECRUITMENT</span>
                <h3>Let's discuss systems, architecture &amp; engineering roles.</h3>
                <p>
                  I am actively open for <strong>Software Engineer</strong>, <strong>Systems / C++</strong>, and <strong>Full-Stack</strong> roles. Whether you have an open opportunity or want to discuss system architectures, feel free to reach out.
                </p>

                <div className="contact-direct-links">
                  <div className="contact-direct-item">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Mail size={16} color="var(--cyan)" />
                      <span>contact@engineer.dev</span>
                    </div>
                    <button className="copy-btn" onClick={copyEmail}>
                      Copy Email
                    </button>
                  </div>

                  <a
                    href="https://github.com/Rdx011O"
                    target="_blank"
                    rel="noreferrer"
                    className="contact-direct-item"
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Github size={16} />
                      <span>GitHub: /Rdx011O</span>
                    </div>
                    <ArrowUpRight size={14} />
                  </a>

                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="contact-direct-item"
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Linkedin size={16} color="var(--lime)" />
                      <span>LinkedIn Profile</span>
                    </div>
                    <ArrowUpRight size={14} />
                  </a>
                </div>

                <button
                  className="btn-primary"
                  onClick={() => setShowResume(true)}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <FileText size={16} /> View Candidate Resume
                </button>
              </div>

              {/* Contact Form */}
              <form
                className="contact-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  triggerToast("Message sent! I'll get back to you shortly.");
                  e.target.reset();
                }}
              >
                <div className="form-group">
                  <label htmlFor="name">YOUR NAME / COMPANY</label>
                  <input
                    id="name"
                    required
                    type="text"
                    className="form-input"
                    placeholder="e.g. Alex Smith / Engineering Manager"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">EMAIL ADDRESS</label>
                  <input
                    id="email"
                    required
                    type="email"
                    className="form-input"
                    placeholder="alex@company.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">PROJECT OR ROLE INQUIRY</label>
                  <textarea
                    id="message"
                    required
                    className="form-textarea"
                    placeholder="Hi! We'd love to chat about a systems / software engineering role..."
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: "10px", justifyContent: "center" }}>
                  <Send size={15} /> Send Direct Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* ── FLOATING RECRUITER DOCK ────────────────────────── */}
      <aside className="recruiter-dock" aria-label="Recruiter quick access dock">
        <button className="dock-btn primary" onClick={() => setShowResume(true)}>
          <FileText size={14} /> View Resume
        </button>
        <a href="#work" className="dock-btn">
          <Cpu size={14} /> Systems
        </a>
        <a href="#contact" className="dock-btn">
          <Mail size={14} /> Contact
        </a>
        <a href="https://github.com/Rdx011O" target="_blank" rel="noreferrer" className="dock-btn">
          <Github size={14} /> GitHub
        </a>
      </aside>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="container">
        <div className="site-footer">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CircuitBoard size={16} color="var(--cyan)" />
            <span>Built with architectural focus. &copy; 2026</span>
          </div>

          <div className="footer-socials">
            <a href="https://github.com/Rdx011O" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="/admin.html">Admin Portal</a>
            <a href="#top">Back to Top &uarr;</a>
          </div>
        </div>
      </footer>
    </>
  );
}

// ── Render ───────────────────────────────────────────────────
createRoot(document.getElementById("root")).render(<App />);
