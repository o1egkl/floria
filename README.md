# 🌸 Floria — Cinematic 3D Interactive World

[![Next.js](https://img.shields.io/badge/Next.js-16.3.6-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.186.0-black?logo=three.js)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?logo=docker)](https://www.docker.com/)

An immersive, cinematic web experience bringing a mystical world of curious creatures, nocturnal sanctuaries, and interactive 3D storytelling to life.

---

## ✨ Features

- **Interactive 3D Character Model**: Real-time WebGL rendering powered by **Three.js**, with responsive camera positioning, lighting, and ambient animation.
- **Dynamic Dual-Layer Cursor Spotlight**: Real-time feathered canvas/mask reveal technique blending a nocturnal sanctuary background into a sunlit biosphere as your cursor moves.
- **Cinematic Scroll-Driven Storytelling**: Editorial narrative sections guiding wanderers through the lore, ecosystems, and artifacts of Floria.
- **Discovery Archive**: Interactive gallery of creatures, realms, and flora with detailed lore modals and animations.
- **Oversized Art-Book Typography**: High-impact editorial typography, glassmorphism UI components, and atmospheric vignettes.
- **Dockerized & Production-Optimized**: Multi-stage standalone build running inside a lightweight, secure Alpine container (~150MB).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **3D Engine**: [Three.js](https://threejs.org/) (`@types/three`)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Containerization**: [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- **Language**: TypeScript

---

## 📂 Project Structure

```text
floria/
├── app/
│   ├── components/
│   │   ├── CharacterModel.tsx      # 3D Three.js canvas & GLTF loader
│   │   ├── StorytellingSection.tsx # Cinematic scroll-driven narrative
│   │   ├── DiscoverySection.tsx    # Creature & realm discovery archive
│   │   └── FloriaFooter.tsx        # Oversized art-book footer
│   ├── globals.css                 # Global styling and Tailwind imports
│   ├── layout.tsx                  # Root layout & font configurations
│   └── page.tsx                    # Main interactive hero & spotlight stage
├── public/
│   ├── 3d-model/                   # 3D GLTF/GLB assets
│   ├── bg-base.jpg                 # Daylight sanctuary backdrop
│   ├── bg-reveal.jpg               # Nocturnal sanctuary backdrop
│   └── floria-*.jpg                # Realm & creature photography
├── Dockerfile                      # Multi-stage production container build
├── docker-compose.yml              # Container orchestration
├── next.config.ts                  # Next.js standalone optimization
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)
- *(Optional)* [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/o1egkl/floria.git
   cd floria
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

### 🐳 Running with Docker

#### Using Docker Compose (Recommended)

Start the app in detached mode:
```bash
docker compose up -d
```

Access the app at [http://localhost:3000](http://localhost:3000).

To view live logs:
```bash
docker compose logs -f
```

To stop the container:
```bash
docker compose down
```

#### Using Docker CLI

```bash
# Build Docker image
docker build -t floria .

# Run container on port 3000
docker run -p 3000:3000 floria
```

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server |
| `npm run build` | Builds optimized production bundle |
| `npm run start` | Runs built production server |
| `npm run lint` | Runs ESLint analysis |
| `npm run docker:build` | Builds the Docker image |
| `npm run docker:run` | Runs the Docker container on port 3000 |
| `npm run docker:compose` | Starts container with Docker Compose |

---

## 📄 License

This project is private and proprietary.
