# 🔐 SecureDocs — Document Management Platform

> SecureDocs is a modern React + Firebase platform to collect, store, and share sensitive family or business paperwork—with enterprise‑grade controls, Cloudinary media handling, and an owner/admin back office.

[![GitHub](https://img.shields.io/badge/GitHub-Arbab--ofc%2Fsecure--docs-181717?logo=github&style=flat-square)](https://github.com/Arbab-ofc/secure-docs)
[![Vite](https://img.shields.io/badge/Built%20with-Vite-646CFF?logo=vite&style=flat-square)](#-tech-stack)
[![Firebase](https://img.shields.io/badge/Backend-Firebase-FFCA28?logo=firebase&style=flat-square)](#-infrastructure)
[![Cloudinary](https://img.shields.io/badge/Assets-Cloudinary-3693F3?logo=cloudinary&style=flat-square)](#-cloudinary-setup)

---

## ✨ Why SecureDocs?

- 📁 **Structured vaults** with categorisation, tags, preview thumbnails, and public share links or QR codes.
- 🔐 **Multi-layer security**: OTP onboarding, email verification, protected routes, owner/admin permissions, and role promotion.
- ☁️ **Cloud-native uploads** powered by Cloudinary, ensuring originals remain untouched while optimized previews are served.
- 📲 **Responsive UX** built with Tailwind, Material Tailwind and framer-motion so dashboards, admin panels, and public links feel consistent on mobile/tablet/desktop.
- 🔭 **Owner console** lets the super-user (e.g., `arbabprvt@gmail.com`) audit all accounts, read contact submissions, and promote members to admin/owner.

---

## 🧱 Architecture & Stack

| Layer | Details |
| --- | --- |
| **UI** | React 19, React Router 7, Vite 7, framer-motion, Tailwind CSS 3, Material Tailwind kit. |
| **State** | Context API (`AuthContext`, `ThemeContext`), custom hooks, React Hot Toast for feedback. |
| **Backend as a Service** | Firebase Auth + Firestore (metadata, roles, contact form), Firebase Storage (optional) & Cloudinary for binary assets. |
| **Utilities** | axios, react-hook-form, clsx/tailwind-merge, date-fns, QR utilities, responsive helpers. |
| **DX** | ESLint 9, React Refresh, npm scripts for dev/build/preview/lint. |

Directory snapshot:

```
src/
├─ components/        # Layouts, auth forms, profile widgets, admin UI
├─ context/           # Auth + Theme providers
├─ pages/             # Route-level screens (Home, Dashboard, Admin, Public doc, etc.)
├─ services/          # Firebase/Cloudinary helpers, admin service, document service
├─ utils/             # Formatters, validators, helpers
├─ config/            # Firebase + Cloudinary bootstrapping
└─ styles/assets/...  # Tailwind layers, shared assets
```

---

## 🚀 Getting Started

### 1. Clone & install

```bash
git clone https://github.com/Arbab-ofc/secure-docs.git
cd secure-docs
npm install
```

### 2. Environment variables

Create `.env` in the project root:

```bash
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx

VITE_CLOUDINARY_CLOUD_NAME=xxx
VITE_CLOUDINARY_UPLOAD_PRESET=unsigned_preset
VITE_CLOUDINARY_BASE_FOLDER=secure-documents
VITE_CLOUDINARY_FOLDER_MODE=dynamic
```

Restart `npm run dev` whenever you edit `.env` so Vite reloads values.

### 3. Local development

```bash
npm run dev
```

Visit `http://localhost:5173`. Register, verify email, and explore the dashboard/admin flows.

### 4. Production build

```bash
npm run build
npm run preview   # optional smoke test against the built bundle
```

Deploy the `dist/` folder (Vercel/Netlify/Firebase Hosting). Firebase Hosting quick steps:

```bash
firebase login
firebase init hosting  # pick project, set public dir to dist, SPA redirect = yes
npm run build
firebase deploy --only hosting
```

---

## ☁️ Cloudinary Setup

1. Create an unsigned upload preset that allows the file types you plan to support.
2. Configure base folder (e.g., `secure-documents`) and optional subfolder strategy via `VITE_CLOUDINARY_FOLDER_MODE`.
3. Keep the preset name and cloud name in `.env`. The document uploader uses these values directly.

---

## 🔐 Security & Roles

- **Owner auto-detection**: `arbabprvt@gmail.com` is promoted to `owner` when signing in; owners can promote/demote other accounts and view every contact submission.
- **Admin board**: `/admin` route shows user counts, roles, contact messages, and actions to promote to admin/owner (owner-only for owner role).
- **Route guards**: `ProtectedRoute`, `VerifiedRoute`, `AdminRoute`, and `PublicRoute` ensure only the correct audience loads each screen.
- **Password flows**: Login page includes “Forgot password?” linking to a reset view; profile includes instant change-password with reauthentication.

Sample Firestore rule snippet (adapt for your project):

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function currentUserRole() {
      return request.auth != null
        ? get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role
        : null;
    }
    function isAdminOrOwner() {
      return ['admin', 'owner'].hasAny([currentUserRole()]);
    }
    function isOwner() {
      return currentUserRole() == 'owner';
    }

    match /users/{userId} {
      allow read: if request.auth != null &&
        (request.auth.uid == userId || isAdminOrOwner());
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
        (request.auth.uid == userId ||
          (isOwner() && request.resource.data.role != null));
      allow delete: if false;
    }

    match /contacts/{contactId} {
      allow create: if (request.auth != null &&
        request.resource.data.userId == request.auth.uid) ||
        (request.auth == null && request.resource.data.userId == null);
      allow read, update, delete: if request.auth != null &&
        (request.auth.uid == resource.data.userId || isAdminOrOwner());
    }

    // …keep the rest of your document/OTP/share rules here
  }
}
```

---

## 🧩 Feature Highlights

| Feature | Details |
| --- | --- |
| 📂 **Document Vault** | Categorised uploads, tag search, share toggles, QR download cards, responsive cards. |
| 📨 **Public sharing** | `/shared/:id` screen with pass-through metadata, copy link, QR code, and security notice. |
| 👤 **Profile Center** | Avatar uploads (Cloudinary), contact info, Aadhaar field, quick edit form. |
| 🔁 **Password tools** | Forgot password (email reset) + change password (reauth + validation) baked into profile. |
| 🌗 **Theme + Toaster** | Global dark/light toggle, themed toasts, scroll manager for anchor navigation. |
| 🧑‍💼 **Admin Dashboard** | Metrics, responsive user lists, role actions, contact message viewer, refresh control. |
| 🧠 **Helpers** | `getUserInitial`, validators, share URL builder, clipboard util, debounced search. |

---

## 📦 Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server with HMR. |
| `npm run build` | Generate production assets. |
| `npm run preview` | Preview the production bundle locally. |
| `npm run lint` | Run ESLint using `eslint.config.js`. |

---

## 🛣️ Deployment Checklist

1. ✅ Firebase project configured (Auth + Firestore + Hosting if used).
2. ✅ Firestore rules updated with admin/owner permissions (see snippet).
3. ✅ Cloudinary preset created and `.env` loaded in hosting provider.
4. ✅ `npm run build` passes locally; `firebase deploy --only hosting` (or platform-specific deploy) succeeds.
5. ✅ Test `/dashboard`, `/profile`, `/admin`, and `/shared/:id` after deployment to confirm routes and guards.

---

## 🤝 Contributing

1. Fork and branch: `git checkout -b feat/thing`.
2. Keep lint clean (`npm run lint`).
3. Provide screenshots or screencasts for UI changes.
4. Open a PR with context + testing notes.

---

## 💬 Support

- 📧 `arbabprvt@gmail.com`
- 🔗 [LinkedIn](https://www.linkedin.com/in/arbab-ofc/)
- 🐙 [GitHub Issues](https://github.com/Arbab-ofc/secure-docs/issues)

Happy building! 🚀
