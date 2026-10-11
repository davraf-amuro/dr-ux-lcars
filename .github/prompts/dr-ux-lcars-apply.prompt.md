---
agent: 'agent'
description: 'Applica o cambia la palette del tema LCARS (enterprise-d, enterprise-e) in un frontend Vue 3 + Tailwind v4'
tools: ['search/codebase', 'edit/editFiles', 'runCommands']
---

# Prompt: applica il tema LCARS

Applica il tema LCARS al frontend Vue del progetto corrente, oppure cambia la palette di un tema LCARS già applicato.

Le regole del tema stanno in `.github/instructions/lcars-theme.instructions.md`; il contratto dei token in `.github/instructions/design-tokens.instructions.md` (pacchetto `dr-fe`). Leggile entrambe per intero prima di scrivere: questo prompt dice **cosa** applicare e **in che ordine**, non ripete le regole.

## Regola d'oro

**Mai sovrascrivere in silenzio un file dell'host.** Per ogni file che esiste già: mostra il diff proposto, spiega cosa cambia, chiedi conferma. Nei componenti esistenti si conservano `<script>`, props, slot, eventi e logica dell'host: cambiano solo template (classi) e `<style>`. I sorgenti qui sotto sono **riferimenti**, non file da incollare a occhi chiusi.

## Fase 1 — Prerequisiti (fermati se uno manca)

1. `.ai/dr-guidelines-packages.json` elenca `dr-fe` e `dr-ux-lcars`. Se manca `dr-fe` → fermati: senza contratto dei token il tema non ha regole.
2. `package.json` contiene `vue` (3.x) e `tailwindcss` 4.x (con `@tailwindcss/vite`). Altrimenti → fermati e dichiara che il tema non si applica a questo stack.
3. Individua i file. Percorsi attesi (struttura di `frontend-organization.instructions.md`):
   - `src/assets/styles/tokens.css`, `src/assets/styles/main.css`
   - `src/App.vue`, `src/components/shell/AppSidebar.vue`, `src/components/shell/AppHeader.vue`
   - `src/components/shared/BasePanel.vue`, `BaseButton.vue`, `BaseBadge.vue`, `HazardStripe.vue`
   - `index.html`, `public/site.webmanifest`
   Percorso diverso o componente con altro nome → chiedi all'utente quale file corrisponde; non indovinare.
4. Palette: se l'utente non l'ha indicata, chiedi `enterprise-d` (TNG: nero e pastelli caldi) o `enterprise-e` (First Contact: blu acciaio, tortora, ruggine).

## Fase 2 — Solo cambio palette

Se `tokens.css` contiene già `--c-lcars-frame`, il tema è applicato: sostituisci **solo** i valori di `tokens.css` con quelli della palette scelta (Fase 3, passo 1) e i `theme-color` (Fase 3, passo 6). I componenti non si toccano. Poi vai alla Fase 4.

## Fase 3 — Applicazione completa

Un passo alla volta, con conferma per ogni file esistente.

1. **`tokens.css`** — sostituisci con la palette scelta (sezione "Palette" in fondo). Token propri dell'host non presenti qui (es. `--panel-bevel` di un tema precedente): elencali e chiedi se rimuoverli; se un componente li usa ancora, segnalalo.
2. **Font** — se manca `@fontsource-variable/saira` in `package.json`, proponi `npm install @fontsource-variable/saira` e attendi conferma.
3. **`main.css`** — integra il riferimento "main.css": import di Saira, `@custom-variant dark`, alias `@theme inline` dei token LCARS, `h1`–`h3`, `.font-condensed`, `.stencil`, focus unico, `prefers-reduced-motion`. Mantieni gli import e le regole proprie dell'host che non confliggono.
4. **Guscio** — `App.vue`, `AppSidebar.vue`, `AppHeader.vue` dai riferimenti. Le voci di navigazione, il marchio e il contenuto di stato restano quelli dell'host: dai riferimenti prendi struttura, classi e stile.
5. **Condivisi** — `BasePanel`, `BaseButton`, `BaseBadge`, `HazardStripe` dai riferimenti, API dell'host invariata. Poi cerca `<input`, `<select`, `<textarea` e i link d'azione: proponi l'elenco dei punti da portare a `rounded-full` (Regola 4 dell'istruzione) e applica dopo conferma.
6. **`theme-color`** — in `index.html` due `<meta name="theme-color">` con `--c-bg` chiaro e scuro della palette (tabella in fondo); in `site.webmanifest`, se esiste, `theme_color` e `background_color` uguali a `--c-bg` chiaro.

## Fase 4 — Verifica

1. `node scripts/lcars-contrast.mjs` (percorso diverso di `tokens.css` → passalo come argomento). Exit code diverso da 0 → mostra le coppie `FAIL` e fermati: non si committa un tema sotto soglia.
2. Comandi di verifica dell'host dichiarati dalla sua istruzione di dominio (lint senza `--fix`, format, type-check, test, build). Tutti verdi.
3. Chiedi all'utente un controllo visivo a 375px e 1280px, tema chiaro e scuro: gomito assente su mobile, voce attiva riconoscibile senza colore, anello di focus visibile su ogni blocco.

## Output

- File modificati e creati, con una riga di motivo ciascuno
- Esito dello script contrasti (numero di coppie, eventuali `FAIL`)
- Esito dei comandi di verifica
- Token o file dell'host lasciati intatti e perché

---

## Riferimento — `main.css`

```css
@import '@fontsource-variable/saira/wdth.css';
@import 'tailwindcss';
@import './tokens.css';

/* La variante dark segue l'attributo impostato da useTheme, non solo la preferenza di sistema. */
@custom-variant dark (&:where([data-theme='dark'], [data-theme='dark'] *));

/* Token esposti a Tailwind: bg-surface, text-ink, bg-lcars-frame, text-on-lcars… */
@theme inline {
  --color-bg: var(--c-bg);
  --color-surface: var(--c-surface);
  --color-panel-line: var(--c-panel-line);
  --color-control-border: var(--c-control-border);
  --color-ink: var(--c-ink);
  --color-ink-muted: var(--c-ink-muted);
  --color-federal: var(--c-federal);
  --color-on-federal: var(--c-on-federal);
  --color-alert: var(--c-alert);
  --color-on-alert: var(--c-on-alert);
  --color-caution: var(--c-caution);
  --color-on-caution: var(--c-on-caution);
  --color-ok: var(--c-ok);
  --color-on-ok: var(--c-on-ok);
  --color-neutral: var(--c-neutral);
  --color-lcars-frame: var(--c-lcars-frame);
  --color-lcars-trim: var(--c-lcars-trim);
  --color-lcars-accent-1: var(--c-lcars-accent-1);
  --color-lcars-accent-2: var(--c-lcars-accent-2);
  --color-lcars-accent-3: var(--c-lcars-accent-3);
  --color-lcars-accent-4: var(--c-lcars-accent-4);
  --color-on-lcars: var(--c-on-lcars);

  --font-sans: 'Saira Variable', system-ui, sans-serif;
  --font-display: 'Saira Variable', system-ui, sans-serif;
  --font-mono: ui-monospace, 'Cascadia Mono', Consolas, monospace;
}

@layer base {
  html {
    background-color: var(--c-bg);
    color: var(--c-ink);
    font-family: var(--font-sans);
    font-stretch: 100%;
  }

  body {
    min-height: 100vh;
    line-height: 1.5;
  }

  /* Anello di focus unico per tutti gli elementi interattivi. */
  :focus-visible {
    outline: var(--focus-ring-width) solid var(--c-federal);
    outline-offset: var(--focus-ring-offset);
  }

  /* Lettering LCARS: Saira condensata, maiuscolo. */
  h1,
  h2,
  h3 {
    font-family: var(--font-display);
    font-stretch: 62.5%;
    font-weight: 600;
    line-height: 1.1;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }
}

@layer utilities {
  /* Titoli e numeri grandi in Saira condensata. */
  .font-condensed {
    font-stretch: 62.5%;
  }

  /* Sopratitoli, etichette e pulsanti: maiuscolo spaziato, condensato. */
  .stencil {
    font-stretch: 75%;
    text-transform: uppercase;
    letter-spacing: var(--stencil-tracking);
  }
}

/* Collegamento "Vai al contenuto": fuori schermo finché non riceve il focus da tastiera. */
.skip-link {
  position: fixed;
  top: 0.5rem;
  left: 0.5rem;
  z-index: 60;
  transform: translateY(-200%);
}

.skip-link:focus {
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Se l'host usa già un font monospaziato (es. `@fontsource-variable/jetbrains-mono`), tienilo in `--font-mono`.

## Riferimento — `App.vue` (solo il guscio)

Conserva provider, transizioni e logica dell'host; il riferimento mostra griglia, link "Vai al contenuto" e spazio per la navigazione mobile.

```vue
<script setup lang="ts">
import { RouterView } from 'vue-router'

import AppHeader from '@/components/shell/AppHeader.vue'
import AppSidebar from '@/components/shell/AppSidebar.vue'

const MAIN_CONTENT_ID = 'main-content'
</script>

<template>
  <a :href="`#${MAIN_CONTENT_ID}`" class="skip-link bg-federal px-4 py-2 font-semibold text-on-federal">
    Vai al contenuto
  </a>
  <div class="min-h-screen md:grid md:grid-cols-[15rem_1fr]">
    <AppSidebar />
    <div class="flex min-w-0 flex-col">
      <AppHeader>
        <template #brand>
          <!-- Marchio dell'host -->
        </template>
        <!-- Contenuto di stato dell'host (banner, avvisi) -->
      </AppHeader>
      <main :id="MAIN_CONTENT_ID" tabindex="-1" class="app-main flex-1 px-4 pt-4 pb-24 md:px-6 md:pb-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-main:focus {
  outline: none;
}
</style>
```

## Riferimento — `AppSidebar.vue`

Le voci (`links`) restano quelle dell'host, con la loro sorgente (route, meta, costanti). Il colore del blocco si assegna per indice: nessun nome di colore nel componente.

```vue
<script setup lang="ts">
import { type Component } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'

interface NavLink {
  to: RouteLocationRaw
  label: string
  icon: Component
}

// Voci dell'host: mantieni la sorgente esistente, qui serve solo la forma.
const links: NavLink[] = []

/** Blocchi LCARS delle voci, per indice: oltre la quarta voce si ricomincia. */
const ACCENTS = [
  'bg-lcars-accent-1',
  'bg-lcars-accent-2',
  'bg-lcars-accent-3',
  'bg-lcars-accent-4',
] as const
const accentOf = (index: number) => ACCENTS[index % ACCENTS.length]
</script>

<template>
  <nav
    aria-label="Navigazione principale"
    class="fixed inset-x-0 bottom-0 z-30 bg-bg p-1 md:sticky md:top-0 md:flex md:h-screen md:flex-col md:gap-(--lcars-gap) md:p-0 md:pl-3"
  >
    <!-- Gomito LCARS: si salda alla barra superiore della testata. Visibilità con classi, non nello style scoped -->
    <div class="lcars-elbow stencil hidden font-mono text-xs text-on-lcars md:flex" aria-hidden="true" />
    <ul class="grid auto-cols-fr grid-flow-col gap-(--lcars-gap) md:flex md:flex-col">
      <li v-for="(link, index) in links" :key="link.label">
        <RouterLink
          :to="link.to"
          class="nav-link stencil flex min-h-14 flex-col items-center justify-center gap-1 px-2 text-xs font-semibold text-on-lcars md:flex-row md:items-end md:justify-end md:gap-3 md:px-4 md:pb-1.5 md:text-base"
          :class="accentOf(index)"
        >
          <component :is="link.icon" :size="20" :stroke-width="1.75" aria-hidden="true" />
          <span>{{ link.label }}</span>
        </RouterLink>
      </li>
    </ul>
    <!-- Coda della colonna: chiude la cornice in basso -->
    <div class="lcars-tail hidden flex-1 md:block" aria-hidden="true" />
  </nav>
</template>

<style scoped>
.lcars-elbow {
  position: relative;
  align-items: flex-end;
  justify-content: flex-end;
  height: 6rem;
  padding: 0 1rem 0.375rem;
  background: var(--c-lcars-frame);
  border-top-left-radius: var(--lcars-elbow);
}

/* Etichetta decorativa: il testo viene dalla palette (--lcars-label). */
.lcars-elbow::before {
  content: var(--lcars-label);
}

/* Raccordo concavo tra gomito e barra orizzontale della testata. */
.lcars-elbow::after {
  content: '';
  position: absolute;
  top: var(--lcars-bar);
  left: 100%;
  width: 1rem;
  height: 1rem;
  background: radial-gradient(
    circle at 100% 100%,
    transparent calc(1rem - 0.5px),
    var(--c-lcars-frame) 1rem
  );
}

.lcars-tail {
  background: var(--c-lcars-trim);
  border-bottom-left-radius: var(--lcars-elbow);
}

/* Barra in basso su mobile: estremità a pillola. */
li:first-child .nav-link {
  border-radius: 9999px 0 0 9999px;
}

li:last-child .nav-link {
  border-radius: 0 9999px 9999px 0;
}

@media (min-width: 48rem) {
  li:first-child .nav-link,
  li:last-child .nav-link {
    border-radius: 0;
  }
}

.nav-link:hover {
  filter: brightness(1.12);
}

/*
 * Voce attiva: barra scura e peso maggiore, non il solo colore. La barra è staccata dal bordo
 * del blocco, così resta visibile anche sul fondo del tema scuro.
 */
.nav-link[aria-current='page'] {
  font-weight: 800;
  background-image: linear-gradient(to top, transparent 4px, var(--c-on-lcars) 4px 9px, transparent 9px);
}

@media (min-width: 48rem) {
  .nav-link[aria-current='page'] {
    background-image: linear-gradient(to right, transparent 6px, var(--c-on-lcars) 6px 14px, transparent 14px);
  }
}
</style>
```

## Riferimento — `AppHeader.vue`

Il pulsante del tema usa il composable dell'host (`useTheme` di `composables/shared/`, oppure lo store `ui` se l'host lo incapsula lì). Le icone sono quelle già usate dall'host.

```vue
<script setup lang="ts">
import { useTheme } from '@/composables/shared/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <header class="bg-bg">
    <!-- Barra LCARS a segmenti: su desktop prosegue il gomito della colonna di navigazione -->
    <div class="flex h-(--lcars-bar) gap-(--lcars-gap) pr-3 md:pr-4" aria-hidden="true">
      <div class="flex-1 rounded-l-full bg-lcars-frame md:rounded-none" />
      <div class="w-20 bg-lcars-trim" />
      <div class="w-10 bg-lcars-accent-1" />
      <div class="w-8 rounded-r-full bg-lcars-accent-4" />
    </div>
    <div class="flex items-center gap-4 px-4 py-3 md:px-8">
      <div class="shrink-0">
        <slot name="brand" />
      </div>
      <div class="min-w-0 flex-1">
        <slot />
      </div>
      <button
        type="button"
        class="inline-flex h-11 w-16 shrink-0 items-center justify-center rounded-full bg-lcars-trim text-on-lcars hover:brightness-110"
        :aria-pressed="isDark"
        aria-label="Tema scuro"
        :title="isDark ? 'Passa al tema chiaro' : 'Passa al tema scuro'"
        @click="toggleTheme()"
      >
        <!-- Icona sole/luna dell'host, 20px, aria-hidden -->
      </button>
    </div>
  </header>
</template>
```

## Riferimento — `BasePanel.vue`

```vue
<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Elemento radice: section per i pannelli con titolo, div per i contenitori. */
    as?: 'section' | 'div' | 'article'
    /** Cella "eroe" della vista: staffa più spessa nel colore della cornice. */
    hero?: boolean
  }>(),
  { as: 'div', hero: false },
)
</script>

<template>
  <!-- Staffa LCARS: tappo sinistro arrotondato che prosegue in filetti sopra e sotto -->
  <component :is="as" class="lcars-panel bg-surface" :class="{ 'lcars-panel--hero': hero }">
    <div class="panel-body p-4">
      <slot />
    </div>
  </component>
</template>

<style scoped>
.lcars-panel {
  --panel-cap: var(--c-lcars-trim);
  --panel-cap-width: 0.75rem;

  overflow: hidden;
  border-style: solid;
  border-color: var(--panel-cap);
  border-width: 4px 0 4px var(--panel-cap-width);
  border-radius: 1.5rem 0 0 1.5rem;
}

.lcars-panel--hero {
  --panel-cap: var(--c-lcars-frame);
  --panel-cap-width: 1.25rem;
}

.panel-body {
  height: 100%;
}
</style>
```

## Riferimento — `BaseButton.vue` e `BaseBadge.vue` (solo classi)

Varianti e props restano quelle dell'host. Classi della radice:

```text
BaseButton: stencil inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-5 font-semibold
            transition-opacity disabled:cursor-not-allowed disabled:opacity-60
            primary   → bg-federal text-on-federal border-federal
            secondary → bg-surface text-federal border-control-border
            danger    → bg-alert text-on-alert border-alert
            ghost     → bg-transparent text-federal border-transparent

BaseBadge:  inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-sm font-semibold whitespace-nowrap
            ok → border-ok text-ok · alert → border-alert text-alert · neutral → border-neutral text-neutral
            federal → border-federal text-federal · caution → border-caution bg-caution text-on-caution
```

## Riferimento — `HazardStripe.vue` (solo stile)

```css
/* Allerta rossa LCARS: blocchi rossi separati da fessure del colore di fondo. Solo decorativa. */
.alert-stripe {
  width: 100%;
  background: repeating-linear-gradient(
    90deg,
    var(--c-alert) 0 28px,
    var(--c-bg) 28px calc(28px + var(--lcars-gap))
  );
}
```

---

## Palette

| Palette | `theme-color` chiaro | `theme-color` scuro | Etichetta del gomito |
|---|---|---|---|
| `enterprise-d` | `#f4ebe0` | `#000000` | `LCARS 1701-D` |
| `enterprise-e` | `#e8e4dc` | `#05070c` | `LCARS 1701-E` |

### `tokens.css` — `enterprise-d`

```css
/*
 * Tema LCARS, palette "enterprise-d" (Star Trek: The Next Generation): nero pieno, arancio,
 * pesca, lilla, pervinca e rosso. Struttura e ruoli: lcars-theme.instructions.md.
 * Contrasti (WCAG 2.x) verificati con scripts/lcars-contrast.mjs il <data>: testo >= 4.5:1,
 * bordi dei controlli e focus >= 3:1, in chiaro e in scuro.
 * --c-caution non si usa mai come colore del testo: solo fondo, con --c-on-caution sopra.
 * Sopra i blocchi --c-lcars-* si scrive solo con --c-on-lcars.
 */


:root {
  color-scheme: light;

  /* Tema chiaro "plancia diurna": superfici pesca chiaro, stessi blocchi LCARS. */
  --c-bg: #f4ebe0;
  --c-surface: #fbf6ef;
  --c-panel-line: #dccfc0;
  --c-control-border: #6e6478;
  --c-ink: #14101c;
  --c-ink-muted: #4f4658;
  --c-federal: #4b3f9e;
  --c-on-federal: #ffffff;
  --c-alert: #a8323a;
  --c-on-alert: #ffffff;
  --c-caution: #ff9900;
  --c-on-caution: #14101c;
  --c-ok: #2f6b3a;
  --c-on-ok: #ffffff;
  --c-neutral: #5e5668;

  /* Blocchi LCARS per ruolo, uguali nei due temi. */
  --c-lcars-frame: #ff9900;
  --c-lcars-trim: #cc99cc;
  --c-lcars-accent-1: #9999ff;
  --c-lcars-accent-2: #ffcc99;
  --c-lcars-accent-3: #cc99cc;
  --c-lcars-accent-4: #cc6666;
  --c-on-lcars: #000000;

  --focus-ring-width: 3px;
  --focus-ring-offset: 2px;
  --hit-target-min: 44px;
  --stencil-tracking: 0.08em;

  /* Cornice LCARS: spessore delle barre e raggio esterno del gomito. */
  --lcars-bar: 1.25rem;
  --lcars-elbow: 2.5rem;
  --lcars-gap: 4px;
  --lcars-label: 'LCARS 1701-D';
}

/* Tema scuro "ponte di comando": scelta esplicita (useTheme) oppure preferenza di sistema. */
:root[data-theme='dark'] {
  color-scheme: dark;

  --c-bg: #000000;
  --c-surface: #0e0c14;
  --c-panel-line: #2e2838;
  --c-control-border: #8a7f9e;
  --c-ink: #f5ede1;
  --c-ink-muted: #c9b8a6;
  --c-federal: #9999ff;
  --c-on-federal: #000000;
  --c-alert: #ff6666;
  --c-on-alert: #000000;
  --c-on-caution: #000000;
  --c-ok: #99cc99;
  --c-on-ok: #000000;
  --c-neutral: #aaa0b8;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    color-scheme: dark;

    --c-bg: #000000;
    --c-surface: #0e0c14;
    --c-panel-line: #2e2838;
    --c-control-border: #8a7f9e;
    --c-ink: #f5ede1;
    --c-ink-muted: #c9b8a6;
    --c-federal: #9999ff;
    --c-on-federal: #000000;
    --c-alert: #ff6666;
    --c-on-alert: #000000;
    --c-on-caution: #000000;
    --c-ok: #99cc99;
    --c-on-ok: #000000;
    --c-neutral: #aaa0b8;
  }
}
```

### `tokens.css` — `enterprise-e`

```css
/*
 * Tema LCARS, palette "enterprise-e" (Star Trek: First Contact): fondo quasi nero, blu acciaio,
 * tortora e ruggine. Struttura e ruoli: lcars-theme.instructions.md.
 * Contrasti (WCAG 2.x) verificati con scripts/lcars-contrast.mjs il <data>: testo >= 4.5:1,
 * bordi dei controlli e focus >= 3:1, in chiaro e in scuro.
 * --c-caution non si usa mai come colore del testo: solo fondo, con --c-on-caution sopra.
 * Sopra i blocchi --c-lcars-* si scrive solo con --c-on-lcars.
 */


:root {
  color-scheme: light;

  /* Tema chiaro "plancia diurna": superfici tortora chiaro, stessi blocchi LCARS. */
  --c-bg: #e8e4dc;
  --c-surface: #f5f2ec;
  --c-panel-line: #cfc7b8;
  --c-control-border: #6b6556;
  --c-ink: #10141c;
  --c-ink-muted: #4a4f5c;
  --c-federal: #2f4a80;
  --c-on-federal: #ffffff;
  --c-alert: #a8321f;
  --c-on-alert: #ffffff;
  --c-caution: #d9b07c;
  --c-on-caution: #10141c;
  --c-ok: #1f6b4a;
  --c-on-ok: #ffffff;
  --c-neutral: #5a6070;

  /* Blocchi LCARS per ruolo, uguali nei due temi. */
  --c-lcars-frame: #c79c6e;
  --c-lcars-trim: #8a9bb8;
  --c-lcars-accent-1: #6c86bc;
  --c-lcars-accent-2: #c79c6e;
  --c-lcars-accent-3: #8a9bb8;
  --c-lcars-accent-4: #c85c44;
  --c-on-lcars: #05070c;

  --focus-ring-width: 3px;
  --focus-ring-offset: 2px;
  --hit-target-min: 44px;
  --stencil-tracking: 0.08em;

  /* Cornice LCARS: spessore delle barre e raggio esterno del gomito. */
  --lcars-bar: 1.25rem;
  --lcars-elbow: 2.5rem;
  --lcars-gap: 4px;
  --lcars-label: 'LCARS 1701-E';
}

/* Tema scuro "ponte di comando": scelta esplicita (useTheme) oppure preferenza di sistema. */
:root[data-theme='dark'] {
  color-scheme: dark;

  --c-bg: #05070c;
  --c-surface: #10141c;
  --c-panel-line: #2a3242;
  --c-control-border: #6f7f99;
  --c-ink: #e6e9f0;
  --c-ink-muted: #9aa6bb;
  --c-federal: #7d9ad6;
  --c-on-federal: #05070c;
  --c-alert: #e0533f;
  --c-on-alert: #05070c;
  --c-on-caution: #05070c;
  --c-ok: #6fc7a0;
  --c-on-ok: #05070c;
  --c-neutral: #8a96ad;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    color-scheme: dark;

    --c-bg: #05070c;
    --c-surface: #10141c;
    --c-panel-line: #2a3242;
    --c-control-border: #6f7f99;
    --c-ink: #e6e9f0;
    --c-ink-muted: #9aa6bb;
    --c-federal: #7d9ad6;
    --c-on-federal: #05070c;
    --c-alert: #e0533f;
    --c-on-alert: #05070c;
    --c-on-caution: #05070c;
    --c-ok: #6fc7a0;
    --c-on-ok: #05070c;
    --c-neutral: #8a96ad;
  }
}
```

Sostituisci `<data>` con la data della verifica di Fase 4.

---

*Prompt v1.0 - Applica tema LCARS - 2026-10-11 — claude-opus-5-5 — riferimenti estratti da dr-mailroom-fe, commit fcc1502 (enterprise-e) e 0c81f5d (enterprise-d) (dr-guidelines#13, #14)*
