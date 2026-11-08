import { useEffect, useState } from 'react';
import { profile } from '../data/profile';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Icon } from './Icon';

function TypedRole() {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(profile.roles[0]);
  useEffect(() => {
    if (reduced) return;
    let role = 0;
    let length = profile.roles[0].length;
    let deleting = true;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const phrase = profile.roles[role];
      length += deleting ? -1 : 1;
      setValue(phrase.slice(0, length));
      let delay = deleting ? 38 : 72;
      if (length === 0) { role = (role + 1) % profile.roles.length; deleting = false; delay = 280; }
      else if (length === phrase.length && !deleting) { deleting = true; delay = 2400; }
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 2600);
    return () => clearTimeout(timer);
  }, [reduced]);

  return <span className="typed-role" aria-hidden="true">{reduced ? profile.roles[0] : value}<span className="typing-cursor">|</span></span>;
}

export function Hero() {
  return <section id="home" className="hero section-line">
    <div className="page-width hero-grid">
      <div className="hero-copy">
        <p className="hero-intro">Hello, I'm a Web Developer <span className="intro-line" /></p>
        <h1>Haniel A.<br className="mobile-name-break" /> <span className="text-cyan">Coquilla Jr.</span></h1>
        <div className="hero-role"><span className="role-label">I create as a</span> <TypedRole /><span className="sr-only">{profile.roles.join(', ')}</span></div>
        <p className="hero-description">{profile.introduction}</p>
        <div className="flex flex-wrap items-center gap-3.5 hero-actions">
          <a href="#projects" className="button button-primary"><Icon name="folder" size={18} />View My Projects<Icon name="arrow" size={17} /></a>
          <a href="#contact" className="button button-outline"><Icon name="mail" size={18} />Contact Me</a>
        </div>
      </div>
      <div className="hero-art">
        <div className="hero-art-glow" aria-hidden="true" />
        <img className="portrait-art" src="/images/koki.png" alt="Haniel A. Coquilla Jr. in graduation attire" width="1122" height="1402" fetchPriority="high" />
        <span className="floating-square square-one" aria-hidden="true" /><span className="floating-square square-two" aria-hidden="true" /><span className="floating-square square-three" aria-hidden="true" />
        <div className="art-caption"><span className="status-dot" /> Ideas into interfaces <span className="caption-code">&lt;/&gt;</span></div>
      </div>
    </div>
  </section>;
}
