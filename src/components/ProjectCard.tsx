import { useState } from 'react';
import type { Project } from '../types';
import { Icon } from './Icon';

export function ProjectCard({ project }: { project: Project }) {
  const [imageError, setImageError] = useState(false);
  return <article className="project-card reveal" aria-labelledby={`${project.id}-heading`}>
    <div className="project-preview">
      <div className="preview-browser" aria-hidden="true"><div className="browser-dots"><i /><i /><i /></div><span>vng-lecheflan.vercel.app</span><Icon name="external" size={11} /></div>
      {imageError ? <div className="preview-fallback"><span>V & G</span><h3>LecheFlan</h3><p>Sweetness in every bite.</p><span className="preview-fallback-label">Explore the live project below</span></div> : <img src={project.screenshot} alt={project.screenshotAlt} width="1200" height="840" loading="lazy" onError={() => setImageError(true)} />}
      <span className="preview-caption"><span className="status-dot" /> Web-based management system</span>
    </div>
    <div className="project-details">
      <p className="eyebrow project-category">{project.category}</p>
      <h3 id={`${project.id}-heading`}>{project.title}</h3>
      <p className="project-description">{project.description}</p>
      <ul className="technology-tags" aria-label="Project technologies">{project.technologies.map(technology => <li key={technology}>{technology}</li>)}</ul>
      <ul className="project-features">{project.features.map(feature => <li key={feature}><Icon name="check" size={15} /><span>{feature}</span></li>)}</ul>
      <div className="flex flex-wrap gap-3 project-actions">
        {project.liveUrl && <a className="button button-primary button-small" href={project.liveUrl} target="_blank" rel="noopener noreferrer"><Icon name="external" size={15} />View Live Project<Icon name="arrow" size={14} /></a>}
        {project.sourceUrl && <a className="button button-outline button-small" href={project.sourceUrl} target="_blank" rel="noopener noreferrer"><Icon name="github" size={15} />View Source Code</a>}
      </div>
    </div>
  </article>;
}
