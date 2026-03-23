# SportQuiz Master Technical Documentation

## Purpose of This Document
This document explains how the current codebase works in detail, with a focus on architecture, component responsibilities, state transitions, data flow, and UI styling decisions.

The explanation is written as if you are learning how to reason about a real React app in production-like structure.

## 1) Project Architecture

### 1.1 High-Level Architecture
The app follows a feature-oriented React architecture:
- Presentation components in src/Components
- Business logic in a reusable custom hook in src/hooks
- Data access and transformations in src/services
- Global style system in src/index.css
- Entry-point composition in src/App.jsx and src/main.jsx

This organization keeps concerns separated:
- UI components focus on rendering and user interactions.
- The hook centralizes app-level quiz session state.
- The service layer isolates external API details.
- Styling remains consistent through utility classes plus shared CSS helpers.

### 1.2 Folder Structure and Why It Is Organized This Way
- src/Components
  - Holds reusable UI units (screens + smaller helpers).
  - Helps keep each visual concern isolated and testable.
  - Example: QuizScreen controls quiz runtime interactions; Timer and ProgressBar are focused sub-components.

- src/hooks
  - Holds custom hooks that encapsulate stateful business logic.
  - useQuizLogic was introduced to keep App.jsx clean and focused on screen composition.

- src/services
  - Contains external communication and data shaping.
  - api.js owns fetch behavior, decoding HTML entities, and answer shuffling.

- src/assets
  - Reserved for static files (images/icons/etc.).
  - Keeps non-code resources separate from logic and components.

- src/index.css and src/App.css
  - index.css contains active global styles and utility helpers.
  - App.css currently contains mostly scaffold/default template styles and appears non-essential to the current UI flow.

### 1.3 Architectural Pattern in Practice
The project uses an intentional layered flow:
1. App.jsx asks useQuizLogic for app state and handlers.
2. App.jsx renders exactly one active screen by state value.
3. QuizScreen fetches category-specific questions using the API service.
4. Child components (Timer, QuestionCard, ProgressBar) render focused UI concerns.
5. Result data is persisted in localStorage and shown later in HomeScreen history.

This gives you a strong separation between:
- app orchestration (App + hook)
- screen behavior (screen components)
- infrastructure (service and browser storage)

## 2) File-by-File Analysis

## 2.1 src/App.jsx

### Primary Responsibility
App.jsx is now a clean composition layer. It does not own quiz state directly. It chooses which screen to display and wires props from the hook to each screen.

### Imports and Their Roles
- HomeScreen, QuizScreen, ResultScreen: visual screen components.
- ThemeToggle: cross-app theme wrapper.
- useQuizLogic: central quiz session logic provider.

### State and Effects in This File
- No local useState.
- No useEffect.
- This is intentional and matches your goal: App is a pure UI entry-point.

### Hook Outputs Consumed
From useQuizLogic, App reads:
- categories
- screen
- selectedCategory
- sessionResult
- history
- summaryText
- startCategory
- completeQuiz
- setScreen

### Screen Routing Logic
- If screen is home: renders HomeScreen with categories/history and onStart.
- If screen is quiz: renders QuizScreen with selected category, quit callback, finish callback.
- If screen is result and sessionResult exists: renders ResultScreen with result summary.

### Why This Design Is Good
- App remains easy to read.
- Testing is simpler because screen decisions are explicit.
- Business logic lives in one reusable place.

## 2.2 src/hooks/useQuizLogic.js

### Primary Responsibility
This hook manages app-level quiz session state and transitions across the three screens:
- home
- quiz
- result

It also persists and restores recent quiz history using localStorage.

### Internal Static Data
- categories array defines available quiz categories.
- Each category has id, title, subtitle, icon.

### State (useState) Breakdown
- screen
  - default: home
  - controls which screen App renders.

- selectedCategory
  - default: first category in categories.
  - changes when user starts a category.

- sessionResult
  - default: null
  - stores the latest completed quiz summary.

- history
  - initialized lazily from localStorage key quiz-history.
  - if key is missing, returns empty array.
  - if JSON parse fails, returns empty array.

### Memo (useMemo) Breakdown
- summaryText
  - derived from sessionResult.
  - returns empty string when no result.
  - format: score/total in category.

Why memo is reasonable:
- It avoids recomputation on unrelated rerenders.
- It keeps derived value explicitly tied to sessionResult.

### Handlers
- startCategory(category)
  - sets selectedCategory.
  - switches screen to quiz.

- completeQuiz({ score, total })
  - creates result object with:
    - id from Date.now
    - category title from selectedCategory
    - score and total from quiz completion payload
    - playedAt with locale date string
  - prepends new result into history and caps to 6 items.
  - writes updated history to localStorage.
  - updates sessionResult.
  - switches screen to result.

### Returned API Contract
The hook returns both state and control methods so App can remain a declarative renderer.

## 2.3 src/Components/HomeScreen.jsx

### Primary Responsibility
HomeScreen is the dashboard/landing screen where users:
- see branding
- start a quick quiz
- pick any category
- review recent quiz activity

### State and Effects in This File
- No local useState.
- No useEffect.
- It is a pure presentational component.

### Props Received
- categories
  - array of category objects displayed as selectable cards.

- history
  - array of recent results for the Recent Activity list.

- onStart
  - callback invoked when user starts a quiz from Quick Start or category buttons.

### Render and Interaction Logic
- Header card shows app identity and visual badge.
- Daily Challenge card has Quick Start that calls onStart with categories[0].
- Categories card maps categories into buttons.
- Recent Activity card:
  - if history empty: displays empty-state message.
  - else maps each history item with category, date, and score/total.

### UX Notes
- Gives immediate paths to action.
- Preserves confidence with visible history feedback.

## 2.4 src/Components/QuizScreen.jsx

### Primary Responsibility
QuizScreen manages the runtime flow of a quiz attempt:
- fetch questions for a selected category
- track current question and score
- process answer selection
- handle timer timeout
- offer 50/50 hint
- end quiz and report final result to parent

### State (useState) Breakdown
- questions: fetched question objects.
- currentIndex: current question pointer.
- selected: selected option value (or timeout marker).
- score: current correct answers count.
- loading: fetch state flag.
- error: fetch failure message.
- hintUsed: whether hint has been used in this session.
- hiddenOptions: option values removed by hint.

### Effects and Memo/Callback Usage
- useCallback loadQuestions
  - asynchronous loader that resets quiz session state after fetch.
  - dependency on category.id so category changes trigger new data.

- useEffect
  - runs loadQuestions on mount and whenever callback identity changes (typically category change).

- useCallback goNext
  - advances to next question or finishes quiz if at end.
  - clears selected and hidden options before moving.

- useCallback handleTimeout
  - sets selected to timeout marker only when no answer selected yet.

- useMemo questionCounter
  - derived text such as 3/20 from index and question count.

### Props Received
- category
  - object containing category metadata; category.id is used for API fetch.

- onFinish
  - callback called with final score and total when quiz ends.

- onQuit
  - callback to return to home.

### Core Logic Flow in QuizScreen
1. Screen mounts with selected category.
2. loadQuestions runs:
  - sets loading true and clears error
  - fetches and stores questions
  - resets index, selected, score, hint state
3. While loading, renders Loading component.
4. On error, renders ErrorMessage with retry callback.
5. On success, renders:
  - header (category, question counter, score)
  - timer + hint controls
  - progress bar
  - question card
  - navigation actions
6. User selects answer:
  - selected is locked
  - score increments if correct
7. Timer timeout without selection:
  - selected becomes timeout marker
  - UI asks user to continue manually
8. User presses Next or Finish:
  - advances question or calls onFinish with final payload.

### Important Implementation Details
- selected uses special sentinel value __timeout__ to represent unanswered timeout state.
- hiddenOptions is recalculated per question when hint is used.
- key on Timer includes currentIndex and selected to force timer reset between answer states/questions.

## 2.5 src/Components/ResultScreen.jsx

### Primary Responsibility
ResultScreen presents the final outcome of the completed session.

### State and Effects in This File
- No local useState.
- No useEffect.

### Props Received
- result
  - object containing score, total, and category.

- onBackHome
  - callback that returns user to home screen.

- summaryText
  - preformatted summary derived in the hook.

### Logic and Rendering
- Calculates points as score multiplied by 50.
- Displays score ratio, category completion text, earned points, summary text.
- Provides Back to Home action.

## 2.6 src/Components/ThemeToggle.jsx

### Primary Responsibility
ThemeToggle wraps the app and controls light/dark mode persistence and root class toggling.

### State (useState) Breakdown
- theme
  - initial value from localStorage key theme, fallback light.

### Effect (useEffect) Breakdown
Whenever theme changes:
- toggles class theme-dark on document root element.
- persists selected theme into localStorage.

### Props Received
- children
  - nested app UI tree rendered inside themed container.

### Render and Interaction Logic
- Applies conditional wrapper colors based on theme.
- Renders toggle button that flips theme between light and dark.
- Keeps the rest of app agnostic of theme logic.

## 3) Logic Flow: Full Quiz Session Lifecycle

### 3.1 App Boot and Session Preparation
1. main.jsx mounts App into root element.
2. App mounts ThemeToggle wrapper and calls useQuizLogic.
3. useQuizLogic initializes:
- current screen as home
- default category
- sessionResult as null
- history from localStorage if available

### 3.2 Category Selection and Navigation
1. User chooses Quick Start or a category in HomeScreen.
2. HomeScreen calls onStart(category).
3. Hook startCategory updates selectedCategory and sets screen to quiz.
4. App rerenders and switches to QuizScreen.

### 3.3 Question Fetching and Preparation
1. QuizScreen receives category prop.
2. useEffect triggers loadQuestions.
3. loadQuestions calls fetchQuestions with:
- amount 20
- category.id
4. In services/api.js:
- request sent to OpenTDB API
- non-OK response throws error
- payload response_code validated
- HTML entities decoded
- answer options shuffled
- normalized question objects returned

### 3.4 In-Quiz Interaction Loop
For each question:
1. Timer starts at 25 seconds.
2. User can optionally use one 50/50 hint per quiz run.
3. User selects one answer.
4. If correct, score increments by 1.
5. Next button unlocks after answer selection (or timeout sentinel).
6. On Next:
- if not final question: index increments
- if final question: onFinish(score, total) is called

Timeout path:
- If timer reaches zero before selection, selected becomes timeout sentinel.
- User is informed that time is up and can proceed by pressing Next.

### 3.5 Completion, Persistence, and Result Display
1. Hook completeQuiz builds result entry.
2. Result is prepended to history and history is limited to latest 6 attempts.
3. Updated history persisted in localStorage.
4. sessionResult updated for result screen rendering.
5. screen changed to result.
6. App renders ResultScreen.
7. User presses Back to Home to return to dashboard.

## 4) Styling Approach (Tailwind + Custom CSS)

### 4.1 Styling Stack
- Tailwind CSS v4 is enabled via:
  - @import tailwindcss in index.css
  - @tailwindcss/vite plugin in vite.config.js
- Utility classes are heavily used directly in JSX.
- Shared semantic classes (glass-card, brand-button, fade-up) are declared in index.css for consistency.

### 4.2 Visual Direction: Cinematic/Professional
The UI combines:
- Deep brand purple (#3101B9) for strong identity.
- Soft violet surfaces (#F3E8FF) for secondary backgrounds.
- Glass-like cards with large radius and soft shadows for premium depth.
- Gradient hero blocks and radial page backgrounds for cinematic atmosphere.

### 4.3 Spacing and Density
- Cards use rounded-2xl/rounded-3xl and generous padding for breathing room.
- Vertical rhythm is maintained with space-y utilities.
- Screen width constrained to max-w-md/max-w-lg for readable focus.

### 4.4 Responsiveness
- Mobile-first classes with sm breakpoints.
- Category grid adapts from 1 column to 3 columns.
- Main container paddings scale up on larger widths.

### 4.5 Motion and Feedback
- fade-up animation on major sections for smooth entrance.
- Hover lift and opacity transitions on primary actions.
- Progress bar and timer visual feedback support pacing and urgency.

### 4.6 Theme Handling
- ThemeToggle switches root class theme-dark.
- Dark mode updates container/card palette while preserving brand accents.
- Theme preference is persisted in localStorage.

## 5) Git Workflow

### 5.1 Observed Branch Strategy
Current branch set includes:
- main
- Ihsane
- Quize.abdo

A practical interpretation:
- main is stable integration branch.
- Ihsane and Quize.abdo are contributor feature branches.

### 5.2 Why This Strategy Is Good
- Isolates work streams so one contributor does not block another.
- Makes code review focused and easier to reason about.
- Reduces risk of unstable code entering main too early.

### 5.3 Why Small Commits Matter
Small, focused commits improve:
- Traceability: each commit captures one intent.
- Reviewability: reviewers understand change purpose faster.
- Debugging: easier to bisect/regress pinpoint issues.
- Rollback safety: narrow revert scope with minimal side effects.

### 5.4 Recommended Team Flow
1. Branch from main into personal branch.
2. Implement one concern at a time.
3. Commit small logical units with clear message.
4. Open PR into main and request review.
5. Merge only after validation and discussion.

## 6) Mentoring Notes: How to Read This Codebase Efficiently

1. Start with App.jsx and identify screen routing conditions.
2. Move to useQuizLogic.js to understand global state transitions.
3. Study QuizScreen.jsx next, because it contains most runtime complexity.
4. Read api.js to understand data normalization and error conditions.
5. Finally inspect HomeScreen and ResultScreen for UX entry/exit points.

If you keep this top-down order, the code becomes straightforward despite multiple files.

## 7) Summary
The codebase is now in a solid shape for maintainability:
- App.jsx is clean and declarative.
- Business logic is centralized in a custom hook.
- Screen components are focused and mostly stateless.
- Data fetching is isolated in a service.
- Styling has a clear brand system with responsive utility-first implementation.
- Git workflow with contributor branches and small commits supports safe collaboration.
