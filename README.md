# PitWall IQ

PitWall IQ is an independent Formula 1 race intelligence website built to help fans understand race weekends through real standings data, driver form indicators, basic strategy simulation, beginner-friendly explanations, and iconic F1 history moments.

## The Problem
Formula 1 is a highly complex, data-driven sport. New and casual fans often struggle to understand *why* certain decisions are made during a race, especially regarding pit stops and tyre strategies. While the broadcast provides live commentary, it can be overwhelming, and post-race analysis often requires deep technical knowledge.

## Competitor Gap
- **MultiViewer:** Powerful for hardcore live viewers.
- **F1 Tempo:** Strong for deep telemetry exploration.
- **Armchair Strategist:** Overlaps with strategy dashboards.
- **Official F1:** Owns live media and broadcast rights.

**PitWall IQ** wins by being beginner-first: providing real data plus clear, deterministic strategy explanations.

## Features
- **Dashboard:** Real-time driver and constructor standings, race schedules, and latest results.
- **Driver Intelligence Hub:** Analyzes driver momentum, consistency, and pressure based on recent performance.
- **Strategy Lab:** A rule-based simulator to test advanced track position, tyre, and weather assumptions.
- **Race Explainer:** Deterministic analysis of historical races, explaining strategy events like undercuts and traffic risks using OpenF1 data.
- **History Vault & Glossary:** Learn iconic moments and fundamental F1 terms.

## Tech Stack
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

## APIs Used
- **Jolpica/Ergast API (Compatible):** Used for schedules, standings, latest results, and qualifying data.
- **OpenF1 API:** Used for historical race intelligence, including telemetry, pit stops, and race control data.

*Note: No API keys are required to run this project.*

## Architecture
- `src/lib/api/jolpicaClient.ts`: Modular client for Ergast-compatible endpoints.
- `src/lib/api/openF1Client.ts`: Modular client for OpenF1 historical endpoints, with built-in deduplication and caching.
- `src/lib/raceIntelligence/`: Deterministic rules engine to calculate pit stop analytics, strategy events, and generate race narratives.
- `src/lib/f1Api.ts`: Compatibility barrel file exporting Jolpica functions.

## How to run locally
1. Clone the repository.
2. Ensure you have Node.js installed.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser.

## Roadmap
- [ ] Add more comprehensive strategy heuristics (e.g., tyre degradation models).
- [ ] Incorporate visual charts for stint timelines.
- [ ] Expand the History Vault.

## Disclaimer
> Independent project. Not affiliated with Formula 1, FIA, Formula One Management, Formula One Licensing, teams, drivers, or broadcasters. Built for learning and portfolio purposes.
