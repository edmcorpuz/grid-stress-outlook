import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/space-grotesk/latin-400.css';
import '@fontsource/space-grotesk/latin-500.css';
import '@fontsource/space-grotesk/latin-600.css';
import './style.css';
import { slides, mainSlides, references, speakers, budgetSeconds, slideIndex, balance } from './content';
import type { SceneController } from './scene';

const $ = <T extends HTMLElement = HTMLElement>(selector: string) => document.querySelector<T>(selector)!;
const escape = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const icon = (name: string) => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${({ arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>', grid: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>', screen: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/>', expand: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>', pause: '<path d="M9 5v14M15 5v14"/>', play: '<path d="m8 5 11 7-11 7z"/>', close: '<path d="m6 6 12 12M6 18 18 6"/>', reset: '<path d="M4 10a8 8 0 1 1 1 7M4 4v6h6"/>' } as Record<string, string>)[name] ?? ''}</svg>`;
const presenter = new URLSearchParams(location.search).has('presenter');
let index = slideIndex(location.hash), lastMain = Math.min(index, mainSlides.length - 1);
let paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
let scene: SceneController | undefined;
let channel: BroadcastChannel | undefined;
try { channel = new BroadcastChannel('grid-stress-defense-v1'); } catch { /* Presentation works without a secondary window. */ }
interface Timer { elapsed: number; started: number | null }
let timer: Timer = { elapsed: 0, started: null };
try { const stored = JSON.parse(localStorage.getItem('grid-defense-timer') || 'null'); if (stored && typeof stored.elapsed === 'number' && (stored.started === null || typeof stored.started === 'number')) timer = stored; } catch { /* Storage may be restricted. */ }
const elapsed = () => Math.max(0, timer.elapsed + (timer.started === null ? 0 : (Date.now() - timer.started) / 1000));
const timeString = (seconds: number) => `${Math.floor(Math.abs(seconds) / 60).toString().padStart(2, '0')}:${Math.floor(Math.abs(seconds) % 60).toString().padStart(2, '0')}`;
const post = (value: unknown) => channel?.postMessage(value);
const timerSave = () => { try { localStorage.setItem('grid-defense-timer', JSON.stringify(timer)); } catch { /* Nonpersistent timer remains usable. */ } };
function toggleTimer() { timer = timer.started === null ? { elapsed: timer.elapsed, started: Date.now() } : { elapsed: elapsed(), started: null }; timerSave(); post({ type: 'timer', timer }); updateTimer(); }
function resetTimer() { timer = { elapsed: 0, started: null }; timerSave(); post({ type: 'timer', timer }); updateTimer(); }

const fallback = `<div class="fallback-art" aria-hidden="true"><div class="fallback-orbit"></div><svg viewBox="0 0 400 500"><g fill="#2b5349" stroke="#b8f7ce" stroke-width="1.4"><path d="m180 35 36 18 10 48-18 29 17 35 45 27-5 15-60-30-26-29-31-17 7-43z"/><path d="m157 168 22 12-4 26-17 12-11-24z"/><path d="m140 233-12 26-36 56-11-5 25-51z"/><path d="m222 223 25 14-4 30-19-4-9-19z"/><path d="m255 235 14 23-5 37-11-2-7-25z"/><path d="m290 210 24 24-7 37-21-8-8-30z"/><path d="m260 307 32-8 40 31-6 35-37 23-29-15-31 14-23-20 18-34z"/></g><g fill="none" stroke="#b8f7ce" opacity=".6"><path d="M185 110Q305 115 260 250Q338 270 290 340"/><circle cx="185" cy="110" r="8"/><circle cx="260" cy="250" r="8"/><circle cx="290" cy="340" r="8"/></g></svg><span>PHILIPPINE GRIDS · SCHEMATIC</span></div>`;

if (presenter) {
  document.body.classList.add('presenter-mode');
  $('#app').innerHTML = `<header class="presenter-top"><a class="brand" href="${import.meta.env.BASE_URL}" target="_blank" rel="noopener">GS<span>GRID STRESS OUTLOOK</span></a><span class="eyebrow">PRIVATE PRESENTER WINDOW</span><button id="timer-toggle" class="timer-control" aria-label="Start or pause 20-minute timer"><span id="timer">20:00</span><span id="timer-state">Start timer</span></button><button id="timer-reset" class="icon-button" aria-label="Reset timer">${icon('reset')}</button></header><main class="presenter-layout"><section><div id="presenter-slide"></div><div class="presenter-controls"><button id="prev" class="button">← Previous</button><button id="next" class="button primary">Next slide →</button></div><p class="muted" id="sync-status">Keep the audience window open on the projector. This window contains the script.</p><div id="speaker-plan"></div></section><section class="script-pane"><div id="presenter-notes"></div><div id="presenter-next"></div></section></main><div id="toast" role="status"></div>`;
} else {
  $('#app').innerHTML = `
  <a href="#slide-title" class="skip-link">Skip to slide</a>
  <header class="topbar">
    <a href="#slide-1" class="brand" aria-label="Grid Stress Outlook, first slide"><span class="brand-symbol">G<span>↗</span></span><span>GRID STRESS<br><b>OUTLOOK</b></span></a>
    <div class="top-context"><span class="tiny-dot"></span> BIG DATA WAREHOUSING & ANALYTICS <span class="divider">/</span> RESEARCH DEFENSE</div>
    <div class="top-actions"><button id="overview" class="icon-button" aria-label="Open slide overview (O)" title="Slide overview (O)">${icon('grid')}</button><button id="presenter" class="icon-button" aria-label="Open private presenter window (P)" title="Private presenter window (P)">${icon('screen')}</button><button id="fullscreen" class="icon-button" aria-label="Toggle fullscreen (F)" title="Fullscreen (F)">${icon('expand')}</button><button id="help" class="help-button" aria-label="Keyboard shortcuts and help">?</button></div>
  </header>
  <main id="presentation">
    <div class="ambient" aria-hidden="true"></div>
    <div class="visual-frame"><div class="visual-heading"><span><span class="tiny-dot"></span> SYSTEM STUDY / PH</span><span id="scene-code">01—GRID</span></div><div id="scene" role="img" aria-label="Stylized 3D Philippine grids. Connections and motion are illustrative, not live grid data.">${fallback}</div><div id="scene-overlay"></div><div class="visual-footer"><span id="scene-caption">Schematic geography · Illustrative connections</span><div><button id="camera-reset" class="icon-button small" aria-label="Reset 3D camera" title="Reset camera">${icon('reset')}</button><button id="motion" class="icon-button small" aria-label="Pause visual motion" aria-pressed="false" title="Pause visual motion">${icon('pause')}</button></div></div></div>
    <article id="slide-content" tabindex="-1"></article>
  </main>
  <footer class="bottom-bar">
    <div class="footer-upper"><div class="slide-position"><span id="slide-number">01</span><span class="muted">/ <span id="slide-total">16</span></span><span id="footer-chapter"></span></div><div class="speaker-tag"><span class="tiny-dot"></span><span id="current-speaker">Soriano</span><span id="speaker-role">Lead presenter</span></div><div class="timer-wrap"><button id="timer-toggle" class="timer-control" aria-label="Start or pause 20-minute timer"><span id="timer">20:00</span><span id="timer-state">Start timer</span></button><button id="timer-reset" class="icon-button small" aria-label="Reset timer" title="Reset 20-minute timer">${icon('reset')}</button></div><nav aria-label="Slide navigation"><button id="prev" class="nav-button" aria-label="Previous slide"><span class="reverse">${icon('arrow')}</span></button><button id="next" class="nav-button next" aria-label="Next slide">${icon('arrow')}</button></nav></div>
    <div id="chapter-progress" aria-label="Presenter sections"></div>
    <div class="footer-lower"><span>PHILIPPINE POWER GRIDS <span class="footer-slash">/</span> A RESEARCH PROPOSAL</span><button id="notes">N <span>Rehearsal notes</span></button><span class="keyboard-hint">← → NAVIGATE <span class="footer-slash">/</span> O OVERVIEW</span></div>
  </footer>
  <dialog id="overview-dialog" aria-labelledby="overview-title"><div class="dialog-heading"><div><span class="eyebrow">THE PRESENTATION</span><h2 id="overview-title">A clear path through the proposal.</h2></div><button class="icon-button" data-close aria-label="Close overview">${icon('close')}</button></div><p class="muted">16 main slides · 5 presenters · 19:30 planned + 0:30 buffer</p><div id="overview-list"></div></dialog>
  <dialog id="notes-dialog" aria-labelledby="notes-title"><div class="dialog-heading"><div><span class="eyebrow">REHEARSAL ONLY · VISIBLE ON THIS SCREEN</span><h2 id="notes-title">Speaker notes</h2></div><button class="icon-button" data-close aria-label="Close speaker notes">${icon('close')}</button></div><div id="notes-content"></div><div class="dialog-controls"><button class="button" id="notes-prev">← Previous</button><button class="button primary" id="notes-next">Next slide →</button></div></dialog>
  <dialog id="help-dialog" aria-labelledby="help-title"><div class="dialog-heading"><h2 id="help-title">Ready for the room.</h2><button class="icon-button" data-close aria-label="Close help">${icon('close')}</button></div><div class="shortcuts"><p><kbd>←</kbd><kbd>→</kbd> Previous / next slide</p><p><kbd>Space</kbd><kbd>Page Down</kbd> Next slide / clicker</p><p><kbd>Home</kbd><kbd>End</kbd> Opening / closing slide</p><p><kbd>O</kbd> Overview & technical appendix</p><p><kbd>P</kbd> Private presenter window</p><p><kbd>N</kbd> Rehearsal notes (visible here)</p><p><kbd>T</kbd> Start / pause 20-minute timer</p><p><kbd>F</kbd> Fullscreen</p><p><kbd>M</kbd> Pause / resume decorative motion</p><p><kbd>Esc</kbd> Close a dialog</p></div><p class="muted">Use extended displays, not mirrored displays, for private notes. Move the presenter window to your own screen. On a single shared screen, use the printed script instead.</p><button id="print" class="button">Print script / save as PDF</button><p class="muted">Tip: load the presentation before the defense. Fonts, map, and code are bundled; slide changes do not request external services. A first page load still needs network access on GitHub Pages.</p></dialog>
  <div id="announcer" class="sr-only" aria-live="polite"></div><div id="toast" role="status"></div><section id="print-handout"></section>`;
}

function scriptHtml(i: number) {
  const s = slides[i];
  return `<div class="script-meta"><span class="pill">${s.speaker}${s.speaker === 'Soriano' ? ' · Leader' : ''}</span><span>${s.appendix ? 'Optional appendix' : `${timeString(s.seconds)} allocated`}</span></div><h3>${escape(s.title)} ${escape(s.accent)}</h3><div class="spoken-script">${s.notes.map(p => `<p>${escape(p)}</p>`).join('')}</div><div class="cue"><b>STAGE CUE</b><p>${escape(s.cue)}</p></div><div class="handoff"><b>TRANSITION / HANDOFF</b><p>${escape(s.bridge)}</p></div>`;
}
function visualHtml() {
  const s = slides[index];
  if (s.visual === 'balance') return `<div class="visual-card balance-card"><div class="card-top"><span>VISAYAS / REPORTED SNAPSHOT</span><span id="balance-badge" class="alert-badge">Red alert</span></div><div class="meter-row"><span>Available</span><b id="available-label">2,468 <small>MW</small></b></div><div class="meter-track"><i id="supply-bar" style="width:77.1%"></i></div><div class="meter-row"><span>Projected peak</span><b>2,545 <small>MW</small></b></div><div class="meter-track demand"><i style="width:79.5%"></i></div><div class="balance-result"><span>Supply − demand</span><strong id="balance-margin">−77 <small>MW</small></strong></div><details id="simulator"><summary>Optional teaching simulator</summary><label for="supply-input">Available capacity <span id="sim-value">2,468 MW</span></label><input id="supply-input" type="range" min="2200" max="3200" value="2468" step="1"><p>Illustrative thresholds: regulating = 4% of demand; contingency = 150 MW. Not an NGCP operational model.</p><button id="sim-reset" class="text-button">Reset reported snapshot</button></details></div>`;
  if (s.visual === 'outlook') return `<div class="visual-card outlook-card"><div class="card-top"><span>GRID STRESS OUTLOOK</span><span class="pill">CONCEPT ONLY</span></div><div class="outlook-title"><span>Visayas</span><span>↗</span></div><div class="outlook-status">Assessment pending validation</div><dl><div><dt>Issue time</dt><dd>Recorded for each warning</dd></div><div><dt>Horizon</dt><dd>To be evaluated</dd></div><div><dt>Evidence</dt><dd>Supply · Demand · Weather</dd></div><div><dt>Freshness</dt><dd>Shown separately per source</dd></div></dl><p>No live data · No probability calculated</p></div>`;
  if (s.visual === 'validation') return `<div class="visual-card metric-strip"><div><strong>80%</strong><span>Event recall target</span></div><div><strong>&lt;20%</strong><span>False-warning share target</span></div><div><strong>3 days</strong><span>Lead time to investigate</span></div><p>Proposed targets—not achieved performance.</p></div>`;
  if (s.scene === 'lake') return `<div class="layer-key"><span><i></i> RAW <small>Preserve</small></span><span><i></i> CLEAN <small>Validate</small></span><span><i></i> CURATED <small>Analyze</small></span></div>`;
  if (s.scene === 'clusters') return `<div class="cluster-key"><span>● Calm</span><span>● Demand</span><span>● Supply loss</span><span>● Combined</span><small>Possible profiles · synthetic points</small></div>`;
  if (s.id === 'opening') return `<div class="hero-annotation"><span class="annotation-line"></span><span>THREE GRIDS.<br><b>ONE CONNECTED VIEW.</b></span></div>`;
  return '';
}
function render() {
  const s = slides[index];
  if (!s.appendix) lastMain = index;
  document.title = `${index + 1}. ${s.title} ${s.accent} — Grid Stress Outlook`;
  if (presenter) {
    $('#presenter-slide').innerHTML = `<span class="eyebrow">${escape(s.chapter)} · ${index + 1}/${slides.length}</span><h1>${escape(s.title)}<span>${escape(s.accent)}</span></h1><p>${escape(s.summary)}</p><span class="pill">${escape(s.label)}</span>`;
    $('#presenter-notes').innerHTML = scriptHtml(index);
    $('#presenter-next').innerHTML = `<span class="eyebrow">UP NEXT</span><p>${index < mainSlides.length - 1 ? `${escape(slides[index + 1].title)} ${escape(slides[index + 1].accent)} · ${slides[index + 1].speaker}` : 'End of main deck · Q&A / optional appendix'}</p>`;
    $('#speaker-plan').innerHTML = speakers.map(name => { const total = mainSlides.filter(x => x.speaker === name).reduce((n, x) => n + x.seconds, 0); return `<div class="${s.speaker === name ? 'active' : ''}"><span>${name}</span><span>${timeString(total)}</span></div>`; }).join('') + '<p class="muted">0:30 shared buffer · 20:00 total</p>';
  } else {
    const citations = (s.sources || []).map(id => { const r = references.find(x => x.id === id)!; return `<a href="${r.url}" target="_blank" rel="noopener noreferrer" title="${escape(r.title)}">[${id}] ${escape(r.publisher.split(' / ')[0])} ↗</a>`; }).join('');
    $('#slide-content').className = `slide ${s.id === 'opening' ? 'opening' : ''} ${s.stat ? 'has-stat' : ''}`;
    $('#slide-content').innerHTML = `<div class="eyebrow chapter-label"><span class="chapter-line"></span>${escape(s.chapter)}</div><h1 id="slide-title">${escape(s.title)}<span>${escape(s.accent)}</span></h1><p class="slide-summary">${escape(s.summary)}</p>${s.stat ? `<div class="big-stat"><strong>${s.stat.value}</strong><div><span>${s.stat.unit}</span><small>${escape(s.stat.detail)}</small></div></div>` : ''}${s.points ? `<div class="key-points">${s.points.map((p, i) => `<div class="key-point"><span class="point-index">${String(i + 1).padStart(2, '0')}</span><div><h2>${escape(p.title)}</h2><p>${escape(p.text)}</p></div></div>`).join('')}</div>` : ''}${s.id === 'opening' ? `<div class="opening-actions"><button id="begin" class="button primary">Begin the proposal ${icon('arrow')}</button><span>20 MINUTES <i>·</i> 5 VOICES</span></div><div class="team-line">SORIANO <span>LEADER</span> / CORPUZ / BARSOMO / NURIL / MARIANO</div>` : ''}<div class="slide-footnote"><span class="evidence-label">${escape(s.label)}</span>${citations ? `<div class="citations">${citations}</div>` : ''}${s.appendix ? '<button class="text-button" id="back-main">← Return to main presentation</button>' : ''}${s.id === 'closing' ? '<button class="text-button" id="appendix-open">Explore the technical appendix ↗</button>' : ''}</div>`;
    $('#scene-overlay').innerHTML = visualHtml();
    $('#scene-code').textContent = ({ grid: '01—GRID', lake: '02—LAKEHOUSE', signals: '03—SIGNALS', clusters: '04—PROFILES' })[s.scene];
    $('#scene-caption').textContent = ({ grid: 'Schematic geography · Illustrative connections', lake: 'Proposed layers · Illustrative records', signals: 'Synthetic visualization · No fitted results', clusters: 'Synthetic groups · Not a trained model' })[s.scene];
    $('#scene').setAttribute('aria-label', ({ grid: 'Stylized three-dimensional Philippine grids; connections are schematic, not live data.', lake: 'Three floating layers illustrate raw, clean, and curated data.', signals: 'Synthetic points and curves illustrate overlapping signals, not measured relationships.', clusters: 'Four synthetic groups illustrate clustering; these are not discovered grid-day clusters.' })[s.scene]);
    $('#slide-number').textContent = s.appendix ? `A${index - mainSlides.length + 1}` : String(index + 1).padStart(2, '0');
    $('#slide-total').textContent = String(s.appendix ? slides.length - mainSlides.length : mainSlides.length).padStart(2, '0');
    $('#footer-chapter').textContent = s.chapter.split('/')[1].trim();
    $('#current-speaker').textContent = s.speaker;
    $('#speaker-role').textContent = s.speaker === 'Soriano' ? 'Lead presenter' : 'Presenter';
    $('#chapter-progress').innerHTML = speakers.map((name, i) => `<button data-chapter="${mainSlides.findIndex(x => x.speaker === name)}" aria-label="Go to ${name}'s section" class="${name === s.speaker ? 'active' : speakers.indexOf(s.speaker) > i ? 'done' : ''}"><span>${String(i + 1).padStart(2, '0')}</span>${name}</button>`).join('');
    $('#overview-list').innerHTML = `<h3>Main presentation</h3><div class="overview-grid">${slides.map((x, i) => `${i === mainSlides.length ? '</div><h3>Technical appendix · Q&A only</h3><div class="overview-grid">' : ''}<button data-slide="${i}" class="overview-item ${index === i ? 'selected' : ''}" ${index === i ? 'aria-current="true"' : ''}><span>${x.appendix ? 'A' + (i - mainSlides.length + 1) : String(i + 1).padStart(2, '0')}</span><div><b>${escape(x.title)} ${escape(x.accent)}</b><small>${x.speaker}${x.appendix ? ' · optional' : ` · ${timeString(x.seconds)}`}</small></div></button>`).join('')}</div>`;
    $('#notes-content').innerHTML = scriptHtml(index);
    $('#announcer').textContent = `Slide ${index + 1}. ${s.title} ${s.accent} Presenter: ${s.speaker}.`;
    scene?.setMode(s.scene);
    $('#begin')?.addEventListener('click', () => { if (timer.started === null) toggleTimer(); go(1); });
    $('#appendix-open')?.addEventListener('click', () => openDialog('overview-dialog'));
    $('#back-main')?.addEventListener('click', () => go(lastMain));
    const input = $<HTMLInputElement>('#supply-input');
    const updateBalance = () => {
      const capacity = Number(input.value), result = balance(capacity);
      $('#available-label').innerHTML = `${capacity.toLocaleString('en-US')} <small>MW</small>`;
      $('#supply-bar').style.width = `${capacity / 3200 * 100}%`;
      $('#balance-badge').textContent = result.state;
      $('#balance-badge').dataset.state = result.state;
      $('#balance-margin').innerHTML = `${result.margin < 0 ? '−' : '+'}${Math.abs(result.margin).toLocaleString('en-US')} <small>MW</small>`;
      $('#sim-value').textContent = `${capacity.toLocaleString('en-US')} MW`;
      $('.balance-card .card-top > span').textContent = capacity === 2468 ? 'VISAYAS / REPORTED SNAPSHOT' : 'ILLUSTRATIVE WHAT-IF / NOT OBSERVED';
    };
    input?.addEventListener('input', updateBalance);
    $('#sim-reset')?.addEventListener('click', () => { input.value = '2468'; updateBalance(); });
    document.querySelectorAll<HTMLButtonElement>('[data-slide]').forEach(b => b.addEventListener('click', () => { closeDialogs(); go(Number(b.dataset.slide)); }));
    document.querySelectorAll<HTMLButtonElement>('[data-chapter]').forEach(b => b.addEventListener('click', () => go(Number(b.dataset.chapter))));
    $<HTMLButtonElement>('#notes-prev').disabled = index === 0;
    $<HTMLButtonElement>('#notes-next').disabled = index === mainSlides.length - 1 || index === slides.length - 1;
  }
  $<HTMLButtonElement>('#prev').disabled = index === 0;
  $<HTMLButtonElement>('#next').disabled = index === mainSlides.length - 1 || index === slides.length - 1;
  updateTimer();
}
function go(next: number, broadcast = true) {
  index = Math.max(0, Math.min(slides.length - 1, next));
  history.replaceState(null, '', `#slide-${index + 1}`);
  render();
  if (!presenter) window.scrollTo({ top: 0, behavior: 'instant' });
  if (broadcast) post({ type: 'slide', index });
}
function nextSlide() { if (index !== mainSlides.length - 1) go(index + 1); }
function updateTimer() {
  const left = budgetSeconds - elapsed();
  $('#timer').textContent = `${left < 0 ? '+' : ''}${timeString(left)}`;
  $('#timer').classList.toggle('over-time', left < 0);
  $('#timer-state').textContent = timer.started === null ? timer.elapsed > 0 ? 'Resume' : 'Start timer' : 'Pause';
  $('#timer-toggle').setAttribute('aria-label', `${timer.started === null ? 'Start or resume' : 'Pause'} timer, ${timeString(left)} ${left < 0 ? 'over time' : 'remaining'}`);
}
function openDialog(id: string) { closeDialogs(); $<HTMLDialogElement>(`#${id}`).showModal(); }
function closeDialogs() { document.querySelectorAll<HTMLDialogElement>('dialog[open]').forEach(d => d.close()); }
function toast(message: string) { $('#toast').textContent = message; $('#toast').classList.add('visible'); window.setTimeout(() => $('#toast').classList.remove('visible'), 4500); }
function openPresenter() {
  const url = new URL(location.href); url.searchParams.set('presenter', '1');
  const popup = window.open(url.href, 'grid-presenter', 'popup,width=1180,height=850');
  toast(popup ? 'Presenter window opened. Move it to your private screen, not the projector.' : 'Popup blocked. Allow popups for this page, then press P again.');
}
function motionToggle() {
  paused = !paused; scene?.setPaused(paused);
  $('#motion').innerHTML = icon(paused ? 'play' : 'pause');
  $('#motion').setAttribute('aria-pressed', String(paused));
  $('#motion').setAttribute('aria-label', paused ? 'Resume visual motion' : 'Pause visual motion');
  $('#motion').title = paused ? 'Resume visual motion' : 'Pause visual motion';
  document.body.classList.toggle('motion-paused', paused);
}
async function fullscreen() { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { toast('Fullscreen is unavailable here. Use your browser’s fullscreen option.'); } }
$('#prev').addEventListener('click', () => go(index - 1));
$('#next').addEventListener('click', nextSlide);
$('#timer-toggle').addEventListener('click', toggleTimer);
$('#timer-reset').addEventListener('click', () => { if (elapsed() < 1 || confirm('Reset the shared 20-minute timer?')) resetTimer(); });
window.addEventListener('hashchange', () => go(slideIndex(location.hash)));
window.addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented) return;
  const target = e.target as HTMLElement;
  if (target.closest('input, textarea, select, [contenteditable="true"]')) return;
  if (document.querySelector('dialog[open]')) return;
  if ((e.key === ' ' || e.key === 'Enter') && target.closest('button, a, summary')) return;
  if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); nextSlide(); }
  else if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); go(index - 1); }
  else if (e.key === 'Home') { e.preventDefault(); go(0); }
  else if (e.key === 'End') { e.preventDefault(); go(mainSlides.length - 1); }
  else if (e.key.toLowerCase() === 't') toggleTimer();
  else if (!presenter) {
    switch (e.key.toLowerCase()) {
      case 'o': openDialog('overview-dialog'); break;
      case 'n': openDialog('notes-dialog'); break;
      case 'p': openPresenter(); break;
      case 'f': void fullscreen(); break;
      case 'm': motionToggle(); break;
      case '?': openDialog('help-dialog'); break;
    }
  }
});
if (channel) channel.onmessage = e => {
  const data = e.data;
  if (data?.type === 'slide' && Number.isInteger(data.index) && data.index >= 0 && data.index < slides.length) { go(data.index, false); if (presenter) $('#sync-status').textContent = 'Connected · Slide changes sync with the audience window.'; }
  if (data?.type === 'timer' && data.timer && Number.isFinite(data.timer.elapsed) && (data.timer.started === null || Number.isFinite(data.timer.started))) { timer = data.timer; timerSave(); updateTimer(); }
  if (data?.type === 'hello' && !presenter) { post({ type: 'slide', index }); post({ type: 'timer', timer }); }
};
if (!presenter) {
  $('#overview').addEventListener('click', () => openDialog('overview-dialog'));
  $('#notes').addEventListener('click', () => openDialog('notes-dialog'));
  $('#help').addEventListener('click', () => openDialog('help-dialog'));
  $('#presenter').addEventListener('click', openPresenter);
  $('#fullscreen').addEventListener('click', () => void fullscreen());
  $('#motion').addEventListener('click', motionToggle);
  $('#camera-reset').addEventListener('click', () => scene?.reset());
  $('#notes-prev').addEventListener('click', () => go(index - 1));
  $('#notes-next').addEventListener('click', nextSlide);
  $('#print').addEventListener('click', () => { closeDialogs(); window.print(); });
  document.querySelectorAll<HTMLElement>('[data-close]').forEach(b => b.addEventListener('click', () => b.closest('dialog')?.close()));
  document.querySelectorAll<HTMLDialogElement>('dialog').forEach(d => d.addEventListener('click', e => { if (e.target === d) { const r = d.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close(); } }));
  $('#print-handout').innerHTML = `<h1>Grid Stress Outlook</h1><p>20-minute defense · Soriano, Corpuz, Barsomo, Nuril, Mariano</p><p>19:30 planned speaking time + 0:30 shared buffer. Main slides: 1–16. Appendix: 17–21.</p>${slides.map((s, i) => `<article class="print-slide"><h2>${s.appendix ? 'Appendix' : 'Slide'} ${i + 1}</h2>${scriptHtml(i)}${s.sources ? `<p>Sources: ${s.sources.map(n => `[${n}]`).join(', ')}</p>` : ''}</article>`).join('')}<article class="print-slide"><h2>References</h2>${references.map(r => `<p>[${r.id}] ${escape(r.publisher)}. ${escape(r.title)}. ${r.date}.<br>${r.url}<br>${escape(r.status)}</p>`).join('')}</article>`;
  if (paused) { paused = false; motionToggle(); }
  if (!new URLSearchParams(location.search).has('static')) {
    import('./scene').then(m => m.createScene($('#scene'))).then(controller => { scene = controller; scene.setMode(slides[index].scene); scene.setPaused(paused); }).catch(error => { console.warn('3D unavailable; static illustration remains.', error instanceof Error ? error.message : error); $('#scene-caption').textContent = 'Static illustration · 3D unavailable on this device'; });
  } else $('#scene-caption').textContent = 'Static mode · Schematic illustration';
}
render();
if (presenter) post({ type: 'hello' });
const clockInterval = window.setInterval(updateTimer, 250);
window.addEventListener('pagehide', () => { clearInterval(clockInterval); scene?.dispose(); channel?.close(); });
