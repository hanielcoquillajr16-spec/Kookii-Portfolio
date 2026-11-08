import { useEffect, useRef, useState } from 'react';
import { profile } from '../data/profile';
import { Icon } from './Icon';

const links = [
  { label: 'About', id: 'about' },
  { label: 'Projects', id: 'projects' },
  { label: 'Skills', id: 'skills' },
  { label: 'Contact', id: 'contact' },
];

export function Navbar() {
  const [active, setActive] = useState('about');
  const [open, setOpen] = useState(false);
  const navigationTarget = useRef<string | null>(null);

  useEffect(() => {
    const update = () => {
      if (navigationTarget.current) { setActive(navigationTarget.current); return; }
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8;
      if (atBottom && window.scrollY > 0) { setActive('contact'); return; }
      const sections = ['about', 'skills', 'projects', 'contact'];
      let next = 'about';
      for (const id of sections) {
        if ((document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= 180) next = id;
      }
      setActive(next);
    };
    const readHash = () => {
      const id = window.location.hash.slice(1);
      navigationTarget.current = links.some(link => link.id === id) ? id : null;
      update();
    };
    const manualScroll = () => { navigationTarget.current = null; update(); };
    const keyboardScroll = (event: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) manualScroll();
    };
    readHash();
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    window.addEventListener('hashchange', readHash);
    window.addEventListener('wheel', manualScroll, { passive: true });
    window.addEventListener('touchstart', manualScroll, { passive: true });
    window.addEventListener('keydown', keyboardScroll);
    return () => {
      window.removeEventListener('scroll', update); window.removeEventListener('resize', update);
      window.removeEventListener('hashchange', readHash); window.removeEventListener('wheel', manualScroll);
      window.removeEventListener('touchstart', manualScroll); window.removeEventListener('keydown', keyboardScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    const closeOnOutside = (event: PointerEvent) => {
      if (event.target instanceof Element && !event.target.closest('.site-header')) setOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOnOutside);
    return () => { document.removeEventListener('keydown', closeOnEscape); document.removeEventListener('pointerdown', closeOnOutside); };
  }, [open]);

  return <header className="site-header">
    <div className="page-width flex items-center justify-between gap-6">
      <a className="brand" href="#home" aria-label="Haniel Coquilla, back to top" onClick={() => setOpen(false)}>
        <Icon name="code" size={38} />
        <span>{profile.firstName} <span className="text-cyan">{profile.lastName}</span><span className="brand-dot">.</span></span>
      </a>
      <button className="menu-toggle icon-button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}><Icon name={open ? 'close' : 'menu'} /></button>
      <nav id="main-navigation" aria-label="Main navigation" className={`navigation ${open ? 'is-open' : ''}`}>
        {links.map(({ label, id }) => <a key={id} href={`#${id}`} className={active === id ? 'active' : ''} aria-current={active === id ? 'location' : undefined} onClick={() => { navigationTarget.current = id; setActive(id); setOpen(false); }}>{label}</a>)}
      </nav>
    </div>
  </header>;
}
