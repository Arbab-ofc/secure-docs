# 🔐 SecureDocs &mdash; Document Management Platform

> A modern React + Firebase platform for storing, sharing, and safeguarding vital documents for your family or team.

[![Live Repo](https://img.shields.io/badge/GitHub-Arbab--ofc%2Fsecure--docs-181717?logo=github&style=flat-square)](https://github.com/Arbab-ofc/secure-docs)
[![Built with Vite](https://img.shields.io/badge/Built%20with-Vite-646CFF?logo=vite&style=flat-square)](#-tech-stack)
[![Firebase Ready](https://img.shields.io/badge/Backend-Firebase-FFCA28?logo=firebase&style=flat-square)](#-infrastructure)

---

## ✨ Highlights

- 📁 **Vault‑grade storage** – Organize passports, licenses, or business documents in structured folders with role-aware sharing.
- 👥 **Family-first collaboration** – Invite relatives, track shared links, and switch between private and public document views.
- ☁️ **Cloud-native uploads** – Cloudinary keeps originals secure while responsive previews load instantly across devices.
- 🔒 **Zero-friction security** – Email verification, OTP onboarding, and protected routes ensure only trusted users get access.
- 🌗 **Adaptive UI** – Theme toggles, glassmorphism surfaces, and Tailwind-powered layouts feel at home on iOS, Android, and desktop.

---

## 🧠 Architecture Overview

| Layer | Highlights |
| --- | --- |
| **Client** | React 19 + Vite, React Router v7, framer-motion transitions, Tailwind + Material Tailwind components. |
| **Auth** | Firebase Authentication, email verification flow, OTP verification component for two-step checks. |
| **Storage** | Firebase Firestore for metadata, Firebase Storage / Cloudinary for binary uploads and sharing links. |
| **State** | Context API for auth + theming, custom hooks (`useAuth`, `useTheme`) shared across layouts. |
| **DX** | ESLint 9, React Refresh, modular file structure (pages, components, services, utils). |

---

## 🧭 Project Structure

```
src/
├─ components/      # Layout, auth, common UI
├─ context/         # Auth + Theme providers
├─ hooks/           # Custom hooks
├─ pages/           # Route-level views (Home, Dashboard, Profile, etc.)
├─ services/        # API + Firebase helpers
├─ utils/           # Formatters, constants
└─ config/          # Firebase + Cloudinary setup
```

---

## 🚀 Getting Started

### 1. Clone & install

```bash
git clone https://github.com/Arbab-ofc/secure-docs.git
cd secure-docs
npm install
```

### 2. Configure environment

Create `.env` in the project root:

```bash
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_CLOUDINARY_CLOUD_NAME=cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=unsigned_preset
VITE_CLOUDINARY_BASE_FOLDER=secure-documents
VITE_CLOUDINARY_FOLDER_MODE=dynamic
```

> ⚠️ Restart the dev server whenever you change `.env` values so Vite picks them up.

### 3. Run locally

```bash
npm run dev
```

Visit `http://localhost:5173` and explore the app. Register a user, verify email, then unlock the dashboard.

### 4. Build for production

```bash
npm run build
npm run preview   # Optional smoke test
```

Deploy the `dist` folder to your preferred static host (Vercel, Netlify, Firebase Hosting, etc.).

---

## 🧩 Core Features

| Feature | Description |
| --- | --- |
| 📂 **Smart folders** | Filter by tags, types, or reference numbers; share read-only or editable links. |
| 🔐 **Security Suite** | OTP verification, email verification, protected + verified routes, toast notifications for auth state. |
| 👤 **Profile Center** | Edit bio, avatar, contact data, and manage trusted contacts. |
| 💌 **Sharing & QR** | Public document view via `/shared/:documentId`, QR-based access, Cloudinary-backed links. |
| 🌙 **Theme-aware UI** | Context-powered dark mode, animated gradients, responsive footer/contact cards. |
| 📱 **Mobile-first footer** | CTA card, contact details, and scroll manager to ensure anchor links land at the right spot. |

---

## 🛠 Tech Stack

- ⚛️ React 19 + React Router 7
- ⚡ Vite 7, ESBuild, React Refresh
- 🎨 Tailwind CSS 3, Material Tailwind, Framer Motion, clsx
- 🔥 Firebase (Auth, Firestore, Storage)
- ☁️ Cloudinary (upload presets, secure folders)
- 🧰 react-hook-form, react-hot-toast, axios, date-fns, QR utilities

---

## 📦 NPM Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Vite dev server with HMR. |
| `npm run build` | Bundle production assets. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint (`eslint.config.js`). |

---

## 🌐 Deployment Checklist

1. ✅ Firebase project created with Web app credentials.
2. ✅ Cloudinary unsigned preset created & limited to required file types.
3. ✅ `.env` configured on hosting provider (Vercel/Netlify/Firebase Hosting).
4. ✅ `npm run build` passes locally.
5. ✅ Firestore/Storage security rules reviewed for your use case.

---

## 🤝 Contributing

1. Fork the repo on GitHub.
2. Create a feature branch: `git checkout -b feat/amazing-idea`.
3. Commit with clear messages and follow existing lint/style rules.
4. Submit a PR describing motivation, screenshots, and testing notes.

---

## 🧾 License

This project is licensed under the MIT License. See `LICENSE` (or the repository page) for full text.

---

## 🙋 FAQ

- **Can I run SecureDocs without Firebase?**  
  Not yet. Auth + storage rely on Firebase, but you can fork the repo and plug in Supabase or another BaaS.

- **Where do uploads live?**  
  Binary files go to Cloudinary; metadata, user mappings, and OTPs live in Firestore.

- **Does it work offline?**  
  Not currently. Add a PWA shell or service worker if offline access is a priority.

---

## 💬 Need Help?

- 📧 `arbabprvt@gmail.com`
- 🔗 [LinkedIn](https://www.linkedin.com/in/arbab-ofc/)
- 🐙 [GitHub Issues](https://github.com/Arbab-ofc/secure-docs/issues)

Happy building! 🚀
