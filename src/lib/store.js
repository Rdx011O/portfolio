// ── localStorage store ────────────────────────────────────────
// Keys:
//   portfolio_github_config  → { username, token }
//   portfolio_projects       → ProjectRecord[]
//   portfolio_playground     → string (free-form text)
//   portfolio_experiments    → ExperimentCard[]

const KEYS = {
  config: "portfolio_github_config",
  projects: "portfolio_projects",
  playground: "portfolio_playground",
  experiments: "portfolio_experiments",
};

// ── Default Rich Projects (Recruiter & Portfolio Showcase) ────
export const SEED_PROJECTS = [
  {
    repoName: "cpp-async-dispatcher",
    title: "Vortex C++ Async Engine",
    tagline: "High-Performance Concurrency & System Architecture Framework",
    description: "Modern C++20 multi-threaded event dispatcher utilizing lock-free circular ring buffers, thread pools, and RAII memory safety for low-latency task processing.",
    category: "cpp",
    githubUrl: "https://github.com/Rdx011O",
    liveUrl: "https://github.com/Rdx011O",
    language: "C++",
    tags: ["C++20", "System Architecture", "Multithreading", "Lock-free Queues", "RAII", "POSIX"],
    selected: true,
    featured: true,
    metrics: "Sub-microsecond task dispatch • 0% heap fragmentation • Custom arena allocators",
    tone: "blue",
    order: 0,
    stages: [
      {
        label: "Problem",
        content: "Standard thread-per-task models create excessive context-switching overhead and memory contention in high-frequency event architectures."
      },
      {
        label: "Thinking",
        content: "Architected a thread-pool worker queue with CPU cache-line aligned ring buffers, eliminating mutex contention using atomic compare-and-swap operations."
      },
      {
        label: "System Design",
        content: "Structured as a modular 3-tier architecture: Producer ingestion layer, lock-free work-stealing scheduler, and dedicated SIMD/compute worker threads."
      },
      {
        label: "Implementation",
        content: "Built with Modern C++20 standards, smart pointers, custom memory arena allocators, and deterministic object lifecycle management."
      },
      {
        label: "Benchmark & Result",
        content: "Achieved 4.2M events/second throughput on 8 cores with p99.9 latency under 8 microseconds."
      }
    ]
  },
  {
    repoName: "nexus-event-os",
    title: "Nexus Distributed Event OS",
    tagline: "High-Throughput Real-time System & Architecture",
    description: "Distributed event orchestration architecture managing real-time websocket state sync, cryptographic QR validation, and optimistic cache consistency.",
    category: "architecture",
    githubUrl: "https://github.com/Rdx011O",
    liveUrl: "https://github.com/Rdx011O",
    language: "TypeScript",
    tags: ["System Architecture", "React 19", "Node.js", "WebSocket", "Redis Pub/Sub", "PostgreSQL"],
    selected: true,
    featured: true,
    metrics: "10k+ concurrent requests • 99.98% uptime • 42ms p95 latency",
    tone: "lime",
    order: 1,
    stages: [
      {
        label: "Problem",
        content: "High-concurrency event check-ins experienced database connection exhaustion, race conditions in seat allocation, and network disconnection drops."
      },
      {
        label: "Thinking",
        content: "Decoupled the write path from the persistence layer using Redis in-memory pub/sub queues and asynchronous transactional batching."
      },
      {
        label: "System Design",
        content: "Architected an offline-first client node topology with cryptographic state machines, optimistic UI mutations, and idempotent replay buffers."
      },
      {
        label: "Implementation",
        content: "Implemented with React 19, TypeScript strict mode, Node.js clustered socket workers, and automated background reconciliation workers."
      },
      {
        label: "Benchmark & Result",
        content: "Processed 3,500+ attendees in production with zero packet drops, reducing check-in latency from 24s to 1.8s."
      }
    ]
  },
  {
    repoName: "edge-pulse-iot",
    title: "EdgePulse IoT Gateway",
    tagline: "ESP32 Embedded C++ Firmware & Multi-Sensor Telemetry Node",
    description: "Embedded telemetry gateway orchestrating multi-channel environmental I2C/SPI sensor arrays with local DSP filtering and MQTT cloud bridging.",
    category: "embedded",
    githubUrl: "https://github.com/Rdx011O",
    liveUrl: "https://github.com/Rdx011O",
    language: "C++",
    tags: ["ESP32", "C++", "FreeRTOS", "MQTT", "I2C / SPI", "Embedded Firmware"],
    selected: true,
    featured: false,
    metrics: "50Hz sampling rate • Low-power sleep <15μA • Dual-core FreeRTOS",
    tone: "cyan",
    order: 2,
    stages: [
      {
        label: "Problem",
        content: "Raw ADC sensor conversions suffered from high-frequency electromagnetic noise, intermittent WiFi drops, and battery depletion."
      },
      {
        label: "Thinking",
        content: "Designed a twin-core FreeRTOS task partition: Core 0 dedicated to real-time timer interrupts & Kalman filtering, Core 1 managing TLS MQTT buffering."
      },
      {
        label: "System Design",
        content: "Isolated analog and digital ground planes on custom 2-layer PCB layout with hardware brownout protection and flash ring buffers."
      },
      {
        label: "Implementation",
        content: "Programmed in modern C++ with ESP-IDF, FreeRTOS message queues, DMA buffers, and deep-sleep wake-on-interrupt state machines."
      },
      {
        label: "Benchmark & Result",
        content: "14+ days continuous battery life on a single 18650 cell with 99.99% data packet delivery under adverse network conditions."
      }
    ]
  },
  {
    repoName: "aether-design-system",
    title: "Aether UI & Component Engine",
    tagline: "Accessible Component Library & Micro-interaction System",
    description: "Production-grade design token pipeline and React component framework built for high-performance dashboard interfaces with fluid physics.",
    category: "web",
    githubUrl: "https://github.com/Rdx011O",
    liveUrl: "https://github.com/Rdx011O",
    language: "React",
    tags: ["Design Systems", "Vanilla CSS", "React 19", "Web Accessibility (WCAG)", "Tokens"],
    selected: true,
    featured: false,
    metrics: "45+ accessible components • 100% WCAG AA • <12kB bundle size",
    tone: "orange",
    order: 3,
    stages: [
      {
        label: "Problem",
        content: "Bloated third-party UI libraries created heavy JavaScript bundles, slow initial paint times, and broken keyboard focus management."
      },
      {
        label: "Thinking",
        content: "Crafted a headless token architecture where semantic CSS custom properties automatically adapt across dark/light themes and screen densities."
      },
      {
        label: "System Design",
        content: "Component hierarchy separating atomic primitives (Button, Input, Surface) from compound layout orchestration (Modals, Radars, Drawers)."
      },
      {
        label: "Implementation",
        content: "Pure Vanilla CSS architecture with custom CSS properties, modular React 19 primitives, keyboard navigation traps, and ARIA compliant roles."
      },
      {
        label: "Benchmark & Result",
        content: "Decreased UI development turnaround time by 60% with zero external styling dependencies."
      }
    ]
  },
  {
    repoName: "circuitsim-logic-core",
    title: "CircuitSim Logic Engine",
    tagline: "Digital Logic Gate Simulator & Truth Table Synthesis",
    description: "Browser-based digital circuit simulator supporting combinational logic gates, flip-flops, clock generators, and automated truth table synthesis.",
    category: "embedded",
    githubUrl: "https://github.com/Rdx011O",
    liveUrl: "https://github.com/Rdx011O",
    language: "JavaScript",
    tags: ["Digital Logic", "ECE", "Graph Traversal", "Boolean Algebra", "Web Canvas"],
    selected: true,
    featured: false,
    metrics: "Sub-millisecond gate propagation • Topological sorting engine",
    tone: "blue",
    order: 4,
    stages: [
      {
        label: "Problem",
        content: "Students and engineers needed a friction-free, zero-install simulator to test boolean algebra and combinational circuits on the fly."
      },
      {
        label: "Thinking",
        content: "Modeled digital circuit schematics as directed acyclic graphs (DAG) with cycle detection and topological wave propagation."
      },
      {
        label: "System Design",
        content: "Topological node evaluator processing logic states level-by-level with discrete event simulation step tracking."
      },
      {
        label: "Implementation",
        content: "Developed with pure JavaScript canvas rendering, object-oriented wire routing algorithms, and instant Karnaugh map generation."
      },
      {
        label: "Benchmark & Result",
        content: "Used by 200+ students for digital design coursework verification and automated truth table validation."
      }
    ]
  }
];

// ── GitHub config ─────────────────────────────────────────────
export function getGithubConfig() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.config)) || { username: "Rdx011O", token: "" };
  } catch {
    return { username: "Rdx011O", token: "" };
  }
}
export function saveGithubConfig(config) {
  localStorage.setItem(KEYS.config, JSON.stringify(config));
}

// ── Projects ──────────────────────────────────────────────────
export function getProjects() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEYS.projects));
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
    return SEED_PROJECTS;
  } catch {
    return SEED_PROJECTS;
  }
}
export function saveProjects(projects) {
  localStorage.setItem(KEYS.projects, JSON.stringify(projects));
}

export function mergeReposIntoProjects(existing, freshRepos) {
  const existingMap = Object.fromEntries(existing.map((p) => [p.repoName, p]));
  const merged = freshRepos.map((repo, i) => {
    const prev = existingMap[repo.repoName];
    return prev
      ? { ...prev, githubUrl: repo.githubUrl, language: repo.language, topics: repo.topics }
      : {
          repoName: repo.repoName,
          title: repo.repoName.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          tagline: repo.description ? repo.description.slice(0, 80) : "Engineering project & software system",
          description: repo.description || "Experimental engineering project with clean code and robust architecture.",
          githubUrl: repo.githubUrl,
          liveUrl: repo.homepage || "",
          language: repo.language || "C++",
          topics: repo.topics || [],
          tags: repo.topics && repo.topics.length ? repo.topics : [repo.language || "Code", "Systems"],
          selected: true,
          tone: ["lime", "orange", "blue", "cyan"][i % 4],
          order: existing.length + i,
          category: "cpp",
          stages: [
            { label: "Problem", content: "Targeted problem statement and architectural requirements." },
            { label: "Thinking", content: "System modeling, trade-off analysis, and component selection." },
            { label: "System Design", content: "Architecture diagram, data flow, and concurrency strategy." },
            { label: "Implementation", content: "Implementation details, algorithms, and engineering stack." },
            { label: "Benchmark & Result", content: "Performance benchmarks, key takeaways, and production metrics." },
          ],
        };
  });
  return merged.sort((a, b) => a.order - b.order);
}

// ── Playground ────────────────────────────────────────────────
export function getPlayground() {
  return (
    localStorage.getItem(KEYS.playground) ||
    "Currently deep in Modern C++ (C++20 standards, memory models, multithreading), Systems Architecture (distributed state, low-latency queues), and Embedded Firmware on ESP32."
  );
}
export function savePlayground(text) {
  localStorage.setItem(KEYS.playground, text);
}

// ── Experiment Cards ──────────────────────────────────────────
const DEFAULT_EXPERIMENTS = [
  { id: "SYS-01", title: "C++ Lock-free Queue", category: "Systems / C++", copy: "Multi-producer single-consumer ring buffer with atomic memory fences." },
  { id: "SYS-02", title: "Distributed State Sync", category: "Architecture", copy: "Vector clock algorithm and optimistic conflict-free replicated data types." },
  { id: "EXP-03", title: "Kinetic Logic Sim", category: "Hardware / Web", copy: "Interactive digital logic gate playground with sub-millisecond signal propagation." },
  { id: "EXP-04", title: "ESP32 Sensor Telemetry", category: "Embedded C++", copy: "Real-time FreeRTOS task streaming multi-channel sensor telemetry." },
];

export function getExperiments() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEYS.experiments));
    return saved && saved.length ? saved : DEFAULT_EXPERIMENTS;
  } catch {
    return DEFAULT_EXPERIMENTS;
  }
}
export function saveExperiments(experiments) {
  localStorage.setItem(KEYS.experiments, JSON.stringify(experiments));
}
