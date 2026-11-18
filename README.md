# CommitCue

Learn Git visually, track team contributions.

**Live demo:** https://commitcue.vercel.app/

## Problem
Students memorize Git commands without understanding the commit graph behind them, and teachers cannot easily see who contributed what in group projects.

## Features
- **Git Playground:** type `init`, `commit`, `branch`, `checkout` and `merge` and watch the commit graph update live, with a plain-English explanation after each command.
- **Team Tracker:** paste any public GitHub repo link to see each member's commits, lines added/deleted and contribution share, with a fairness flag.
- **Last-minute detector:** choose a deadline and see what share of each member's recent commits were made in the 48 hours before it.
- **Class View:** paste several team repos at once and compare all teams with one verdict each.

## Tech stack
React, Vite, SVG (commit graph), Recharts, GitHub REST API. No backend.

## How to run locally
```bash
git clone https://github.com/yashikakumbha-27/Commitcue.git
cd Commitcue
npm install
npm run dev
```

## How the fairness score works
Each member's share = 50% of their commit share + 50% of their lines-changed share. One person above 50% is flagged as carrying the project, and anyone far below an equal share is flagged as uneven participation.

## Limitations
Commit counts and lines changed do not measure the quality or difficulty of work, and work done outside GitHub is not visible. The last-minute detector looks at each repo's latest 100 commits. GitHub allows about 60 API requests per hour without a token.

## Team
- Yashika Kumbha
- Yashika Agrawal 
