# Coffee Timer Design System

「北欧の明るいキッチンに、木製のコーヒー道具が置かれている雰囲気」— a bright, calm, Scandinavian-kitchen redesign of the Coffee Timer PWA.

## Product context

**Coffee Timer** (source: https://github.com/khaki1981/CoffeeTimer) is a smartphone-first PWA that:

- Manages coffee brewing with multiple sequential timers (蒸らし → 1投目 → 2投目 …)
- Saves brewing menus (メニュー編集: menu name + steps with seconds)
- Records coffee beans (豆メモ: name, roaster, origin, process, roast level, dates, price, weight)
- Rates taste on 8 axes (酸味・苦味・甘み・コク・香り・後味・飲みやすさ・総合評価) with a radar chart
- Tracks flavor notes (チョコレート, 柑橘, 花, 紅茶 …), repeat rating, favorites
- Has sound settings: notification sounds (Bell/Wood/Soft) and BGM (Morning Coffee, Cafe Jazz, Rain, Lo-Fi) with volume sliders and toggles

The original design is dark brown (dark café). **This design system replaces it** with a bright Nordic direction per the owner's brief: ivory/white/light-greige surfaces, brown reserved for buttons/headings/accents, small doses of sage green and blue-gray, warmth without heaviness.

Explore the repo above for exact feature behavior, copy, and data schema (`docs/coffee-bean-memo.md`, `docs/database-schema.md`).

## Design concept

**明るい・静か・手仕事の温かみ。** The screen is the bright kitchen counter (ivory, white); the brown elements are the wooden tools placed on it (buttons, headings, borders). Sage and blue-gray are the ceramic and linen touches. Friendly over premium; operability over decoration; big readable timer digits.

### Color usage ratio

- **~70%** ivory / paper backgrounds (`--ivory`, `--paper`)
- **~20%** greige wells, hairlines, muted text (`--greige`, `--border-line`)
- **~8%** brown — buttons, headings, key borders (`--wood-600`, `--wood-300`)
- **~2%** accents — sage / blue-gray / terracotta, one at a time, small areas

Never use brown as a full-screen or full-card background. Never use more than one saturated accent in the same component.

## CONTENT FUNDAMENTALS

- **Language:** Japanese UI copy with English product/feature names ("Coffee Timer", "Coffee Bean Memo", "Morning Coffee", "Bell").
- **Tone:** plain, quiet, instructional. No exclamation marks, no marketing voice. Labels are nouns: 「メニュー名」「豆の名前」「焙煎度」. Buttons are short verbs: 「記録」「保存」「編集」「新規」「閉じる」.
- **Status copy** is calm and stateful: 「準備完了」「現在：蒸らし」.
- **Person:** no I/you; imperative-neutral (「〜してください」 only in docs, not UI).
- **Emoji:** the original uses sparse functional glyphs (☕ on the bean-memo button, ⭐ for favorites). Keep at most these two; do not add decorative emoji.
- **Numbers** always tabular: 01:00, 90℃, 20g, 300ml.

## VISUAL FOUNDATIONS

- **Colors:** see `tokens/colors.css`. Warm neutrals; text is dark brown (#3F3028), never pure black. Semantic: sage = success/complete/brewing, blue-gray = info/links, terracotta = favorites/attention/destructive-lite.
- **Type:** Zen Kaku Gothic New (JP body/UI — clean, slightly rounded, friendly) + Outfit (EN display, headings, timer digits; geometric, Nordic). Timer digits use `font-variant-numeric: tabular-nums`. Hierarchy in `tokens/typography.css`. Japanese body line-height 1.7.
- **Spacing:** 4px base scale; 20px page padding; 24px between cards; 44px minimum hit targets, 64px round timer controls. Phone column max 480px, centered on desktop (max 720px with two-column form grids).
- **Backgrounds:** flat ivory. No photos, no gradients, no wood-grain textures (the brief forbids heavy woodgrain — warmth comes from color, not texture).
- **Corner radii:** generous and friendly — 10px inputs, 14px buttons, 20px cards, pill chips/toggles/round controls. Uniform corners (the old quirky uneven radii are retired).
- **Borders:** 1px hairline #E0DACD on cards; 1.5px #CFC6B5 on inputs; brown 1.5px marks focus/active.
- **Shadows:** very soft, warm-tinted (rgba(63,48,40,…)), low elevation. Cards: `--shadow-card`. Never hard/black shadows.
- **Hover:** background tint shifts (paper → wood-soft, brown darkens ~8%). **Press:** translateY(1px) + shadow removed. **Focus:** 2px `--focus-ring` outline, 2px offset.
- **Animation:** short and quiet — 120ms color, 220ms expand/collapse with `--ease-out`. No bounces. Respect `prefers-reduced-motion`.
- **Transparency/blur:** not used; surfaces are opaque.
- **Cards:** white (#FFFEFA), 20px radius, hairline border + soft shadow, 20px padding.
- **Progress:** sage fill on greige track; completed steps sage, current step brown, upcoming greige.

## ICONOGRAPHY

The source app has **no logo and no icon set** — it uses unicode glyphs (▶ ⏸ ■ ♪ × ＋ ▼ ⌄) and two emoji (☕ ⭐). Per that convention plus mobile clarity needs, this system uses **Lucide** (CDN, stroke icons, 1.75px stroke — matches the light handmade line quality): `https://unpkg.com/lucide@latest` or copy individual SVGs. Key mappings: play/pause/square (timer), coffee (beans), music (sound), plus, chevron-down, pencil (edit), star (favorite — filled terracotta when active). Wordmark: render "Coffee Timer" in Outfit 600 — **no drawn logo exists; do not invent one.**

- **Intentional addition:** Lucide icon substitution for unicode glyphs (flagged: source used raw glyphs; swap back if the owner prefers).
- **Intentional addition:** `ProgressSteps` component — requested explicitly in the design brief (進捗表示), not present in source.

## Index

- `styles.css` — global entry (imports everything below)
- `tokens/` — fonts, colors, typography, spacing, effects, base
- `guidelines/` — foundation specimen cards (Design System tab)
- `components/core/` — Button, ControlButton, Card, Tag, Collapsible
- `components/forms/` — Input, Select, Toggle, Slider, RatingScale
- `components/timer/` — TimerDisplay, ProgressSteps
- `components/beans/` — BeanCard, RadarChart
- `ui_kits/coffee-timer/` — full app screen recreation (index.html)
- `SKILL.md` — agent skill entry point
