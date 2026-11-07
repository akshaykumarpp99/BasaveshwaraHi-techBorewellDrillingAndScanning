import type { LucideIcon } from 'lucide-react'
import {
  Users, Cog, Timer, BadgeIndianRupee, ShieldCheck, Headphones, Award,
  ClipboardList, MapPinned, FlaskConical, PencilRuler, Drill, CheckCheck,
} from 'lucide-react'

interface WhyItem { icon: LucideIcon; title: string; text: string }
export const whyUs: WhyItem[] = [
  { icon: Users, title: 'Experienced Drilling Professionals', text: 'A technical crew that understands local ground conditions and drilling methods.' },
  { icon: Cog, title: 'Modern Drilling Machinery', text: 'Well-maintained rigs and compressors for efficient, dependable drilling.' },
  { icon: Timer, title: 'Timely Project Completion', text: 'Clear schedules and updates so your project finishes when promised.' },
  { icon: BadgeIndianRupee, title: 'Transparent Pricing', text: 'A written quote up front, with no hidden charges added later.' },
  { icon: ShieldCheck, title: 'Safety-Focused Operations', text: 'Safe site practices to protect our crew, your property and neighbours.' },
  { icon: Headphones, title: 'Reliable Customer Support', text: 'Reach us by call or WhatsApp before, during and after the job.' },
  { icon: Award, title: 'Quality Workmanship', text: 'Proper casing, testing and clean-up on every borewell we deliver.' },
]

interface ProcessStep { icon: LucideIcon; title: string; text: string }
export const processSteps: ProcessStep[] = [
  { icon: ClipboardList, title: 'Customer Enquiry', text: 'Tell us your location and water need by form, call or WhatsApp.' },
  { icon: MapPinned, title: 'Site Inspection', text: 'Our team visits to study access, terrain and nearby sources.' },
  { icon: FlaskConical, title: 'Groundwater Assessment', text: 'We evaluate the likely water-bearing zones and the right spot.' },
  { icon: PencilRuler, title: 'Drilling Planning', text: 'Depth, method, casing and a transparent quotation are agreed.' },
  { icon: Drill, title: 'Borewell Drilling', text: 'Our crew drills with the planned method and safe site practices.' },
  { icon: CheckCheck, title: 'Completion & Testing', text: 'We test the yield, finish the work and hand over clearly.' },
]

interface Testimonial { name: string; location: string; text: string; rating: number; isSample: boolean }
/** SAMPLE content: replace with real customer reviews (with permission). */
export const testimonials: Testimonial[] = [
  { name: 'Customer Name', location: 'Your City', rating: 5, isSample: true, text: 'Sample testimonial. Replace this with a genuine review from a real customer about their borewell experience.' },
  { name: 'Customer Name', location: 'Your District', rating: 5, isSample: true, text: 'Sample testimonial. Add the customer’s own words about the team, timing and the result.' },
  { name: 'Customer Name', location: 'Your City', rating: 4, isSample: true, text: 'Sample testimonial. Only publish reviews you have received and have permission to show.' },
]

interface Faq { q: string; a: string }
export const faqs: Faq[] = [
  { q: 'How much does borewell drilling cost?', a: 'Cost depends on the depth, drilling method (rotary or DTH), casing length, rock type and site access. After a site visit we give a written quotation, so you know the price before drilling begins.' },
  { q: 'How long does borewell drilling take?', a: 'Most residential borewells take from several hours to a couple of days. Deeper bores, hard rock or difficult access can take longer. We confirm the expected schedule in the quotation.' },
  { q: 'How do you determine the drilling location?', a: 'We inspect the site, study the terrain and nearby water sources, and consider the geology. Where needed we recommend a groundwater survey. No method can guarantee water, and we will be honest about the likelihood.' },
  { q: 'What is the maximum borewell depth?', a: 'Depth depends on the rig, the local geology and regulations in your area. We will advise a suitable depth range for your site; contact us with your location and requirement.' },
  { q: 'Do you provide pump installation?', a: 'Yes. We can advise on the right submersible pump for your borewell and install, wire and commission it after drilling.' },
  { q: 'Do you offer borewell cleaning services?', a: 'Yes. We clean and flush existing borewells to remove silt and blockages and help restore water flow.' },
]
