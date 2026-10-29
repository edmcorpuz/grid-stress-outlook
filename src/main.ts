import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/space-grotesk/latin-400.css';
import '@fontsource/space-grotesk/latin-500.css';
import '@fontsource/space-grotesk/latin-600.css';
import './style.css';
import { slides, mainSlides, references, speakers, budgetSeconds, slideIndex, balance, parts, partLabel, researchTitle, evidenceMeaning, type Slide } from './content';
import type { SceneController } from './scene';

const $ = <T extends HTMLElement = HTMLElement>(selector: string) => document.querySelector<T>(selector)!;
const escape = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const icon = (name: string) => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${({ arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>', grid: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>', screen: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/>', notes: '<path d="M6 4h9l3 3v13H6z"/><path d="M9 11h6M9 15h6"/>', expand: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>', pause: '<path d="M9 5v14M15 5v14"/>', play: '<path d="m8 5 11 7-11 7z"/>', close: '<path d="m6 6 12 12M6 18 18 6"/>', reset: '<path d="M4 10a8 8 0 1 1 1 7M4 4v6h6"/>' } as Record<string, string>)[name] ?? ''}</svg>`;
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
const slideNumber = (i: number) => slides[i].appendix ? `A${i - mainSlides.length + 1}` : String(i + 1).padStart(2, '0');
/** "NGCP · grid alerts" and "Question — answer" render as a bold lead plus plain text. */
const point = (text: string) => { const [lead, rest] = text.split(/ · | — /); return rest ? `<b>${escape(lead)}</b><span>${escape(text.slice(lead.length + 3))}</span>` : `<span>${escape(text)}</span>`; };

const fallback = `<div class="fallback-art" aria-hidden="true"><div class="fallback-orbit"></div><svg viewBox="0 0 400 500"><g fill="#2b5349" stroke="#b8f7ce" stroke-width="1.4"><path d="m180 35 36 18 10 48-18 29 17 35 45 27-5 15-60-30-26-29-31-17 7-43z"/><path d="m157 168 22 12-4 26-17 12-11-24z"/><path d="m140 233-12 26-36 56-11-5 25-51z"/><path d="m222 223 25 14-4 30-19-4-9-19z"/><path d="m255 235 14 23-5 37-11-2-7-25z"/><path d="m290 210 24 24-7 37-21-8-8-30z"/><path d="m260 307 32-8 40 31-6 35-37 23-29-15-31 14-23-20 18-34z"/></g><g fill="none" stroke="#b8f7ce" opacity=".6"><path d="M185 110Q305 115 260 250Q338 270 290 340"/><circle cx="185" cy="110" r="8"/><circle cx="260" cy="250" r="8"/><circle cx="290" cy="340" r="8"/></g></svg><span>PHILIPPINE GRIDS · SCHEMATIC</span></div>`;

if (presenter) {
  document.body.classList.add('presenter-mode');
  $('#app').innerHTML = `<header class="presenter-top"><span class="brand">Grid Stress Outlook <b>Presenter</b></span><span class="eyebrow">PRIVATE · KEEP OFF THE PROJECTOR</span><button id="timer-toggle" class="timer-control" aria-label="Start or pause 20-minute timer"><span id="timer">20:00</span><span id="timer-state">Start timer</span></button><button id="timer-reset" class="icon-button" aria-label="Reset timer">${icon('reset')}</button></header><main class="presenter-layout"><section><div id="presenter-slide"></div><div class="presenter-controls"><button id="prev" class="button">← Previous</button><button id="next" class="button primary">Next slide →</button></div><p class="muted" id="sync-status">Keep the audience window open on the projector. This window contains the script.</p><div id="speaker-plan"></div></section><section class="script-pane"><div id="presenter-notes"></div><div id="presenter-next"></div></section></main><div id="toast" role="status"></div>`;
} else {
  $('#app').innerHTML = `
  <a href="#slide-title" class="skip-link">Skip to slide</a>
  <div id="scene" role="img" aria-label="Illustrative 3D scenes of the Philippine grids and the proposed data framework. Not live grid data.">${fallback}</div>
  <div class="scrim" aria-hidden="true"></div>
  <main id="presentation"><article id="slide-content" class="slide" tabindex="-1"></article></main>
  <header class="chrome topbar">
    <span class="brand"><span class="brand-mark" aria-hidden="true"></span>Grid Stress Outlook <b>Group 3</b></span>
    <div class="top-actions"><button id="overview" class="icon-button" aria-label="Open slide overview (O)" title="Overview (O)">${icon('grid')}</button><button id="notes" class="icon-button" aria-label="Open rehearsal notes (N)" title="Rehearsal notes (N)">${icon('notes')}</button><button id="presenter" class="icon-button" aria-label="Open private presenter window (P)" title="Presenter window (P)">${icon('screen')}</button><button id="motion" class="icon-button" aria-label="Pause motion (M)" aria-pressed="false" title="Pause motion (M)">${icon('pause')}</button><button id="fullscreen" class="icon-button" aria-label="Toggle fullscreen (F)" title="Fullscreen (F)">${icon('expand')}</button><button id="help" class="help-button" aria-label="Keyboard shortcuts and help">?</button></div>
  </header>
  <footer class="chrome bottom-bar">
    <div class="slide-position"><span id="slide-number">01</span><span class="muted">/ <span id="slide-total">17</span></span></div>
    <div class="speaker-tag"><span class="tiny-dot"></span><span id="current-speaker">Soriano</span><span id="speaker-role">Leader</span></div>
    <div class="timer-wrap"><button id="timer-toggle" class="timer-control" aria-label="Start or pause 20-minute timer"><span id="timer">20:00</span><span id="timer-state">Start timer</span></button><button id="timer-reset" class="icon-button small" aria-label="Reset timer" title="Reset 20-minute timer">${icon('reset')}</button></div>
    <nav aria-label="Slide navigation"><button id="prev" class="nav-button" aria-label="Previous slide"><span class="reverse">${icon('arrow')}</span></button><button id="next" class="nav-button next" aria-label="Next slide">${icon('arrow')}</button></nav>
  </footer>
  <div id="progress" aria-hidden="true"><i></i></div>
  <dialog id="overview-dialog" aria-labelledby="overview-title"><div class="dialog-heading"><div><span class="eyebrow">FOLLOWS THE NINE-PART FORMAT</span><h2 id="overview-title">The presentation, part by part.</h2></div><button class="icon-button" data-close aria-label="Close overview">${icon('close')}</button></div><p class="muted">17 main slides · 5 presenters · 19:30 planned + 0:30 buffer</p><div id="overview-list"></div></dialog>
  <dialog id="notes-dialog" aria-labelledby="notes-title"><div class="dialog-heading"><div><span class="eyebrow">REHEARSAL ONLY · VISIBLE ON THIS SCREEN</span><h2 id="notes-title">Speaker notes</h2></div><button class="icon-button" data-close aria-label="Close speaker notes">${icon('close')}</button></div><div id="notes-content"></div><div class="dialog-controls"><button class="button" id="notes-prev">← Previous</button><button class="button primary" id="notes-next">Next slide →</button></div></dialog>
  <dialog id="help-dialog" aria-labelledby="help-title"><div class="dialog-heading"><h2 id="help-title">Ready for the room.</h2><button class="icon-button" data-close aria-label="Close help">${icon('close')}</button></div><div class="shortcuts"><p><kbd>←</kbd><kbd>→</kbd> Previous / next slide</p><p><kbd>Space</kbd><kbd>Page Down</kbd> Next slide / clicker</p><p><kbd>Home</kbd><kbd>End</kbd> Opening / closing slide</p><p><kbd>O</kbd> Overview & appendix</p><p><kbd>P</kbd> Private presenter window</p><p><kbd>N</kbd> Rehearsal notes (visible here)</p><p><kbd>T</kbd> Start / pause 20-minute timer</p><p><kbd>F</kbd> Fullscreen</p><p><kbd>M</kbd> Pause / resume motion</p><p><kbd>Esc</kbd> Close a dialog</p></div><p class="muted">Controls hide while the mouse is still; move it to show them. For private notes use extended displays, not mirrored: put this deck on the projector and the presenter window on your own screen. On one shared screen, use the printed script.</p><button id="print" class="button">Print script / save as PDF</button><p class="muted">Open the page once before the defense so it is cached. Add <b>?static=1</b> to skip 3D, or <b>?quality=low</b> for a lighter 3D on older PCs.</p></dialog>
  <div id="announcer" class="sr-only" aria-live="polite"></div><div id="toast" role="status"></div><section id="print-handout"></section>`;
}

function scriptHtml(i: number) {
  const s = slides[i];
  return `<div class="script-meta"><span class="pill">${s.speaker}${s.speaker === 'Soriano' ? ' · Leader' : ''}</span><span>${escape(partLabel(s))}</span><span>${s.appendix ? 'Optional appendix' : `${timeString(s.seconds)} allocated`}</span></div><h3>${escape(s.title)} ${escape(s.accent)}</h3><div class="spoken-script">${s.notes.map(p => `<p>${escape(p)}</p>`).join('')}</div><div class="cue"><b>STAGE CUE</b><p>${escape(s.cue)}</p></div><div class="handoff"><b>TRANSITION / HANDOFF</b><p>${escape(s.bridge)}</p></div>`;
}
function slideHtml(s: Slide) {
  let n = 0;
  const step = () => `style="--i:${n++}"`;
  const citations = (s.sources || []).map(id => { const r = references.find(x => x.id === id)!; return `<a href="${r.url}" target="_blank" rel="noopener noreferrer" title="${escape(r.title)}">[${id}] ${escape(r.publisher.split(' / ')[0])} ↗</a>`; }).join('');
  const opening = s.id === 'opening';
  const heading = `<div class="part-label reveal" ${step()}>${opening ? 'Group 3 · Big Data Warehousing and Analytics' : s.appendix ? escape(s.appendix) : `<span>Part ${s.part} of 9</span>${escape(parts[s.part - 1])}`}</div><h1 id="slide-title"><span class="line"><span ${step()}>${escape(s.title)}</span></span><span class="line accent"><span ${step()}>${escape(s.accent)}</span></span></h1>`;
  const body = opening
    ? `<p class="research-title reveal" ${step()}>${escape(researchTitle)}</p><p class="team-line reveal" ${step()}>${speakers.map(name => `${name}${name === 'Soriano' ? ' <i>leader</i>' : ''}`).join(' · ')}</p><div class="opening-actions reveal" ${step()}><button id="begin" class="button primary">Begin ${icon('arrow')}</button><span>20 minutes · 9 parts · 5 voices</span></div>`
    : `${s.stat ? `<div class="big-stat reveal" ${step()}><strong>${escape(s.stat.value)}</strong><span>${escape(s.stat.unit)}</span></div>` : ''}${s.points ? `<ul class="points">${s.points.map(p => `<li class="reveal" ${step()}>${point(p)}</li>`).join('')}</ul>` : ''}${s.id === 'margin' ? `<details id="simulator" class="what-if reveal" ${step()}><summary>What if more supply came online?</summary><label for="supply-input">Available supply <b id="sim-value">2,468 MW</b></label><input id="supply-input" type="range" min="2200" max="3200" value="2468" step="1"><div class="what-if-result"><span id="balance-badge" class="alert-badge" data-state="Red alert">Red alert</span><span id="balance-margin">−77 MW</span><span id="what-if-label">Reported snapshot</span></div><button id="sim-reset" class="text-button">Reset to reported</button><p class="fine">Teaching model: regulating 4% of demand, contingency 150 MW. Not NGCP’s calculation.</p></details>` : ''}`;
  const meta = `<div class="slide-meta reveal" ${step()}><span class="evidence" data-kind="${s.evidence}" title="${escape(evidenceMeaning[s.evidence])}">${s.evidence}</span>${citations}${s.appendix ? '<button class="text-button" id="back-main">← Return to main presentation</button>' : ''}${s.id === 'closing' ? '<button class="text-button" id="appendix-open">Appendix for questions ↗</button>' : ''}</div>`;
  return heading + body + meta;
}
function render() {
  const s = slides[index];
  if (!s.appendix) lastMain = index;
  document.title = `${index + 1}. ${s.title} ${s.accent} — Grid Stress Outlook`;
  if (presenter) {
    $('#presenter-slide').innerHTML = `<span class="eyebrow">${escape(partLabel(s))} · ${slideNumber(index)}</span><h1>${escape(s.title)}<span>${escape(s.accent)}</span></h1>${s.stat ? `<p><b>${escape(s.stat.value)}</b> ${escape(s.stat.unit)}</p>` : ''}${s.points ? `<ul>${s.points.map(p => `<li>${escape(p)}</li>`).join('')}</ul>` : ''}<span class="pill">${s.evidence}</span>`;
    $('#presenter-notes').innerHTML = scriptHtml(index);
    $('#presenter-next').innerHTML = `<span class="eyebrow">UP NEXT</span><p>${index < mainSlides.length - 1 ? `${escape(slides[index + 1].title)} ${escape(slides[index + 1].accent)} · ${slides[index + 1].speaker}` : 'End of main deck · Q&A / optional appendix'}</p>`;
    $('#speaker-plan').innerHTML = speakers.map(name => { const total = mainSlides.filter(x => x.speaker === name).reduce((n, x) => n + x.seconds, 0); return `<div class="${s.speaker === name ? 'active' : ''}"><span>${name}</span><span>${timeString(total)}</span></div>`; }).join('') + '<p class="muted">0:30 shared buffer · 20:00 total</p>';
  } else {
    const content = $('#slide-content');
    content.className = `slide ${s.id === 'opening' ? 'opening' : ''} ${s.appendix ? 'appendix' : ''}`;
    content.innerHTML = slideHtml(s);
    void content.offsetWidth; content.classList.add('enter');
    $('#slide-number').textContent = slideNumber(index);
    $('#slide-total').textContent = String(s.appendix ? slides.length - mainSlides.length : mainSlides.length).padStart(2, '0');
    $('#current-speaker').textContent = s.speaker;
    $('#speaker-role').textContent = s.speaker === 'Soriano' ? 'Leader' : '';
    $<HTMLElement>('#progress i').style.transform = `scaleX(${s.appendix ? 1 : (index + 1) / mainSlides.length})`;
    $('#overview-list').innerHTML = parts.map((name, p) => `<section class="overview-part"><h3><span>Part ${p + 1}</span>${escape(name)}</h3><div class="overview-grid">${slides.map((x, i) => x.appendix || x.part !== p + 1 ? '' : overviewItem(x, i)).join('')}</div></section>`).join('') + `<section class="overview-part"><h3><span>Appendix</span>Q&A only</h3><div class="overview-grid">${slides.map((x, i) => x.appendix ? overviewItem(x, i) : '').join('')}</div></section>`;
    $('#notes-content').innerHTML = scriptHtml(index);
    $('#announcer').textContent = `Slide ${index + 1}. ${partLabel(s)}. ${s.title} ${s.accent} Presenter: ${s.speaker}.`;
    scene?.setShot(s.shot);
    if (s.id !== 'margin') scene?.setSupply(2468);
    $('#begin')?.addEventListener('click', () => { if (timer.started === null) toggleTimer(); go(1); });
    $('#appendix-open')?.addEventListener('click', () => openDialog('overview-dialog'));
    $('#back-main')?.addEventListener('click', () => go(lastMain));
    const input = $<HTMLInputElement>('#supply-input');
    const updateBalance = () => {
      const capacity = Number(input.value), result = balance(capacity);
      $('#sim-value').textContent = `${capacity.toLocaleString('en-US')} MW`;
      $('#balance-badge').textContent = result.state;
      $('#balance-badge').dataset.state = result.state;
      $('#balance-margin').textContent = `${result.margin < 0 ? '−' : '+'}${Math.abs(result.margin).toLocaleString('en-US')} MW vs demand`;
      $('#what-if-label').textContent = capacity === 2468 ? 'Reported snapshot' : 'What-if · not observed';
      scene?.setSupply(capacity);
    };
    input?.addEventListener('input', updateBalance);
    $('#sim-reset')?.addEventListener('click', () => { input.value = '2468'; updateBalance(); });
    document.querySelectorAll<HTMLButtonElement>('[data-slide]').forEach(b => b.addEventListener('click', () => { closeDialogs(); go(Number(b.dataset.slide)); }));
    $<HTMLButtonElement>('#notes-prev').disabled = index === 0;
    $<HTMLButtonElement>('#notes-next').disabled = index === mainSlides.length - 1 || index === slides.length - 1;
  }
  $<HTMLButtonElement>('#prev').disabled = index === 0;
  $<HTMLButtonElement>('#next').disabled = index === mainSlides.length - 1 || index === slides.length - 1;
  updateTimer();
}
function overviewItem(x: Slide, i: number) {
  return `<button data-slide="${i}" class="overview-item ${index === i ? 'selected' : ''}" ${index === i ? 'aria-current="true"' : ''}><span>${slideNumber(i)}</span><div><b>${escape(x.title)} ${escape(x.accent)}</b><small>${x.speaker}${x.appendix ? ' · optional' : ` · ${timeString(x.seconds)}`}</small></div></button>`;
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
  $('#motion').setAttribute('aria-label', paused ? 'Resume motion (M)' : 'Pause motion (M)');
  $('#motion').title = paused ? 'Resume motion (M)' : 'Pause motion (M)';
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
  $('#notes-prev').addEventListener('click', () => go(index - 1));
  $('#notes-next').addEventListener('click', nextSlide);
  $('#print').addEventListener('click', () => { closeDialogs(); window.print(); });
  document.querySelectorAll<HTMLElement>('[data-close]').forEach(b => b.addEventListener('click', () => b.closest('dialog')?.close()));
  document.querySelectorAll<HTMLDialogElement>('dialog').forEach(d => d.addEventListener('click', e => { if (e.target === d) { const r = d.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close(); } }));
  // Controls stay out of the audience's way: they appear on mouse movement and fade after a pause.
  let idle = 0;
  const wake = () => { document.body.classList.remove('idle'); clearTimeout(idle); idle = window.setTimeout(() => document.body.classList.add('idle'), 2600); };
  window.addEventListener('pointermove', wake); wake();
  const runningOrder = parts.map((name, p) => { const own = mainSlides.filter(x => x.part === p + 1), first = slides.indexOf(own[0]) + 1, lastSlide = slides.indexOf(own.at(-1)!) + 1; return `<li>Part ${p + 1} · ${escape(name)} — slide${first === lastSlide ? ` ${first}` : `s ${first}–${lastSlide}`} · ${[...new Set(own.map(x => x.speaker))].join(', ')}</li>`; }).join('');
  $('#print-handout').innerHTML = `<h1>Grid Stress Outlook</h1><p>${escape(researchTitle)}</p><p>Group 3 · Soriano (leader), Corpuz, Barsomo, Nuril, Mariano · 20-minute defense: 19:30 planned + 0:30 buffer.</p><h2>Follows the nine-part format</h2><ol class="print-parts">${runningOrder}</ol><p>Main slides 1–17. Appendix A1–A4 (slides 18–21) for questions only.</p>${slides.map((s, i) => `<article class="print-slide"><h2>${s.appendix ? 'Appendix' : 'Slide'} ${slideNumber(i)}</h2>${scriptHtml(i)}${s.sources ? `<p>Sources: ${s.sources.map(n => `[${n}]`).join(', ')}</p>` : ''}</article>`).join('')}<article class="print-slide"><h2>References</h2>${references.map(r => `<p>[${r.id}] ${escape(r.publisher)}. ${escape(r.title)}. ${r.date}.<br>${r.url}<br>${escape(r.status)}</p>`).join('')}</article>`;
  if (paused) { paused = false; motionToggle(); }
  if (!new URLSearchParams(location.search).has('static')) {
    import('./scene').then(m => m.createScene($('#scene'), slides[index].shot)).then(controller => { scene = controller; scene.setShot(slides[index].shot); scene.setPaused(paused); }).catch(error => { console.warn('3D unavailable; static illustration remains.', error instanceof Error ? error.message : error); });
  }
}
render();
if (presenter) post({ type: 'hello' });
const clockInterval = window.setInterval(updateTimer, 250);
window.addEventListener('pagehide', () => { clearInterval(clockInterval); scene?.dispose(); channel?.close(); });
