# binurasalindra.github.io

Binura salindra portfolio website

## Local preview

This remains a static HTML/CSS/jQuery site, ready for GitHub Pages. No build step or production package installation is required.

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Open <http://127.0.0.1:4173>.

## Maintenance

- `index.html` contains the original portfolio content, semantic sections, navigation, article, and contact form.
- `css/style.css` contains the design tokens, component styles, responsive layouts, print styles, and reduced-motion support.
- `js/init.js` handles navigation state, the native article dialog, and the existing EmailJS integration.
- Motion enhancements use native IntersectionObserver and Web Animations: directional single-pass reveals, a finite portrait float/glow, a schematic node-and-path frame, a compact scroll cue, and bounded desktop pointer tilt/parallax. They stop for reduced motion, reveal focused controls immediately, and avoid idle JavaScript animation loops. Touch devices omit tilt/parallax. The portrait's ambient entrance settles within 4.8 seconds.
- `css/font/` contains self-hosted DM Sans and DM Serif Display, their OFL licenses, and a small subset of the existing social icon font.
- Responsive WebP variants sit alongside the original JPEG images. The originals remain as fallbacks.
- Legacy template libraries remain in the repository but are no longer loaded by the page. No new production JavaScript dependencies were added.

Keep portfolio wording and destination URLs unchanged unless a content update is explicitly requested. The article is available inline without JavaScript; with JavaScript it opens in a keyboard-accessible dialog. The mobile navigation also has a no-JavaScript fallback. EmailJS and the map still need network access.

## Regression checks

The browser tests use Playwright and axe as development-only tools. To avoid adding a package/build system to the static site, install them into a temporary directory. With the preview server running, open a second PowerShell terminal:

```powershell
$qaDir = Join-Path $env:TEMP 'binura-portfolio-qa'
npm install --prefix $qaDir playwright @axe-core/playwright
$env:PORTFOLIO_QA_HOME = $qaDir
node tests/portfolio.cjs
node tests/motion.cjs
```

The default browser is installed Microsoft Edge. Set `PORTFOLIO_BROWSER_CHANNEL=chrome` to use installed Chrome, or set `PORTFOLIO_URL` to test another local preview address. Screenshots and test results are written to a temporary directory printed by the runner.

Checks cover nine viewport widths (320–1920px), keyboard/mobile navigation, browser history, article content and focus behavior, CV download, reduced motion, no-JavaScript browsing, JavaScript errors, failed local assets, and axe WCAG A/AA scans. Contact requests are mocked, including success, failure, validation, unavailable SDK, and duplicate submissions; tests never send live email.

JavaScript syntax can also be checked without additional tools:

```powershell
node --check js/init.js
node --check tests/portfolio.cjs
git diff --check
```

The redesign was additionally checked in Firefox and WebKit. The latest local Lighthouse mobile audit scored **93 Performance / 100 Accessibility / 100 Best Practices / 100 SEO**, with zero cumulative layout shift. These are local lab measurements, not production guarantees. A source comparison verified that all 194 original text entries and every existing destination link were preserved; text comparisons normalize formatting whitespace only.
