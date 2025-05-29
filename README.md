# Genetics - Vite TypeScript Project

This is a modern web application built with Vite and TypeScript.

## Features

- ⚡️ Lightning fast development with [Vite](https://vitejs.dev/)
- 🔥 Hot Module Replacement (HMR)
- 🧩 TypeScript support
- 📦 Optimized production builds

## Getting Started

### Prerequisites

- Node.js (version 14.18+ or 16+)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn
```

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

This will start the development server at http://localhost:3000 and open your browser automatically.

### Building for Production

Build the project for production:

```bash
npm run build
# or
yarn build
```

This will generate optimized files in the `dist` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
# or
yarn preview
```

## Project Structure

```
/
├── dist/               # Build output directory
├── node_modules/       # Dependencies
├── src/
│   ├── index.ts        # Main TypeScript entry point
│   └── style.css       # Global styles
├── index.html          # HTML entry point
├── package.json        # Project metadata and dependencies
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## Customization

You can customize the Vite configuration in `vite.config.ts` to add plugins, change build options, and more.

## License

This project is licensed under the MIT License.
