import type { ContactLink } from '../types';

export const profile = {
  firstName: 'Haniel',
  lastName: 'Coquilla',
  fullName: 'Haniel A. Coquilla Jr.',
  roles: ['Frontend Developer', 'Full-Stack Web Developer', 'Web Designer'],
  introduction: 'I build modern and responsive web applications with a passion for clean design and great user experience.',
  about: "I'm a passionate web developer who loves turning ideas into interactive and functional websites. I specialize in modern web technologies, designing responsive interfaces, and building web-based systems. I'm always eager to learn new tools and improve my skills.",
  education: 'STI College Las Piñas',
};

export const contactEmail = 'coquilla13nielhanjr@gmail.com';
export const contactFormEndpoint = `https://formsubmit.co/ajax/${contactEmail}`;

// Set a URL to null to disable that contact card.
export const contactLinks: ContactLink[] = [
  { label: 'Email Me', icon: 'mail', url: `mailto:${contactEmail}` },
  { label: 'GitHub', icon: 'github', url: 'https://github.com/hanielcoquillajr16-spec' },
  { label: 'LinkedIn', icon: 'linkedin', url: 'https://www.linkedin.com/in/haniel-a-coquilla-jr-b071a844a/' },
];
