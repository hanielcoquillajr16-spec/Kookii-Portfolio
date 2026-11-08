import { profile } from '../data/profile';
import { Icon } from './Icon';

export function About() {
  return <section id="about" aria-labelledby="about-heading" className="about-section section-line">
    <div className="page-width about-grid reveal">
      <div className="about-art" aria-hidden="true"><img src="/images/developer-workspace.svg" alt="" width="460" height="260" loading="lazy" /></div>
      <div className="about-copy">
        <p className="eyebrow">01 / About me</p>
        <h2 id="about-heading">A little about me<span className="text-cyan">.</span></h2>
        <p className="body-copy">{profile.about}</p>
      </div>
      <div className="about-facts">
        <div className="about-fact"><Icon name="graduation" size={29} /><div><h3>IT Student</h3><p>{profile.education}</p></div></div>
        <div className="about-fact"><Icon name="code" size={28} /><div><h3>Web Developer</h3><p>React · TypeScript</p></div></div>
        <div className="about-fact"><Icon name="rocket" size={28} /><div><h3>Always Learning</h3><p>Building better solutions</p></div></div>
      </div>
    </div>
  </section>;
}
