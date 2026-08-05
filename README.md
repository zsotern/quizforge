# QuizForge

> A lightweight, fast quiz creator and player for students and educators — build a quiz in minutes, play it instantly, and see where you need to improve.

## Description

QuizForge is a lightweight web application for quickly creating and sharing quiz questions. It targets students who want to test their knowledge and educators who need a fast, free alternative to expensive platforms like Kahoot or Quizizz. Unlike existing tools, QuizForge is designed around speed: a new question card can be created in under 30 seconds, with no registration required for basic use. The clean, distraction-free interface makes it equally useful for self-study and classroom settings.

## Goals

- Design and implement a reusable Question Card component — a single card displays a question, multiple answer options, and highlights the correct one after selection.
- Build a Quiz Creator view — a form where the user can add, edit, and delete question cards to assemble a quiz.
- Build a Quiz Player view — the assembled quiz is playable in sequence, with a simple end-screen showing the score.

## Non-goals

- QuizForge will not support real-time multiplayer or live classroom sessions in this version. Features like participant lobbies, live leaderboards, or teacher-controlled game flow (à la Kahoot) are out of scope.
- No user accounts or authentication are required for the core create → play → review loop. This is a deliberate scope decision, not an oversight — see R7 below.

## Screenshots

*(screenshots of the Creator, Player, Quiz List, and Results views go here)*

## Tech Stack

- Angular 21 (standalone components, Reactive Forms)
- TypeScript
- SCSS
- LocalStorage (client-side persistence, no backend in Phase 1)

## Setup

```bash
git clone https://github.com/zsotern/quizforge
cd quizforge/client
npm install
ng serve
```

Open your browser at: `http://localhost:4200`

## Planned Features

| # | Feature | Status | Label |
|---|---------|--------|-------|
| [R1](#r1--question-card-creator) | Question Card Creator | ✅ Done | `feature` `requirement` |
| [R2](#r2--answer-explanation-field) | Answer Explanation Field | ✅ Done | `feature` `requirement` |
| [R3](#r3--randomized-question-order) | Randomized Question Order | ✅ Done | `feature` `requirement` |
| [R4](#r4--results-screen) | Results Screen | ✅ Done | `feature` `requirement` |
| [R5](#r5--localstorage-persistence) | LocalStorage Persistence | ✅ Done | `feature` `requirement` |
| [R6](#r6--responsive-mobile-layout) | Responsive Mobile Layout | ✅ Done | `feature` `requirement` |
| [R7](#r7--no-registration-for-basic-use) | No Registration for Basic Use | ✅ Done | `feature` `requirement` |
| [R8](#r8--share-quiz-via-link) | Share Quiz via Link | ❌ Phase 2 | `feature` `idea` |
| [R9](#r9--randomized-answer-order) | Randomized Answer Order | ✅ Done | `feature` `idea` |
| [R10](#r10--multiple-quiz-management) | Multiple Quiz Management | ✅ Done | `feature` `requirement` |
| [R11](#r11--offline-tolerant-operation-pwa) | Offline-Tolerant Operation (PWA) | ❌ Phase 3 | `feature` `idea` |

**Phase 1 (MVP) — all Must/Should-have features are complete.** The project currently implements a full, working create → play → review loop with a responsive, mobile-friendly UI.

## Future Plans (Phase 2 / Phase 3)

- Node.js + Express backend, PostgreSQL, JWT authentication
- Share quiz via link (R8)
- Categories, statistics dashboard, points/streaks (see design plan)
- AI-generated quizzes from PDF/text input (R12)
- PWA / offline support (R11)
