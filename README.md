# Nordic Overland: one-page trade site (phase 1)

Plain HTML, CSS and vanilla JS. No build step, no dependencies.
Open `index.html` directly, or serve the folder (`npx serve` / VS Code Live Server).

## Page structure (all on `index.html`)
1. Hero: "The horntools distributor for Iceland" + Request dealer terms / See the range
2. `#supply` Who we supply: retailers, workshops and installers, rental companies, tour operators.
   Each row jumps to the form with "Type of business" preselected.
3. `#range` The range: nine horntools product groups
4. `#why` Why horntools: Austria, 5-year warranty, 100+ dealers
5. Fitment: 17 vehicle makes
6. `#contact` Request dealer terms: form + contact details

## Files
- `assets/css/style.css`: all styles; `logo-masks.css`: the logo as inlined masks (recolours with the season)
- `assets/js/main.js`: season switch, mobile menu, form (preview only, sends nothing)
- `assets/fonts/`: Barlow + Barlow Condensed, self-hosted (latin subset, covers þ ð æ)
- `assets/img/`: hero in 3 sizes, one crop from the hero photo, favicons

## Seasons
Two themes driven by `:root[data-theme="summer|winter"]` colour tokens at the top of `style.css`.
Auto-selected by the Icelandic calendar (summer: Thursday 19-25 April, winter: Saturday 21-27 October),
with a manual switch. A visitor's choice is kept until the next season change.
The inline script in `<head>` sets the theme before first paint.

## Placeholders to replace before launch
- Email `info@nordicoverland.is`, phone `+354 000 0000`, address "To be added" (search `index.html`)
- Range lists come from the public horntools range: trim to what is actually stocked
- "Buying for yourself?" line in the contact section: adjust to the client's real policy for private customers

## Planned WordPress mapping (phase 2)
- One front page (`front-page.php`) with ACF fields per section; header/footer -> `header.php` / `footer.php`
- Repeating parts (audiences, range items, vehicle makes) -> ACF repeaters, so the client edits rows, not HTML
- Form -> Contact Form 7 / WPForms with the same field names (company, name, email, phone, type, message)
- Head script -> `wp_head`; CSS/JS -> `wp_enqueue_style` / `wp_enqueue_script`
