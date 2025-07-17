# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This is a cocktail recipe project containing:

1. **React Frontend App** (`cocktail-app/`): A modern React + TypeScript + Vite application for browsing and searching cocktail recipes
2. **Data Analysis Scripts** (root directory): Python scripts for analyzing cocktail ingredients and generating statistics
3. **Data Files**: JSON files containing cocktail recipes and ingredient data

## Common Development Commands

### Frontend Development (cocktail-app/)
```bash
cd cocktail-app
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production (runs TypeScript check first)
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Python Data Analysis (root directory)
```bash
python analyze_ingredients.py      # Generate basic ingredient frequency analysis
python detailed_analysis.py        # Generate detailed ingredient analysis with categorization
```

## Architecture Overview

### Frontend Application Structure
- **Components**: Organized by feature (cocktail/, search/, layout/, ui/)
- **Custom Hooks**: `useCocktailSearch.ts` handles search state and pagination
- **Type Definitions**: TypeScript interfaces in `types/` directory
- **Utilities**: Search and pagination logic in `utils/`
- **Data**: JSON files in `src/data/` containing cocktail and ingredient data

### Key Frontend Components
- `App.tsx`: Main application component managing cocktail selection state
- `CocktailList.tsx`: Displays paginated cocktail results
- `CocktailDetail.tsx`: Modal for showing detailed cocktail information
- `CompactSearchFilters.tsx`: Search interface with name and ingredient filtering
- `useCocktailSearch.ts`: Custom hook managing search state, filtering, and pagination

### Technology Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Search**: Fuse.js for fuzzy search functionality
- **Forms**: React Hook Form
- **Testing**: Puppeteer for E2E testing
- **Linting**: ESLint with TypeScript support

### Data Processing
- Python scripts analyze cocktail recipes from `cocktail-recipes.json`
- Categorizes ingredients into spirits, liqueurs, soft drinks, fruits, etc.
- Generates frequency analysis and detailed statistics

## Development Notes

- The frontend uses a custom search hook that combines name-based fuzzy search with ingredient filtering
- Pagination is implemented with configurable items per page
- The app supports responsive design with Tailwind CSS
- TypeScript is strictly configured with separate configs for app and node environments
- ESLint is configured with React-specific rules and TypeScript support