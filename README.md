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

- `src/data/profile.ts`: name, introduction, about text, education, and contact links. `contactEmailLink` controls the Email Me card and fallback. The form's delivery address is set privately in the backend's `CONTACT_TO_EMAIL` variable. GitHub and LinkedIn are configured. Setting a contact URL to `null` displays “Coming soon.”
- `src/data/skills.ts`: skill names, local logos, and categories.
- `src/data/projects.ts`: featured project details. Add `sourceUrl` to display its repository button. Add another object to the array to create another reusable project card.
- `public/images/vng-preview.jpg`: a captured preview of the live project. Run `node scripts/capture-project.mjs` to refresh it (requires Chrome and network access).
- `src/styles.css`: colors, spacing, responsive layouts, and animations.

## Accessibility and motion

Keyboard navigation, visible focus states, a skip link, active section navigation, an accessible mobile menu, and reduced-motion support are included. The skills carousel pauses on hover and keyboard focus and has previous, next, and pause controls. Missing personal links never lead to invented addresses.

## Assets

Technology logos are bundled locally from [Devicon](https://github.com/devicons/devicon), with its license in `public/icons/LICENSE.txt`. Web Design uses a custom interface illustration because it is a discipline rather than a product with an official logo. Developer illustrations are original SVGs. Inter is bundled locally with its license in `public/fonts/LICENSE.txt`.

The frontend uses static hosting and does not need a database. The Resend contact form uses server logic in `backend/`, which can run on Netlify alongside the site or on a separate backend host. The technology list describes the developer's skills and the featured project's stack; it does not require every listed technology to run this portfolio.

## Contact form

The contact form sends messages through a server endpoint and [Resend](https://resend.com/docs/send-with-nodejs). The server holds the API key, selects the fixed recipient, and uses the visitor's address only as Reply-To. The frontend never calls Resend directly.

The Email Me card and fallback open Gmail's compose window in a new tab with `contactEmail` filled in as the recipient. Visitors who are signed out will need to sign in to Gmail. This link is separate from the embedded form's Resend backend.

### Set up Resend

1. Create a [Resend account](https://resend.com/signup). For initial testing, use the email address that should receive your portfolio messages.
2. Create a sending API key in Resend. Store it only in `backend/.env.local` locally and your backend host's environment settings in production. Never use a `VITE_` variable for the key.
3. For production, verify a domain you own and set `RESEND_FROM_EMAIL` to a sender at that domain. The default `onboarding@resend.dev` sender is for testing and can only send to the email associated with your Resend account. See [Resend's testing restrictions](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain).

### Run the form locally

Copy `backend/.env.example` to `backend/.env.local` and set the private key and sender. Both `.env.local` files are ignored by Git. With Node.js 24 installed, open two terminals from the project root:

```sh
# Terminal 1: separate contact backend
npm run dev:api

# Terminal 2: frontend; Vite forwards /api/contact to the backend
npm run dev
```

The backend defaults to port 3001. `ALLOWED_ORIGINS` must contain the exact frontend origin, such as `http://127.0.0.1:5173`, without a path. `CONTACT_TO_EMAIL` is the receiving inbox. Missing credentials return an unavailable response rather than claiming that an email was sent.

### Deploy the site and contact form on Netlify

The root `netlify.toml` builds the frontend into `dist/` and bundles `netlify/functions/contact.mjs` as a [Netlify Function](https://docs.netlify.com/build/functions/get-started/). The form uses `/api/contact` on the same website. A separate backend project is not needed for this option.

1. Push the deployment files to GitHub, then import `hanielcoquillajr16-spec/Kookii-Portfolio` into Netlify. Use the repository root as the base directory, `npm run build` as the build command, and `dist` as the publish directory. These settings are already in `netlify.toml`.
2. In Netlify's environment settings, add the variables below. Their scope must include **Functions**. Your local `backend/.env.local` is ignored by Git and is not uploaded to Netlify. Keep secrets out of `netlify.toml` and `VITE_` variables. See [Netlify's function environment variables](https://docs.netlify.com/build/functions/environment-variables/).

   | Variable | Value |
   | --- | --- |
   | `RESEND_API_KEY` | Your private Resend sending key |
   | `RESEND_FROM_EMAIL` | A sender on your verified domain, or `onboarding@resend.dev` for restricted testing |
   | `CONTACT_TO_EMAIL` | `coquilla13nielhanjr@gmail.com` |
   | `ALLOWED_ORIGINS` | Your exact published origin, such as `https://your-site.netlify.app`, without a trailing slash or path |

3. Deploy again after saving the variables. Submit a real message and check both the receiving inbox and Resend's logs. The test sender can only deliver to the email associated with your Resend account.

`VITE_CONTACT_ENDPOINT=/api/contact` is set automatically for Netlify builds. If you add a custom domain, include its exact origin in `ALLOWED_ORIGINS` too, separating origins with commas. Preview deployments need their own explicitly allowed origins before the form will accept messages. Import the repository so Netlify deploys both the site and Function.

### Host the backend separately with GitHub Pages

`backend/api/contact.mjs` is a [Vercel Node.js function](https://vercel.com/docs/functions/runtimes/node-js). Import this GitHub repository into a separate Vercel project, select `backend` as its root directory, and use the Other framework preset. Configure `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_TO_EMAIL`, and `ALLOWED_ORIGINS` in that project's environment settings before deployment. The backend can also run as a standalone Node.js service using `backend/server.mjs`.

For your GitHub Pages frontend, allow `https://hanielcoquillajr16-spec.github.io` as an origin on the backend. Set the public build variable `VITE_CONTACT_ENDPOINT` to the deployed backend's full HTTPS `/api/contact` URL, then rebuild the frontend. This URL is public; the Resend key stays on the backend. A production build without an endpoint disables the form and offers the Email Me fallback.

The backend validates inputs, caps request size, checks allowed origins, uses a honeypot, and applies a per-instance request limit. Configure your backend host's firewall for limits across all server instances before public use. The recipient cannot be changed by a visitor's request.

The form validates required fields and email format, prevents repeat submissions while sending, and displays confirmation, timeout, unavailable, and connection errors. Failed submissions preserve the entered message. Inbox delivery must be verified after the Resend account and deployed backend are configured.

```sh
# Backend tests use a mocked Resend API; no emails are sent.
npm run test:api

# Browser form tests against an active frontend development server.
node scripts/verify-contact.mjs http://127.0.0.1:5173
```

## Hosting

Source code is maintained in [Kookii-Portfolio on GitHub](https://github.com/hanielcoquillajr16-spec/Kookii-Portfolio).

`npm run build` outputs the frontend to `dist/`. GitHub Pages serves these static files; it does not run `backend/`. A repository Pages deployment also needs Vite's base path and public asset paths configured for `/Kookii-Portfolio/` when setting up the Pages deployment.
