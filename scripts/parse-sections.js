#!/usr/bin/env node
/**
 * parse-sections.js
 * Reads public/bayou-family-fishing.html, extracts <section id="..."> blocks,
 * writes stub Next.js component + page files per section.
 *
 * Usage:
 *   node scripts/parse-sections.js [--input path/to/file.html]
 *   node scripts/parse-sections.js --extract --input /tmp/bff-v1/public/bayou-family-fishing.html
 *
 * Output (stub mode):
 *   apps/web/components/{id}/index.tsx  — React component stub
 *   apps/web/app/{id}/page.tsx          — Next.js page wrapper
 *
 * Output (--extract mode):
 *   scripts/manifests/{id}.json  — structured content manifest
 *   scripts/manifests/{id}.html  — raw HTML of the section
 *
 * Known sections:
 *   home, gallery, members, boats, volunteer, donate, about, innisfree
 */

const fs = require('fs');
const path = require('path');

const KNOWN_SECTIONS = ['home', 'gallery', 'members', 'boats', 'volunteer', 'donate', 'about', 'innisfree'];

// Sections that need 'use client' (interactive)
const CLIENT_SECTIONS = new Set(['members', 'donate', 'gallery']);

// Sections that are hero pages — main uses pt-0 instead of pt-24
const HERO_SECTIONS = new Set(['home', 'innisfree']);

// Sections that use Supabase
const SUPABASE_SECTIONS = new Set(['members', 'gallery']);

// Route map
const ROUTES = {
  home: '/',
  gallery: '/gallery',
  members: '/members',
  boats: '/boats',
  volunteer: '/volunteer',
  donate: '/donate',
  about: '/about',
  innisfree: '/innisfree',
};

function toPascalCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

// ─── Stub mode ────────────────────────────────────────────────────────────────

function writeComponentStub(sectionId, originalHtml) {
  const componentName = toPascalCase(sectionId);
  const isClient = CLIENT_SECTIONS.has(sectionId);
  const componentDir = path.join('apps/web/components', sectionId);
  const componentFile = path.join(componentDir, 'index.tsx');

  if (!fs.existsSync(componentDir)) fs.mkdirSync(componentDir, { recursive: true });

  const htmlComment = originalHtml
    ? `\n{/*\n  Original HTML:\n${originalHtml.slice(0, 500)}...\n*/}\n`
    : '';

  const content = `${isClient ? "'use client';\n\n" : ''}// ${componentName} — migrated from v1 HTML section #${sectionId}
// TODO Phase 1: Replace stub with full Next.js component

${isClient ? '' : '// Server Component — no \'use client\' directive needed\n'}
export default function ${componentName}() {
  return (
    <section id="${sectionId}" className="py-16">
      ${htmlComment}
      <div className="container mx-auto px-4">
        <p className="text-text-mid font-serif">
          {/* TODO: Migrate ${sectionId} section content here */}
          ${componentName} section — migration pending
        </p>
      </div>
    </section>
  );
}
`;

  fs.writeFileSync(componentFile, content, 'utf8');
  console.log(`  wrote: ${componentFile}`);
}

function writePageStub(sectionId) {
  const componentName = toPascalCase(sectionId);
  const isHero = HERO_SECTIONS.has(sectionId);
  const ptClass = isHero ? 'pt-0' : 'pt-24';

  const pageDir = sectionId === 'home'
    ? 'apps/web/app'
    : path.join('apps/web/app', sectionId);

  if (!fs.existsSync(pageDir)) fs.mkdirSync(pageDir, { recursive: true });

  const pageFile = path.join(pageDir, 'page.tsx');

  if (fs.existsSync(pageFile)) {
    const existing = fs.readFileSync(pageFile, 'utf8');
    if (!existing.includes('migration pending')) {
      console.log(`  skip (exists): ${pageFile}`);
      return;
    }
  }

  const content = `// ${componentName} page — App Router Server Component
// Nav padding rule: ${isHero ? 'hero page → pt-0' : 'interior page → pt-24'}

import ${componentName} from '@/components/${sectionId}';

export default function ${componentName}Page() {
  return (
    <main className="${ptClass}">
      <${componentName} />
    </main>
  );
}
`;

  fs.writeFileSync(pageFile, content, 'utf8');
  console.log(`  wrote: ${pageFile}`);
}

// ─── Extract mode ─────────────────────────────────────────────────────────────

function stripHtmlTags(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractImages(html, sectionId) {
  const images = [];
  const imgRegex = /<img[^>]+>/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    const tag = match[0];
    const src = (tag.match(/src=["']([^"']+)["']/) || [])[1] || '';
    const alt = (tag.match(/alt=["']([^"']*)["']/) || [])[1] || '';
    const width = parseInt((tag.match(/width=["']?(\d+)["']?/) || [])[1] || '0', 10) || undefined;
    const height = parseInt((tag.match(/height=["']?(\d+)["']?/) || [])[1] || '0', 10) || undefined;
    // Determine context from surrounding markup
    const before = html.slice(Math.max(0, match.index - 200), match.index);
    const contextMatch = before.match(/class=["'][^"']*?(gallery|hero|boat|about|card|logo|avatar|profile)[^"']*["']/i);
    const context = contextMatch ? contextMatch[1].toLowerCase() : sectionId;
    images.push({ src, alt, width: width || undefined, height: height || undefined, context });
  }
  return images;
}

function extractVideos(html) {
  const videos = [];
  const videoRegex = /<video[^>]*>([\s\S]*?)<\/video>/gi;
  let match;
  while ((match = videoRegex.exec(html)) !== null) {
    const tag = match[0];
    const src = (tag.match(/src=["']([^"']+)["']/) || [])[1] || '';
    const autoplay = /autoplay/i.test(tag);
    const muted = /muted/i.test(tag);
    const loop = /loop/i.test(tag);
    // Also grab <source> tags inside
    const sourceRegex = /<source[^>]+src=["']([^"']+)["'][^>]*>/gi;
    const sources = [];
    let sm;
    while ((sm = sourceRegex.exec(match[0])) !== null) sources.push(sm[1]);
    videos.push({ src: src || sources[0] || '', sources, autoplay, muted, loop });
  }
  return videos;
}

function extractIframes(html) {
  const iframes = [];
  const iframeRegex = /<iframe[^>]+>/gi;
  let match;
  while ((match = iframeRegex.exec(html)) !== null) {
    const tag = match[0];
    const src = (tag.match(/src=["']([^"']+)["']/) || [])[1] || '';
    const title = (tag.match(/title=["']([^"']*)["']/) || [])[1] || '';
    let type = 'other';
    if (src.includes('zeffy.com')) type = 'zeffy';
    else if (src.includes('maps') || src.includes('openstreetmap') || src.includes('esri')) type = 'map';
    iframes.push({ src, title, type });
  }
  return iframes;
}

function extractLinks(html) {
  const links = [];
  const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1];
    const text = stripHtmlTags(match[2]).trim();
    if (text && href) links.push({ href, text });
  }
  return links;
}

function extractButtons(html) {
  const buttons = [];
  const btnRegex = /<button[^>]*>([\s\S]*?)<\/button>/gi;
  let match;
  while ((match = btnRegex.exec(html)) !== null) {
    const text = stripHtmlTags(match[1]).trim();
    const type = (match[0].match(/type=["']([^"']+)["']/) || [])[1] || 'button';
    if (text) buttons.push({ text, type });
  }
  return buttons;
}

function extractLists(html) {
  const lists = [];
  const listRegex = /<(ul|ol)[^>]*>([\s\S]*?)<\/\1>/gi;
  let match;
  while ((match = listRegex.exec(html)) !== null) {
    const items = [];
    const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    let li;
    while ((li = liRegex.exec(match[2])) !== null) {
      const text = stripHtmlTags(li[1]).trim();
      if (text) items.push(text);
    }
    if (items.length > 0) lists.push({ type: match[1], items });
  }
  return lists;
}

function extractCards(html) {
  const cards = [];

  // Pattern 1: divs with class containing card/item/entry/tile/story or data-boat/data-card attributes
  const cardRegex = /<div[^>]+(?:class=["'][^"']*(?:card|item|entry|tile|story|opportunity|board)[^"']*["']|data-(?:boat|card)=["'][^"']*["'])[^>]*>([\s\S]*?)<\/div>/gi;
  let match;
  while ((match = cardRegex.exec(html)) !== null) {
    const inner = match[1];
    const titleMatch = inner.match(/<h[2-6][^>]*>([\s\S]*?)<\/h[2-6]>/i);
    const title = titleMatch ? stripHtmlTags(titleMatch[1]).trim() : '';
    const descMatch = inner.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const description = descMatch ? stripHtmlTags(descMatch[1]).trim() : '';
    const imgMatch = inner.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
    const linkMatch = inner.match(/<a[^>]+href=["']([^"']+)["'][^>]*>/i);
    if (title || description) {
      const card = { title, description };
      if (imgMatch) card.image = { src: imgMatch[1], alt: '', context: 'card' };
      if (linkMatch) card.link = { href: linkMatch[1], text: '' };
      cards.push(card);
    }
  }

  // Pattern 2: <details>/<summary> structures (boats section uses these)
  const detailsRegex = /<details[^>]*>([\s\S]*?)<\/details>/gi;
  while ((match = detailsRegex.exec(html)) !== null) {
    const inner = match[1];
    const summaryMatch = inner.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i);
    const title = summaryMatch ? stripHtmlTags(summaryMatch[1]).trim() : '';
    const descMatch = inner.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const description = descMatch ? stripHtmlTags(descMatch[1]).trim() : '';
    const imgMatch = inner.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
    if (title) {
      const card = { title, description, type: 'details' };
      if (imgMatch) card.image = { src: imgMatch[1], alt: '', context: 'boat' };
      cards.push(card);
    }
  }

  return cards;
}

function extractParagraphs(html) {
  const paragraphs = [];
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match;
  while ((match = pRegex.exec(html)) !== null) {
    const text = stripHtmlTags(match[1]).trim();
    if (text && text.length > 10) paragraphs.push(text);
  }
  return paragraphs;
}

function extractHeadings(html) {
  const headings = { heading: '', subheading: '' };
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h2 = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  const h3 = html.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
  headings.heading = stripHtmlTags((h1 || h2 || h3 || ['', ''])[1]).trim();
  if (h1 && h2) headings.subheading = stripHtmlTags(h2[1]).trim();
  else if (h2 && h3) headings.subheading = stripHtmlTags(h3[1]).trim();
  return headings;
}

function getLineRange(fullHtml, sectionHtml) {
  const start = fullHtml.indexOf(sectionHtml);
  if (start === -1) return [0, 0];
  const before = fullHtml.slice(0, start);
  const startLine = (before.match(/\n/g) || []).length + 1;
  const endLine = startLine + (sectionHtml.match(/\n/g) || []).length;
  return [startLine, endLine];
}

function buildManifest(sectionId, sectionHtml, fullHtml) {
  const images = extractImages(sectionHtml, sectionId);
  const videos = extractVideos(sectionHtml);
  const iframes = extractIframes(sectionHtml);
  const links = extractLinks(sectionHtml);
  const buttons = extractButtons(sectionHtml);
  const lists = extractLists(sectionHtml);
  const cards = extractCards(sectionHtml);
  const paragraphs = extractParagraphs(sectionHtml);
  const { heading, subheading } = extractHeadings(sectionHtml);
  const zeffyUrls = iframes.filter(i => i.type === 'zeffy').map(i => i.src);
  const lineRange = getLineRange(fullHtml, sectionHtml);

  const manifest = {
    section: sectionId,
    type: CLIENT_SECTIONS.has(sectionId) ? 'client' : 'server',
    route: ROUTES[sectionId] || `/${sectionId}`,
    content: {
      heading,
      ...(subheading ? { subheading } : {}),
      paragraphs,
      images,
      videos,
      links,
      iframes,
      cards,
      lists,
      buttons,
    },
    metadata: {
      lineRange,
      imageCount: images.length,
      videoCount: videos.length,
      hasSupabase: SUPABASE_SECTIONS.has(sectionId),
      isInteractive: CLIENT_SECTIONS.has(sectionId),
      zeffyUrls,
      leafletMarkers: sectionId === 'innisfree' || sectionId === 'home'
        ? [
            { lat: 29.5955, lng: -89.9067, label: 'Home Base' },
            { lat: 29.5534, lng: -89.9539, label: 'INNISFREE' },
          ]
        : [],
    },
  };

  return manifest;
}

function writeManifests(sections, fullHtml) {
  const manifestDir = path.join('scripts', 'manifests');
  if (!fs.existsSync(manifestDir)) fs.mkdirSync(manifestDir, { recursive: true });

  for (const { id, html } of sections) {
    if (!html) {
      console.log(`  skip manifest (no HTML): ${id}`);
      continue;
    }
    const manifest = buildManifest(id, html, fullHtml);
    const jsonFile = path.join(manifestDir, `${id}.json`);
    const htmlFile = path.join(manifestDir, `${id}.html`);
    fs.writeFileSync(jsonFile, JSON.stringify(manifest, null, 2), 'utf8');
    fs.writeFileSync(htmlFile, html, 'utf8');
    console.log(`  manifest: ${jsonFile} (${manifest.metadata.imageCount} images, ${manifest.metadata.zeffyUrls.length} zeffy URLs)`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);
  const extractMode = args.includes('--extract');
  const inputFlag = args.indexOf('--input');
  const inputPath = inputFlag >= 0 ? args[inputFlag + 1] : 'public/bayou-family-fishing.html';

  console.log('parse-sections.js — Bayou Charity HTML → Next.js stub generator');
  if (extractMode) console.log('Mode: --extract (generating content manifests)');

  let sections = KNOWN_SECTIONS.map(id => ({ id, html: null }));
  let fullHtml = '';

  if (fs.existsSync(inputPath)) {
    console.log(`Reading: ${inputPath}`);
    fullHtml = fs.readFileSync(inputPath, 'utf8');
    const sectionRegex = /<section[^>]+id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/section>/gi;
    const found = [];
    let match;
    while ((match = sectionRegex.exec(fullHtml)) !== null) {
      found.push({ id: match[1], html: match[2] });
    }
    if (found.length > 0) {
      sections = found;
      console.log(`Found ${found.length} sections in HTML.`);
    }
  } else {
    console.log(`HTML file not found at ${inputPath} — generating stubs for all known sections.`);
  }

  if (extractMode) {
    console.log('\nGenerating content manifests...');
    writeManifests(sections, fullHtml);
    console.log('\nDone. Review manifests in scripts/manifests/');
    console.log('Next: node scripts/verify-manifests.js');
  } else {
    for (const { id, html } of sections) {
      console.log(`Processing section: #${id}`);
      writeComponentStub(id, html);
      writePageStub(id);
    }
    console.log('\nDone. Review stubs in apps/web/components/ and apps/web/app/');
    console.log('Next: Replace each stub with the full migrated component in Phase 1.');
  }
}

main();
