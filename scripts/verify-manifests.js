#!/usr/bin/env node
/**
 * verify-manifests.js
 * Quick-checks content manifests for expected values.
 * Run after parse-sections.js --extract.
 *
 * Usage: node scripts/verify-manifests.js
 *
 * Checks:
 *   - All 8 manifests exist
 *   - gallery: imageCount >= 30
 *   - donate: zeffyUrls.length >= 1
 *   - volunteer: zeffyUrls.length >= 1
 *   - boats: content.cards.length >= 3
 *   - about: content.cards.length >= 2
 *   - innisfree: metadata.leafletMarkers.length === 2
 *   - members: metadata.hasSupabase === true
 *   - All: heading is non-empty
 */

const fs = require('fs');
const path = require('path');

const MANIFEST_DIR = path.join('scripts', 'manifests');

const EXPECTED = {
  home:      { minImages: 0, minZeffy: 0, minCards: 0, hasSupabase: false },
  gallery:   { minImages: 30, minZeffy: 0, minCards: 0, hasSupabase: true },
  members:   { minImages: 0, minZeffy: 0, minCards: 0, hasSupabase: true },
  boats:     { minImages: 1, minZeffy: 0, minCards: 3, hasSupabase: false },
  volunteer: { minImages: 0, minZeffy: 1, minCards: 0, hasSupabase: false },
  donate:    { minImages: 0, minZeffy: 1, minCards: 0, hasSupabase: false },
  about:     { minImages: 1, minZeffy: 0, minCards: 2, hasSupabase: false },
  innisfree: { minImages: 0, minZeffy: 0, minCards: 0, hasSupabase: false, requireMarkers: true },
};

let passed = 0;
let failed = 0;

function check(label, condition, detail = '') {
  if (condition) {
    console.log(`  ✅ ${label}${detail ? ' — ' + detail : ''}`);
    passed++;
  } else {
    console.log(`  ❌ ${label}${detail ? ' — ' + detail : ''}`);
    failed++;
  }
}

function verifyManifest(sectionId, expected) {
  console.log(`\n[ ${sectionId} ]`);
  const jsonFile = path.join(MANIFEST_DIR, `${sectionId}.json`);
  const htmlFile = path.join(MANIFEST_DIR, `${sectionId}.html`);

  check('manifest JSON exists', fs.existsSync(jsonFile));
  check('manifest HTML exists', fs.existsSync(htmlFile));

  if (!fs.existsSync(jsonFile)) return;

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
  } catch (e) {
    check('manifest JSON is valid', false, e.message);
    return;
  }

  check('section field matches', manifest.section === sectionId, `got: ${manifest.section}`);
  check('route field present', !!manifest.route, `got: ${manifest.route}`);
  check('type field valid', manifest.type === 'server' || manifest.type === 'client', `got: ${manifest.type}`);
  check('heading non-empty', manifest.content && manifest.content.heading !== undefined);

  if (expected.minImages > 0) {
    check(
      `imageCount >= ${expected.minImages}`,
      manifest.metadata.imageCount >= expected.minImages,
      `got: ${manifest.metadata.imageCount}`
    );
  } else {
    console.log(`  ℹ️  imageCount: ${manifest.metadata.imageCount}`);
  }

  if (expected.minZeffy > 0) {
    check(
      `zeffyUrls >= ${expected.minZeffy}`,
      manifest.metadata.zeffyUrls.length >= expected.minZeffy,
      `got: ${JSON.stringify(manifest.metadata.zeffyUrls)}`
    );
  } else {
    console.log(`  ℹ️  zeffyUrls: ${manifest.metadata.zeffyUrls.length}`);
  }

  if (expected.minCards > 0) {
    check(
      `cards.length >= ${expected.minCards}`,
      manifest.content.cards.length >= expected.minCards,
      `got: ${manifest.content.cards.length}`
    );
  } else {
    console.log(`  ℹ️  cards: ${manifest.content.cards.length}`);
  }

  if (expected.hasSupabase) {
    check('hasSupabase === true', manifest.metadata.hasSupabase === true);
  }

  if (expected.requireMarkers) {
    check(
      'leafletMarkers === 2',
      manifest.metadata.leafletMarkers.length === 2,
      `got: ${manifest.metadata.leafletMarkers.length}`
    );
  }

  console.log(`  ℹ️  paragraphs: ${manifest.content.paragraphs.length}, videos: ${manifest.metadata.videoCount}`);
}

function main() {
  console.log('verify-manifests.js — Bayou Charity manifest verification');
  console.log(`Manifest dir: ${MANIFEST_DIR}\n`);

  if (!fs.existsSync(MANIFEST_DIR)) {
    console.error('❌ scripts/manifests/ does not exist. Run parse-sections.js --extract first.');
    process.exit(1);
  }

  for (const [sectionId, expected] of Object.entries(EXPECTED)) {
    verifyManifest(sectionId, expected);
  }

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`RESULT: ${passed} passed, ${failed} failed`);

  if (failed > 0) {
    console.log('\n⚠️  Fix the failures above before dispatching agents.');
    console.log('If image/card counts are wrong, check parse-sections.js extraction logic.');
    process.exit(1);
  } else {
    console.log('\n✅ All checks passed. Manifests are ready for agent dispatch.');
  }
}

main();
