# Dusty

A desktop app with a Rust backend that scans your filesystem and figures out what's actually in it — clusters TV shows scattered across random folders, finds your old projects, and (eventually) surfaces files you forgot you downloaded.

Started this because I kept losing track of what shows/files I already had downloaded somewhere on my PC. Figured I'd build something instead of manually digging through folders.

## What it does right now

- **Show clustering** — groups video files into shows using a rolling-hash + union-find approach, so it doesn't rely on filenames following any strict naming convention
- **Project discovery** — finds and lists code/work projects sitting around on disk
- **Storage cleanup** — scans the drive for large archive files (.zip/.rar), image-heavy directories, and completely empty folders to help free up space
- **Desktop UI** — Rust backend, React frontend, wired together with Tauri IPC for real-time scan results, allowing you to open files directly from the app

Still actively building this out — more file categories and cleanup features planned.

## Requirements

- [Rust](https://www.rust-lang.org/tools/install) 1.70+
- [Node.js](https://nodejs.org/) v16+
- Tauri's OS-specific build tools — see their [prerequisites guide](https://tauri.app/v1/guides/getting-started/prerequisites) (Windows needs MSVC build tools)

## Running it

```bash
git clone https://github.com/AsimMahata/dusty.git
cd dusty/dusty-gui
npm install
npm run tauri dev
```

*Note: You don't need to run `cargo build` or `cargo run` manually. The `tauri dev` command automatically compiles the Rust backend and starts the React dev server simultaneously.*

## Building a release binary

```bash
npm run tauri build
```

Output lands in `dusty-gui/src-tauri/target/release/`.

## Stack

Rust, Tauri, React, TypeScript