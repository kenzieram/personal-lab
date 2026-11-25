# DESIGN.md: Kenzie. Personal Portfolio

## Design Read and Dials

> Reading this as: Editorial personal developer portfolio for technical peers, collaborators, and recruiters, in a bold royal-blue and warm-yellow editorial style, dial ENERGY 3 / RHYTHM 3 / MOTION 2.

- **ENERGY 3 (Bold):** Oversized display typography in Warm Yellow on Royal Blue, decisive full-bleed color shifts, and an authoritative editorial point of view.
- **RHYTHM 3 (Varied):** Distinct structural compositions across sections: full-bleed typographic hero, 2-column primary focus blocks paired with compact supporting rows, dark navy interactive terminal stage, 4/8 editorial biography split, compact project index, creative note, email-first contact split, and a discreet workspace entry band.
- **MOTION 2 (Balanced):** Purposeful hover/focus/press transitions, smooth anchor navigation, a focused terminal cursor, and a crisp mobile menu / command palette transition. All non-essential motion pauses or flattens under `prefers-reduced-motion: reduce`.

---

## Visual Identity

- **Displayed Brand:** `Kenzie.`
- **Private Workspace Brand:** `Personal Lab` (discreet entry at `/login`, visually separated from the public portfolio).
- **Primary Technical Identity:** Networking & Infrastructure (Cisco, MikroTik RouterOS, MTCNA in progress) and Cloud Computing (AWS fundamentals, Docker, Terraform).
- **Supporting Identity:** Software Development, Creative Technology, and Photography.
- **Core Motif:** Strong horizontal yellow or blue rules (`1px` and `2px`), editorial section numbering (`01` to `06`), and sharp rectangular framing with minimal radius (`2px` on editorial blocks, `6px` on the terminal window).

---

## Color Palette and Accessibility

### Primary Website Palette

| Token | Hex | Role |
|---|---|---|
| Royal Blue | `#005292` | Primary brand ground: navbar, hero, terminal band, selected work, footer |
| Warm Yellow | `#FFC928` | Editorial display headlines, horizontal dividers, primary focus accents, Personal Lab CTA band |
| Warm Off-White | `#F2F0E9` | Light editorial sections: Technical Focus, About, Photography, Contact |
| Charcoal | `#151A20` | Primary body text on `#F2F0E9` and `#FFC928` surfaces |
| Secondary Ink (Accessible) | `#525D6A` | Secondary metadata and labels on `#F2F0E9` (exceeds WCAG AA 4.5:1) |
| White | `#FFFFFF` | Body copy, primary links, and high-contrast text on `#005292` and `#101F32` |
| Soft Blue Tint | `#D6E8F8` | Secondary readable prose on `#005292` (contrast > 10:1 against `#005292`) |

### Terminal Palette

| Token | Hex | Role |
|---|---|---|
| Terminal Background | `#101F32` | Main terminal viewport |
| Terminal Surface | `#162941` | Terminal title bar and command suggestion bar |
| Prompt Blue | `#71B7F5` | `kenzie@portfolio ~ %` prompt, command echo, and keyboard `:focus-visible` underline |
| Output Green | `#A6D9B0` | Success indicators and structured labels |
| Highlight Yellow | `#F9E2AF` | Key paths, section highlights, and command names |
| Output White | `#FFFFFF` | Primary terminal output |
| Muted Blue Gray | `#AFC3D9` | Terminal metadata, hints, and secondary notes |

---

## Typography

- **Primary Font:** `Outfit` (loaded via `next/font/google` in `src/app/layout.tsx`, exposed as `--font-outfit`).
- **Terminal Font:** `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`.
- **Hierarchy:**
  - Hero `h1`: `clamp(2.75rem, 7vw, 6rem)`, weight `800`, line-height `0.98`, letter-spacing `-0.03em`.
  - Section `h2`: `clamp(2rem, 4vw, 3.25rem)`, weight `700`, line-height `1.08`, letter-spacing `-0.025em`.
  - Subsection `h3`: `clamp(1.25rem, 2vw, 1.5rem)`, weight `600`, line-height `1.25`.
  - Body Copy: `1rem` (`16px`), weight `400`, line-height `1.65`, max-width `62ch`.

---

## Layout Principles and Section Cadence

1. **01 Navigation** (`#005292`): `Kenzie.` wordmark left, 4 anchor links right (`Focus`, `About`, `Work`, `Contact`) matching top-to-bottom scroll order. Mobile drawer on `< 768px`.
2. **02 Hero** (`#005292`): Oversized `#FFC928` headline, yellow `1px` structural divider, concise intro mentioning Cloud Computing, Networking, and Software Engineering, with direct anchors to `#focus` and `#terminal`.
3. **03 Technical Focus** (`#F2F0E9`, `#focus`): Placed directly below the hero. Two bold **Primary** blocks (`Networking & Infrastructure` with `MTCNA: In Progress`, and `Cloud Computing` with AWS fundamentals, Docker, and Terraform) sit above a quieter ruled tier for **Supporting** areas (`Software Development` and `Creative Technology`).
4. **04 Interactive Terminal** (`#005292`, `#terminal`): Placed immediately after Technical Focus so visitors reach it within the first few scrolls. Dark navy (`#101F32`) Zsh-inspired browser interpreter.
5. **05 About** (`#F2F0E9`, `#about`): 4/8 editorial split covering student developer background, networking and cloud curiosity, and creative habits.
6. **06 Selected Work** (`#005292`, `#work`): Compact, honest showcase of genuine technical builds and experiments (without letting Personal Lab dominate).
7. **07 Photography & Creative Work** (`#F2F0E9`, `#creative`): Compact editorial note on photography as a supporting creative interest (no stock imagery).
8. **08 Contact** (`#F2F0E9`, `#contact`): Prominent `kenzie.ram@proton.me` `mailto:` link, one-click Copy Email button with feedback, and verified GitHub links.
9. **09 Personal Lab Access** (`#FFC928`, `#lab-access`): Discreet, compact workspace entry band near the bottom linking to `/login`.
10. **10 Footer** (`#005292`): Understated bar with `Kenzie.`, copyright, GitHub link, and `Back to top`.

---

## Terminal Focus and Integration Rules

- The terminal `<input>` blends directly into the `kenzie@portfolio ~ %` command line with no background fill, no rectangular border, and no yellow focus box.
- Pointer clicks focus the input cleanly without a yellow box; keyboard navigation (`:focus-visible`) displays a restrained `1.5px` `#71B7F5` (Prompt Blue) bottom underline on the input line alongside the active blinking cursor, meeting WCAG 2.2 C45 without disrupting the terminal aesthetic.
- Strictly client-side pure TypeScript command parser reading from `src/data/portfolio.ts`. No `eval`, no `child_process`, no network requests, no Supabase queries.
