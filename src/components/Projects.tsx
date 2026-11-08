import { projects } from '../data/projects';
import { ProjectCard } from './ProjectCard';

export function Projects() {
  return <section id="projects" aria-labelledby="projects-heading" className="projects-section section-line">
    <div className="page-width">
      <div className="section-heading-row reveal"><div><p className="eyebrow">02 / Selected work</p><h2 id="projects-heading">Project Portfolio<span className="text-cyan">.</span></h2></div><span className="project-count">01 <span>/ Featured project</span></span></div>
      <div className="projects-list">{projects.map(project => <ProjectCard key={project.id} project={project} />)}</div>
    </div>
  </section>;
}
