# PitWall IQ 🏎️

PitWall IQ is a modern, portfolio-grade Formula 1 race intelligence and strategy explainer app. It transforms raw telemetry and race data into beginner-friendly insights, making complex F1 strategy accessible to casual fans.

## Features

- **Race Explainer:** Understand why drivers pitted, who gained an undercut, and the impact of Safety Cars on race pace using historical OpenF1 data.
- **Strategy Lab:** A sandbox to pick any two drivers from any session and compare their average lap pace head-to-head.
- **Driver Intelligence:** A visual grid of the current season's drivers, with live headshots and team colors.
- **Learn Strategy:** An educational hub covering core strategy terms, basic F1 rules, and the upcoming 2026 regulations.

## Tech Stack

- **React & TypeScript:** For a robust, strongly-typed front-end.
- **Vite:** Next-generation frontend tooling for blazing fast builds.
- **Tailwind CSS:** For sleek, modern, and responsive UI styling.
- **OpenF1 API:** Free, keyless historical telemetry and race data.
- **Jolpica/Ergast API:** For driver and constructor standings.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

- `src/components/race`: Modular UI components for the Race Explainer.
- `src/lib/api`: API clients for OpenF1.
- `src/lib/raceIntelligence`: Deterministic heuristic engines that parse lap and pit stop data to detect undercuts, overcuts, and traffic risks.
- `src/pages`: Main application views (Dashboard, Race Explainer, Strategy Lab, Drivers, Learn).

## Development Philosophy

PitWall IQ is not a generic F1 stats dashboard. It explains race strategy using real race data, with a focus on beginner-first explanations and cautious, data-driven heuristics.
