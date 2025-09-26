# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Basic Operations
- `npm install` - Install dependencies
- `npm start` - Run development server (http://localhost:3000)
- `npm test` - Run tests in watch mode
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App (irreversible)

### Testing
- `npm test -- --watchAll=false` - Run all tests once
- `npm test -- --coverage` - Run tests with coverage report
- `npm test -- --testNamePattern="pattern"` - Run specific tests

## Architecture Overview

This is a React-based Minesweeper game built with TypeScript. The architecture follows a functional component pattern with clear separation of concerns.

### Core Architecture

**State Management**: Uses React's `useState` and `useCallback` hooks for local state management. The main game state is centralized in `App.tsx` and flows down through props.

**Game Logic Separation**: Pure game logic is completely separated from UI components in `gameUtils.ts`, making it testable and reusable.

**Component Hierarchy**:
```
App (state management, game orchestration)
├── GameHeader (scoreboard, timer, restart)
└── GameBoard (grid container)
    └── Cell (individual cell, click handling)
```

### Key Components

**App.tsx**: 
- Central state management for the entire game
- Handles timer logic with `useEffect`
- Orchestrates game flow (first click, win/lose detection)
- Passes callbacks down to handle user interactions

**gameUtils.ts**: 
- Pure functions for all game mechanics
- Mine placement with first-click safety (3x3 exclusion zone)
- Recursive cell revelation for empty areas
- Win/lose condition checking
- Board state transformations

**Component Props Flow**:
- State flows down from App to components
- Event handlers flow up via callbacks
- Each component has a single responsibility

### Data Structures

**Cell Interface**: Each cell contains position, mine status, revealed state, flag state, and neighbor count.

**GameState Interface**: Centralized state including board, game status, counters, and timer.

**GameConfig Interface**: Immutable configuration for board dimensions and mine count.

### Game Mechanics

**First Click Safety**: Mines are placed only after the first click, ensuring the first click and its 3x3 neighborhood are mine-free.

**Flood Fill**: Empty cells (neighborMines = 0) trigger recursive revelation of adjacent cells.

**Win Condition**: Game is won when all non-mine cells are revealed (flags are not required on mines).

## Styling

The game uses a classic Windows Minesweeper aesthetic with:
- CSS Grid for the game board layout
- 3D button effects using CSS borders (outset/inset)
- Classic color scheme (#c0c0c0 background, colored numbers)
- Responsive design with media queries for mobile devices
- Emoji-based indicators (flags, mines, status faces)

## Development Notes

### Component Design Patterns
- All components are functional components using hooks
- Props interfaces are clearly defined for each component  
- Event handlers use `useCallback` to prevent unnecessary re-renders
- State updates use functional updates for consistency

### Game State Management
- Game state is immutable - all updates create new objects/arrays
- Board state is deeply cloned when modified to prevent mutation
- Timer runs only during active gameplay (not before first click or after game ends)

### Testing Considerations
- Game logic in `gameUtils.ts` is pure functions ideal for unit testing
- Components receive all dependencies via props, making them easily testable
- No external dependencies or side effects in game logic

### Performance Considerations
- Game board re-renders are minimized through React's reconciliation
- Cell components are lightweight with minimal state
- Recursive algorithms (flood fill) are bounded by grid size