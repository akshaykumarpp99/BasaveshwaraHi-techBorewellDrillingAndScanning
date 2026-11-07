import type { ImageKey } from './images'

export interface Equipment {
  id: string
  title: string
  category: string
  description: string
  image: ImageKey
}

/** Replace with your actual machinery and add real photos in data/images.ts. */
export const equipment: Equipment[] = [
  { id: 'rig', title: 'Borewell Drilling Rigs', category: 'Rigs', description: 'Truck-mounted rigs for rotary and DTH drilling.', image: 'rig' },
  { id: 'hydraulic', title: 'Hydraulic Drilling Machines', category: 'Machines', description: 'Hydraulic units for controlled, efficient drilling.', image: 'hydraulic' },
  { id: 'compressor', title: 'Compressor Machines', category: 'Machines', description: 'High-pressure air for drilling and borewell flushing.', image: 'compressor' },
  { id: 'tanker', title: 'Water Tankers', category: 'Support', description: 'On-site water supply to support drilling operations.', image: 'tanker' },
  { id: 'accessories', title: 'Drilling Accessories', category: 'Accessories', description: 'Drill bits, rods, hammers and casing accessories.', image: 'accessories' },
]
