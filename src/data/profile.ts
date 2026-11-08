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

// Replace null with your actual email or profile URL when you are ready.
// For email, use 'mailto:your-address'. Unconfigured links are clearly disabled.
export const contactLinks: ContactLink[] = [
  { label: 'Email Me', icon: 'mail', url: null },
  { label: 'GitHub', icon: 'github', url: null },
  { label: 'LinkedIn', icon: 'linkedin', url: null },
];
