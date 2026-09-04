// ── GitHub API ────────────────────────────────────────────────
const BASE = "https://api.github.com";

/**
 * Fetch all public repos for a GitHub username.
 * Optionally pass a Personal Access Token for private repos.
 */
export async function fetchGitHubRepos(username, token = "") {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let page = 1;
  let all = [];

  while (true) {
    const res = await fetch(
      `${BASE}/users/${username}/repos?per_page=100&page=${page}&sort=updated`,
      { headers }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `GitHub API error ${res.status}`);
    }
    const data = await res.json();
    all = all.concat(data);
    if (data.length < 100) break;
    page++;
  }

  return all.map((repo) => ({
    repoName: repo.name,
    fullName: repo.full_name,
    description: repo.description || "",
    githubUrl: repo.html_url,
    homepage: repo.homepage || "",
    language: repo.language || "",
    stars: repo.stargazers_count,
    topics: repo.topics || [],
    updatedAt: repo.updated_at,
    isPrivate: repo.private,
  }));
}
