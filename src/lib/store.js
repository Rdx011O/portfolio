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
    return JSON.parse(localStorage.getItem(KEYS.projects)) || [];
  } catch {
    return [];
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
          description: repo.description,
          githubUrl: repo.githubUrl,
          liveUrl: repo.homepage || "",
          language: repo.language,
          topics: repo.topics,
          selected: false,
          tone: ["lime", "orange", "blue", "neutral"][i % 4],
          order: existing.length + i,
          stages: [
            { label: "Problem", content: "" },
            { label: "Thinking", content: "" },
            { label: "Design", content: "" },
            { label: "Build", content: "" },
            { label: "Result", content: "" },
          ],
        };
  });
  return merged.sort((a, b) => a.order - b.order);
}

// ── Playground ────────────────────────────────────────────────
export function getPlayground() {
  return (
    localStorage.getItem(KEYS.playground) ||
    "Currently exploring AI interfaces, embedded systems, and the space between hardware and design."
  );
}
export function savePlayground(text) {
  localStorage.setItem(KEYS.playground, text);
}

// ── Experiment Cards ──────────────────────────────────────────
const DEFAULT_EXPERIMENTS = [
  { id: "TYPE-01", title: "Kinetic poster grid", copy: "Typography that reacts like a machine warming up." },
  { id: "LAB-18", title: "Micro dashboard", copy: "Tiny operational screens for large messy systems." },
  { id: "AI-06", title: "Prompted interface moodboard", copy: "Visual studies for impossible products." },
  { id: "HW-12", title: "Sensor signal sketch", copy: "Turning invisible readings into visible rhythm." },
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
