#!/usr/bin/env node
/**
 * patch-addons-conf.js
 *
 * Reads (or creates) masterportal/addons/addonsConf.json and adds an entry
 * for the addon under test. The script auto-detects the addon type by
 * inspecting the addon's index.js / package.json.
 *
 * Usage:
 *   node scripts/patch-addons-conf.js --masterportal <path> --addon <name>
 */

const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ── CLI args ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
function getArg(name) {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 ? args[idx + 1] : null;
}

const masterportalDir = path.resolve(getArg('masterportal') || 'masterportal');
const addonName       = getArg('addon');

if (!addonName) {
  console.error('ERROR: --addon <name> is required');
  process.exit(1);
}

// ── Paths ───────────────────────────────────────────────────────────────────
const addonsDir     = path.join(masterportalDir, 'addons');
const confPath      = path.join(addonsDir, 'addonsConf.json');
const addonDir      = path.join(addonsDir, addonName);
const addonIndexJs  = path.join(addonDir, 'index.js');
const addonPkgJson  = path.join(addonDir, 'package.json');

// ── Detect addon type ───────────────────────────────────────────────────────
function detectAddonType(addonName, addonDir, indexJsPath) {
  // 1. Check if the addon's own package.json declares a type
  if (fs.existsSync(addonPkgJson)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(addonPkgJson, 'utf8'));
      if (pkg.addonType) return pkg.addonType;
    } catch (_) {}
  }

  // 2. Sniff index.js content for known patterns
  if (fs.existsSync(indexJsPath)) {
    const src = fs.readFileSync(indexJsPath, 'utf8');
    if (/gfiTheme/i.test(src))        return 'gfiTheme';
    if (/searchInterface/i.test(src)) return 'searchInterface';
    if (/filterSnippet/i.test(src))   return 'filterSnippet';
    if (/javascript/i.test(src))      return 'javascript';
    if (/control/i.test(src))         return 'control';
  }

  // 3. Directory-name heuristics
  if (/theme/i.test(addonName))            return 'gfiTheme';
  if (/search/i.test(addonName))           return 'searchInterface';
  if (/control/i.test(addonName))          return 'control';

  // 4. Default to tool
  return 'tool';
}

const addonType = detectAddonType(addonName, addonDir, addonIndexJs);
console.log(`Detected addon type for "${addonName}": ${addonType}`);

// ── Read / create addonsConf.json ───────────────────────────────────────────
let conf = {};
if (fs.existsSync(confPath)) {
  try {
    conf = JSON.parse(fs.readFileSync(confPath, 'utf8'));
  } catch (e) {
    console.warn(`Warning: could not parse existing addonsConf.json – starting fresh. (${e.message})`);
    conf = {};
  }
}

// Merge entry (don't overwrite existing config keys so manual tweaks survive)
if (!conf[addonName]) {
  conf[addonName] = { type: addonType };
} else {
  console.log(`Entry for "${addonName}" already exists – skipping.`);
}

fs.mkdirSync(addonsDir, { recursive: true });
fs.writeFileSync(confPath, JSON.stringify(conf, null, 2) + '\n', 'utf8');
console.log(`Written addonsConf.json:\n${JSON.stringify(conf, null, 2)}`);
