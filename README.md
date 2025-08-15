# LMS (Learning Management System)

## 📚 Overview

A full-stack Learning Management System built with **Next.js** (frontend) and **Express.js** (backend).

This platform enables:

- **Students**: Browse courses, purchase (dummy checkout), stream video lessons, and track progress.
- **Instructors**: Upload and manage course content, categorize and publish courses.

---

## 🛠 Tech Stack

- **Frontend**: Next.js, React, TailwindCSS, TypeScript
- **Backend**: Express.js, Node.js, TypeScript
- **Database**: PostgreSQL (via Prisma ORM)
- **Validation**: Zod
- **Monorepo Tooling**: Turborepo, pnpm
- **Deployment**: AWS EC2 (Ubuntu), Nginx, PM2
- **Package Management**: pnpm workspaces

---

## 📁 Folder Structure

```bash
.
├── apps
│   ├── web              # Next.js frontend
│   └── backend          # Express.js backend
├── packages
│   ├── ui               # Shared UI components
│   ├── types            # Shared TypeScript types
│   ├── zod-validator    # Shared validation schemas
│   ├── typescript-config
│   └── eslint-config
├── turbo.json           # Turborepo config
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

---

## 🔐 Environment Variables

Both the **web** and **backend** applications require individual `.env` files.
Each contains an `example.env` file with placeholders to guide configuration.

### 🔧 Setup Instructions

1. **Web Application**

   ```bash
   cd apps/web
   cp example.env .env
   ```

   Then open `.env` and replace placeholder values with your actual credentials.

2. **Backend Application**

   ```bash
   cd apps/backend
   cp example.env .env
   ```

   Again, open `.env` and fill in the real values.

> **Note:** `.env` files are excluded via `.gitignore` to protect sensitive data.
> Never commit real credentials to version control.

---

## 🚀 Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/Rcmade/LMS.git
   cd LMS
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Run backend**

   ```bash
   cd apps/backend
   pnpm dev
   ```

4. **Run frontend**

   ```bash
   cd apps/web
   pnpm dev
   ```

---

## 🌐 Live Demo

- **Frontend**: [https://lms.rcmade.me](https://lms.rcmade.me)

---

## 📂 GitHub Repository

[🔗 GitHub Repo](https://github.com/Rcmade/LMS.git)

---

Would you like me to add a **"Features"** section next? It can help showcase the functionality (e.g., search, auth, uploads) and make the project more appealing for portfolio or evaluation purposes. Let me know!
