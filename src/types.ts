export interface Skill {
  name: string;
  logo: string;
  category: 'Frontend' | 'Backend' | 'Design';
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  features: string[];
  screenshot: string;
  screenshotAlt: string;
  liveUrl?: string;
  sourceUrl?: string;
}

export interface ContactLink {
  label: string;
  icon: 'mail' | 'github' | 'linkedin';
  url: string | null;
}
