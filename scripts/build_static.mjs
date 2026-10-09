import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SITE_CONFIG, CATEGORIES, AUTHORS, ARTICLES } from '../js/data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const ADSENSE_TAG = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2869103987354107" crossorigin="anonymous"></script>`;

const ADSTERRA_BANNER_HTML = `
  <!-- Adsterra Native Banner Ad Unit (ID: 31640542) -->
  <div class="adsterra-ad-container" style="margin: 2.5rem auto; text-align: center; max-width: 100%; overflow: hidden;">
    <script async="async" data-cfasync="false" src="https://bauval.org/21/f96b4ce25e9b165a5b69df91e673c151"></script>
    <div id="container-f96b4ce25e9b165a5b69df91e673c151"></div>
  </div>
`;

const ADSTERRA_300X250_TAG = `
  <!-- Adsterra 300x250 Medium Rectangle Ad Unit (ID: 31641467) -->
  <div class="adsterra-rectangle-ad" style="margin: 2.5rem auto; text-align: center; display: flex; justify-content: center; min-height: 250px; overflow: hidden;">
    <script type="text/javascript">
      atOptions = {
        'key' : 'd81f6aea9dee9ba13cc5c6190268f2ef',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    </script>
    <script type="text/javascript" src="https://bauval.org/22/d81f6aea9dee9ba13cc5c6190268f2ef"></script>
  </div>
`;

function injectMidArticleAd(content) {
  if (!content) return '';
  const h2Matches = [...content.matchAll(/<h2[^>]*>/gi)];
  if (h2Matches.length >= 2) {
    const secondH2Index = h2Matches[1].index;
    return content.slice(0, secondH2Index) + ADSTERRA_300X250_TAG + '\n' + content.slice(secondH2Index);
  }
  const pMatches = [...content.matchAll(/<\/p>/gi)];
  if (pMatches.length >= 3) {
    const thirdPEnd = pMatches[2].index + 4;
    return content.slice(0, thirdPEnd) + '\n' + ADSTERRA_300X250_TAG + '\n' + content.slice(thirdPEnd);
  }
  return content + '\n' + ADSTERRA_300X250_TAG;
}

const COOKIE_BANNER_HTML = `
  <!-- Cookie Consent Banner -->
  <div id="cookie-consent-banner" style="display: none; position: fixed; bottom: 1.5rem; left: 1.5rem; right: 1.5rem; max-width: 600px; margin: 0 auto; background: var(--bg-surface); border: 1px solid var(--accent-gold); border-radius: var(--radius-md); box-shadow: var(--shadow-lg); padding: 1.25rem 1.5rem; z-index: 99999; backdrop-filter: blur(12px);">
    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
        <span style="font-family: var(--font-serif-header); font-weight: 700; font-size: 1rem; color: var(--text-primary);">Cookie & Privacy Preferences</span>
        <span style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--accent-gold); font-weight: 600;">GDPR & AdSense Compliant</span>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin: 0;">
        BacklinkBlend uses cookies and third-party advertising partners (such as Google AdSense) to deliver personalized content, measure engagement, and maintain site security. Review our <a href="/privacy" style="color: var(--accent-gold); text-decoration: underline;">Privacy Policy</a>.
      </p>
      <div style="display: flex; gap: 0.75rem; justify-content: flex-end; flex-wrap: wrap;">
        <button id="cookie-essential-btn" style="background: transparent; border: 1px solid var(--border-strong); color: var(--text-secondary); padding: 0.45rem 0.9rem; border-radius: var(--radius-sm); font-size: 0.82rem; font-weight: 600; cursor: pointer;">Essential Only</button>
        <button id="cookie-accept-btn" style="background: var(--accent-gold); border: none; color: #FFFFFF; padding: 0.45rem 1.1rem; border-radius: var(--radius-sm); font-size: 0.82rem; font-weight: 700; cursor: pointer;">Accept All Cookies</button>
      </div>
    </div>
  </div>
  <script>
    (function() {
      try {
        var consent = localStorage.getItem('bb_cookie_consent');
        var banner = document.getElementById('cookie-consent-banner');
        if (!consent && banner) {
          banner.style.display = 'block';
        }
        var acceptBtn = document.getElementById('cookie-accept-btn');
        var essentialBtn = document.getElementById('cookie-essential-btn');
        if (acceptBtn) {
          acceptBtn.addEventListener('click', function() {
            localStorage.setItem('bb_cookie_consent', 'accepted');
            if (banner) banner.style.display = 'none';
          });
        }
        if (essentialBtn) {
          essentialBtn.addEventListener('click', function() {
            localStorage.setItem('bb_cookie_consent', 'essential');
            if (banner) banner.style.display = 'none';
          });
        }
      } catch(e) {}
    })();
  </script>
`;


const SEARCH_MODAL_HTML = `
  <!-- Live Search Modal Overlay -->
  <div class="modal-overlay" id="search-overlay">
    <div class="search-modal">
      <div class="search-modal-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" id="modal-search-input" aria-label="Search query input" placeholder="Search articles, topics, authors, or tags..." autocomplete="off" />
        <button id="close-search-btn" class="icon-btn" aria-label="Close search overlay window" style="border: none; width: 32px; height: 32px;">✕</button>
      </div>
      <div class="search-results-list" id="search-results-list">
        <p style="padding: 1rem; color: var(--text-muted); font-size: 0.9rem;">Start typing to search articles, categories, and tags...</p>
      </div>
    </div>
  </div>
`;

function normalizeImgPath(img) {
  if (!img) return '/assets/images/hero_tech_ai_1786192193469.jpg';
  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  if (img.startsWith('/')) return img;
  return '/' + img;
}

function getPageFooterHtml() {
  return getBaseFooter() + SEARCH_MODAL_HTML + COOKIE_BANNER_HTML + `<script src="/js/bundle.js?v=86.0.0"></script></body></html>`;
}

function getBaseHeader(activeNav = '') {
  return `
  <!-- Top Reading Progress Line -->
  <div id="reading-progress"></div>

  <!-- Intelligence Ticker Bar -->
  <div class="intelligence-ticker">
    <div class="ticker-content">
      <span class="ticker-item"><span class="ticker-badge">EDITORIAL</span> Best Books for Critical Thinking (2026)</span>
      <span class="ticker-item"><span class="ticker-badge">AGENTS</span> Enterprise AI Agents: Autonomous Multi-Agent Architecture</span>
      <span class="ticker-item"><span class="ticker-badge">SECURITY</span> Enterprise AI Security: Threat Models & Governance</span>
      <span class="ticker-item"><span class="ticker-badge">AI CODE</span> Blackbox AI: Features, Code Generator & Pricing Guide</span>
      <span class="ticker-item"><span class="ticker-badge">AI VIDEO</span> Viggle AI: Motion Transfer & Prompting Guide</span>
      <span class="ticker-item"><span class="ticker-badge">DEEP LEARNING</span> AI Hallucination: Causes, Detection & Prevention</span>
    </div>
  </div>

  <header class="site-header">
    <div class="header-inner">
      <a href="/" onclick="event.preventDefault(); if(window.app) window.app.navigateTo('home');" class="brand-container">
        <div class="brand-emblem" title="BacklinkBlend">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
        </div>
        <div class="brand-text-wrap">
          <div class="brand-logo">BACKLINK<span class="highlight">BLEND</span></div>
          <div class="brand-tagline">Link Building & AI Authority</div>
        </div>
      </a>

      <nav>
        <ul class="desktop-nav">
          <li><a href="/" onclick="event.preventDefault(); if(window.app) window.app.navigateTo('home');" class="nav-link ${activeNav === 'home' ? 'active' : ''}">Home</a></li>
          <li><a href="/category/link-building" onclick="event.preventDefault(); if(window.app) window.app.navigateTo('category/link-building');" class="nav-link ${activeNav === 'link-building' ? 'active' : ''}">Link Building</a></li>
          <li><a href="/category/ai-automation" onclick="event.preventDefault(); if(window.app) window.app.navigateTo('category/ai-automation');" class="nav-link ${activeNav === 'ai-automation' ? 'active' : ''}">AI & Automation</a></li>
          <li><a href="/category/seo-tools" onclick="event.preventDefault(); if(window.app) window.app.navigateTo('category/seo-tools');" class="nav-link ${activeNav === 'seo-tools' ? 'active' : ''}">SEO Tools</a></li>
          <li><a href="/category/digital-authority" onclick="event.preventDefault(); if(window.app) window.app.navigateTo('category/digital-authority');" class="nav-link ${activeNav === 'digital-authority' ? 'active' : ''}">Digital Authority</a></li>
          <li><a href="/articles" onclick="event.preventDefault(); if(window.app) window.app.navigateTo('articles');" class="nav-link ${activeNav === 'articles' ? 'active' : ''}">All Articles</a></li>
        </ul>
      </nav>

      <div class="header-actions">
        <button class="search-pill-btn" id="search-trigger-btn" aria-label="Search articles across publication" title="Search BacklinkBlend (Ctrl+K)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <span>Search</span>
          <span class="search-shortcut-badge">⌘K</span>
        </button>

        <button class="icon-btn" id="theme-toggle-btn" aria-label="Toggle visual theme" title="Toggle Theme">
          <!-- Populated by JS -->
        </button>

        <button class="icon-btn mobile-menu-toggle" id="mobile-menu-toggle-btn" aria-label="Open mobile navigation menu" title="Open Menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </div>
    </div>

    <!-- Mobile Navigation Drawer Dropdown -->
    <nav class="mobile-nav-drawer" id="mobile-nav-drawer">
      <a href="/" onclick="event.preventDefault(); if(window.app) window.app.navigateTo('home');" class="mobile-nav-link ${activeNav === 'home' ? 'active' : ''}">Home</a>
      <a href="/category/link-building" onclick="event.preventDefault(); if(window.app) window.app.navigateTo('category/link-building');" class="mobile-nav-link ${activeNav === 'link-building' ? 'active' : ''}">Link Building</a>
      <a href="/category/ai-automation" onclick="event.preventDefault(); if(window.app) window.app.navigateTo('category/ai-automation');" class="mobile-nav-link ${activeNav === 'ai-automation' ? 'active' : ''}">AI & Automation</a>
      <a href="/category/seo-tools" onclick="event.preventDefault(); if(window.app) window.app.navigateTo('category/seo-tools');" class="mobile-nav-link ${activeNav === 'seo-tools' ? 'active' : ''}">SEO & Backlink Tools</a>
      <a href="/category/digital-authority" onclick="event.preventDefault(); if(window.app) window.app.navigateTo('category/digital-authority');" class="mobile-nav-link ${activeNav === 'digital-authority' ? 'active' : ''}">Digital Authority</a>
      <a href="/articles" onclick="event.preventDefault(); if(window.app) window.app.navigateTo('articles');" class="mobile-nav-link ${activeNav === 'articles' ? 'active' : ''}">All Articles</a>
      <div style="height: 1px; background: var(--border-light); margin: 0.5rem 0;"></div>
      <a href="/about" onclick="event.preventDefault(); if(window.app) window.app.navigateTo('about');" class="mobile-nav-link ${activeNav === 'about' ? 'active' : ''}">About Us</a>
      <a href="/contact" onclick="event.preventDefault(); if(window.app) window.app.navigateTo('contact');" class="mobile-nav-link ${activeNav === 'contact' ? 'active' : ''}">Contact Us</a>
    </nav>
  </header>
  `;
}

function getBaseFooter() {
  return `
  <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-brand">
        <div class="footer-logo">
          BACKLINK<span style="color: var(--accent-gold); font-style: italic;">BLEND</span>
        </div>
        <p class="footer-desc">BacklinkBlend is an independent digital publication delivering authoritative analysis across Link Building, AI & Automation, SEO Tools, and Digital Search Authority.</p>
        <div class="footer-status-pill">
          <span class="pulse-dot" style="width: 8px; height: 8px;"></span>
          <span>Global Research Active • Hyderabad, Pakistan</span>
        </div>
      </div>

      <div>
        <h4 class="footer-column-title">Editorial Pillars</h4>
        <ul class="footer-links">
          <li><a href="/category/link-building" class="footer-link">Link Building</a></li>
          <li><a href="/category/ai-automation" class="footer-link">AI & Automation</a></li>
          <li><a href="/category/seo-tools" class="footer-link">SEO & Backlink Tools</a></li>
          <li><a href="/category/digital-authority" class="footer-link">Digital Authority</a></li>
        </ul>
      </div>

      <div>
        <h4 class="footer-column-title">Publication</h4>
        <ul class="footer-links">
          <li><a href="/about" class="footer-link">About Us</a></li>
          <li><a href="/contact" class="footer-link">Contact Us</a></li>
          <li><a href="/articles" class="footer-link">All Articles</a></li>
        </ul>
      </div>

      <div>
        <h4 class="footer-column-title">Legal & Trust</h4>
        <ul class="footer-links">
          <li><a href="/privacy" class="footer-link">Privacy Policy</a></li>
          <li><a href="/terms" class="footer-link">Terms & Conditions</a></li>
          <li><a href="/disclaimer" class="footer-link">Editorial Disclaimer</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <div>© 2026 BacklinkBlend. All Rights Reserved. • Hyderabad, Sindh 71500, Pakistan</div>
      <div>Curated Perspective. Unfiltered Depth.</div>
    </div>
  </footer>
  `;
}

function getHead(title, description, canonicalUrl, ogImage = 'https://backlinkblend.com/assets/images/hero_tech_ai_1786192193469.jpg', jsonLd = null) {
  const resolvedOgImage = ogImage.startsWith('http') ? ogImage : 'https://backlinkblend.com/' + ogImage.replace(/^\/+/, '');
  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <base href="/">
  <title>${title}</title>
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonicalUrl}">

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="${resolvedOgImage}">
  <meta property="og:site_name" content="BacklinkBlend">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@BacklinkBlend">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${resolvedOgImage}">

  <!-- Google AdSense Verification & Auto Ads -->
  ${ADSENSE_TAG}

  <!-- Favicons -->
  <link rel="icon" type="image/svg+xml" href="/assets/images/favicon.svg">
  <link rel="icon" type="image/jpeg" href="/assets/images/favicon.jpg">
  <link rel="shortcut icon" href="/favicon.ico">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400;600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">

  <!-- Stylesheet -->
  <link rel="stylesheet" href="/css/styles.css?v=12.0.0">

  ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
</head>
<body data-theme="light">
`;
}

// 1. GENERATE PRIVACY POLICY
function generatePrivacyPage() {
  const title = "Privacy Policy — BacklinkBlend";
  const desc = "Comprehensive Privacy Policy detailing data collection, cookies, Google Analytics, Google AdSense DoubleClick DART cookies, and GDPR compliance.";
  const canonical = "https://backlinkblend.com/privacy";

  const content = `
    <div class="article-reader-container" style="max-width: 900px; margin: 3rem auto; padding: 0 1.5rem;">
      <span class="badge" style="margin-bottom: 1.25rem;">LEGAL & TRUST</span>
      <h1 class="font-serif" style="font-size: 2.75rem; font-weight: 800; color: var(--text-primary); margin-bottom: 1.5rem;">Privacy Policy</h1>
      
      <div class="article-body" style="font-size: 1.05rem; line-height: 1.7; color: var(--text-secondary);">
        <p><em>Effective Date: August 10, 2026 • Last Updated: October 5, 2026</em></p>

        <p>At <strong>BacklinkBlend</strong> (accessible from <code>https://backlinkblend.com</code>), safeguarding the privacy of our readers and site visitors is our utmost commitment. This Privacy Policy outlines the types of information collected, stored, and processed by BacklinkBlend and details your privacy rights in compliance with global standards, including the General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA), and Google AdSense Publisher Policies.</p>

        <h2>1. Information We Collect</h2>
        <p>BacklinkBlend collects both personal and non-personal technical information strictly to provide a secure and optimized reading experience:</p>
        <ul>
          <li><strong>Personal Data Provided Voluntarily:</strong> When you contact us via our Contact Us page or submit an email to <code>backlinkblend@gmail.com</code>, we receive your name, email address, and the content of your message.</li>
          <li><strong>Log Files & Technical Analytics:</strong> Standard server log files capture technical data including IP addresses, browser types, Internet Service Providers (ISP), referring/exit pages, operating system timestamps, and click counts. This data is non-personally identifiable and used exclusively for analytical health monitoring and system security.</li>
        </ul>

        <h2>2. Third-Party Services & Google Analytics</h2>
        <p>We utilize trusted third-party services to analyze audience metrics and maintain site infrastructure:</p>
        <ul>
          <li><strong>Google Analytics:</strong> We use Google Analytics to collect aggregated, anonymous data regarding reader engagement, popular categories, and traffic sources. Google Analytics uses cookies to generate statistical reports. To learn more about Google Analytics privacy practices or to opt out, visit <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style="color: var(--accent-gold); text-decoration: underline;">Google Analytics Opt-out Browser Add-on</a>.</li>
          <li><strong>Search Engine Verification:</strong> Tools such as Google Search Console evaluate indexing efficiency without harvesting individual user data.</li>
        </ul>

        <h2>3. Google AdSense & Third-Party Advertising Cookies</h2>
        <p>BacklinkBlend utilizes Google AdSense and accredited third-party advertising partners to deliver relevant advertisements when you visit our publication. Please review our advertising and cookie policies:</p>
        <ul>
          <li><strong>Google DoubleClick DART Cookies:</strong> Google, as a third-party vendor, uses cookies to serve ads on BacklinkBlend. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visits to BacklinkBlend and/or other websites across the Internet.</li>
          <li><strong>Personalized Advertising Opt-Out:</strong> Users may opt out of personalized advertising by visiting <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" style="color: var(--accent-gold); text-decoration: underline;">Google Advertising Privacy & Terms</a> or managing preferences via <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style="color: var(--accent-gold); text-decoration: underline;">Google Ads Settings</a>. Additionally, you may opt out of third-party vendor cookies for personalized advertising through <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style="color: var(--accent-gold); text-decoration: underline;">www.aboutads.info</a> and the <a href="https://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer" style="color: var(--accent-gold); text-decoration: underline;">Network Advertising Initiative</a>.</li>
          <li><strong>Third-Party Ad Networks:</strong> Third-party ad servers or ad networks utilize technologies such as cookies, JavaScript, or Web Beacons in their advertisements and links appearing on BacklinkBlend. These ad networks automatically receive your IP address to measure campaign efficacy and personalize advertising content. BacklinkBlend has no access to or control over these cookies used by third-party advertisers.</li>
        </ul>

        <h2>4. Cookies & Browser Storage</h2>
        <p>Cookies are small data files stored on your device. BacklinkBlend uses essential cookies and browser local storage (e.g. <code>localStorage</code>) to maintain interface preferences, such as your selected Light or Dark visual theme.</p>
        <p>You can choose to disable cookies through your individual browser settings. However, disabling essential cookies may impact certain interactive features on our site.</p>

        <h2>5. GDPR & CCPA Data Protection Rights</h2>
        <p>We ensure all readers can fully exercise their statutory data protection rights:</p>
        <ul>
          <li><strong>Right to Access & Rectification:</strong> You have the right to request copies of your personal data or request corrections to inaccurate information.</li>
          <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> You have the right to request the deletion of your personal data from our contact databases.</li>
          <li><strong>Right to Object & Restrict Processing:</strong> You have the right to object to or restrict the processing of your personal data under legitimate grounds.</li>
        </ul>
        <p>If you wish to exercise any of these rights, please email our Data Privacy Officer at <code>backlinkblend@gmail.com</code> or write to our editorial bureau at <strong>Hyderabad, Sindh 71500, Pakistan</strong>. We respond to all formal requests within 30 business days.</p>

        <h2>6. Children's Information</h2>
        <p>BacklinkBlend does not knowingly collect personal identifiable information from children under the age of 13. If you believe your child has provided such information on our website, please contact us immediately for prompt removal.</p>

        <h2>7. Updates to This Privacy Policy</h2>
        <p>We reserve the right to update this Privacy Policy periodically. Any modifications will be posted on this page with an updated effective date.</p>
      </div>
    </div>
  `;

  const html = getHead(title, desc, canonical) + getBaseHeader() + `<main id="app-content">${content}</main>` + getPageFooterHtml();
  const dir = path.join(rootDir, 'privacy');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  console.log("Generated /privacy/index.html");
}

// 2. GENERATE ABOUT US
function generateAboutPage() {
  const title = "About Us — BacklinkBlend Editorial Mission & Standards";
  const desc = "Learn about BacklinkBlend, our independent editorial mission, resident analysts, peer-review standards, and international reporting bureau.";
  const canonical = "https://backlinkblend.com/about";

  const authorsHtml = Object.values(AUTHORS).map(auth => `
    <div style="background: var(--bg-surface); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 2rem; display: flex; gap: 1.5rem; align-items: flex-start;">
      <img src="${auth.avatar}" alt="${auth.name}" style="width: 80px; height: 80px; border-radius: var(--radius-full); object-fit: cover;" />
      <div>
        <h3 style="font-family: var(--font-serif-header); font-size: 1.35rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.25rem 0;">${auth.name}</h3>
        <div style="font-size: 0.82rem; font-family: var(--font-mono); color: var(--accent-gold); font-weight: 600; margin-bottom: 0.5rem;">${auth.role}</div>
        <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6; margin: 0;">${auth.bio}</p>
      </div>
    </div>
  `).join('');

  const content = `
    <div class="article-reader-container" style="max-width: 900px; margin: 3rem auto; padding: 0 1.5rem;">
      <span class="badge" style="margin-bottom: 1.25rem;">EDITORIAL MISSION</span>
      <h1 class="font-serif" style="font-size: 2.75rem; font-weight: 800; color: var(--text-primary); margin-bottom: 1rem;">About BacklinkBlend</h1>
      <p style="font-size: 1.15rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 2.5rem;">Delivering rigorous, unfiltered technical masterclasses, macroeconomic research, and executive blueprints across frontier technology and global enterprise.</p>

      <div class="article-body" style="font-size: 1.05rem; line-height: 1.7; color: var(--text-secondary);">
        <h2>Our Independent Editorial Manifesto</h2>
        <p>Founded as an independent international digital publication, <strong>BacklinkBlend</strong> bridges the gap between frontier artificial intelligence engineering, executive corporate strategy, macroeconomic capital liquidity, and modern digital culture. We reject superficial listicles and unverified algorithmic summaries in favor of empirically grounded research masterclasses.</p>

        <p>Every analysis published on BacklinkBlend is authored or peer-reviewed by domain specialists with extensive backgrounds in software engineering, quantitative finance, and digital marketing. We adhere to uncompromising journalistic integrity: our evaluations remain strictly independent of vendor sponsorships, paid backlink schemes, or external commercial pressure.</p>

        <h2>Our Core Editorial Pillars</h2>
        <ul>
          <li><strong>Link Building:</strong> Advanced backlink acquisition methodologies, tiered digital PR, guest editorial outreach, and high-DA link strategies.</li>
          <li><strong>AI & Automation:</strong> Cutting-edge artificial intelligence models, autonomous agents, prompt architecture, and search automation tools.</li>
          <li><strong>SEO & Backlink Tools:</strong> Comprehensive audits and benchmarks of leading SEO platforms, backlink checkers, crawlers, and outreach software.</li>
          <li><strong>Digital Authority:</strong> Google algorithm analysis, Generative Engine Optimization (GEO), search penalty recovery, and organic brand authority.</li>
        </ul>

        <h2 style="margin-top: 3rem;">Resident Editorial Leadership</h2>
        <div style="display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1.5rem;">
          ${authorsHtml}
        </div>

        <h2 style="margin-top: 3rem;">Global Publishing Bureau</h2>
        <p>BacklinkBlend operates out of <strong>Hyderabad, Sindh 71500, Pakistan</strong>, collaborating with international contributors and technology correspondents globally. For editorial pitches, corrections, or press correspondence, please contact our editorial desk at <a href="mailto:backlinkblend@gmail.com" style="color: var(--accent-gold); text-decoration: underline;">backlinkblend@gmail.com</a>.</p>
      </div>
    </div>
  `;

  const html = getHead(title, desc, canonical) + getBaseHeader() + `<main id="app-content">${content}</main>` + getPageFooterHtml();
  const dir = path.join(rootDir, 'about');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  console.log("Generated /about/index.html");
}

// 3. GENERATE CONTACT US
function generateContactPage() {
  const title = "Contact Us — Editorial Desk & Inquiries";
  const desc = "Get in touch with BacklinkBlend. Submit editorial tips, research briefings, or contact our team.";
  const canonical = "https://backlinkblend.com/contact";

  const content = `
    <div class="article-reader-container" style="max-width: 900px; margin: 3rem auto; padding: 0 1.5rem;">
      <span class="badge" style="margin-bottom: 1.25rem;">EDITORIAL DESK</span>
      <h1 class="font-serif" style="font-size: 2.75rem; font-weight: 800; color: var(--text-primary); margin-bottom: 1rem;">Contact Us</h1>
      <p style="font-size: 1.15rem; color: var(--text-secondary); margin-bottom: 2.5rem;">Have a story tip, press release, research inquiry, or editorial question? Send a message to our global newsroom desk.</p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 3rem;">
        <div style="background: var(--bg-surface); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 2rem;">
          <h2 class="font-serif" style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1.25rem; color: var(--text-primary);">Send Us a Message</h2>
          <form action="https://formsubmit.co/backlinkblend@gmail.com" method="POST" style="display: flex; flex-direction: column; gap: 1.25rem;">
            <input type="hidden" name="_subject" value="New Inquiry from BacklinkBlend Editorial Form" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_captcha" value="false" />
            <div>
              <label style="font-size: 0.8rem; font-family: var(--font-mono); color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">FULL NAME</label>
              <input type="text" name="name" required placeholder="Enter your full name" style="width: 100%; border: 1px solid var(--border-strong); background: var(--bg-primary); color: var(--text-primary); padding: 0.85rem 1rem; border-radius: var(--radius-sm);" />
            </div>
            <div>
              <label style="font-size: 0.8rem; font-family: var(--font-mono); color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">EMAIL ADDRESS</label>
              <input type="email" name="email" required placeholder="name@domain.com" style="width: 100%; border: 1px solid var(--border-strong); background: var(--bg-primary); color: var(--text-primary); padding: 0.85rem 1rem; border-radius: var(--radius-sm);" />
            </div>
            <div>
              <label style="font-size: 0.8rem; font-family: var(--font-mono); color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">SUBJECT</label>
              <input type="text" name="subject" required placeholder="Brief subject" style="width: 100%; border: 1px solid var(--border-strong); background: var(--bg-primary); color: var(--text-primary); padding: 0.85rem 1rem; border-radius: var(--radius-sm);" />
            </div>
            <div>
              <label style="font-size: 0.8rem; font-family: var(--font-mono); color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">MESSAGE</label>
              <textarea rows="5" name="message" required placeholder="Write your message here..." style="width: 100%; border: 1px solid var(--border-strong); background: var(--bg-primary); color: var(--text-primary); border-radius: var(--radius-sm); padding: 1rem;"></textarea>
            </div>
            <button type="submit" class="btn-primary" style="margin-top: 0.5rem; justify-content: center; padding: 1rem; background: var(--accent-gold); color: #FFF; border: none; border-radius: var(--radius-sm); font-weight: 700; cursor: pointer;">Transmit Inquiry →</button>
          </form>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div style="background: var(--bg-surface); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 2rem;">
            <h3 style="font-family: var(--font-serif-header); font-size: 1.3rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--text-primary);">Direct Communication</h3>
            <p style="font-size: 0.92rem; color: var(--text-secondary); margin-bottom: 1.25rem;">For formal inquiries, press briefs, or direct correspondence:</p>
            <div style="font-family: var(--font-mono); font-size: 0.95rem; color: var(--accent-gold); font-weight: 600; margin-bottom: 0.5rem;">
              ✉️ Email: <a href="mailto:backlinkblend@gmail.com" style="color: var(--accent-gold); text-decoration: underline;">backlinkblend@gmail.com</a>
            </div>
          </div>

          <div style="background: var(--bg-surface); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 2rem;">
            <h3 style="font-family: var(--font-serif-header); font-size: 1.3rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--text-primary);">Editorial Headquarters</h3>
            <div style="font-family: var(--font-mono); font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">
              📍 <strong>Location:</strong> Hyderabad, Sindh 71500, Pakistan<br />
              🌐 <strong>Website:</strong> <a href="https://backlinkblend.com" style="color: var(--text-primary);">https://backlinkblend.com</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const html = getHead(title, desc, canonical) + getBaseHeader() + `<main id="app-content">${content}</main>` + getPageFooterHtml();
  const dir = path.join(rootDir, 'contact');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  console.log("Generated /contact/index.html");
}

// 4. GENERATE TERMS & CONDITIONS
function generateTermsPage() {
  const title = "Terms & Conditions — BacklinkBlend";
  const desc = "Standard Terms and Conditions governing user access, intellectual property, disclaimers, and limitation of liability on BacklinkBlend.";
  const canonical = "https://backlinkblend.com/terms";

  const content = `
    <div class="article-reader-container" style="max-width: 900px; margin: 3rem auto; padding: 0 1.5rem;">
      <span class="badge" style="margin-bottom: 1.25rem;">LEGAL & TRUST</span>
      <h1 class="font-serif" style="font-size: 2.75rem; font-weight: 800; color: var(--text-primary); margin-bottom: 1.5rem;">Terms & Conditions</h1>
      
      <div class="article-body" style="font-size: 1.05rem; line-height: 1.7; color: var(--text-secondary);">
        <p><em>Effective Date: August 10, 2026</em></p>
        <p>Welcome to <strong>BacklinkBlend</strong> (<code>https://backlinkblend.com</code>). By accessing or browsing our digital publication, you agree to comply with and be bound by the following Terms and Conditions.</p>

        <h2>1. Intellectual Property Rights</h2>
        <p>All content published on BacklinkBlend—including research articles, technical guides, charts, logos, graphics, and software code—is the intellectual property of BacklinkBlend and protected under international copyright and intellectual property conventions.</p>

        <h2>2. Permitted Use & Fair Citation</h2>
        <p>Readers are authorized to view, download, and quote excerpts of our research for personal, non-commercial, and educational purposes, provided that full attribution and a direct canonical backlink to BacklinkBlend.com are prominently displayed. Wholesale syndication, automated scraping, or unauthorized reproduction without prior written consent is strictly prohibited.</p>

        <h2>3. Disclaimer of Warranties</h2>
        <p>The materials on BacklinkBlend are provided on an 'as-is' and 'as-available' basis without warranties of any kind, either express or implied. We do not warrant that our service will be uninterrupted, error-free, or devoid of minor technical oversights.</p>

        <h2>4. Governing Law</h2>
        <p>These terms and conditions are governed by and construed in accordance with the laws of Pakistan, and you irrevocably submit to the jurisdiction of the courts located in Sindh, Pakistan.</p>

        <h2>5. Contact Information</h2>
        <p>Questions regarding these Terms should be directed to <code>backlinkblend@gmail.com</code>.</p>
      </div>
    </div>
  `;

  const html = getHead(title, desc, canonical) + getBaseHeader() + `<main id="app-content">${content}</main>` + getPageFooterHtml();
  const dir = path.join(rootDir, 'terms');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  console.log("Generated /terms/index.html");
}

// 5. GENERATE EDITORIAL DISCLAIMER
function generateDisclaimerPage() {
  const title = "Editorial Disclaimer — BacklinkBlend";
  const desc = "Standard Editorial Disclaimer disclosing AI-generated content practices, affiliate independence, opinion vs fact distinction, and legal notices.";
  const canonical = "https://backlinkblend.com/disclaimer";

  const content = `
    <div class="article-reader-container" style="max-width: 900px; margin: 3rem auto; padding: 0 1.5rem;">
      <span class="badge" style="margin-bottom: 1.25rem;">LEGAL & TRUST</span>
      <h1 class="font-serif" style="font-size: 2.75rem; font-weight: 800; color: var(--text-primary); margin-bottom: 1.5rem;">Editorial Disclaimer</h1>
      
      <div class="article-body" style="font-size: 1.05rem; line-height: 1.7; color: var(--text-secondary);">
        <p><em>Effective Date: August 10, 2026</em></p>
        <p>The technical research, strategic blueprints, macroeconomic commentary, and guides published on <strong>BacklinkBlend</strong> (<code>https://backlinkblend.com</code>) are compiled for general educational and executive briefing purposes only.</p>

        <h2>1. AI-Assisted Research & Human Editorial Oversight</h2>
        <p>In alignment with modern digital publishing standards, BacklinkBlend utilizes artificial intelligence tools to assist in data gathering, technical research synthesis, and initial drafting. However, <strong>every piece of content undergoes rigorous human editorial review, peer verification, and fact-checking</strong> by our editorial team prior to publication.</p>
        <p>Our human editors maintain full editorial accountability, ensuring that all published masterclasses meet high standards of empirical accuracy, structural clarity, and executive utility.</p>

        <h2>2. Commercial Neutrality & Independence</h2>
        <p>BacklinkBlend operates on a foundation of strict commercial neutrality. Our editorial decisions are entirely independent of vendor partnerships, paid backlink exchanges, or undisclosed sponsorships.</p>

        <h2>3. No Professional Financial or Legal Advice</h2>
        <p>Nothing published on BacklinkBlend constitutes personalized financial, investment, legal, cybersecurity, or medical advice. Readers must conduct independent due diligence and consult qualified licensed professionals before making major capital allocations, enterprise infrastructure updates, or health decisions.</p>

        <h2>4. Corrections Policy</h2>
        <p>BacklinkBlend is committed to rapid correction of factual errors. If you identify an error in any article, please email <code>backlinkblend@gmail.com</code>.</p>
      </div>
    </div>
  `;

  const html = getHead(title, desc, canonical) + getBaseHeader() + `<main id="app-content">${content}</main>` + getPageFooterHtml();
  const dir = path.join(rootDir, 'disclaimer');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  console.log("Generated /disclaimer/index.html");
}

// 6. GENERATE ALL 38 ARTICLES AS PRE-RENDERED STATIC HTML PAGES
function generateArticlePages() {
  console.log(`Generating static pages for ${ARTICLES.length} articles...`);

  ARTICLES.forEach(art => {
    if (!art || !art.slug) return;

    const title = `${art.title} — BacklinkBlend`;
    const desc = art.deck || art.metaDescription || '';
    const canonical = `https://backlinkblend.com/article/${art.slug}`;
    const authorName = (art.author && art.author.name) ? art.author.name : 'Evelyn Vance';
    const authorRole = (art.author && art.author.role) ? art.author.role : 'Executive Editor, Technology & AI';
    const authorAvatar = (art.author && art.author.avatar) ? art.author.avatar : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80';
    const authorBio = (art.author && art.author.bio) ? art.author.bio : 'Senior editorial lead covering enterprise artificial intelligence, cybersecurity governance, and autonomous agent systems.';
    const catName = art.category ? art.category.toUpperCase() : 'TECHNOLOGY';
    const readTime = art.readTime || '5 min read';
    const listenTime = art.listenTime || '7 min audio';
    const rawImg = art.image || 'assets/images/hero_tech_ai_1786192193469.jpg';
    const image = normalizeImgPath(rawImg);

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": art.title,
      "description": desc,
      "image": [image.startsWith('http') ? image : 'https://backlinkblend.com' + image],
      "datePublished": (art.date || '2026-08-01') + "T08:00:00+05:00",
      "dateModified": (art.date || '2026-08-01') + "T08:00:00+05:00",
      "author": [{
        "@type": "Person",
        "name": authorName,
        "jobTitle": authorRole
      }],
      "publisher": {
        "@type": "Organization",
        "name": "BacklinkBlend",
        "url": "https://backlinkblend.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://backlinkblend.com/assets/images/favicon.jpg"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonical
      }
    };

    const content = `
      <div class="article-reader-container" style="max-width: 900px; margin: 2rem auto; padding: 0 1.5rem;">
        <nav class="breadcrumbs" style="margin-bottom: 1.5rem; font-size: 0.85rem; color: var(--text-muted); font-family: var(--font-mono);">
          <a href="/" style="color: var(--accent-gold); text-decoration: none;">Home</a>
          <span style="margin: 0 0.5rem;">/</span>
          <a href="/category/${art.category || 'technology'}" style="color: var(--accent-gold); text-decoration: none;">${catName}</a>
          <span style="margin: 0 0.5rem;">/</span>
          <span style="color: var(--text-secondary);">${art.title}</span>
        </nav>

        <header class="article-header" style="margin-bottom: 2rem;">
          <span class="badge" style="margin-bottom: 1rem; display: inline-block;">${catName}</span>
          <h1 class="article-main-title" style="font-family: var(--font-serif-header); font-size: 2.75rem; font-weight: 800; color: var(--text-primary); line-height: 1.2; margin-bottom: 1rem;">${art.title}</h1>
          <p class="article-deck" style="font-size: 1.15rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem;">${desc}</p>

          <div class="author-meta" style="display: flex; align-items: center; gap: 1rem; padding: 1rem 0; border-top: 1px solid var(--border-light); border-bottom: 1px solid var(--border-light);">
            <img src="${authorAvatar}" alt="${authorName}" style="width: 50px; height: 50px; border-radius: var(--radius-full); object-fit: cover;" />
            <div>
              <div style="font-weight: 700; color: var(--text-primary); font-size: 1rem;">${authorName}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-mono);">${authorRole}</div>
            </div>
            <div style="margin-left: auto; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted); text-align: right;">
              <div>Published ${art.date || ''}</div>
              <div>${readTime} • ${listenTime}</div>
            </div>
          </div>
        </header>

        <div class="article-hero-img-box" style="margin-bottom: 2.5rem; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-light);">
          <img src="${image}" alt="${art.title}" width="1600" height="900" style="aspect-ratio: 16/9; width: 100%; height: auto; object-fit: cover; display: block;" onerror="this.onerror=null; this.src='/assets/images/hero_tech_ai_1786192193469.jpg';" />
          ${art.caption ? `<div style="padding: 0.75rem 1rem; font-size: 0.82rem; font-family: var(--font-mono); color: var(--text-muted); background: var(--bg-surface);">${art.caption}</div>` : ''}
        </div>

        <main class="article-body" style="font-size: 1.1rem; line-height: 1.8; color: var(--text-primary);">
          ${injectMidArticleAd(art.content)}

          ${ADSTERRA_BANNER_HTML}

          <div style="background: var(--bg-surface); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 2rem; margin: 3rem 0; display: flex; gap: 1.5rem; align-items: flex-start;">
            <img src="${authorAvatar}" alt="${authorName}" style="width: 70px; height: 70px; border-radius: var(--radius-full); object-fit: cover;" />
            <div>
              <span style="font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; color: var(--accent-gold); font-weight: 700;">ABOUT THE AUTHOR</span>
              <h3 style="font-family: var(--font-serif-header); font-size: 1.35rem; font-weight: 700; color: var(--text-primary); margin: 0.25rem 0 0.5rem 0;">${authorName}</h3>
              <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6; margin: 0;">${authorBio}</p>
            </div>
          </div>
        </main>
      </div>
    `;

    const html = getHead(title, desc, canonical, image, jsonLd) + getBaseHeader(art.category) + `<main id="app-content">${content}</main>` + getPageFooterHtml();
    
    const dir = path.join(rootDir, 'article', art.slug);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  });

  console.log(`Generated ${ARTICLES.length} article static HTML pages in article/<slug>/index.html`);
}

function renderStaticCardHTML(art) {
  if (!art) return '';
  const authorName = (art.author && art.author.name) ? art.author.name : 'BacklinkBlend Editorial';
  const catName = art.category ? art.category.toUpperCase() : 'EDITORIAL';
  const title = art.title || 'Untitled Article';
  const deck = art.deck || art.excerpt || art.metaDescription || '';
  const image = normalizeImgPath(art.image);
  const readTime = art.readTime || '5 min read';
  const slug = art.slug || 'home';

  return `
    <article class="editorial-card">
      <a href="/article/${slug}" style="text-decoration: none; color: inherit; display: flex; flex-direction: column; height: 100%;">
        <div class="card-img-wrapper">
          <img src="${image}" alt="${title}" loading="lazy" decoding="async" width="1600" height="900" style="aspect-ratio: 16/9; width: 100%; height: auto; object-fit: cover;" onerror="this.onerror=null; this.src='/assets/images/hero_tech_ai_1786192193469.jpg';" />
        </div>
        <div class="card-body">
          <span class="badge badge-outline" style="align-self: flex-start; font-size: 0.65rem;">${catName}</span>
          <h2 class="card-title" style="font-size: 1.2rem; line-height: 1.4; margin: 0.5rem 0;">${title}</h2>
          <p class="card-excerpt">${deck}</p>
          <div class="card-footer" style="margin-top: auto; display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-mono); padding-top: 0.75rem; border-top: 1px solid var(--border-light);">
            <span>By ${authorName}</span>
            <span>${readTime}</span>
          </div>
        </div>
      </a>
    </article>
  `;
}

// 7. GENERATE ALL ARTICLES HUB REPOSITORY
function generateArticlesPage() {
  const title = "All Editorial Articles & Frameworks — BacklinkBlend";
  const desc = "Browse all deep-dive articles, strategic blueprints, and research masterclasses across Link Building, AI & Automation, SEO Tools, and Digital Authority on BacklinkBlend.";
  const canonical = "https://backlinkblend.com/articles";

  const cardsHtml = ARTICLES.map(art => renderStaticCardHTML(art)).join('');

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": title,
    "description": desc,
    "url": canonical,
    "publisher": {
      "@type": "Organization",
      "name": "BacklinkBlend",
      "url": "https://backlinkblend.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://backlinkblend.com/assets/images/favicon.jpg"
      }
    }
  };

  const content = `
    <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1.5rem;">
      <nav class="breadcrumbs" style="margin-bottom: 1.5rem; font-size: 0.85rem; color: var(--text-muted); font-family: var(--font-mono);">
        <a href="/" style="color: var(--accent-gold); text-decoration: none;">Home</a>
        <span style="margin: 0 0.5rem;">/</span>
        <span style="color: var(--text-secondary);">All Articles</span>
      </nav>

      <div class="section-header" style="margin-bottom: 2rem;">
        <h1 class="section-title" style="font-family: var(--font-serif-header); font-size: 2.5rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem;">Editorial Repository</h1>
        <span class="section-subtitle" style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--accent-gold);">${ARTICLES.length} Stories Indexed</span>
      </div>

      <div class="grid-3" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem;">
        ${cardsHtml}
      </div>
    </div>
  `;

  const html = getHead(title, desc, canonical, 'https://backlinkblend.com/assets/images/hero_tech_ai_1786192193469.jpg', jsonLd) + getBaseHeader('articles') + `<main id="app-content">${content}</main>` + getPageFooterHtml();
  const dir = path.join(rootDir, 'articles');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  console.log("Generated /articles/index.html");
}

// 8. GENERATE ALL CATEGORY HUB PAGES
function generateCategoryPages() {
  console.log(`Generating static pages for ${CATEGORIES.length} categories...`);

  CATEGORIES.forEach(cat => {
    const title = `${cat.name} Journal & Research — BacklinkBlend`;
    const desc = cat.description;
    const canonical = `https://backlinkblend.com/category/${cat.slug}`;

    const catArticles = ARTICLES.filter(a => a && a.category && a.category.toLowerCase() === cat.slug);
    const cardsHtml = catArticles.map(art => renderStaticCardHTML(art)).join('');

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": title,
      "description": desc,
      "url": canonical,
      "publisher": {
        "@type": "Organization",
        "name": "BacklinkBlend",
        "url": "https://backlinkblend.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://backlinkblend.com/assets/images/favicon.jpg"
        }
      }
    };

    const content = `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1.5rem;">
        <nav class="breadcrumbs" style="margin-bottom: 1.5rem; font-size: 0.85rem; color: var(--text-muted); font-family: var(--font-mono);">
          <a href="/" style="color: var(--accent-gold); text-decoration: none;">Home</a>
          <span style="margin: 0 0.5rem;">/</span>
          <span style="color: var(--text-secondary);">${cat.name}</span>
        </nav>

        <div style="background: var(--bg-surface); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 3rem 2.5rem; margin-bottom: 3rem;">
          <span class="badge" style="margin-bottom: 1rem; display: inline-block;">CATEGORY HUB</span>
          <h1 class="font-serif" style="font-size: 2.75rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.75rem;">${cat.name}</h1>
          <p style="font-size: 1.15rem; color: var(--text-secondary); max-width: 680px; line-height: 1.6;">${cat.description}</p>
          <div style="margin-top: 1.5rem; font-family: var(--font-mono); font-size: 0.85rem; color: var(--accent-gold);">
            ${catArticles.length} Deep-Dive Articles Published
          </div>
        </div>

        <div class="section-header" style="margin-bottom: 2rem;">
          <h2 class="section-title" style="font-family: var(--font-serif-header); font-size: 1.8rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">Category Index</h2>
          <span class="section-subtitle" style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-muted);">${cat.name} Stories</span>
        </div>

        ${catArticles.length > 0 ? `
          <div class="grid-3" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem;">
            ${cardsHtml}
          </div>
        ` : `
          <p style="text-align: center; color: var(--text-muted); padding: 4rem 0;">No articles published in this hub yet. Check back soon!</p>
        `}
      </div>
    `;

    const html = getHead(title, desc, canonical, 'https://backlinkblend.com/assets/images/hero_tech_ai_1786192193469.jpg', jsonLd) + getBaseHeader(cat.slug) + `<main id="app-content">${content}</main>` + getPageFooterHtml();
    const dir = path.join(rootDir, 'category', cat.slug);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
    console.log(`Generated /category/${cat.slug}/index.html`);
  });
}

// EXECUTE ALL
generatePrivacyPage();
generateAboutPage();
generateContactPage();
generateTermsPage();
generateDisclaimerPage();
generateArticlesPage();
generateCategoryPages();
generateArticlePages();
console.log("Static Site Generation completed successfully!");
