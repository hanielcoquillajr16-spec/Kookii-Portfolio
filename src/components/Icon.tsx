import type { SVGProps } from 'react';

export type IconName = 'code' | 'arrow' | 'arrow-up' | 'external' | 'folder' | 'mail' | 'github' | 'linkedin' | 'graduation' | 'rocket' | 'check' | 'chevron-left' | 'chevron-right' | 'pause' | 'play' | 'menu' | 'close' | 'heart';
type Props = SVGProps<SVGSVGElement> & { name: IconName; size?: number };

const paths: Record<IconName, React.ReactNode> = {
  code: <><path d="m8 5-7 7 7 7m8-14 7 7-7 7M14 2l-4 20" /></>,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  'arrow-up': <path d="M12 20V4m-6 6 6-6 6 6" />,
  external: <><path d="M14 3h7v7m0-7L10 14" /><path d="M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" /></>,
  folder: <path d="M3 7V5a1 1 0 0 1 1-1h5l2 3h9a1 1 0 0 1 1 1l-2 11H3L1 8a1 1 0 0 1 1-1h18" />,
  mail: <><rect x="2" y="4" width="20" height="16" rx="3" /><path d="m3 6 9 7 9-7" /></>,
  github: <><path d="M9 19c-4.3 1.3-4.3-2.2-6-2.7M15 22v-3.5c0-1 .1-1.5-.5-2 3.2-.4 6.5-1.5 6.5-7A5.5 5.5 0 0 0 19.5 6c.1-.4.6-2-.1-3.5 0 0-1.2-.4-3.7 1.4a13 13 0 0 0-6.7 0C6.5 2.1 5.3 2.5 5.3 2.5 4.6 4 5.1 5.6 5.2 6A5.5 5.5 0 0 0 3.7 10c0 5.3 3.2 6.4 6.4 6.8-.5.4-.7 1-.7 2V22" /></>,
  linkedin: <><rect x="2" y="2" width="20" height="20" rx="3" /><path d="M7 10v7m0-10v.1M11 17v-7m0 3c0-4 6-4 6 0v4" /></>,
  graduation: <><path d="m1 8 11-5 11 5-11 5L1 8Zm4 2v7c4 3 10 3 14 0v-7m4-2v9" /></>,
  rocket: <><path d="M14 4c3-2 7-2 7-2s0 4-2 7l-7 7-5-5 7-7Z" /><circle cx="16" cy="7" r="1.5" /><path d="m7 11-4 1-1 5 6-1m4 0-1 6 5-1 1-4M5 18l-3 4m4-2-1 3" /></>,
  check: <><circle cx="12" cy="12" r="10" fill="currentColor" stroke="none" /><path d="m7.5 12 3 3 6-6" stroke="#04111f" strokeWidth="2.3" /></>,
  'chevron-left': <path d="m14 6-6 6 6 6" />,
  'chevron-right': <path d="m10 6 6 6-6 6" />,
  pause: <><path d="M8 5v14m8-14v14" strokeWidth="3" /></>,
  play: <path d="m8 4 12 8-12 8V4Z" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  heart: <path fill="currentColor" stroke="none" d="M12 21 3.4 12.5C-3 6.2 6 0 12 6c6-6 15 .2 8.6 6.5Z" />,
};

export function Icon({ name, size = 20, ...props }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
