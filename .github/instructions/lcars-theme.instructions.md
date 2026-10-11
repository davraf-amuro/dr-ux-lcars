---
applyTo: "**/*.css,**/*.vue"
---

# Tema LCARS — Struttura, ruoli dei colori e componenti

Scopo: regole del tema LCARS per i frontend Vue 3 + Tailwind v4. La struttura (guscio a gomito, tipografia, forme, componenti) è una sola; le palette (`enterprise-d`, `enterprise-e`) cambiano solo i valori dei token.

Presuppone `design-tokens.instructions.md` di `dr-fe` (dipendenza del pacchetto): nomi dei token semantici, coppie `on-*`, soglie di contrasto e tema chiaro/scuro stanno lì e non si ripetono qui. Per applicare il tema a un progetto si usa il prompt `dr-ux-lcars-apply.prompt.md`.

---

## Regola 1 — Token propri del tema

Definiti in `tokens.css` accanto ai token semantici di dr-fe, **uguali in tema chiaro e scuro**.

| Token | Ruolo |
|---|---|
| `--c-lcars-frame` | Gomito, segmento lungo della testata, tappo del pannello hero |
| `--c-lcars-trim` | Coda della colonna, pulsante del tema, staffa dei pannelli, secondo segmento della testata |
| `--c-lcars-accent-1` … `--c-lcars-accent-4` | Voci di navigazione, nell'ordine; terzo segmento della testata (`accent-1`) e ultimo (`accent-4`) |
| `--c-on-lcars` | Unico colore di testo e icone sopra un blocco LCARS (quasi nero, canone LCARS) |
| `--lcars-bar` | Spessore delle barre (`1.25rem`) |
| `--lcars-elbow` | Raggio esterno del gomito e della coda (`2.5rem`) |
| `--lcars-gap` | Fessura tra blocchi (`4px`) |
| `--lcars-label` | Etichetta decorativa del gomito, stringa CSS (es. `'LCARS 1701-D'`) |

- Nomi di **ruolo**, mai di colore: un componente che scrive `--c-lcars-orange` è legato a una palette.
- Sopra un blocco LCARS si scrive solo con `--c-on-lcars`, contrasto ≥ 4.5:1 con ogni blocco.
- Nessun testo informativo direttamente su `--c-lcars-*` senza `--c-on-lcars`.
- Esposti a Tailwind con `@theme inline` (`bg-lcars-frame`, `bg-lcars-accent-1`, `text-on-lcars`).

---

## Regola 2 — Tipografia

- Font unico Saira variabile (`@fontsource-variable/saira`, asse `wdth` 50–125%), importato con `@fontsource-variable/saira/wdth.css`.
- Titoli `h1`–`h3`: `font-stretch: 62.5%`, peso 600, maiuscolo, `letter-spacing: 0.02em`, `line-height: 1.1`.
- Utility `.font-condensed` (`font-stretch: 62.5%`) per titoli e numeri grandi.
- Utility `.stencil` (sopratitoli, etichette, pulsanti): `font-stretch: 75%`, maiuscolo, `letter-spacing: var(--stencil-tracking)` con `--stencil-tracking: 0.08em`.
- Testo corrente a larghezza normale (`font-stretch: 100%`): il condensato si riserva a titoli ed etichette.

---

## Regola 3 — Guscio a gomito

**Desktop (≥ 48rem)**: griglia `15rem | 1fr`. La colonna sinistra è una barra LCARS continua, senza bordo né superficie, dall'alto in basso:

1. **Gomito**: blocco alto 6rem in `--c-lcars-frame`, `border-top-left-radius: var(--lcars-elbow)`, etichetta `--lcars-label` in basso a destra (mono, `aria-hidden`).
2. **Raccordo concavo** verso la barra della testata: `::after` di 1rem × 1rem a `left: 100%; top: var(--lcars-bar)` con `radial-gradient(circle at 100% 100%, transparent calc(1rem - 0.5px), var(--c-lcars-frame) 1rem)`.
3. **Voci di navigazione**: un blocco per voce, colore `accent-1..4` per indice (oltre la quarta si ricomincia), separati da `--lcars-gap`, testo `--c-on-lcars` maiuscolo in basso a destra, icona 20px.
4. **Coda**: blocco `flex: 1` in `--c-lcars-trim` fino al fondo, `border-bottom-left-radius: var(--lcars-elbow)`.

**Testata**: barra a segmenti alta `--lcars-bar`, saldata al gomito: segmento lungo `flex-1` in `frame`, poi 5rem in `trim`, 2.5rem in `accent-1`, 2rem in `accent-4` con estremità destra a pillola. Sotto la barra: marchio dell'app (anche su desktop), contenuto di stato, pulsante del tema a pillola 64 × 44px in `trim`.

**Mobile (< 48rem)**: niente gomito né coda; navigazione fissa in basso, una riga di blocchi con le estremità esterne a pillola; la barra della testata ha l'estremità sinistra arrotondata; il contenuto principale lascia spazio in basso alla navigazione.

**Voce attiva**: peso 800 + barra `--c-on-lcars` **staccata** dal bordo del blocco, con `linear-gradient` (desktop: da 6px a 14px dal bordo sinistro; mobile: da 4px a 9px dal basso). Staccata perché nel tema scuro una barra a filo si fonde con il fondo. Lo stato attivo non è mai affidato al solo colore; il link attivo ha `aria-current="page"`.

> **Insidia nota.** La visibilità del gomito e della coda si imposta con classi Tailwind (`hidden md:flex`, `hidden md:block`), **non** con `display` nello `<style scoped>`: lo stile scoped vince su `hidden` e il gomito comparirebbe su mobile.

---

## Regola 4 — Componenti condivisi

Props, slot ed eventi **invariati** rispetto alla versione dell'host: il tema cambia template e stile, non l'API.

| Componente | Forma LCARS |
|---|---|
| `BasePanel` | "Staffa": `border-width: 4px 0 4px 0.75rem`, `border-radius: 1.5rem 0 0 1.5rem`, `overflow: hidden`, fondo `--c-surface`, colore della staffa `--c-lcars-trim`. Variante `hero`: tappo da 1.25rem in `--c-lcars-frame` |
| `BaseButton`, link d'azione | `rounded-full`, `.stencil`, `px-5`, altezza minima `--hit-target-min`. Colori dai token semantici (`federal`, `alert`), non dai `--c-lcars-*` |
| `BaseBadge` | `rounded-full`; stato sempre anche a parole |
| Input, select | `rounded-full`, bordo `--c-control-border`, fondo `--c-surface` |
| `HazardStripe` | Blocchi `--c-alert` larghi 28px separati da fessure `--lcars-gap` nel colore `--c-bg` (allerta rossa LCARS). Solo decorativa (`aria-hidden`): il pericolo è sempre detto anche a parole |

I blocchi `--c-lcars-*` sono cornice: azioni, errori ed esiti usano i token semantici di dr-fe.

---

## Regola 5 — `theme-color` del browser

- `index.html`: due `<meta name="theme-color">`, uno per tema, con il valore di `--c-bg`:
  `media="(prefers-color-scheme: light)"` e `media="(prefers-color-scheme: dark)"`.
- `site.webmanifest` (se presente): `theme_color` e `background_color` uguali a `--c-bg` del tema chiaro.
- Cambiando palette si aggiornano anche questi valori.

---

## Regola 6 — Verifica

- Dopo ogni modifica di un colore: `node scripts/lcars-contrast.mjs` (installato dal pacchetto). Exit code diverso da 0 → contrasto insufficiente, il tema non si committa.
- I rapporti misurati si annotano in testa a `tokens.css` (Regola 4 di `design-tokens`).
- Lint, type-check, test e build restano quelli del progetto host. Controllo visivo a 375px e 1280px, tema chiaro e scuro.
- `prefers-reduced-motion` resta gestito in `main.css` come prescrive dr-fe.

---

## ✅ Checklist pre-commit

- [ ] Nessun nome di colore (`orange`, `tan`, …) nei componenti: solo `frame`, `trim`, `accent-1..4`?
- [ ] Testo su blocchi LCARS solo con `--c-on-lcars`?
- [ ] Gomito e coda nascosti su mobile con classi Tailwind, non con lo style scoped?
- [ ] Voce attiva con `aria-current`, peso e barra staccata, non solo colore?
- [ ] API dei componenti condivisi invariata?
- [ ] `theme-color` in `index.html` e `site.webmanifest` allineati a `--c-bg`?
- [ ] `node scripts/lcars-contrast.mjs` con exit code 0?

---

*Istruzione v1.0 - Tema LCARS - 2026-10-11 — claude-opus-5-5 — struttura estratta da dr-mailroom-fe, commit fcc1502 (Enterprise-E) e 0c81f5d (Enterprise-D) (dr-guidelines#13, #14)*
