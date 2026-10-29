import { describe, expect, test } from 'bun:test';
import { slides, mainSlides, references, speakers, budgetSeconds, balance, slideIndex } from '../src/content';
describe('defense content', () => {
  test('16 main slides, 5 appendix slides and unique IDs', () => { expect(mainSlides).toHaveLength(16); expect(slides).toHaveLength(21); expect(new Set(slides.map(s=>s.id)).size).toBe(slides.length); });
  test('five ordered presenters fit 20 minutes including buffer', () => { expect([...new Set(mainSlides.map(s=>s.speaker))]).toEqual(speakers); expect(mainSlides.reduce((n,s)=>n+s.seconds,0)).toBe(budgetSeconds-30); for(const name of speakers.slice(0,4)) expect(mainSlides.filter(s=>s.speaker===name).reduce((n,s)=>n+s.seconds,0)).toBe(240); });
  test('every slide has script, a cue, handoff and evidence classification', () => { for(const s of slides){expect(s.notes.length).toBeGreaterThan(1);expect(s.cue.length).toBeGreaterThan(10);expect(s.bridge.length).toBeGreaterThan(10);expect(s.label.length).toBeGreaterThan(10);for(const source of s.sources||[])expect(references.some(r=>r.id===source)).toBe(true);} });
  test('hash navigation is bounded', () => { expect(slideIndex('#slide-3')).toBe(2); expect(slideIndex('#slide-999')).toBe(20);expect(slideIndex('#slide-0')).toBe(0);expect(slideIndex('#bad')).toBe(0); });
  test('teaching simulator handles reserve requirements, not only demand', () => { expect(balance(2468)).toMatchObject({margin:-77,state:'Red alert'});expect(balance(2600).state).toBe('Red alert');expect(balance(2700).state).toBe('Yellow alert');expect(balance(2900).state).toBe('Normal');expect(balance(2545*1.04).state).toBe('Yellow alert'); });
  test('sizing distinguishes values from wide rows', () => { expect(300*12*105120).toBe(378432000);expect(300*105120).toBe(31536000); });
});
