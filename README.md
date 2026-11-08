# Haniel Coquilla — Developer Portfolio

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

- `src/data/profile.ts`: name, introduction, about text, education, and contact links. Replace the three `null` contact URLs with your actual `mailto:` address, GitHub profile, and LinkedIn profile. Unconfigured buttons show “Coming soon.”
- `src/data/skills.ts`: skill names, local logos, and categories.
- `src/data/projects.ts`: featured project details. Add `sourceUrl` to display its repository button. Add another object to the array to create another reusable project card.
- `public/images/vng-preview.jpg`: a captured preview of the live project. Run `node scripts/capture-project.mjs` to refresh it (requires Chrome and network access).
- `src/styles.css`: colors, spacing, responsive layouts, and animations.

## Accessibility and motion

Keyboard navigation, visible focus states, a skip link, active section navigation, an accessible mobile menu, and reduced-motion support are included. The skills carousel pauses on hover and keyboard focus and has previous, next, and pause controls. Missing personal links never lead to invented addresses.

## Assets

Technology logos are bundled locally from [Devicon](https://github.com/devicons/devicon), with its license in `public/icons/LICENSE.txt`. Web Design uses a custom interface illustration because it is a discipline rather than a product with an official logo. Developer illustrations are original SVGs. Inter is bundled locally with its license in `public/fonts/LICENSE.txt`.

The website works without a database or backend. Its technology list describes the developer's skills and the featured project's stack; it does not require every listed technology to run this portfolio.

## Hosting

`npm run build` outputs a static site to `dist/`, suitable for static hosting. `.openai/hosting.json` retains the registered private Sites identity and static output directory. Keep that identity for future updates.
