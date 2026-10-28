FIDA PARVIN — DATA SCIENCE PORTFOLIO TEMPLATE

FILES
- index.html: page structure, metadata, Google Fonts, Tailwind CSS v4 browser CDN, Lucide icons
- css/style.css: design tokens, layout, responsive styling, themes, animation and reduced-motion styles
- js/script.js: mobile menu, theme persistence, active navigation, reveal animation, project filters, scroll progress and footer year
- assets/: add your own profile/project images, icons, and resume here

RUN LOCALLY
1. Extract the portfolio folder.
2. Open index.html in a modern browser. For a more realistic local server, use VS Code's Live Server extension.
3. An internet connection is needed for Google Fonts, Tailwind's browser CDN and Lucide icons.
4. This is a no-build prototype using Tailwind CSS v4's browser CDN. For production, install Tailwind CSS v4 with the official CLI and compile a static CSS file instead of using the browser CDN.

PERSONALIZE BEFORE PUBLISHING
- Search index.html for "Fida Parvin", "your.email@example.com", "replace", "Add institution", and "STARTER SLOT".
- Replace the sample LinkedIn and GitHub URLs with your real profiles.
- Add your own projects and real source/demo URLs. The three current cards are project prompts, not claims of completed work.
- Update the course provider, dates, institution and education status accurately.
- Add a resume file to assets/resume.pdf only if you want to provide one, then add a link to it.
- Optional phone, WhatsApp, Instagram and location cards are intentionally omitted until you supply real details.
- The profile visual is a CSS/SVG illustration, so no profile image is required. If adding photos, use meaningful alt text and optimize them before publishing.

ACCESSIBILITY / QUALITY
- Responsive mobile navigation; click-outside and Escape close behavior
- Theme preference persists in localStorage, with dark theme as the default
- Project filters update cards without a reload
- IntersectionObserver section tracking and reveal animations
- Keyboard focus indicators, skip link, reduced-motion support and semantic landmarks
- No contact form
