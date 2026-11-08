import type { Project } from '../types';

export const projects: Project[] = [{
  id: 'vng-lecheflan',
  title: 'V & G LecheFlan Management System',
  category: 'Capstone project',
  description: 'A web-based system designed to organize dessert shop sales, ordering, inventory, reporting, and administrative workflows.',
  technologies: ['React.js', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Node.js', 'Supabase'],
  features: [
    'Customer ordering and product browsing interfaces',
    'Point-of-sale (POS) and pre-order management',
    'Inventory and product management',
    'Online order management',
    'Sales reporting and dashboard',
    'Customer, staff, and administrator modules',
    'Responsive user interface',
  ],
  screenshot: '/images/vng-preview.jpg',
  screenshotAlt: 'The V & G LecheFlan website, featuring its dessert menu and online ordering interface',
  liveUrl: 'https://vng-lecheflan.vercel.app',
  // Add sourceUrl here when the repository is ready to share.
}];
