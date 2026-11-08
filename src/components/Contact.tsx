import { contactLinks } from '../data/profile';
import type { ContactLink } from '../types';
import { ContactForm } from './ContactForm';
import { Icon } from './Icon';
import './Contact.css';

const descriptions: Record<ContactLink['icon'], string> = {
  mail: 'Send me an email anytime',
  github: 'Check out my work',
  linkedin: "Let's connect professionally",
};

export function Contact() {
  return <section id="contact" aria-labelledby="contact-heading" className="contact-section contact-showcase section-line">
    <div className="contact-backdrop" aria-hidden="true">
      <Icon name="code" className="contact-code-art" size={300} />
      <span className="contact-diagonal diagonal-one" />
      <span className="contact-diagonal diagonal-two" />
      <span className="contact-spark spark-one" />
      <span className="contact-spark spark-two" />
      <span className="contact-spark spark-three" />
    </div>
    <div className="page-width contact-content">
      <header className="contact-heading reveal">
        <p className="eyebrow">03 / Contact<span aria-hidden="true" /></p>
        <h2 id="contact-heading">Let's Work <span className="text-cyan">Together</span></h2>
      </header>
      <div className="contact-layout">
        <div className="contact-intro reveal">
          <p className="contact-description">Have a project in mind, a question, or just want to connect?<br className="contact-line-break" /> Feel free to reach out. I'd love to hear from you!</p>
          <div className="contact-cards">
            {contactLinks.map(link => {
              const content = <>
                <span className={`contact-card-icon contact-icon-${link.icon}`}><Icon name={link.icon} size={37} /></span>
                <span className="contact-card-copy"><span className="contact-card-title">{link.label}</span><span className="contact-card-description">{link.url ? descriptions[link.icon] : 'Coming soon'}</span></span>
                <span className="contact-card-arrow"><Icon name="arrow-up-right" size={17} /></span>
              </>;
              return link.url
                ? <a className="contact-card" key={link.icon} href={link.url} target={link.icon === 'mail' ? undefined : '_blank'} rel={link.icon === 'mail' ? undefined : 'noopener noreferrer'}>{content}</a>
                : <div className="contact-card contact-card-unavailable" key={link.icon} aria-disabled="true">{content}</div>;
            })}
          </div>
          <p className="contact-invitation"><span aria-hidden="true">“</span>I'm always open to new opportunities.</p>
        </div>
        <div className="reveal"><ContactForm /></div>
      </div>
    </div>
  </section>;
}
