# Drop your real photos here

1. Save each photo with the **exact filename** below (`.jpg`, `.jpeg`, `.png` or `.webp`).
2. Run `npm run photos` (needs `brew install webp`). Files are resized and written to `public/images`.
3. Refresh the site. Any slot you don't supply keeps its placeholder artwork.

Use **landscape** photos at least as wide as the size shown. The site crops with "cover", so keep the subject near the centre.

| Filename | Where it appears | Ideal size | What to shoot |
|---|---|---|---|
| `hero-rig` | Home hero background (full screen) | 1920×1080, 16:9 | Your rig drilling, wide shot. Keep the rig in the **right half**; the headline sits on the left. |
| `about-rig` | About section, main image | 1200×900, 4:3 | Crew with the rig |
| `team` | About section, small overlay image | 1200×900, 4:3 | Your technical team (with their consent) |
| `rig` | Service: Borewell Drilling + Machinery gallery | 1200×900, 4:3 | Truck-mounted drilling rig |
| `hydraulic` | Service: Drilling Rig Services + Machinery gallery | 1200×900, 4:3 | Hydraulic / crawler drilling machine |
| `compressor` | Machinery gallery | 1200×900, 4:3 | Compressor |
| `tanker` | Machinery gallery | 1200×900, 4:3 | Water tanker |
| `accessories` | Machinery gallery | 1200×900, 4:3 | Drill bits, rods, hammers |
| `openwell` | Service: Openwell Drilling | 1200×900, 4:3 | Open well or recharge well |
| `cleaning` | Service: Borewell Cleaning | 1200×900, 4:3 | Cleaning work in progress |
| `flushing` | Service: Borewell Flushing | 1200×900, 4:3 | Compressor flushing / water jet |
| `pump` | Service: Submersible Pump Installation | 1200×900, 4:3 | Pump being installed / lifted |
| `survey` | Service: Groundwater Survey | 1200×900, 4:3 | Site survey / instrument |
| `maintenance` | Service: Borewell Maintenance | 1200×900, 4:3 | Wellhead, valves, technician |
| `residential` | Projects (Residential) | 1200×900, 4:3 | A real residential job |
| `agricultural` | Projects (Agricultural) | 1200×900, 4:3 | A real farm job |
| `commercial` | Projects (Commercial) | 1200×900, 4:3 | A real commercial job |
| `industrial` | Projects (Industrial) | 1200×900, 4:3 | A real industrial job |
| `og-image` (**.jpg only**) | Link previews (WhatsApp, Facebook…) | 1200×630 | Your best rig shot |

Tips: shoot in good daylight, include people in safety gear for scale, avoid photos with other companies' logos or number plates, and only publish customer sites with their permission.

Per-project photos: each project currently uses one of the four category images. To give every project its own photo, add files under `public/images` and set a path per project in `src/data/projects.ts` / `src/data/images.ts`.
