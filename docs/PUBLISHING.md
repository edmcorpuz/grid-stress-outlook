# Publish using GitHub only

- **Presentation:** https://edmcorpuz.github.io/grid-stress-outlook/
- **Public source:** https://github.com/edmcorpuz/grid-stress-outlook

GitHub Pages is GitHub's built-in static hosting. No third-party platform, custom server, or classroom installation is needed. Source lives on `main`; the generated presentation lives on `gh-pages`.

## Update the presentation

From this project directory, after editing `src/content.ts`:

```bash
bun run docs
bun run test
bun run test:e2e
git add .
git commit -m "Update defense content"
git push origin main
bun run publish:pages
```

The publish command builds the static site, uses a temporary local checkout, and pushes only generated assets to `gh-pages`. It preserves the branch history and does not force-push. A concurrent conflicting publish fails safely. GitHub then updates the site; wait for the Pages build to finish before refreshing in the classroom.

The committed PDF is a printable snapshot. After script edits, the browser test regenerates `test-results/presentation-script.pdf`; copy it to `docs/presentation-script.pdf` if you want the repository PDF to match. You can also use **? → Print script / save as PDF** in the app.

## One-time setup for a new copy

```bash
mise install
mise exec -- gh auth login --web --git-protocol https
```

Complete the browser login yourself. Never put a token into source files or chat.

Initialize and commit a Git repository if one does not exist, then create your public remote once:

```bash
mise exec -- gh repo create grid-stress-outlook --public --source=. --remote=origin --push
bun run publish:pages
```

On GitHub, open **Settings → Pages → Deploy from a branch → gh-pages → / (root)**. The published link is `https://YOUR-USERNAME.github.io/grid-stress-outlook/`. Update the links in README when forking to another account.

No custom GitHub Actions workflow is required. Optional CI/deploy workflow examples are provided in `docs/workflow-examples/`, not activated. Copying them to `.github/workflows/` requires appropriate GitHub token permissions. If using the example deployment workflow, switch Pages source to GitHub Actions instead of the branch.

## Before the defense

- Open the actual live URL on the classroom PC, not the repository source page.
- Check slides 1, 3, 8, 13, and 16; test arrows, fullscreen, and projector readability.
- Confirm the timer is reset to **20:00**. Press **T** when Soriano starts speaking.
- If the PC is slow, append `?static=1` or pause motion with **M**.
- Use extended displays for private notes. Never mirror the notes window to the projector.
- Download/print the combined script. Initial site loading requires internet; offline refresh is not guaranteed.
- Leave the main deck on slide 16 for Q&A. Use **O** for the appendix.

The repository is intentionally public, including the original files and the five presenter names. No API credentials, personal customer records, or application backend are included.
