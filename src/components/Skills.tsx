import { useEffect, useRef, useState } from 'react';
import { skills } from '../data/skills';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Icon } from './Icon';

export function Skills() {
  const track = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const [interacting, setInteracting] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(true);

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const update = () => setHasOverflow(element.scrollWidth > element.clientWidth + 1);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [reduced]);

  useEffect(() => {
    const element = track.current;
    if (!element || reduced || paused || interacting) return;
    let frame: number;
    let last = 0;
    let offset = element.scrollLeft;
    const animate = (time: number) => {
      if (last) {
        const loopWidth = (element.scrollWidth + 16) / 2;
        offset += Math.min(time - last, 60) * 0.025;
        if (offset >= loopWidth) offset -= loopWidth;
        element.scrollLeft = offset;
      }
      last = time;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [reduced, paused, interacting]);

  const scroll = (direction: number) => {
    setPaused(true);
    const element = track.current;
    if (!element) return;
    const loopWidth = (element.scrollWidth + 16) / 2;
    if (!reduced && direction < 0 && element.scrollLeft < 130) element.scrollLeft += loopWidth;
    element.scrollBy({ left: direction * 240, behavior: reduced ? 'instant' : 'smooth' });
  };

  return <section id="skills" aria-labelledby="skills-heading" className="skills-section section-line">
    <div className="page-width reveal">
      <div className="section-heading-row">
        <div><p className="eyebrow">Skills & technologies</p><h2 id="skills-heading">My toolkit<span className="text-cyan">.</span></h2></div>
        <p className="section-aside">The technologies behind my work</p>
      </div>
      <div className="skills-carousel">
        <button className="icon-button carousel-arrow" aria-label="Previous skills" disabled={!hasOverflow} onClick={() => scroll(-1)}><Icon name="chevron-left" size={17} /></button>
        <div ref={track} className={`skills-track ${paused ? 'is-paused' : ''}`} tabIndex={0} role="region" aria-label="Technology skills. Use the arrow buttons to explore." onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)} onFocus={() => setInteracting(true)} onBlur={() => setInteracting(false)}>
          {(reduced ? skills : [...skills, ...skills]).map((skill, index) => <div className="skill-card" key={`${skill.name}-${index}`} aria-hidden={index >= skills.length ? true : undefined}>
            <img src={skill.logo} alt="" className="skill-logo" width="39" height="39" style={{ animationDelay: `${(index % 4) * -1.2}s` }} />
            <span>{skill.name}</span>
          </div>)}
        </div>
        <button className="icon-button carousel-arrow" aria-label="Next skills" disabled={!hasOverflow} onClick={() => scroll(1)}><Icon name="chevron-right" size={17} /></button>
      </div>
      <div className="skills-bottom"><span className="section-dash" />{!reduced && <button className="motion-toggle" onClick={() => setPaused(!paused)} aria-label={paused ? 'Play skills animation' : 'Pause skills animation'} aria-pressed={paused}><Icon name={paused ? 'play' : 'pause'} size={11} />{paused ? 'Play motion' : 'Pause motion'}</button>}</div>
    </div>
  </section>;
}
