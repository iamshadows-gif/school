# Hello Kidz School — Public Website (frontend)

A static, multi-page website: plain HTML, CSS and vanilla JavaScript. No build step, no frameworks, no external fonts, scripts, images or maps.

## 1. Run the site locally (Windows)

**Simplest:** double-click `index.html` in this `frontend` folder. Every page works from disk.

**Recommended (closer to a real server):**

1. Open *Command Prompt* in the `frontend` folder (type `cmd` in the folder's address bar).
2. Run `python -m http.server 8000`
3. Open <http://localhost:8000> in your browser.
4. Stop the server with `Ctrl + C`.

Python is only used to serve the files. The site itself does not need Python.

## 2. Folder structure

```
frontend/
  index.html            Home
  about.html            About Us
  academics.html        Academics
  admissions.html       Admissions (enquiry form + FAQs)
  activities.html       Activities
  gallery.html          Gallery (placeholders + category filter)
  contact.html          Contact Us
  README.md             This file
  styles/
    style.css           Design system (colours, type, spacing) and components
    responsive.css      Breakpoints and layout changes for tablet/desktop
  scripts/
    config.js           ★ School details and future API address — edit here
    navigation.js       Mobile menu (hamburger, aria-expanded, Escape, outside click)
    forms.js            Form validation, accessible messages, demo / future API submit
    gallery.js          Gallery category filter
    main.js             Footer year, contact details, missing-logo handling
  images/
    logoschool.PNG      ★ The school logo (see section 5 — must be added)
    placeholders/       Local SVG placeholders and illustrations (no photographs)
```

## 3. Editing school information

All unknown facts are shown on the pages as highlighted bracketed text, for example `[Phone to be added]`. Nothing is invented.

To publish a real detail, open `scripts/config.js` and fill in the empty values:

```js
contact: {
  phone: "+91 00000 00000",
  email: "office@yourschool.example",
  address: "Full postal address",
  openingHours: "Mon–Fri, 9:00 am – 1:00 pm"
},
```

Once a value is set, every matching placeholder across the site (header/footer, contact page, admissions page) becomes a live `tel:` / `mailto:` link or plain text. Leave a value as `""` to keep the placeholder.

Text that is not contact data (welcome message, introduction, facility details, fee/date policies) is edited directly in the HTML files. Search a page for `todo` to find every placeholder — each one is a `<span class="todo">` marker. When the information is confirmed, replace the marker with the real text.

> **Header and footer are repeated in each HTML file** (this keeps the site working without a server or build step). If you change the navigation, logo, or footer, make the same change in all seven pages.

## 4. Replacing placeholders with real photographs

Only use photographs the school owns or has permission to publish, with parental consent for any child shown. Do not use internet images.

1. Take or obtain the approved photo. Resize it to about 1200 px wide and save it as `.jpg` (keeps the page fast on older computers).
2. Put it in `images/` with a simple name, e.g. `images/classroom-2026-01.jpg`.
3. In the HTML file, change the `src` of the matching placeholder, for example:
   ```html
   <img src="images/classroom-2026-01.jpg" alt="Children reading together in the Class 2 classroom">
   ```
   The placeholder `<img>` tags are listed by searching for `placeholders/`:
   | Placeholder file | Used on |
   |---|---|
   | `campus-placeholder.svg` | Gallery (campus) |
   | `classroom-placeholder.svg` | About, Gallery (classrooms) |
   | `activities-placeholder.svg` | Gallery (activities) |
   | `events-placeholder.svg` | Gallery (events) |
   | `students-placeholder.svg` | Home hero, About |
   | `activity-*.svg` | Home and Activities cards (illustrations — may stay as they are) |
4. Write a meaningful `alt` text describing the photo. Keep the `<figcaption>` accurate.
5. Remove the word "Placeholder" from the gallery tag and caption when the photo is real.
6. Keep the page's figure size stable (the images have `width` and `height` attributes), and check the page at phone width.

## 5. The school logo

The header and footer use **`images/logoschool.PNG`**. This file was **not present** in the repository when the site was built, so the header currently shows the school name without a logo. The site still works: the logo is hidden automatically when the file is missing.

To add it, copy the existing logo file into `frontend/images/` and keep the name `logoschool.PNG`. If its extension or name is different, update the `src` in all seven HTML files (search for `logoschool.PNG`). Do not stretch the logo; the site uses `object-fit: contain`.

## 6. Forms — what is demo-only today

| Form | Page | Status |
|---|---|---|
| Parent enquiry | `index.html#enquiry` | **Demo only** — validates, then shows a message saying nothing was sent or saved |
| Admission enquiry | `admissions.html#enquiry` | **Demo only** (same behaviour) |
| Contact message | `contact.html` | **Demo only** (same behaviour) |

Demo mode is active because `config.js` has no API address. No data leaves the browser. The success message is deliberately honest and says the data has **not** been sent.

Browser validation is for convenience only. Any real backend must validate every field again.

## 7. Future FastAPI integration

Nothing is connected yet. These are the places to change when the backend exists:

1. **Set the API address** in `scripts/config.js` (`api.baseUrl`) and the endpoint path (`api.enquiryEndpoint`). Only set these once the endpoint exists and has been tested. Do not put secrets, passwords, API keys or tokens in frontend files — anything in the browser is visible to visitors.
2. **Request logic:** `sendEnquiry()` in `scripts/forms.js` already sends a JSON `POST` with a timeout when both values are set. It treats only an HTTP 2xx response as success. Adjust the payload or response handling there if the API differs.
3. **Server-side:** the backend should validate, rate-limit, and store enquiries. It must not return or expose private student or staff data to this public site.
4. **Keep the public site and the future ERP separate.** This site must never show student records, fees, internal IDs, or staff permissions. An ERP, if built, should be a separate application with its own login.
5. **Do not collect** Aadhaar numbers, APAAR IDs, identity documents, or other sensitive student records through these forms. The forms already warn parents about this.

The backend is in the project's `backend/` folder and has not been modified.

## 8. Accessibility and responsiveness

- Semantic HTML5 landmarks (`header`, `nav`, `main`, `footer`), a skip link, and labelled form fields.
- Keyboard-accessible menu: Tab to the **Menu** button, Enter to open, Escape to close (focus returns to the button).
- Visible focus rings on all interactive elements.
- Layouts are checked at 320, 375, 390, 430, 768, 1024 and 1440 px wide, with no horizontal scrolling.
- The site respects "reduce motion" settings and avoids heavy animation.

## 9. Maintenance notes

- **Design tokens** (colours, spacing, radii, shadows, widths) are CSS variables at the top of `styles/style.css`. Change them there to restyle every page.
- **Keep CSS and JavaScript shared.** Do not copy styles into individual pages.
- **Plain files only.** Avoid adding frameworks or build tools unless the team decides it is necessary.
- **Check after each change:** open each page at phone width (about 390 px) and desktop width, then try the menu and one form.
