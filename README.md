# PitWall IQ 🏎️

PitWall IQ is a modern, portfolio-grade Formula 1 race intelligence and strategy explainer app. It transforms raw telemetry and race data into beginner-friendly insights, making complex F1 strategy accessible to casual fans.

## Features

- **Race Explainer:** Understand why drivers pitted, who gained an undercut, and the impact of Safety Cars on race pace using historical OpenF1 data.
- **New Fan Mode:** A globally accessible toggle that injects beginner-friendly context and simple jargon translations across the app.
- **Strategy Lab:** A sandbox to pick any two drivers from any session and compare their average lap pace head-to-head with strategic preset guides.
- **Driver Intelligence:** A visual grid of the current season's drivers, with live headshots and team colors.
- **Learning Hub:** A beginner onboarding system that explains F1 through race examples, a watch guide, and an interactive quiz without feeling like a boring glossary.

## Limitations & Architecture Notes

- **No AI / No API Keys:** PitWall IQ is strictly deterministic. It does not use LLMs, OpenAI, or paid AI APIs to generate insights. It relies entirely on hard-coded heuristics and mathematical analysis of public data.
- **Historical Data:** The application relies on the free, public OpenF1 API. Data completeness may vary depending on the session, and the app gracefully degrades when telemetry or position data is unavailable.
- **Heuristic Strategy Detection:** Strategy events (like undercuts) are identified based on timing thresholds. They are signals, not guaranteed facts, and are presented with varying confidence levels.

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
- `src/contexts`: Global state providers, including `NewFanContext`.
- `src/lib/api`: API clients for OpenF1.
- `src/lib/learning`: Static content and types for the educational hub.
- `src/lib/raceIntelligence`: Deterministic heuristic engines that parse lap and pit stop data to detect undercuts, overcuts, and traffic risks.
- `src/pages`: Main application views (Dashboard, Race Explainer, Strategy Lab, Drivers, Learn).

## Development Philosophy

PitWall IQ is not a generic F1 stats dashboard. It explains race strategy using real race data, with a strict focus on beginner-first explanations and cautious, data-driven heuristics. "Explain F1 without the jargon."
