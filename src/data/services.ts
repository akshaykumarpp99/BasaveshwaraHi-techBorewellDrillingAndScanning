import type { LucideIcon } from 'lucide-react'
import { Droplets, CircleDot, Sparkles, Waves, Gauge, Radar, Truck, Wrench } from 'lucide-react'
import type { ImageKey } from './images'

export interface Service {
  slug: string
  title: string
  short: string
  icon: LucideIcon
  image: ImageKey
  /** Longer copy for the detail page. */
  overview: string
  included: string[]
  whenYouNeedIt: string[]
}

export const services: Service[] = [
  {
    slug: 'borewell-drilling',
    title: 'Borewell Drilling',
    short: 'Professional drilling for residential, agricultural, commercial and industrial water supply.',
    icon: Droplets,
    image: 'rig',
    overview:
      'We drill borewells using rotary and DTH (down-the-hole hammer) methods, matched to the local geology. Each job begins with a site assessment so the location, depth and casing plan fit your water requirement.',
    included: ['Site inspection and location marking', 'Rotary / DTH drilling', 'PVC / MS casing as required', 'Yield testing on completion', 'Clear written quotation before work starts'],
    whenYouNeedIt: ['New plot or farm with no water source', 'Existing borewell has dried up', 'Higher water demand than the current source'],
  },
  {
    slug: 'openwell-drilling',
    title: 'Openwell Drilling',
    short: 'Openwell and recharge-well work to improve groundwater availability for farms and homes.',
    icon: CircleDot,
    image: 'openwell',
    overview:
      'Openwells and recharge wells help store and replenish groundwater. We assess the site and recommend the structure that best supports your water needs and local water table.',
    included: ['Site assessment', 'Drilling and excavation support', 'Lining and protection guidance', 'Water-level check on completion'],
    whenYouNeedIt: ['Improving seasonal water storage', 'Groundwater recharge on farmland', 'Supplementing a borewell source'],
  },
  {
    slug: 'borewell-cleaning',
    title: 'Borewell Cleaning',
    short: 'Remove silt, sand and blockages to restore water flow in existing borewells.',
    icon: Sparkles,
    image: 'cleaning',
    overview:
      'Over time borewells collect silt and debris that reduce discharge. Cleaning clears the bore and screens so the pump can draw water efficiently again.',
    included: ['Pump and pipe removal', 'Air or mechanical cleaning', 'Debris and silt removal', 'Flow check before reinstalling the pump'],
    whenYouNeedIt: ['Muddy or sandy water', 'Reduced discharge', 'Pump struggling or tripping'],
  },
  {
    slug: 'borewell-flushing',
    title: 'Borewell Flushing',
    short: 'Compressor flushing that clears fine particles and helps revive low-yield borewells.',
    icon: Waves,
    image: 'flushing',
    overview:
      'Flushing uses compressed air to push water and fine material out of the borewell, helping reopen water-bearing fractures and improving the flow.',
    included: ['Compressor flushing', 'Water-level and flow observation', 'Report of results'],
    whenYouNeedIt: ['Low or declining yield', 'After drilling, to develop the bore', 'Turbid water after long idle periods'],
  },
  {
    slug: 'submersible-pump-installation',
    title: 'Submersible Pump Installation',
    short: 'Correctly sized pump selection, installation, cabling and commissioning.',
    icon: Gauge,
    image: 'pump',
    overview:
      'We help select a pump that matches borewell depth, water level and your daily requirement, then install and commission it with proper piping and electrical protection.',
    included: ['Pump sizing advice', 'Installation and cabling', 'Starter / panel connection', 'Test run and handover'],
    whenYouNeedIt: ['New borewell', 'Replacing a failed pump', 'Upgrading discharge capacity'],
  },
  {
    slug: 'groundwater-survey',
    title: 'Groundwater Survey',
    short: 'Technical assessment to identify promising water-bearing locations before you drill.',
    icon: Radar,
    image: 'survey',
    overview:
      'A survey helps reduce the risk of drilling a dry borewell. We study the terrain, nearby sources and geology to recommend suitable spots. No survey can guarantee water; we will always be upfront about the likelihood.',
    included: ['Terrain and geology review', 'Nearby source observations', 'Recommended drilling points', 'Estimated depth range'],
    whenYouNeedIt: ['Before drilling on a new site', 'Choosing between multiple spots', 'Prior borewells failed nearby'],
  },
  {
    slug: 'drilling-rig-services',
    title: 'Drilling Rig Services',
    short: 'Rig and compressor services for contractors and projects that need drilling capacity.',
    icon: Truck,
    image: 'hydraulic',
    overview:
      'We provide drilling rig and equipment services with operators for projects that need additional capacity or specialised drilling support.',
    included: ['Rig with operator crew', 'Compressor support', 'Flexible scheduling', 'Transparent per-job or per-foot pricing'],
    whenYouNeedIt: ['Contractor needs extra capacity', 'Large or multi-bore projects', 'Specialised site access'],
  },
  {
    slug: 'borewell-maintenance',
    title: 'Borewell Maintenance',
    short: 'Routine inspection and upkeep to extend borewell and pump life.',
    icon: Wrench,
    image: 'maintenance',
    overview:
      'Regular inspection of the borewell, casing, pump and electricals helps catch problems early and avoid costly breakdowns.',
    included: ['Borewell and casing inspection', 'Pump and motor check', 'Minor repairs', 'Maintenance schedule advice'],
    whenYouNeedIt: ['Yearly preventive check-up', 'Before the dry season', 'After heavy usage or storms'],
  },
]

export const getService = (slug?: string) => services.find((s) => s.slug === slug)
