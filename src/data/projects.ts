import type { ImageKey } from './images'

export type ProjectCategory = 'Residential' | 'Agricultural' | 'Commercial' | 'Industrial'
export const projectCategories: ProjectCategory[] = ['Residential', 'Agricultural', 'Commercial', 'Industrial']

export interface Project {
  id: string
  title: string
  category: ProjectCategory
  location: string
  depth: string
  drillingType: string
  description: string
  image: ImageKey
  /** SAMPLE content: replace with real completed projects before launch. */
  isSample: boolean
}

export const projects: Project[] = [
  { id: 'p1', title: 'Home Borewell – Sample Project', category: 'Residential', location: 'Your City', depth: '—', drillingType: 'Rotary drilling', description: 'Sample entry. Replace with a real residential project: location, depth and what was delivered.', image: 'residential', isSample: true },
  { id: 'p2', title: 'Farm Irrigation Bore – Sample Project', category: 'Agricultural', location: 'Your District', depth: '—', drillingType: 'DTH drilling', description: 'Sample entry. Replace with a real agricultural project and its results.', image: 'agricultural', isSample: true },
  { id: 'p3', title: 'Office Complex Water Supply – Sample Project', category: 'Commercial', location: 'Your City', depth: '—', drillingType: 'Rotary drilling', description: 'Sample entry. Replace with a real commercial project.', image: 'commercial', isSample: true },
  { id: 'p4', title: 'Factory Process Water – Sample Project', category: 'Industrial', location: 'Industrial Area', depth: '—', drillingType: 'DTH drilling', description: 'Sample entry. Replace with a real industrial project.', image: 'industrial', isSample: true },
  { id: 'p5', title: 'Villa Plot Borewell – Sample Project', category: 'Residential', location: 'Your City', depth: '—', drillingType: 'Rotary drilling', description: 'Sample entry. Replace with a real residential project.', image: 'residential', isSample: true },
  { id: 'p6', title: 'Orchard Water Source – Sample Project', category: 'Agricultural', location: 'Your District', depth: '—', drillingType: 'DTH drilling', description: 'Sample entry. Replace with a real agricultural project.', image: 'agricultural', isSample: true },
]
