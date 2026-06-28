import express from 'express';

const router = express.Router();

router.get('/repo', async (req, res) => {
  const { repo } = req.query;
  if (!repo) {
    return res.status(400).json({ error: 'Missing required query parameter "repo"' });
  }

  const headers = {
    'User-Agent': 'MERN-Classic-OS-Portfolio-App'
  };

  // Attach token if present in environment configuration to avoid rate limits
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  try {
    // 1. Fetch repository general metadata (stars, issues)
    const metaRes = await fetch(`https://api.github.com/repos/${repo}`, { headers });
    if (!metaRes.ok) {
      return res.status(metaRes.status).json({ error: `GitHub API metadata fetch failed: ${metaRes.statusText}` });
    }
    const metaData = await metaRes.json();

    // 2. Fetch absolute latest commit message
    const commitRes = await fetch(`https://api.github.com/repos/${repo}/commits?per_page=1`, { headers });
    let commitMessage = 'Local backup commit synchronized';
    if (commitRes.ok) {
      const commitData = await commitRes.json();
      if (commitData && commitData.length > 0) {
        commitMessage = commitData[0].commit.message;
      }
    }

    res.json({
      stars: metaData.stargazers_count,
      issues: metaData.open_issues_count,
      commit: commitMessage
    });
  } catch (error) {
    console.error('Error proxying request to GitHub REST endpoint:', error);
    res.status(500).json({ error: 'Server proxy failed to resolve GitHub API host' });
  }
});

export default router;
