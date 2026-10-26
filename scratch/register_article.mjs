import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const contentHtml = fs.readFileSync(path.join(__dirname, 'article_content.html'), 'utf8');

const articleData = {
  id: 'art-technical-seo-audits-guide',
  slug: 'technical-seo-audits-guide',
  title: 'Technical SEO Audits: 7-Pillar Framework, Checklist & Guide',
  deck: 'A comprehensive technical SEO audit framework evaluating crawl budgets, JavaScript rendering, indexing directives, Core Web Vitals, and structured data architecture.',
  category: 'digital-authority',
  date: '2026-10-26',
  readTime: '9 min read',
  listenTime: null,
  image: 'assets/images/technical_seo_audits_guide_banner.jpg',
  imageAlt: 'Technical SEO audits dashboard showing crawl status codes, indexing directives, Core Web Vitals metrics, and site architecture graph.',
  caption: 'A complete technical SEO audit framework inspecting crawlability, indexability, Core Web Vitals, and structured data hierarchy.',
  featured: false,
  trendingRank: null,
  tags: ['Technical SEO', 'SEO Audits', 'Crawl Budget', 'Core Web Vitals', 'Indexability', 'Search Console'],
  takeaway: 'A technical SEO audit systematically removes discovery and rendering barriers so search crawlers can evaluate, index, and rank your content without architectural friction.',
  focusKeyword: 'technical seo audits',
  metaDescription: 'Master technical seo audits with our 7-pillar framework. Learn how to diagnose crawl errors, fix indexing blockers, optimize Core Web Vitals, and scale traffic.'
};

// Format article entry for data.js and bundle.js
const articleObjCode =   {
    id: ,
    slug: ,
    title: ,
    deck: ,
    category: ,
    author: AUTHORS['abdul'],
    date: ,
    readTime: ,
    listenTime: ,
    image: ,
    imageAlt: ,
    caption: ,
    featured: ,
    trendingRank: ,
    tags: ,
    takeaway: ,
    focusKeyword: ,
    metaDescription: ,
    content: \

    \
  },;

// 1. Update js/data.js
const dataPath = path.join(rootDir, 'js', 'data.js');
let dataContent = fs.readFileSync(dataPath, 'utf8');

if (!dataContent.includes(slug: '') && !dataContent.includes(slug: ")) {
 dataContent = dataContent.replace('export const ARTICLES = [', 'export const ARTICLES = [\n' + articleObjCode);
 fs.writeFileSync(dataPath, dataContent, 'utf8');
 console.log('✅ js/data.js updated with new article.');
} else {
 console.log('ℹ️ js/data.js already has this article.');
}

// 2. Update js/bundle.js
const bundlePath = path.join(rootDir, 'js', 'bundle.js');
let bundleContent = fs.readFileSync(bundlePath, 'utf8');

if (!bundleContent.includes(slug: '') && !bundleContent.includes(slug: )) {
 bundleContent = bundleContent.replace('const ARTICLES = [', 'const ARTICLES = [\n' + articleObjCode);
 fs.writeFileSync(bundlePath, bundleContent, 'utf8');
 console.log('✅ js/bundle.js updated with new article.');
} else {
 console.log('ℹ️ js/bundle.js already has this article.');
}

// 3. Update sitemap.xml
const sitemapPath = path.join(rootDir, 'sitemap.xml');
let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
const sitemapEntry = <!-- Article: -->
 <url>
 <loc>https://backlinkblend.com/article/</loc>
 <lastmod></lastmod>
 <changefreq>monthly</changefreq>
 <priority>0.8</priority>
 </url>\n\n;

if (!sitemapContent.includes(/article/)) {
 sitemapContent = sitemapContent.replace('<!-- Editorial Articles (Canonical Only) -->\n\n', '<!-- Editorial Articles (Canonical Only) -->\n\n' + sitemapEntry);
 fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
 console.log('✅ sitemap.xml updated.');
} else {
 console.log('ℹ️ sitemap.xml already contains this URL.');
}

// 4. Update llms.txt & llms-full.txt
const llmsEntry = - [](https://backlinkblend.com/article/): \n;

const llmsPath = path.join(rootDir, 'llms.txt');
let llmsContent = fs.readFileSync(llmsPath, 'utf8');
if (!llmsContent.includes(/article/)) {
 llmsContent = llmsContent.replace('## Core Technical Research & Articles\n\n', '## Core Technical Research & Articles\n\n' + llmsEntry);
 fs.writeFileSync(llmsPath, llmsContent, 'utf8');
 console.log('✅ llms.txt updated.');
}

const llmsFullPath = path.join(rootDir, 'llms-full.txt');
let llmsFullContent = fs.readFileSync(llmsFullPath, 'utf8');
if (!llmsFullContent.includes(/article/)) {
 llmsFullContent = llmsFullContent.replace('## Core Technical Research & Articles\n\n', '## Core Technical Research & Articles\n\n' + llmsEntry);
 fs.writeFileSync(llmsFullPath, llmsFullContent, 'utf8');
 console.log('✅ llms-full.txt updated.');
}

// 5. Update index.html cache buster
const indexPath = path.join(rootDir, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');
indexContent = indexContent.replace(/bundle\.js\?v=\d+\.0\.0/, 'bundle.js?v=101.0.0');
fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log('✅ index.html cache bust updated to 101.0.0.');

console.log('All files updated successfully!');