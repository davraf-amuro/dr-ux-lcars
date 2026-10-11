# dr-ux-lcars

Pacchetto di temi grafici LCARS per frontend Vue 3 + Tailwind v4: una struttura (guscio a gomito, tipografia, componenti) e due palette, `enterprise-d` ed `enterprise-e`, con verifica automatica dei contrasti.

## 🧩 Cosa contiene

| File | Tipo | A cosa serve |
|------|------|--------------|
| `.github/instructions/lcars-theme.instructions.md` | Istruzione | Regole del tema: token per ruolo (`--c-lcars-frame`, `--c-lcars-trim`, `--c-lcars-accent-1..4`, `--c-on-lcars`), token di forma, tipografia Saira condensata, guscio a gomito su desktop e barra in basso su mobile, voce attiva riconoscibile senza colore, forma LCARS dei componenti condivisi, `theme-color`, verifica. |
| `.github/prompts/dr-ux-lcars-apply.prompt.md` | Prompt | Applica il tema a un frontend esistente o cambia palette. Contiene i sorgenti di riferimento (`tokens.css` delle due palette, `main.css`, guscio, componenti condivisi). Mostra il diff e chiede conferma per ogni file dell'host: non sovrascrive mai in silenzio. Su Claude Code si usa chiedendo all'agente di seguire il prompt. |
| `scripts/lcars-contrast.mjs` | Script Node | Legge `tokens.css` e verifica i contrasti WCAG 2.x di ogni coppia, in chiaro e in scuro. Exit code `0` conforme, `1` coppie sotto soglia, `2` file illeggibile o token mancanti. Nessuna dipendenza, nessuna rete. |

### Le palette

| Palette | Ispirazione | Fondo chiaro / scuro | Blocchi (frame · trim · accent 1–4) |
|---|---|---|---|
| `enterprise-d` | Star Trek: The Next Generation | `#f4ebe0` / `#000000` | arancio · lilla · pervinca, pesca, lilla, rosso |
| `enterprise-e` | Star Trek: First Contact | `#e8e4dc` / `#05070c` | tortora · acciaio · blu, tortora, acciaio, ruggine |

Le palette cambiano solo i valori dei token: componenti e struttura sono identici.

## 🔗 Dipendenze e domini

- Dipende da: `dr-fe`. Il tema fornisce i token di `design-tokens.instructions.md` di `dr-fe` (nomi, coppie `on-*`, soglie di contrasto, tema chiaro/scuro con `data-theme`); senza quel contratto le regole del tema non hanno base. L'installer installa `dr-fe` prima, se manca.
- Richiesto da: nessuno.
- Applicabilità nel catalogo: `appliesTo: node`.
- Dominio del catalogo: `web-frontend`. Tipologia che lo propone: `vue-fe`, in `optionalPackages`.
- Stack richiesto nell'host: Vue 3, Tailwind CSS 4 con `@tailwindcss/vite`, Node per lo script dei contrasti. Font `@fontsource-variable/saira` (il prompt propone di installarlo se manca).

## 🚀 Come si installa

Esegui dalla **root del repository del frontend**: l'installer usa la cartella corrente come destinazione. Prerequisiti: PowerShell 7, git, `gh auth status` autenticato.

Via core:

```powershell
Set-Location <root-del-frontend>
& ([scriptblock]::Create((gh api repos/davraf-amuro/dr-guidelines/contents/dr-guidelines-install.ps1 -H "Accept: application/vnd.github.raw" | Out-String))) -Package dr-ux-lcars
```

Oppure con l'installer del pacchetto:

```powershell
& ([scriptblock]::Create((gh api repos/davraf-amuro/dr-ux-lcars/contents/dr-ux-lcars-install.ps1 -H "Accept: application/vnd.github.raw" | Out-String)))
```

L'installer porta istruzione, prompt e script: **non modifica i sorgenti del frontend**. Il tema si applica dopo, con il prompt `dr-ux-lcars-apply.prompt.md`, scegliendo la palette.

## 📦 Cosa finisce nel progetto host

| Percorso nel progetto host | Contenuto |
|----------------------------|-----------|
| `.github/instructions/lcars-theme.instructions.md` | Copia dell'istruzione del tema |
| `.github/prompts/dr-ux-lcars-apply.prompt.md` | Copia del prompt di applicazione |
| `scripts/lcars-contrast.mjs` | Script di verifica dei contrasti |
| `.ai/dr-guidelines-packages.json` | Voce `dr-ux-lcars` in `installed` (e `dr-fe`, se installato come dipendenza) |

Dopo il prompt di applicazione cambiano anche `src/assets/styles/tokens.css`, `main.css`, il guscio (`App.vue`, `AppSidebar.vue`, `AppHeader.vue`), i componenti condivisi, `index.html` e `site.webmanifest`: sempre con diff mostrato e conferma.

`LICENSE`, `.github/ISSUE_TEMPLATE/` e `dr-ux-lcars-install.ps1` restano in questo repo.

Senza `-Update` un file già presente viene saltato (`[SKIP]`).

## 🔄 Aggiornare

Tutti i pacchetti del progetto: `/dr-get-latest`.

Solo questo pacchetto:

```powershell
& ([scriptblock]::Create((gh api repos/davraf-amuro/dr-ux-lcars/contents/dr-ux-lcars-install.ps1 -H "Accept: application/vnd.github.raw" | Out-String))) -Update
```

`-Update` sovrascrive istruzione, prompt e script, mai i sorgenti del frontend. Per portare nel frontend una correzione del tema, rilancia il prompt di applicazione.

Cambiare palette: rilancia il prompt e scegli l'altra; cambiano solo `tokens.css` e i `theme-color`.

## 🐞 Segnalare un problema o una miglioria

Non correggere la copia nel progetto host: si perde al primo `-Update`. Dal progetto host usa `/dr-file-feedback <descrizione>` (su Copilot il prompt `.github/prompts/dr-file-feedback.prompt.md` del core): apre la issue in questo repo.

| Modello | Quando |
|---------|--------|
| `.github/ISSUE_TEMPLATE/miglioria.md` | Richiesta evolutiva, nuova palette |
| `.github/ISSUE_TEMPLATE/problema.md` | Malfunzionamento |

LCARS e Star Trek sono marchi di Paramount; questo pacchetto è un omaggio non ufficiale e non usa materiale grafico originale.

---

*Revisione v1.0 — 2026-10-11 — claude-opus-5-5*
