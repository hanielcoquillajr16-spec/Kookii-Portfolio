# Kookii-Portfolio

Haniel Coquilla — Developer Portfolio.

A responsive React + TypeScript portfolio inspired by the supplied navy-and-cyan reference. Built with Vite, Tailwind CSS, and lightweight CSS animations.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. To check and build production files:

```sh
npm run check
npm run build
npm run preview
```

## Personalize

- `src/data/profile.ts`: name, introduction, about text, education, and contact links. Change `contactEmail` to update the embedded form recipient and `contactEmailLink` to update the hosted Email Me page and fallback. GitHub and LinkedIn are configured. Setting a contact URL to `null` displays “Coming soon.”
- `src/data/skills.ts`: skill names, local logos, and categories.
- `src/data/projects.ts`: featured project details. Add `sourceUrl` to display its repository button. Add another object to the array to create another reusable project card.
- `public/images/vng-preview.jpg`: a captured preview of the live project. Run `node scripts/capture-project.mjs` to refresh it (requires Chrome and network access).
- `src/styles.css`: colors, spacing, responsive layouts, and animations.

## Accessibility and motion

Keyboard navigation, visible focus states, a skip link, active section navigation, an accessible mobile menu, and reduced-motion support are included. The skills carousel pauses on hover and keyboard focus and has previous, next, and pause controls. Missing personal links never lead to invented addresses.

## Assets

Technology logos are bundled locally from [Devicon](https://github.com/devicons/devicon), with its license in `public/icons/LICENSE.txt`. Web Design uses a custom interface illustration because it is a discipline rather than a product with an official logo. Developer illustrations are original SVGs. Inter is bundled locally with its license in `public/fonts/LICENSE.txt`.

The website uses static hosting and does not need a database. Its technology list describes the developer's skills and the featured project's stack; it does not require every listed technology to run this portfolio.

## Contact form

The contact form submits directly to [FormSubmit](https://formsubmit.co/) using its AJAX endpoint. Messages go to `contactEmail` in `src/data/profile.ts`; no email password or API secret is included in the frontend.

The Email Me card and error fallback open [your FormSubmit contact page](https://formsubmit.co/el/pokobu) in a new tab. This hosted email link is separate from the AJAX submission endpoint used by the embedded form; it should not replace `contactFormEndpoint`.

Before delivery works, open the site through `npm run dev` or your hosted URL, submit the form once, and click the activation link sent to the recipient's inbox. Check spam if needed. FormSubmit documents this one-time confirmation in its [setup instructions](https://formsubmit.co/). Inbox delivery still needs to be verified after activation.

The form validates required fields and email format, prevents repeat submissions while sending, and displays confirmation, activation, timeout, and connection errors. Failed submissions preserve the entered message, with an Email Me fallback. See [FormSubmit's AJAX documentation](https://formsubmit.co/ajax-documentation) for the service contract.

## Hosting

Source code is maintained in [Kookii-Portfolio on GitHub](https://github.com/hanielcoquillajr16-spec/Kookii-Portfolio).

`npm run build` outputs a static site to `dist/`, suitable for static hosting.
