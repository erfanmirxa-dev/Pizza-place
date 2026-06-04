# Pizza Place — Denham Springs, LA

A production-grade single-page marketing site for **Pizza Place**, a family-run
pizzeria & po-boy kitchen on LA-16 in Denham Springs / Watson, Louisiana.

**Live files**
- `index.html` — markup + structured data
- `assets/css/styles.css` — design system & layout
- `assets/js/main.js` — interactions
- `assets/img/` — photographic & video assets (see *Asset pipeline* below)

No build step. Open `index.html` or serve the folder:
```
python3 -m http.server 8000   # then visit http://localhost:8000
```

---

## Real business details (verified)

| | |
|---|---|
| **Address** | 34646 LA-16, Denham Springs, LA 70706 |
| **Phone** | (225) 664-8254 |
| **Rating** | 4.5★ · 412 Google reviews |
| **Price** | $10–20 |
| **Hours** | Mon–Thu 10:30am–8:00pm · Fri–Sat 10:30am–8:30pm · Sun 10:30am–8:00pm |
| **Notes** | Dine in · Take-out · Delivery · Kids' menu · No reservations |

Hours, rating and contact details are also encoded as `Restaurant` JSON-LD in
`index.html` for SEO, and the open/closed pill + today's-hours highlight are
computed live in `main.js` from the schedule above.

### Social proof — verbatim reviews
Used word-for-word in the Reviews and Story sections (sourced from public Google /
Yelp / Restaurantji listings for this location):

- “Great food and great employees.”
- “I've never had a bad pizza from here.”
- “Great pizza, po-boys, and friendly service.”
- “We love the food and staff. The food is delicious and the staff is so friendly. They have become family to us!”

The headline and body copy are written to match that warm, plain-spoken,
family-run voice.

---

## Design system

Deliberately **not** the generic template look — no Inter/Roboto, no purple
gradients, no centered hero with twin CTAs, no carousel.

- **Type** — `Fraunces` (expressive optical serif, display & quotes) ·
  `Hanken Grotesk` (humanist text) · `Space Mono` (labels, prices, hours).
  Micro-typography: tabular figures for all numbers, balanced headlines
  (`text-wrap:balance`), mono eyebrow labels with wide tracking, optical-size
  axis on the serif, italic `SOFT` axis for emphasis.
- **Palette** — wood-oven warmth: charred espresso `#160f0a`, cream paper
  `#f7eddb`, ember `#ea5a22`, tomato `#c0341d`, gold `#e9b949`, basil `#7d8a48`.
- **Layout** — asymmetric hero (copy left, rippling logo right), full menu with
  category tabs, signature stills grid, verbatim review wall, live hours +
  embedded OpenStreetMap of the real address.

### Real animation (all respects `prefers-reduced-motion`)
- **3D pizza-slice logo with a true ripple** — inline SVG slice driven by an
  animated `feTurbulence` + `feDisplacementMap` filter (`#ripple`), plus
  concentric expanding ripple rings and a flickering oven halo.
- **Brick-oven hero** — canvas ember particle system biased toward the oven
  side + radial firelight glow that flickers.
- Sticky nav shrink, IntersectionObserver scroll reveals (staggered), CSS
  marquee of specialties (pause on hover), animated menu-tab panels.

---

## Asset pipeline (MCP-generated photos & hero video)

The brief calls for **MCP-generated stills and a hero video — no stock, no
placeholders**. During this build the Higgsfield MCP image/video backend
returned `User not found` on every `generate_image` / `generate_video` /
`balance` call (an account-provisioning error on the MCP side, not a code
issue), so the photographic assets could not be generated yet.

Until they land, every media slot renders **bespoke hand-authored SVG/CSS art**
(the 3D pizza logo, oven glow, food illustrations) — real custom artwork, not
gray placeholders. Swapping in generated photography is intentionally a
one-liner.

### How to swap in real photos (no code changes beyond the tag)
1. Generate the image via the Higgsfield MCP (prompts below), download it to
   `assets/img/`.
2. Drop an `<img>` into the matching `.shot__art` block — CSS makes it cover the
   vector art automatically:
   ```html
   <div class="shot__art shot__art--pie" aria-hidden="true">
     <img src="assets/img/supreme.jpg" alt="Watson Supreme pizza" />
     <svg class="food food--pie" ...><use href="#slice"/></svg>
   </div>
   ```
3. For the hero video, add inside `<section class="hero">` (a slot comment marks
   the spot):
   ```html
   <video class="hero__video" autoplay muted loop playsinline poster="assets/img/hero.jpg">
     <source src="assets/img/hero.mp4" type="video/mp4" />
   </video>
   ```

### Ready-to-run generation prompts
Model: `nano_banana_pro` (stills, 2k–4k) → `veo3` / `kling3_0` (image-to-video).

- **hero (16:9 → video)** — “Cinematic interior of a cozy family-run Louisiana
  pizzeria at night; glowing wood-fired brick oven with dancing flames on the
  right, a fresh pepperoni pizza on a wooden peel at the oven mouth, charred
  fire-brick, drifting smoke, warm amber firelight, deep shadows, shallow DOF,
  no people, no text, 35mm film grain.”
- **supreme** — “Top-down photo of a loaded supreme pizza fresh from a wood oven:
  pepperoni, Italian sausage, mushroom, peppers, black olives, bubbling golden
  mozzarella, charred crust, rustic wooden board, warm light, steam.”
- **muffaletta** — “Louisiana muffaletta on a round sesame loaf, ham, salami,
  provolone, olive salad, cut in quarters, on white paper on an orange tray,
  casual diner, warm light.”
- **poboy** — “Roast beef po-boy on French bread, gravy, dressed with lettuce
  and tomato, on butcher paper, warm diner light, shallow DOF.”
- **rings** — “Stack of thick-cut golden onion rings on a white plate, casual
  pizzeria table, warm appetizing light, shallow DOF.”
- **interior** — “Warm corner of a Louisiana pizzeria: brick oven glow, wooden
  counter dusted with flour, hanging pendant light, cozy, lived-in, no people.”

`data-shot` attributes on each `<figure>` (`hero`, `supreme`, `muffaletta`,
`poboy`, `rings`, `interior`) map slots to the prompts above.

---

## Notes
- The design reference `Pizza Place Wireframes.html`
  (`api.anthropic.com/v1/design/...`) returned **HTTP 404** to the fetch tool
  (authenticated link, not reachable here), so the layout was built from the
  written brief and the business's real menu/photos. If you can export that
  wireframe to the repo, the structure here maps cleanly onto it.
