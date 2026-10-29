/** Publish only generated static assets to gh-pages; no third-party platform or workflow token scope. */
import { mkdtempSync, cpSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
function run(args: string[], cwd = root, quiet = false) {
  const r = Bun.spawnSync(args, { cwd, stdout: 'pipe', stderr: 'pipe' });
  const out = new TextDecoder().decode(r.stdout), err = new TextDecoder().decode(r.stderr);
  if (r.exitCode !== 0) throw new Error(`${args[0]} ${args[1]} failed (${r.exitCode}): ${err || out}`);
  if (!quiet && (out || err)) console.log((out + err).trim());
  return out.trim();
}
run(['bun', 'run', 'build']);
const remote = run(['git', 'remote', 'get-url', 'origin'], root, true);
if (!/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+(?:\.git)?$/.test(remote) && !/^git@github\.com:[\w.-]+\/[\w.-]+(?:\.git)?$/.test(remote)) throw new Error('Expected a normal GitHub origin URL. Configure origin before publishing.');
const name = run(['git', 'config', 'user.name'], root, true);
const email = run(['git', 'config', 'user.email'], root, true);
const existing = run(['git', 'ls-remote', '--heads', 'origin', 'gh-pages'], root, true);
const directory = mkdtempSync(join(tmpdir(), 'grid-pages-'));
try {
  run(['git', 'init', '-b', 'gh-pages'], directory, true);
  run(['git', 'config', 'user.name', name], directory, true);
  run(['git', 'config', 'user.email', email], directory, true);
  run(['git', 'remote', 'add', 'origin', remote], directory, true);
  if (existing) {
    run(['git', 'fetch', '--depth=1', 'origin', 'gh-pages'], directory);
    run(['git', 'checkout', '-B', 'gh-pages', 'FETCH_HEAD'], directory, true);
    run(['git', 'rm', '-r', '--ignore-unmatch', '.'], directory, true);
  }
  cpSync(join(root, 'dist'), directory, { recursive: true });
  writeFileSync(join(directory, '.nojekyll'), '');
  run(['git', 'add', '-A'], directory, true);
  const diff = Bun.spawnSync(['git', 'diff', '--cached', '--quiet'], { cwd: directory });
  if (diff.exitCode === 0) console.log('Published assets are already up to date.');
  else {
    run(['git', 'commit', '-m', 'Publish Grid Stress Outlook static presentation'], directory);
    run(['git', 'push', 'origin', 'HEAD:gh-pages'], directory);
  }
  console.log('Static branch ready. GitHub repository Settings → Pages → Deploy from branch: gh-pages, / (root).');
} finally { rmSync(directory, { recursive: true, force: true }); }
