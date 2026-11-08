import { contactLinks } from '../data/profile';
import { Icon } from './Icon';

export function Contact() {
  const pending = contactLinks.some(link => !link.url);
  return <section id="contact" aria-labelledby="contact-heading" className="contact-section section-line">
    <div className="contact-decoration" aria-hidden="true"><i /><i /><i /></div>
    <div className="page-width contact-grid reveal">
      <div className="contact-copy"><p className="eyebrow">03 / Contact</p><h2 id="contact-heading">Let's Work Together<span className="text-cyan">.</span></h2><p className="body-copy">Have a question, a project in mind, or just want to connect?<br className="desktop-only" /> I'd love to hear from you.</p></div>
      <div className="contact-links"><div className="flex flex-wrap gap-3">
        {contactLinks.map(link => link.url ? <a className="button button-outline contact-button" key={link.label} href={link.url} target={link.icon === 'mail' ? undefined : '_blank'} rel={link.icon === 'mail' ? undefined : 'noopener noreferrer'}><Icon name={link.icon} size={20} />{link.label}</a> : <span className="contact-placeholder" key={link.label}><button className="button button-outline contact-button" disabled aria-describedby="contact-pending-note"><Icon name={link.icon} size={20} />{link.label}</button><span>Coming soon</span></span>)}
      </div>{pending && <p id="contact-pending-note" className="contact-note">Contact details will be added soon.</p>}</div>
    </div>
  </section>;
}
