/* ==========================================================================
   BacklinkBlend — SEO & Dynamic JSON-LD Schema Engine
   ========================================================================== */

import { SITE_CONFIG } from './data.js';

export function updateSEO({ title, description, canonicalUrl, ogImage, ogType = 'website', articleData = null, breadcrumbs = [] }) {
  try {
    // Update Title
    const fullTitle = title ? `${title} | BacklinkBlend` : SITE_CONFIG.title;
    document.title = fullTitle;

    // Helper to set/create meta tag
    const setMeta = (name, content, attr = 'name') => {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const metaDesc = description || SITE_CONFIG.description;
    const currentUrl = canonicalUrl || window.location.href;
    const image = ogImage || `${SITE_CONFIG.url}/assets/images/hero_tech_ai_1786192193469.jpg`;

    setMeta('description', metaDesc);
    setMeta('robots', 'index, follow');

    // Open Graph
    setMeta('og:site_name', 'BacklinkBlend', 'property');
    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', metaDesc, 'property');
    setMeta('og:url', currentUrl, 'property');
    setMeta('og:type', ogType, 'property');
    setMeta('og:image', image, 'property');

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:site', SITE_CONFIG.twitter);
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', metaDesc);
    setMeta('twitter:image', image);

    // Canonical Link
    let canonicalEl = document.querySelector('link[rel="canonical"]') || document.getElementById('canonical-link');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    const cleanCanonical = currentUrl.split('#')[0];
    canonicalEl.setAttribute('href', cleanCanonical);

    // Schema.org JSON-LD Generation
    injectSchemas({ articleData, breadcrumbs, currentUrl });
  } catch (err) {
    console.error('SEO update error:', err);
  }
}

function injectSchemas({ articleData, breadcrumbs, currentUrl }) {
  // Remove existing JSON-LD scripts
  const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
  existingSchemas.forEach(el => el.remove());

  const schemas = [];

  // 1. Organization & Website Schema (Always present)
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    'name': 'BacklinkBlend',
    'url': SITE_CONFIG.url,
    'logo': `${SITE_CONFIG.url}/assets/images/hero_tech_ai_1786192193469.jpg`,
    'sameAs': [
      'https://twitter.com/BacklinkBlend',
      'https://linkedin.com/company/backlinkblend'
    ],
    'contactPoint': {
      '@type': 'ContactPoint',
      'email': SITE_CONFIG.contactEmail,
      'contactType': 'editorial office'
    }
  });

  // 2. Breadcrumb Schema if available
  if (breadcrumbs && breadcrumbs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((crumb, idx) => ({
        '@type': 'ListItem',
        'position': idx + 1,
        'name': crumb.name,
        'item': crumb.url ? `${SITE_CONFIG.url}${crumb.url}` : undefined
      }))
    });
  }

  // 3. Article Schema if viewing an article
  if (articleData) {
    const authorName = (articleData.author && articleData.author.name) ? articleData.author.name : 'BacklinkBlend Editorial';
    const authorRole = (articleData.author && articleData.author.role) ? articleData.author.role : 'Executive Desk';

    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      'headline': articleData.title,
      'description': articleData.deck || articleData.metaDescription || '',
      'image': [articleData.image && articleData.image.startsWith('http') ? articleData.image : `${SITE_CONFIG.url}/${articleData.image || 'assets/images/hero_tech_ai_1786192193469.jpg'}`],
      'datePublished': articleData.date,
      'dateModified': articleData.date,
      'author': [{
        '@type': 'Person',
        'name': authorName,
        'jobTitle': authorRole
      }],
      'publisher': {
        '@type': 'Organization',
        'name': 'BacklinkBlend',
        'logo': {
          '@type': 'ImageObject',
          'url': `${SITE_CONFIG.url}/assets/images/hero_tech_ai_1786192193469.jpg`
        }
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': currentUrl
      }
    });
  }

  // Append scripts to head
  schemas.forEach(schema => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  });
}
