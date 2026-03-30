---
name: vehicle-description-writer
description: Write wiki-style vehicle descriptions into content/vehicles markdown files. Use when generating, writing, or bulk-creating vehicle descriptions, or filling empty description sections.
---

# Vehicle Description Writer

Generates encyclopedic descriptions for vehicles in `content/vehicles/`. **Do not hunt for a separate vehicle data tree.**

## Workflow

### 1. Identify target vehicles

Determine which vehicles need descriptions. The user may specify:

- A single file (e.g., `content/vehicles/tiger-i.md`)
- A batch (e.g., "all vehicles without descriptions")
- A filtered set (e.g., "all tanks", "all Hawk Republic vehicles")

To find vehicles missing descriptions, look for files in `content/vehicles/` where `## Description` is immediately followed by a blank line and then `## Armor` (or end of file) with no content between them.

### 2. Gather facts

Use whatever is already available (conversation, repo, pasted material). Vehicle stats are often supplied as a single markdown file in the layout the table in step 3 refers to. If something essential is missing, ask rather than guess.

### 3. What to emphasize vs. omit

The vehicle page already shows most raw stats, so the description should add **context** rather than repeat tables.

Stats arrive as vehicle markdown (same layout you would have had in standalone data files). Read that **from whatever is supplied in context** — conversation, attachments, paste — not by searching the repo for a fixed tree. Extract only what you need for prose using this map:

**Use in the description** (for prose context):

| Data point | Location in file |
|---|---|
| Vehicle name | `# Header` |
| Role | `Role` definition list |
| Locomotion | Under `General information` (Tracked/Wheeled) |
| Amphibious | Under `General information` (if present) |
| Weight | `Vehicle` table |
| Crew count + roles | `Vehicle` table (Driver, Gunner, Commander, etc.) |
| Max speed | `Vehicle` table (Forward/Backward) |
| Engine | `Powertrain` table |
| Horsepower + hp/t | `Powertrain` table |
| Main weapon(s) | Weapon headers under turret sections (e.g., `#### [100mm D-10TS2]`) |
| Secondary weapon(s) | Additional weapon headers (MGs, ATGMs, etc.) |
| Notable features | `Feature:` lines (Stabilizer, FCS, Smoke grenades, APS) |
| Defenses | `Defenses` section (smoke system, jammers) |
| Sights/optics | Rangefinder type, zoom levels, thermals |

Weave those details into flowing prose; don't mirror whole tables.

**Do NOT include in the description** (already shown on the page):

- Team name
- Obtainment method (Free/Premium)
- Price / coin cost
- Loadout era (Cold War, WW2, etc.)
- Tier placement
- In-game availability table
- Addon details
- Armor values / thickness

### 4. Write the description

Insert the description in `content/vehicles/<file>.md` between `## Description` and whatever follows it (usually `## Armor` or end of file).

**Style**: Wiki-style encyclopedic, third-person, factual. Similar to a Wikipedia article's opening paragraph about a military vehicle.

**Length**: Full paragraph, 5–8 sentences.

**Structure** (general order):

1. What the vehicle is and its role (opening sentence)
2. Real-world historical background (origin, era, manufacturer, service history — use your knowledge of real military vehicles; see history guidelines below)
3. Crew composition and locomotion
4. Mobility characteristics (weight, speed, power-to-weight)
5. Main armament and fire control capabilities
6. Secondary armament or defensive systems
7. Notable features that set it apart (APS, amphibious, autoloader, thermals, etc.)

**History guidelines**:

- Use your knowledge of real-world military history to add 1–3 sentences of context: when it was developed, by whom, why, and its service record.
- For well-known vehicles (Tiger I, T-72, M1 Abrams, etc.), include key historical facts like manufacturer, year of introduction, and notable deployments.
- For obscure prototypes or fictional vehicles where you're not confident, keep it brief or skip the history. Don't fabricate.
- History should flow naturally into the technical description, not feel like a separate block.

**Formatting — bold names**:

- Use `**bold**` for proper names: vehicle designations, weapon designations, engine names, system names (e.g., **Drozd** APS).
- Only bold a name on its **first mention**. Subsequent references use plain text.
- The vehicle's own name in the opening sentence should be bolded.

**Rules**:

- Refer to the vehicle by its display name (the H1 in `content/vehicles/<file>.md`), not the filename.
- Use metric units as given in the materials you are working from.
- Don't list every stat — weave the important ones into flowing prose.
- Mention the crew count and key roles naturally (e.g., "operated by a crew of four").
- When describing weapons, use full designations when you have them (e.g., "100mm D-10TS2" not only "100mm gun").
- Do NOT include pricing, team, loadout, tier, or obtainment info — the page already shows these.

### 5. Batch processing

When processing multiple vehicles:

- Use the TodoWrite tool to track progress
- Process vehicles in alphabetical order by filename
- After writing each description, move to the next
- Report a summary at the end (how many written, any skipped because the target file or required context was missing)

## Examples

### Example: T-55AD

```md
# T-55AD

## Description

The **T-55AD** is a Main Battle Tank and a modernized variant of the Soviet T-55 series, one of the most widely produced tank families in history. Originally developed in the late 1950s by the Kharkiv design bureau, the T-55 saw service across dozens of nations; the AD variant introduced the **Drozd** active protection system — the world's first operational APS — to counter the growing threat of anti-tank guided missiles during the Cold War. Operated by a crew of four and riding on a tracked chassis weighing 38 tonnes, it is powered by a **ChTZ V-55V** diesel engine producing 580 horsepower for a 15.3 hp/t power-to-weight ratio and a top speed of 50 km/h. The main armament is a stabilized **100mm D-10TS2** cannon equipped with a laser rangefinder and fire control system, supplemented by a coaxial **7.62mm PKT** and a roof-mounted **12.7mm NSVT** machine gun. The Drozd APS provides frontal protection with four dual-charge launchers capable of intercepting incoming projectiles traveling between 70 and 700 m/s. The vehicle also features an engine smoke system for additional screening when withdrawing from engagements.

## Armor
```

### Example: Tiger I

```md
# Tiger I

## Description

The **Tiger I** is a Heavy Tank, formally designated Panzerkampfwagen VI Tiger Ausf. E, produced by Henschel & Sohn for Nazi Germany beginning in 1942. It earned a fearsome reputation on the Eastern and Western Fronts for its thick armor and powerful gun, though its weight and mechanical complexity limited production numbers to roughly 1,350 units. In-game, it is a heavily armored tracked vehicle weighing 57.3 tonnes, crewed by five — a driver, gunner, bow gunner, commander, and loader. The **MB HL230 P45** engine delivers 690 horsepower, though the substantial mass limits its power-to-weight ratio to 12 hp/t and top speed to 45 km/h; neutral steering helps compensate when maneuvering in tight spaces. Its primary armament is the formidable **88mm KwK36** cannon, complemented by two **7.92mm MG34** machine guns — one coaxial and one in the bow position. The turret features smoke grenades for defensive screening but lacks a stabilizer or modern fire control aids, relying on a 2.5x telescope sight.

## Armor
```

### Example: 2S14 Zhalo-S

```md
# 2S14 Zhalo-S

## Description

The **2S14 Zhalo-S** is a wheeled Tank Destroyer built on the BTR-70 chassis, developed in the Soviet Union during the 1980s as a lightweight, rapidly deployable anti-armor platform. The project sought to mount a high-velocity gun on an amphibious wheeled hull for use by airborne and reconnaissance units, though it never entered full serial production. Weighing just 12.5 tonnes, it is crewed by a driver, gunner, commander, and one passenger, and is fully amphibious at 4 km/h. Twin **ZMZ-4905** diesel engines produce a combined 240 horsepower, yielding an impressive 19.2 hp/t power-to-weight ratio and a top road speed of 80 km/h. Its primary weapon is the **85mm 2A62** cannon fed by an autoloader with a rapid 2.4-second reload cycle, carrying a mix of HE, APFSDS, and HEAT ammunition. The fire control system provides 6x magnification, though the vehicle lacks a laser rangefinder. Lightly protected by design, the Zhalo-S relies on speed and mobility rather than armor to survive on the battlefield.

## Armor
```
