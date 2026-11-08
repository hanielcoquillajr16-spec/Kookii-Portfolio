import { profile } from '../data/profile';
import { Icon } from './Icon';

export function Footer() {
  return <footer className="site-footer"><div className="page-width footer-content"><p>© {new Date().getFullYear()} {profile.fullName}<span className="footer-divider">|</span><span>Built with <span className="text-cyan">React + TypeScript</span> <Icon name="heart" size={12} /></span></p><a href="#home" className="back-to-top" aria-label="Back to top"><Icon name="arrow-up" size={15} /></a></div></footer>;
}
