# CLAIRA — What You Carry Into the Light

A single-page site for **CLAIRA**, a quiet-luxury women's handbag maison.
Built to continue directly from the brand's hero (nav + "New Handbags for
Her" campaign banner) down through a full story: manifesto, signature bag,
collection, craftsmanship, campaign editorial, word of mouth, and a
newsletter close.

**Live files**
- `index.html` — markup
- `assets/css/styles.css` — design system & layout
- `assets/js/main.js` — scroll-progress bar, nav state, mobile drawer, reveals
- `assets/img/` — campaign photography, cropped from the supplied hero shot

No build step. Serve the folder:
```
python3 -m http.server 8000   # then visit http://localhost:8000
```

---

## Design system

- **Type** — `Cormorant Garamond` (light weight, wide tracking) for every
  headline and display moment; `Jost` for navigation, labels and body copy,
  with generous letter-spacing on small uppercase elements (eyebrows,
  chapter numbers, footer column heads).
- **Palette** — warm bone `#F5EFE4`, deeper bone `#EAE0CD`, deep espresso
  `#2B2019`, soft near-black `#15100C`, cream `#FBF6EC` for text on dark.
  One accent only: campaign pink `#ED1E84` — the exact tone of the
  signature bag — used sparingly on hairlines, link underlines, the
  scroll-progress bar and the small chapter numbers.
- **Journey: shadow into light** — the hero photo scrims into deep espresso
  at its base, the manifesto section that follows holds that same espresso
  shadow, chapter 02 fades espresso → bone as the signature bag is
  introduced, and the rest of the page settles into warm bone (dipping to
  near-black once more for the campaign quote) before the footer closes the
  loop back in espresso — a literal read of "what you carry into the light."

## Sections

01. Hero — kept exactly as supplied (nav, `WOMEN` eyebrow, "New Handbags for
    Her", `Shop Now`), re-set in the brand's type system.
02. Manifesto — the tagline, large-scale.
03. Signature spotlight — the campaign pink tote, in close detail.
04. The Collection — four bags as hand-drawn SVG line art (no stock).
05. Craftsmanship — materials, hardware, the atelier process.
06. Campaign quote — a full-bleed editorial statement.
07. Word of mouth — three short testimonials.
08. Join the Maison — newsletter capture.
09. Footer — sitemap, contact, copyright.

## Imagery

The only supplied asset was a hero mockup screenshot (nav + campaign photo
baked together). It was reprocessed with Pillow into clean, text-free crops
— `hero.jpg`, `signature`/`bag-detail.jpg`, `portrait.jpg`, `coast.jpg` — so
the real nav and headline could be rebuilt as live HTML/CSS in the brand's
own type rather than flattened into the photo. The product grid uses
bespoke inline-SVG bag silhouettes in place of unavailable studio
photography (the Higgsfield image-generation MCP was unavailable in this
session).
