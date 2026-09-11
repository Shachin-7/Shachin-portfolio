const fs = require("fs");
const path = require("path");

const htmlPath = path.join(__dirname, "../public/landing-pages/inner-green-3d.html");
let html = fs.readFileSync(htmlPath, "utf8");

// 1. Add photo styling and hide dock-wrap in CSS
const cssAnchor = "/* ── play button (z 4) ─────────────────────────────────────────────── */";
const newCss = `/* ── dock hide for clean hero integration ───────────────────────────── */
  .dock-wrap{ display: none !important; }

  /* ── photo avatar in place of play button (z 4) ───────────────────── */
  .play-wrap{
    position:absolute; z-index:4; pointer-events:none;
    left:calc(172 * var(--u)); top:calc(410 * var(--u));
    width:calc(216 * var(--u)); height:calc(216 * var(--u));
  }
  .play-wrap > *{ pointer-events:auto; }
  .photo-frame {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    overflow: hidden;
    background: #111512;
    border: calc(3.5 * var(--u)) solid rgba(255, 255, 255, 0.92);
    box-shadow: 
      0 calc(12 * var(--u)) calc(36 * var(--u)) rgba(0, 0, 0, 0.75),
      0 0 calc(24 * var(--u)) rgba(194, 248, 79, 0.25);
    pointer-events: auto;
    transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease), border-color 0.4s var(--ease);
  }
  .photo-frame:hover {
    transform: scale(1.06);
    border-color: #ffffff;
    box-shadow: 
      0 calc(18 * var(--u)) calc(50 * var(--u)) rgba(0, 0, 0, 0.9),
      0 0 calc(32 * var(--u)) rgba(194, 248, 79, 0.45);
  }
  .photo-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
    display: block;
  }
`;

if (!html.includes(".photo-frame")) {
  html = html.replace(cssAnchor, newCss + "\n  " + cssAnchor);
}

// 2. Replace play button with photo in HTML
const oldPlayWrapRegex = /<span class="play-wrap" style="--pd:20">[\s\S]*?<\/span>\s*<\/span>\s*<\/span>\s*<span class="play-ring mask-circle" style="--d:840ms" aria-hidden="true"><\/span>\s*<\/span>/;
const newPlayWrap = `<span class="play-wrap" style="--pd:20">
      <span class="photo-frame mask-circle" style="--d:900ms">
        <img src="/images/Sha_passport.jpg" alt="Shachin VP" class="photo-img" />
      </span>
      <span class="play-ring mask-circle" style="--d:840ms" aria-hidden="true"></span>
    </span>`;

html = html.replace(oldPlayWrapRegex, newPlayWrap);

// 3. Replace "Explore the work" button with "My Resume"
const oldExploreRegex = /<button class="liquid-button liquid-button--explore btn" type="button" onclick="[\s\S]*?<\/button>/;
const newResumeBtn = `<a class="liquid-button liquid-button--explore btn" href="https://drive.google.com/file/d/1u89mWJA3SIVcM_bGSncmhk87Xsph-m3V/view?usp=sharing" target="_blank" rel="noopener noreferrer" aria-label="Download Resume" style="text-decoration:none;">
            <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            <span class="lbl">My Resume</span>
          </a>`;

html = html.replace(oldExploreRegex, newResumeBtn);

// 4. Update ghost text
html = html.replace(
  '<div class="ghost fade" style="--d:1150ms" aria-hidden="true">PROJECTS</div>',
  '<div class="ghost fade" style="--d:1150ms" aria-hidden="true">SHACHIN</div>'
);

// 5. Update Card 1: Our Ethos
html = html.replace(
  '<p class="label">Core Focus</p>\n      <h2>Deep Learning &amp; AI.</h2>',
  '<p class="label">AI Philosophy</p>\n      <h2>Model with intent.<br>Build for scale.</h2>'
);
html = html.replace(
  '<p class="label">Our Ethos</p>\n      <h2>Let the wild lead.</h2>',
  '<p class="label">AI Philosophy</p>\n      <h2>Model with intent.<br>Build for scale.</h2>'
);

// 6. Update Headline
const oldHeadlineRegex = /<h1 class="headline" style="--pd:18; --pr:1\.2">[\s\S]*?<\/h1>/;
const newHeadline = `<h1 class="headline" style="--pd:18; --pr:1.2">
      <span><i style="--d:260ms">An aspiring</i></span>
      <span><i style="--d:360ms">AI Engineer &amp; ML Dev</i></span>
    </h1>`;
html = html.replace(oldHeadlineRegex, newHeadline);

// 7. Update Lede
const oldLedeRegex = /<p class="lede mask" style="--d:480ms; --pd:14; --pr:1">[\s\S]*?<\/p>/;
const newLede = `<p class="lede mask" style="--d:480ms; --pd:14; --pr:1">I build intelligent systems that transform complex data into scalable, real-world AI solutions — specializing in end-to-end ML pipelines, deep learning architectures, and API-based deployments.</p>`;
html = html.replace(oldLedeRegex, newLede);

// 8. Update Stats
html = html.replace(
  '<div><dt>ML Pipelines</dt><dd>15+ Shipped</dd></div>',
  '<div><dt>Hackathons</dt><dd>5x Champion</dd></div>'
);
html = html.replace(
  '<div><dt>Benchmark Accuracy</dt><dd>98.6% Avg</dd></div>',
  '<div><dt>Benchmark Acc</dt><dd>98.6% Avg</dd></div>'
);

fs.writeFileSync(htmlPath, html, "utf8");
console.log("Updated public/landing-pages/inner-green-3d.html successfully!");
