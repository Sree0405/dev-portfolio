/**
 * IMMERSIVE EXPERIENCE TYPES
 */

export interface Section {
  id: string;
  title: string;
  subtitle?: string;
  camera: {
    position: [number, number, number];
    lookAt: [number, number, number];
  };
}

export interface ImmersiveState {
  progress: number;
  currentSection: number;
  isMobile: boolean;
  isLoaded: boolean;
}

export const SECTIONS: Section[] = [
  {
    id: 'hero',
    title: 'SREEKANTH',
    subtitle: 'Creative Developer',
    camera: { position: [0, 0, 12], lookAt: [0, 0, 0] },
  },
  {
    id: 'about',
    title: 'ABOUT',
    subtitle: 'Who I Am',
    camera: { position: [10, 7, 9], lookAt: [0, 4, 0] },
  },
  {
    id: 'skills',
    title: 'SKILLS',
    subtitle: 'What I Do',
    camera: { position: [-6, 5, 10], lookAt: [0, 5, 0] },
  },
  {
    id: 'projects',
    title: 'PROJECTS',
    subtitle: 'What I Build',
    camera: { position: [0, 10, 8], lookAt: [0, 10, 0] },
  },
  {
    id: 'contact',
    title: 'CONTACT',
    subtitle: "Let's Connect",
    camera: { position: [0, 15, 10], lookAt: [0, 15, 0] },
  },
];
