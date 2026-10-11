#!/usr/bin/env node
/**
 * Verifica i contrasti WCAG 2.x dei token di un tema LCARS, in tema chiaro e scuro.
 *
 * Uso:  node scripts/lcars-contrast.mjs [percorso/tokens.css]
 *       default: src/assets/styles/tokens.css
 *
 * Legge solo il file indicato: nessuna rete, nessun eval. Exit code 0 se tutte le coppie
 * rispettano le soglie, 1 se almeno una fallisce, 2 se il file non si legge o mancano token.
 * Soglie e coppie: design-tokens.instructions.md (dr-fe) e lcars-theme.instructions.md.
 */
import { readFileSync } from 'node:fs'

const DEFAULT_PATH = 'src/assets/styles/tokens.css'
const TEXT_MIN = 4.5
const NON_TEXT_MIN = 3

const LIGHT_SELECTOR = ':root'
const DARK_SELECTORS = [":root[data-theme='dark']", ':root[data-theme="dark"]']
const SYSTEM_DARK_SELECTOR = ':root:not([data-theme])'

const SURFACES = ['--c-bg', '--c-surface']
// --c-federal, --c-alert, --c-ok sono anche testo (link, badge, pulsanti ghost): soglia 4.5:1,
// che copre anche l'anello di focus in --c-federal (3:1).
const TEXT_ON_SURFACES = ['--c-ink', '--c-ink-muted', '--c-neutral', '--c-federal', '--c-alert', '--c-ok']
const NON_TEXT_ON_SURFACES = ['--c-control-border']
const ON_PAIRS = [
  ['--c-on-federal', '--c-federal'],
  ['--c-on-alert', '--c-alert'],
  ['--c-on-caution', '--c-caution'],
  ['--c-on-ok', '--c-ok'],
]
const LCARS_BLOCKS = [
  '--c-lcars-frame',
  '--c-lcars-trim',
  '--c-lcars-accent-1',
  '--c-lcars-accent-2',
  '--c-lcars-accent-3',
  '--c-lcars-accent-4',
]

function parseBlocks(css) {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '')
  const blocks = new Map()
  // Solo i blocchi più interni: il selettore dentro @media resta il testo dopo la sua '{'
  for (const match of withoutComments.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = match[1].trim().replace(/\s+/g, ' ')
    const declarations = {}
    for (const decl of match[2].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
      declarations[decl[1]] = decl[2].trim()
    }
    blocks.set(selector, { ...(blocks.get(selector) ?? {}), ...declarations })
  }
  return blocks
}

function resolve(tokens, name, seen = new Set()) {
  const raw = tokens[name]
  if (raw === undefined) return undefined
  const reference = raw.match(/^var\(\s*(--[\w-]+)\s*\)$/)
  if (!reference) return raw
  if (seen.has(name)) throw new Error(`riferimento circolare su ${name}`)
  seen.add(name)
  return resolve(tokens, reference[1], seen)
}

function hexToRgb(value) {
  const hex = value.replace('#', '')
  if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) return undefined
  const full = hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16))
}

function luminance([r, g, b]) {
  const channel = (c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

function checkTheme(label, tokens, problems, results) {
  const color = (name) => {
    const value = resolve(tokens, name)
    if (value === undefined) {
      problems.push(`${label}: token mancante ${name}`)
      return undefined
    }
    const rgb = hexToRgb(value)
    if (!rgb) problems.push(`${label}: ${name} = '${value}' non è un esadecimale (#rgb o #rrggbb)`)
    return rgb
  }

  const pair = (fg, bg, min) => {
    const a = color(fg)
    const b = color(bg)
    if (!a || !b) return
    const ratio = contrast(a, b)
    results.push({ label, fg, bg, ratio, min, ok: ratio >= min })
  }

  for (const surface of SURFACES) {
    for (const fg of TEXT_ON_SURFACES) pair(fg, surface, TEXT_MIN)
    for (const fg of NON_TEXT_ON_SURFACES) pair(fg, surface, NON_TEXT_MIN)
  }
  for (const [fg, bg] of ON_PAIRS) pair(fg, bg, TEXT_MIN)
  for (const block of LCARS_BLOCKS) pair('--c-on-lcars', block, TEXT_MIN)
}

function main() {
  const path = process.argv[2] ?? DEFAULT_PATH
  let css
  try {
    css = readFileSync(path, 'utf8')
  } catch (error) {
    console.error(`Impossibile leggere ${path}: ${error.message}`)
    process.exit(2)
  }

  const blocks = parseBlocks(css)
  const light = blocks.get(LIGHT_SELECTOR)
  const darkSelector = DARK_SELECTORS.find((s) => blocks.has(s))
  if (!light || !darkSelector) {
    console.error(`${path}: servono i blocchi '${LIGHT_SELECTOR}' e '${DARK_SELECTORS[0]}'.`)
    process.exit(2)
  }

  const problems = []
  const results = []
  const dark = { ...light, ...blocks.get(darkSelector) }
  checkTheme('chiaro', light, problems, results)
  checkTheme('scuro', dark, problems, results)

  // Il blocco per la preferenza di sistema deve ripetere esattamente il tema scuro esplicito
  const systemDark = blocks.get(SYSTEM_DARK_SELECTOR)
  if (systemDark) {
    const explicitDark = blocks.get(darkSelector)
    for (const name of new Set([...Object.keys(explicitDark), ...Object.keys(systemDark)])) {
      if (explicitDark[name] !== systemDark[name]) {
        problems.push(`scuro: ${name} diverso tra '${darkSelector}' e '${SYSTEM_DARK_SELECTOR}'`)
      }
    }
  }

  for (const r of results) {
    const mark = r.ok ? 'ok  ' : 'FAIL'
    console.log(`${mark} ${r.label.padEnd(6)} ${r.fg} su ${r.bg}: ${r.ratio.toFixed(2)}:1 (min ${r.min}:1)`)
  }
  for (const p of problems) console.error(`ERRORE ${p}`)

  const failed = results.filter((r) => !r.ok).length
  if (problems.length > 0) process.exit(2)
  console.log(failed === 0 ? `\n${results.length} coppie verificate: tutte conformi.` : `\n${failed} coppie su ${results.length} sotto soglia.`)
  process.exit(failed === 0 ? 0 : 1)
}

main()
