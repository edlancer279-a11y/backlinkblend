---
name: blog
description: >-
  Safe, end-to-end SEO blog post workflow for BacklinkBlend.com. Picks or accepts a
  primary keyword within the site's four pillars (link building, AI & automation, SEO tools,
  digital authority), researches the SERP, writes accurate, source-backed, people-first content,
  creates a 16:9 banner with alt text, adds a 120-200 word conclusion and FAQ, inserts 3-5
  verified internal links and 1-3 relevant external citations, registers the article in
  js/bundle.js and js/data.js, and updates sitemap.xml, llms.txt, index.html and .htaccess.
  Follows Google Search spam policies and E-E-A-T guidance.
---

# BacklinkBlend Editorial Blog Skill (`/blog`)

This skill defines the standard pipeline for writing, optimizing and publishing articles on **BacklinkBlend.com**.

## Core Principles (read first, never override)

1. **People-first content.** Every article must genuinely help the reader. Never write just to rank.
2. **Accuracy over speed.** Never invent statistics, quotes, studies, prices, features, dates, URLs or sources. If a fact cannot be verified from a reliable source during research, leave it out or say it is unconfirmed.
3. **No spam tactics.** Never use keyword stuffing, hidden text or links, cloaking, doorway pages, copied or lightly rewritten content, fake reviews, fake authors or fake credentials.
4. **No link-scheme promotion.** Never recommend or teach buying links, PBNs, link exchanges at scale, automated link spam, or any tactic that violates Google's link spam policies. When a topic touches these (tiered links, expired domains, guest posting at scale), explain how they work **together with the risks and Google's policy position**, and point the reader to safe alternatives (digital PR, original research, genuine outreach).
5. **Stay in the niche.** Only publish topics that fit the four pillars below. Do not write finance, investment, medical, legal or other YMYL advice.
6. **Add real value.** Each article needs something beyond what the top 10 results already say: a clear framework, a worked example, a checklist, a comparison, or a practical process. If you cannot add this, pick a different topic.
7. **Human review before publish.** Treat all output as a draft until a person has checked facts, links and tone.

---

## Workflow Overview

```
1. Keyword & Cluster ──► 2. SERP Research ──► 3. Write & Fact-check
                                                      │
6. Verify & Build ◄── 5. Code Registration ◄── 4. Banner, Links, SEO
```

---

## Step 1: Keyword Selection & Cannibalization Check

1. **Target keyword**: use the user's focus keyword, or choose a high-intent topic inside the four pillars.
2. **Cannibalization audit**: check `js/bundle.js` and `js/data.js`. If an existing article already targets the same keyword, intent or a near-identical slug, **stop and tell the user** instead of publishing a duplicate. Suggest updating the existing article or choosing a different angle.
3. **Cluster**: pick 3-5 secondary semantic keywords and 4-5 real "People Also Ask" questions for the FAQ. Use them naturally, never force them.

## Step 2: SERP Research

- Review the top results for the keyword. Note search intent (guide, comparison, how-to, definition), what they cover, and what they miss.
- Collect **verifiable sources** (official documentation, Google Search Central, peer-reviewed or institutional research, reputable industry publications). Note the URL of each source you intend to use. Every factual claim, number or pricing detail in the article must trace back to one of them.
- Never copy sentences or structure from competitors. Write original text.

## Step 3: Metadata

### Author
Use **only** authors that exist in `AUTHORS` and who are **real people who have approved their name and bio**. If none are real or approved, use the neutral editorial author:
- `AUTHORS['editorial-team']`: "BacklinkBlend Editorial Team"

Never invent names, job titles, degrees, certifications or experience. Do not assign articles to authors outside their genuine expertise.

### Category (use exactly one of these four slugs)
- `link-building`: backlinks, guest posting, broken link building, outreach, digital PR, link audits.
- `ai-automation`: AI tools, LLMs, AI agents, prompt engineering, automation workflows for marketing and SEO.
- `seo-tools`: Ahrefs, Semrush, backlink analysis, crawlers, outreach software.
- `digital-authority`: Google algorithms and updates, spam policies, E-E-A-T, GEO (Generative Engine Optimization), domain authority.

### Metadata Blueprint
- **`id`**: `'art-' + slug`
- **`slug`**: kebab-case, descriptive, no dates or stuffed keywords
- **`title`**: 50-65 characters, contains the primary keyword naturally, accurate to the content, no clickbait or false promises
- **`deck`**: 1-2 sentences summarizing the article honestly
- **`category`**: one of the four slugs above
- **`author`**: per the Author rules above
- **`date`**: real publication date `'YYYY-MM-DD'`. If an existing article is materially updated later, add `updated: 'YYYY-MM-DD'` with the real date. Never fake or backdate.
- **`readTime`**: calculated from the real word count (about 200-230 words per minute)
- **`listenTime`**: include **only if an audio version actually exists**. Otherwise omit it or set it to `null`.
- **`image`**: `'assets/images/' + slug.replace(/-/g, '_') + '_banner.jpg'`
- **`imageAlt`**: short, factual description of the image (add this field and render it as the `alt` attribute; if the schema does not support it yet, flag it to the user)
- **`caption`**: concise editorial caption
- **`featured`**: `true` or `false`
- **`trendingRank`**: integer 1-5 or `null`
- **`tags`**: 4-6 relevant tags
- **`takeaway`**: one declarative sentence that accurately answers the primary query
- **`focusKeyword`**: lowercase primary keyword
- **`metaDescription`**: 150-160 characters, includes the primary keyword, describes the page accurately, no exaggeration

## Step 4: Content Writing Standards

### Voice
- Clear, authoritative, practical. Think of a senior analyst writing for professionals.
- High signal-to-noise. No filler, no hype words ("revolutionary", "game-changing", "ultimate"), no guarantees ("rank #1 in 30 days").
- Vary sentence structure and article structure. Do not reuse the same template of headings across articles.

### Opening
The first sentence should contain the **primary keyword in bold** and deliver the core answer or definition. Keep it natural. Do not repeat the exact keyword unnaturally anywhere else; aim for natural usage and related terms.

### Length and depth
- Aim for roughly **1,200-2,000 words**, but depth matters more than length. Never pad.
- Use clear H2/H3 headings, short paragraphs, and lists only where they help.

### Accuracy rules
- Every statistic, price, feature, date or quote must come from a source you actually checked. Link or attribute it.
- For pricing or product features, say "at the time of writing" and confirm from the official page.
- Do not claim personal testing or experience ("we tested", "in our experience") unless it is true. Use "according to the official documentation" or similar instead.
- Do not make guaranteed ranking, traffic or income claims.
- Disclose affiliate or sponsored relationships if any exist.

### Required structured element (at least one)
1. **Comparison / pricing table** (only with verified data):
   ```html
   <div style="overflow-x: auto; margin: 1.5rem 0;">
     <table style="width: 100%; border-collapse: collapse; background: var(--bg-surface); border: 1px solid var(--border-light); border-radius: var(--radius-sm);">
       <thead>
         <tr style="background: var(--bg-secondary); border-bottom: 1px solid var(--border-light);">
           <th style="padding: 0.85rem 1rem; text-align: left; font-family: var(--font-mono); font-size: 0.85rem; color: var(--accent-gold);">Option</th>
           <th style="padding: 0.85rem 1rem; text-align: left; font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-primary);">Key Features</th>
           <th style="padding: 0.85rem 1rem; text-align: left; font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-secondary);">Best For</th>
         </tr>
       </thead>
       <tbody>
         <tr style="border-bottom: 1px solid var(--border-light);">
           <td style="padding: 0.85rem 1rem; font-weight: 700; color: var(--text-primary);">...</td>
           <td style="padding: 0.85rem 1rem; color: var(--text-secondary);">...</td>
           <td style="padding: 0.85rem 1rem; color: var(--text-secondary);">...</td>
         </tr>
       </tbody>
     </table>
   </div>
   ```
2. **Pro Tip / Insight callout**:
   ```html
   <div style="background: var(--bg-secondary); border-left: 4px solid var(--accent-gold); padding: 1.25rem; margin: 2rem 0; border-radius: var(--radius-sm);">
     <h4 style="margin: 0 0 0.5rem 0; font-family: var(--font-serif-header); color: var(--text-primary);">Insight: [Title]</h4>
     <p style="margin: 0; color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6;">[Practical, accurate recommendation]</p>
   </div>
   ```

## Step 5: Linking Policy

### Internal links (3-5 per article)
1. Link **only to slugs that actually exist** in `js/bundle.js`. Verify each one. Never invent a slug.
2. Use SPA-safe markup (keep a real `href` so crawlers can follow it):
   ```html
   <a href="/article/[target-slug]" onclick="event.preventDefault(); if(window.app) window.app.navigateTo('article/[target-slug]');" style="color: var(--accent-gold); text-decoration: underline;">Natural descriptive anchor</a>
   ```
3. Anchors must be natural and varied. No "click here", no repeated exact-match keyword anchors, no more than one link to the same article.
4. Link only where it genuinely helps the reader.

### External links (1-3 per article)
1. Link to **reputable, relevant sources** that support your claims: official documentation, Google Search Central, Wikipedia for definitions, institutional or peer-reviewed research. Confirm each URL loads and says what you cite.
2. **Default (editorial citation):**
   ```html
   <a href="https://example.org/topic" target="_blank" rel="noopener noreferrer" style="color: var(--accent-gold); text-decoration: underline;">Descriptive anchor</a>
   ```
3. Use `rel="nofollow noopener noreferrer"` for untrusted sources, and `rel="sponsored noopener noreferrer"` for paid or affiliate links. If the user explicitly asks for `nofollow` on all external links, follow that.
4. Never link to spam, link sellers, casino/adult/pharma-type sites, or sites you have not checked.

## Step 6: Conclusion & FAQ

### Conclusion (before the FAQ)
- Heading: `<h2>Conclusion</h2>`
- Length: **120-200 words**
- Mention the primary keyword once, naturally. Summarize the real takeaways without repeating earlier sentences. Give a practical next step. Keep the same professional voice. No hype, no guarantees.

### FAQ
- Heading: `<h2>Frequently Asked Questions (FAQ)</h2>`
- 4-5 questions, each with a direct, accurate 2-4 sentence answer based on the researched sources.
  ```html
  <div style="margin-top: 1.5rem;">
    <h3 style="font-size: 1.1rem; margin-bottom: 0.25rem;">[Question]?</h3>
    <p style="margin-bottom: 1.25rem; color: var(--text-secondary);">[Direct answer]</p>
  </div>
  ```

## Step 7: Banner Image

1. Create or obtain exactly **one original 16:9 banner**. Do not use copyrighted or stock images without a licence, logos of other brands in misleading ways, or images of real people without permission.
2. Clean composition, no garbled text, no fake watermarks, no fake screenshots presented as real product output.
3. Save to `assets/images/<slug_with_underscores>_banner.jpg` (or `.png` / `.webp`), optimized for fast loading. Always provide `imageAlt`.

## Step 8: Code Registration & Site Files

1. **`js/bundle.js`**: prepend the article object to `const ARTICLES = [`.
2. **`js/data.js`**: add the identical object to `export const ARTICLES = [`.
3. **`sitemap.xml`**: add the canonical URL only (no duplicates, no non-`/article/` variants), with the **real** `lastmod` date:
   ```xml
   <url>
     <loc>https://backlinkblend.com/article/[slug]</loc>
     <lastmod>[YYYY-MM-DD]</lastmod>
     <changefreq>monthly</changefreq>
     <priority>0.8</priority>
   </url>
   ```
   Keep the homepage at priority `1.0`. Do not give every article `1.0`.
4. **`llms.txt` and `llms-full.txt`**: add under `## Core Technical Research & Articles`:
   ```markdown
   - [Article Title](https://backlinkblend.com/article/[slug]): [Article Deck]
   ```
5. **`index.html`**: increment the bundle version (`?v=XX.0.0`) for cache busting.
6. **`.htaccess`**: add the new slug to the 301 root redirect rule to `/article/$1`.
7. **Run the static pre-renderer** so crawlers get full HTML with structured data:
   ```bash
   node scripts/build_static.mjs
   ```
   Confirm the generated page contains the full article text, title, meta description, canonical URL, and Article schema with author, `datePublished` and (if applicable) `dateModified`.

## Step 9: Quality Audit Checklist

Before reporting completion, verify every item:

**Content & trust**
- [ ] Topic fits one of the four pillars (no finance, medical or legal advice).
- [ ] No existing article targets the same keyword or intent.
- [ ] Every number, price, feature, quote and date is verified against a real source. Nothing invented.
- [ ] No guarantees, hype claims, or fake first-hand experience claims.
- [ ] Any mention of risky link tactics includes the risks and Google's position.
- [ ] Author is a real approved person or `editorial-team`. No invented credentials.
- [ ] Content is original and adds something beyond the top results.

**On-page**
- [ ] Primary keyword in bold in the first sentence, used naturally (no stuffing).
- [ ] Title is 50-65 characters. Meta description is 150-160 characters.
- [ ] 3-5 internal links, all pointing to existing slugs, with natural varied anchors.
- [ ] 1-3 external links to reputable sources, with the correct `rel` attribute.
- [ ] Conclusion is 120-200 words and sits before the FAQ.
- [ ] FAQ has 4-5 accurate answers.
- [ ] Banner exists at the correct path and has alt text.
- [ ] `listenTime` is only present if audio really exists.

**Technical**
- [ ] `node --check js/bundle.js` and `node --check js/data.js` pass with no syntax errors.
- [ ] `sitemap.xml` has the canonical URL, real `lastmod`, no duplicates.
- [ ] `llms.txt` and `llms-full.txt` updated.
- [ ] `index.html` version bumped. `.htaccess` updated.
- [ ] `build_static.mjs` ran successfully and the static page looks correct.

## Final Report to User

Give a concise summary:
1. Article title and slug
2. Author and category
3. Focus keyword and word count
4. Sources used for facts (list the URLs) and the external link `rel` mode
5. Confirmation of registration in `bundle.js`, `data.js`, `sitemap.xml`, `llms.txt`, `index.html`, `.htaccess`, and the static build
6. **Anything the user must verify manually** (e.g. pricing figures, claims with weaker sources, missing alt-text field support, author approval)
