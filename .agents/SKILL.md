---
name: blog
description: >-
  Automated end-to-end SEO blog post creation workflow for BacklinkBlend.com.
  Picks or accepts a primary keyword, conducts SERP research, writes authoritative
  editorial content (AI, tech, finance, business, digital marketing), generates a 16:9
  featured banner image in assets/images/, enforces a mandatory 120-200 word SEO conclusion,
  inserts 3-5 internal links and exactly 1 external authority link (default nofollow with dofollow override),
  registers the article in js/bundle.js and js/data.js, and updates sitemap.xml.
---

# BacklinkBlend Editorial Blog Skill (`/blog`)

This skill defines the standardized, end-to-end editorial pipeline for generating, optimizing, formatting, and publishing new SEO articles on **BacklinkBlend.com**.

---

## Workflow Overview

```
1. Keyword & Cluster  ──►  2. SERP Research  ──►  3. Content Writing & Voice
                                                         │
6. Verification & Sitemap ◄──  5. Code Injection   ◄──  4. Banner Image & SEO Linking
```

---

## Step-by-Step Execution Plan

### Step 1: Keyword Selection & Cannibalization Check
1. **Target Keyword Identification**:
   - Receive user-specified focus keyword OR select an emerging high-intent topic in AI technology, autonomous agents, enterprise cloud, global finance, or digital marketing.
2. **Cannibalization Audit**:
   - Check `js/bundle.js` and `js/data.js` to ensure the proposed focus keyword or slug has **not** already been targeted by an existing article.
3. **Keyword Cluster**:
   - Identify 3–5 secondary semantic keywords.
   - Collect 4–5 "People Also Ask" (PAA) questions for the FAQ section.

---

### Step 2: Editorial Specifications & Metadata

#### Author Assignment
Assign the article to the appropriate resident author in `AUTHORS`:
- `evelyn-vance` (Executive Editor, Technology & AI): AI tools, LLMs, neural models, cloud computing, developer tools.
- `julian-thorne` (Senior Financial Strategist): Global finance, macroeconomics, private equity, fintech.
- `marcus-vane` (Dr. Marcus Vane, Lead Marketing & Growth): SEO, digital marketing, organic growth, brand strategy.
- `elena-rostova` (Global Culture & Design Director): Architectural design, modern minimalism, digital culture.

#### Category Assignment
Choose one of the 6 core pillars:
- `technology` (AI Technology)
- `ai-agents` (AI Agents)
- `business` (Business Strategy)
- `finance` (Global Finance)
- `digital-marketing` (Digital Marketing)
- `culture` (Modern Culture)

#### Metadata Blueprint
- **`id`**: `'art-' + slug`
- **`slug`**: kebab-case URL slug (e.g., `what-is-cursor-ai-guide`)
- **`title`**: 50–65 characters, high CTR, containing primary keyword (e.g., `"What Is Cursor AI? Features, Code Editor & Pricing Guide"`)
- **`deck`**: 1–2 sentence executive overview summarizing the article
- **`readTime`**: e.g., `'6 min read'`
- **`listenTime`**: e.g., `'8 min audio'`
- **`image`**: `'assets/images/' + slug + '_banner.jpg'`
- **`caption`**: Concise editorial caption describing the visual
- **`featured`**: `true` or `false`
- **`trendingRank`**: Integer `1` to `5` or `null`
- **`tags`**: Array of 4–6 relevant tags
- **`takeaway`**: Single declarative sentence directly answering the primary query (designed for Google Featured Snippet)
- **`focusKeyword`**: Lowercase primary keyword (e.g., `'cursor ai'`)
- **`metaDescription`**: 150–160 characters containing primary keyword, key benefits, and user intent

---

### Step 3: Content Writing Standards

#### Tone & Editorial Voice
- **Authoritative & Sophisticated**: Write like a senior technology analyst or financial journalist (matching *MIT Technology Review*, *Wired*, or *Financial Times*).
- **Concise & Dense**: Avoid robotic filler, hyperbolic cliches, or fluff. Deliver high signal-to-noise ratio insights.
- **Immediate Direct Answer**: The very first sentence must feature the **primary keyword in bold** and immediately deliver the core definition or answer.

#### Interactive & Structured Elements
Each article must include at least one of the following:
1. **Comparison / Pricing Table**:
   ```html
   <div style="overflow-x: auto; margin: 1.5rem 0;">
     <table style="width: 100%; border-collapse: collapse; background: var(--bg-surface); border: 1px solid var(--border-light); border-radius: var(--radius-sm);">
       <thead>
         <tr style="background: var(--bg-secondary); border-bottom: 1px solid var(--border-light);">
           <th style="padding: 0.85rem 1rem; text-align: left; font-family: var(--font-mono); font-size: 0.85rem; color: var(--accent-gold);">Plan / Tier</th>
           <th style="padding: 0.85rem 1rem; text-align: left; font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-primary);">Key Features</th>
           <th style="padding: 0.85rem 1rem; text-align: left; font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-secondary);">Target Audience</th>
         </tr>
       </thead>
       <tbody>
         <tr style="border-bottom: 1px solid var(--border-light);">
           <td style="padding: 0.85rem 1rem; font-weight: 700; color: var(--text-primary);">Starter Tier</td>
           <td style="padding: 0.85rem 1rem; color: var(--text-secondary);">...</td>
           <td style="padding: 0.85rem 1rem; color: var(--text-secondary);">...</td>
         </tr>
       </tbody>
     </table>
   </div>
   ```
2. **Pro Tip / Architectural Callout Box**:
   ```html
   <div style="background: var(--bg-secondary); border-left: 4px solid var(--accent-gold); padding: 1.25rem; margin: 2rem 0; border-radius: var(--radius-sm);">
     <h4 style="margin: 0 0 0.5rem 0; font-family: var(--font-serif-header); color: var(--text-primary);">Architectural Insight: [Title]</h4>
     <p style="margin: 0; color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6;">
       [Insightful analysis or strategic recommendation]
     </p>
   </div>
   ```

---

### Step 4: Linking Policy

#### Mandatory Internal Links (3–5 Links per Article)
1. **SPA Router Integration**:
   Every internal link **must** use BacklinkBlend's SPA-safe navigation attribute:
   ```html
   <a href="/article/[target-slug]" onclick="event.preventDefault(); if(window.app) window.app.navigateTo('article/[target-slug]');" style="color: var(--accent-gold); text-decoration: underline;">Natural Descriptive Anchor</a>
   ```
2. **Relevance**: Target existing articles found in `js/bundle.js` that share thematic relevance.
3. **Natural Anchors**: Never use generic phrases like "click here" or "read more". Use natural, topic-specific anchor text.

#### Mandatory External Authority Link (Exactly 1 Link)
1. **Target**: Must link to a recognized, high-authority domain (`en.wikipedia.org`, official project documentation, peer-reviewed paper, or institutional research).
2. **Default Policy**: All external links must use `rel="nofollow noopener noreferrer"`:
   ```html
   <a href="https://example.org/topic" target="_blank" rel="nofollow noopener noreferrer" style="color: var(--accent-gold); text-decoration: underline;">Authoritative Anchor Text</a>
   ```
3. **Override Rule**: If the user explicitly asks for `dofollow`, `use dofollow external link`, or `remove nofollow`, switch attribute to:
   ```html
   <a href="https://example.org/topic" target="_blank" rel="noopener noreferrer" style="color: var(--accent-gold); text-decoration: underline;">Authoritative Anchor Text</a>
   ```

---

### Step 5: Mandatory SEO Conclusion & FAQ

#### Mandatory Conclusion Section
Every article must end with a dedicated conclusion placed immediately **before** the FAQ section.
- **Heading**: `<h2>Conclusion</h2>`
- **Length**: Exactly **120–200 words**.
- **Content**:
  - Reiterate the primary focus keyword naturally once.
  - Summarize key strategic takeaways without repeating previous sentences.
  - Provide actionable next steps or future outlook.
  - Offer a natural editorial sign-off that maintains BacklinkBlend's sophisticated voice.

#### FAQ Section
Directly follow the conclusion with an FAQ section:
```html
<h2>Frequently Asked Questions (FAQ)</h2>
<div style="margin-top: 1.5rem;">
  <h3 style="font-size: 1.1rem; margin-bottom: 0.25rem;">[Question 1]?</h3>
  <p style="margin-bottom: 1.25rem; color: var(--text-secondary);">[Direct 2-4 sentence answer]</p>
  ...
</div>
```

---

### Step 6: Visual Banner Asset Workflow

1. Generate or acquire exactly **one 16:9 featured banner image**.
2. **Visual Standards**:
   - Modern, sleek editorial digital art, UI representation, or high-tech workspace.
   - Clean, balanced composition without AI text hallucinations or fake watermarks.
3. **Save Path**:
   Save directly to `assets/images/<slug>_banner.jpg` (or `.png`/`.webp`).

---

### Step 7: Dual Code Registry & Sitemap Integration

#### 1. Inject into `js/bundle.js`
Prepend the new article object to `const ARTICLES = [` in `js/bundle.js` (at the top of the array so it displays first in recency).

#### 2. Inject into `js/data.js`
Add the identical article object to `export const ARTICLES = [` in `js/data.js` to keep the source of truth synchronized.

#### 3. Append to `sitemap.xml`
Add the clean, canonical article URL right under the homepage entry in `sitemap.xml` (do NOT add duplicate non-/article/ URLs):
```xml
  <!-- Featured Article: [Article Title] -->
  <url>
    <loc>https://backlinkblend.com/article/[slug]</loc>
    <lastmod>[YYYY-MM-DD]</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
```

---

### Step 8: Quality Audit & Verification Checklist

Before reporting completion to the user, verify:
- [ ] Primary keyword appears in bold in the first sentence of the article content.
- [ ] 3–5 valid internal links point to active articles with `onclick="...navigateTo(...)"`.
- [ ] Exactly 1 external link exists with the correct `rel` setting (nofollow by default, dofollow only if requested).
- [ ] Mandatory Conclusion is present, between 120–200 words.
- [ ] FAQ contains 4–5 questions with direct answers.
- [ ] Banner image exists at `assets/images/<slug>_banner.jpg`.
- [ ] `js/bundle.js` and `js/data.js` are free of JavaScript syntax errors.
- [ ] `sitemap.xml` contains the clean canonical URL `/article/<slug>` (no duplicate entries).

#### Final Report to User
Provide a concise summary:
1. Article Title & Target Slug
2. Assigned Author & Category
3. Focus Keyword & Word Count
4. External link mode used (Default Nofollow or Requested Dofollow)
5. Confirmation of registration in `bundle.js`, `data.js`, and `sitemap.xml`.
