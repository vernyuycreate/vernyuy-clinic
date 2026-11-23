# Vernyuy Clinic: Website Demonstration

A frontend-only demo of a modern multi-specialty clinic website in Buea, Cameroon, with an admin dashboard demo.
Built with HTML, CSS, vanilla JavaScript and GSAP (+ ScrollTrigger, loaded from cdnjs). No backend, no build step.

Made by Vernyuy Services. WhatsApp: +237 652 311 022 (https://wa.me/237652311022)

## Run it
Open `index.html` in a browser, or upload the folder to any static host. An internet connection is needed for the GSAP and Google Fonts CDNs. (Everything is plain HTML files with relative links, so it also works from a double-click, except doctor/appointment pre-filling which needs the query string and works in all browsers.)

## Structure (14 pages)
```
index.html                home
about.html                about us
services.html             services
departments.html          departments (anchors: #d-general, #d-pediatrics, #d-womens, #d-dental, ...)
doctors.html              all doctors
doctor.html?id=0..4       one doctor profile (id = position in DOCS)
team.html                 team
children.html             children's care
patient-information.html  patient information (anchors: #pi-0 ... #pi-6)
resources.html            articles (resources.html?q=title pre-filters)
faq.html                  FAQ
contact.html              contact form
appointment.html          appointment form (?doctor=N or ?dept=Name pre-selects)
admin.html                admin dashboard demo
css/style.css, css/polish.css   styles
js/main.js                data + per-page scripts (each page sets <body data-page="...">)
js/polish.js              titles, focus, accessibility and GSAP motion
js/images.js              automatic photo loader (reads assets/images/, see below)
js/theme.js               light theme by default plus a dark-theme toggle in the header
js/fx.js                  extra GSAP motion: looping ambient animations, scroll and pointer effects
assets/images/            put the images listed below here
```
Each page carries its own header, footer, title and meta description. Page-specific rendering in `main.js` is keyed on `document.body.dataset.page`, so a page only runs the code it needs. The old hash router was removed; every link is a normal link, so Back, refresh, bookmarks and sharing all work natively.

## Privacy and demo notes
- Forms collect no medical details and send nothing anywhere. Success screens say so.
- The site always opens in the light theme, whatever the device's own setting. The sun/moon button in the header switches to dark, and that choice (the only thing saved, in LocalStorage) is remembered on every page. All records, doctors, team, testimonials and articles are fictional.
- Sample items marked "to be confirmed" (hours, phone, payments, insurance) must be replaced with the real clinic's information.

## Motion (js/fx.js)
Looping: drifting colour blobs (hero and page headers), a radar ring and bobbing badges around the hero artwork, a heartbeat on the logo mark, an ECG pulse line and a scrolling department marquee on the home page, rising crosses and a button shine in the call-to-action, a floating department initial on `departments.html`, and a slow zoom on the hero photo once one is added.
Scroll and pointer: every `h2` rises word by word, photos reveal and parallax-scroll, and cards tilt in 3D under a mouse pointer.
All loops pause while off-screen, and everything is skipped for visitors who prefer reduced motion. Tune speeds, counts and colours at the top of each function in `fx.js`; styling is at the end of `css/polish.css`.

## Images required
**Photos load automatically.** `js/images.js` looks in `assets/images/` for each file name in the table below and swaps it in for the matching placeholder panel. There is no code to edit: add a file with the exact name, refresh, and it appears. Anything missing keeps its illustrated placeholder, so you can add images one at a time, in any order.

- Accepted extensions: `.jpg`, `.webp`, `.png`, `.jpeg` (checked in that order). Use the base name from the table.
- Photos fill their panel with `object-fit: cover` and load lazily as you scroll. Descriptive `alt` text is added for doctors and team members from the site data.
- Where a photo sits behind text (family tiles, clinic carousel), a dark gradient is added automatically for readability.
- Optional images (age-group rows, `about-team`, `patient-1..3`) appear only if the file exists.
- `favicon.png` replaces the built-in icon, and `social-share.jpg` adds an `og:image` tag. Social crawlers do not run JavaScript, so for real link previews also add a static `<meta property="og:image" content="https://your-domain/assets/images/social-share.jpg">` to each page.
- If you rename a doctor, team member, resource or facility in `js/main.js`, keep the numbered file names (`doctor-1`, `resource-3`, ...) in the same order as the data arrays (`DOCS`, `TL`, `TN`, `RC`). Facility photos are matched by caption name, and department photos by department.

Export as WebP or JPG, under about 200 KB each. Use only licensed images or photos with written consent. The table lists each file, its size and where it appears (the placeholder class names are for reference only).

### Where to look and how to search
- **Free, commercially usable libraries:** Unsplash, Pexels, Pixabay. Check each photo's licence, and avoid recognisable brand logos or readable patient information in the frame.
- **Representation matters:** this is a clinic in Buea, Cameroon, so add words like `African`, `Black`, or `Cameroon` to most searches involving people. Many results otherwise skew to other regions.
- **Keep the look consistent:** pick one style (bright, natural light, warm teal/green tones to match the site) and stick with it. Searching `bright clinic natural light` or `soft light` helps.
- **Children:** use only licensed stock with model releases, or photos taken with written parental consent.
- **Search tips:** try 2 to 4 words, then add `portrait` or `vertical` for tall crops and `horizontal` or `wide` for wide ones. Add `candid` for a natural feel, or `smiling` for warmth.
- **Do not use** photos with visible patient records, real X-rays, or identifiable ill patients, and avoid anything that implies a real clinic, doctor or credential for this fictional demo.

| # | File name | Size (px) | Ratio | Used in | Placeholder | Search for |
|---|---|---|---|---|---|---|
| 1 | hero-family-care.jpg | 1200 x 1500 | 4:5 | `index.html` hero: doctor with a child and parent | `.hero .photo` SVG | `African doctor with child and mother`, `family doctor consultation smiling`, `pediatrician with parent and child` |
| 2 | welcome-clinic.jpg | 1200 x 900 | 4:3 | `index.html` welcome / `about.html` | welcome panel | `modern clinic reception bright`, `African medical team smiling`, `family clinic waiting room` |
| 3 | children-feature.jpg | 900 x 900 | 1:1 | `index.html` children's section | `.kids` SVG | `African child doctor checkup`, `pediatrician with young patient`, `happy child clinic` |
| 4-7 | family-children.jpg, family-adults.jpg, family-women.jpg, family-older-adults.jpg | 600 x 800 | 3:4 | `index.html` "One place. Care for the whole family." tiles | `.fam div` | `African children smiling portrait`, `African man adult portrait smiling`, `African woman portrait healthcare`, `elderly African couple portrait` |
| 8-12 | doctor-1.jpg ... doctor-5.jpg | 800 x 1000 | 4:5 | `doctors.html`, `doctor.html`, `index.html`, `children.html` | `.doc .pt`, `.pp` | `African doctor portrait white coat`, `Black female doctor portrait`, `African male physician stethoscope`, `African dentist portrait`, `African nutritionist portrait` (match to the profiles: family physician, pediatrician, women's health, dentist, wellness) |
| 13-14 | team-lead-1.jpg, team-lead-2.jpg | 1000 x 800 | 5:4 | `team.html`: medical leadership | `.tp` | `African medical director portrait`, `senior doctor team leader smiling`, `African pediatrician portrait` |
| 15-17 | team-nurse-1.jpg ... team-nurse-3.jpg | 400 x 400 | 1:1 | `team.html`: nursing and pediatric care | `.tc` | `African nurse portrait smiling`, `pediatric nurse with child`, `nurse headshot scrubs` |
| 18-24 | dept-general.jpg, dept-pediatrics.jpg, dept-womens-health.jpg, dept-dental.jpg, dept-laboratory.jpg, dept-preventive.jpg, dept-nutrition.jpg | 1200 x 900 | 4:3 | `departments.html` | `.dp` | General: `doctor patient consultation African`; Pediatrics: `pediatric consultation child`; Women's: `African woman doctor consultation`; Dental: `dental checkup clinic`, `dentist with patient`; Lab: `medical laboratory technician`, `lab test tubes microscope`; Preventive: `health screening blood pressure check`; Nutrition: `healthy African food vegetables`, `nutrition consultation` |
| 25-30 | facility-reception.jpg, facility-consultation.jpg, facility-pediatric.jpg, facility-waiting.jpg, facility-laboratory.jpg, facility-treatment.jpg | 700 x 900 | 7:9 | `index.html` "Inside the clinic" carousel | `.cs` | `clinic reception desk bright`, `empty consultation room modern`, `pediatric waiting area colourful`, `clinic waiting room chairs`, `medical laboratory interior`, `clinic treatment room empty`; empty rooms avoid consent issues |
| 31-38 | resource-1.jpg ... resource-8.jpg | 800 x 400 | 2:1 | `resources.html`, `index.html` teasers (featured one 1200 x 600) | `.rcp`, `.tp2` | 1 `patient writing notes doctor visit`; 2 `child wellness checkup`; 3 `preventive health checkup`; 4 `healthy lifestyle walking`, `family exercise outdoors`; 5 `women's health consultation`; 6 `health screening`, `blood pressure monitor`; 7 `family healthy meal`, `African vegetables cooking`; 8 `child vaccination`, `immunisation vaccine` |
| 39-43 | children-infants.jpg, children-toddlers.jpg, children-preschool.jpg, children-school-age.jpg, children-adolescents.jpg | 800 x 600 | 4:3 | `children.html` age-group rows (optional) | `.age` | `African baby checkup`, `toddler playing African`, `preschool children African classroom`, `African schoolchildren uniform`, `African teenagers portrait` |
| 44 | about-team.jpg | 1200 x 800 | 3:2 | `about.html` (optional) | add to About | `African healthcare team group photo`, `clinic staff smiling together` |
| 45-47 | patient-1.jpg ... patient-3.jpg | 200 x 200 | 1:1 | testimonials (optional, neutral portraits) | none yet | `African adult headshot smiling`, `African woman headshot`, `African parent portrait` |
| 48 | favicon.png | 512 x 512 | 1:1 | browser icon | add `<link rel="icon">` | not a photo: export the "+" logo mark from the site (teal circle, white cross) |
| 49 | social-share.jpg | 1200 x 630 | 1.91:1 | link preview (Open Graph) | add `<meta property="og:image">` | use the hero photo cropped wide, or `African doctor family wide` with the clinic name overlaid |

## Where to edit content
In `js/main.js`: `DOCS` (doctors), `DEPTS` (departments), `SV` (services), `FQ` (FAQ), `RC` (articles), `TL/TN/TB/TS` (team), `AP` (admin demo records), `QT` (testimonials).
"# vernyuy-clinic" 
