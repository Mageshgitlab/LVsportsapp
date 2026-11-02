# LV Sports Carnival 🐉 (Mortal Kombat Edition)

A broadcast-grade TV dashboard and administrative control portal styled with a full **Mortal Kombat tournament theme**. Tailored specifically for large **75" TVs at 1920×1080 landscape**, ensuring high visibility from across the arena without vertical or horizontal scrolling.

---

## 📺 Live Routes (HashRouter)

- **TV Dashboard**: `/#/tv` (or root `/#/`)
  - Auto-rotating slides advancing every 5 seconds (configurable)
  - Mortal Kombat Outworld dark stone theme, torch-flicker animations, and glowing red/gold runic borders
  - Persistent header: MK Dragon Medallion, jagged metallic lettering, and live blood-red/gold clock
  - Persistent footer: Scrolling Kombat dispatch ticker with realm standings and scores
  - Bottom health-bar style progress bar displaying time left for current slide + diamond position dots
  - Screen shake and flash transitions (respects `prefers-reduced-motion` and Admin intensity settings)
  - Audio sound effects (Gong, "FIGHT!", "FINISH HIM!", "FLAWLESS VICTORY"), muted by default with audio toggle
  - Auto-hides mouse cursor after 3 seconds of inactivity
  - Keyboard shortcuts:
    - `Space`: Pause / Resume auto-slideshow
    - `Left Arrow`: Previous slide
    - `Right Arrow`: Next slide
- **Admin Portal**: `/#/admin`
  - Protected with passcode gate: **`lv2026`**
  - Tabs: Teams, Members, Games, Results, Announcements, **Theme & FX**, Settings
  - Theme Tab: sound on/off, volume slider, sound test buttons, effect intensity (low / medium / high), plain dark fallback toggle
  - Interactive 16:9 TV Simulation Live Preview
  - Instant JSON Export / Import and Default Seed Data Reset

---

## 🛡️ The Four Contending Factions (MK Persona)

| Squad | Faction | MK Warrior Look | Primary Color | Champion (Captain) | Co-Champion (Vice Captain) | Default Squad |
| :--- | :---: | :--- | :---: | :--- | :--- | :--- |
| **Pardus** | **A** | **Scorpion** (Netherrealm Hellfire) | Yellow (`#EAB308`) | Rajesh | Saathithya | 13 Registered Athletes |
| **Falcon Fury** | **B** | **Sub-Zero** (Lin Kuei Cryomancer) | Ice Blue (`#38BDF8`) | Sathish | Monisha | 13 Registered Athletes |
| **Stormbreakers** | **C** | **Raiden** (Thunder God) | Lightning Blue (`#F0F9FF`) | Rohithkumar | Abdul Aziz | 14 Registered Athletes |
| **Tiger Ka Hukum** | **D** | **Liu Kang** (Shaolin Dragon Fire) | Dragon Red (`#DC2626`) | Pugazh Vaanan | Kanishka | *Squad to be announced* |

---

## 🎯 Slides (Auto-looping Sequence)

1. **Welcome / Hero**: Dragon logo flame-in, "CHOOSE YOUR TEAM", Outworld arena background.
2. **Teams Overview**: Character-select grid with glowing selection frames.
3. **Team A – Pardus**: Scorpion fighter-profile layout + 13-member character-select roster.
4. **Team B – Falcon Fury**: Sub-Zero fighter-profile layout + 13-member character-select roster.
5. **Team C – Stormbreakers**: Raiden fighter-profile layout + 14-member character-select roster.
6. **Team D – Tiger Ka Hukum**: Liu Kang fighter-profile + "STATUS: AWAITING SOUL SUMMON" / "Squad to be announced".
7. **Captains & Vice Captains**: "Champions & Co-Champions of the Realms" showcase.
8. **Games Schedule**: Tournament ladder look; fixtures presented with big "VS" and "FIGHT!".
9. **Points Table / Leaderboard**: MK health-bar style points meters; Rank 1 gets gold "FLAWLESS VICTORY" badge.
10. **Game-wise Results**: Winner displays "FINISH HIM! ➔ VICTORY" (+10 pts) and Runner-up (+5 pts).
11. **Announcements**: Ancient Outworld stone-tablet panel with torch-glow.
12. **Sponsors & Partners**: Honored Realm Guilds on dark stone dragon cards.

---

## 🎨 Theme Architecture

All theme definitions and assets are fully centralized:
- **Design Tokens & Factions**: `src/theme/mk-theme.ts`
- **Global Styles & Animations**: `src/styles/mk-theme.css`
- **Asset Config & Placeholders**: `src/config/assets.ts`

Sound effects load from `/public/audio/` (`gong.mp3`, `fight.mp3`, `finish_him.mp3`, `flawless_victory.mp3`). If audio files are not present, an internal Web Audio API synthesizer generates realistic gong strikes and combat hits automatically.

---

## 🚀 Setup & Local Execution

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Production build
npm run build

# 4. Deploy to GitHub Pages
npm run deploy
```

---

## 🔐 Admin Passcode
- **Passcode**: `lv2026`
