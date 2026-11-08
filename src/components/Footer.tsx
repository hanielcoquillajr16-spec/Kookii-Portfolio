import { profile } from '../data/profile';
import { Icon } from './Icon';

export function Footer() {
  return <footer className="site-footer"><div className="page-width footer-content"><p>© {new Date().getFullYear()} {profile.fullName}</p><a href="#home" className="back-to-top" aria-label="Back to top"><Icon name="arrow-up" size={15} /></a></div></footer>;
}
