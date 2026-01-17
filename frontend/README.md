# Political Transparency - Frontend

React + TypeScript frontend for the Political Transparency web application.

## Tech Stack

- **React 18** with TypeScript (strict mode)
- **Mapbox GL JS** for interactive maps
- **TailwindCSS** for styling
- **TanStack Query** (React Query) for data fetching
- **Axios** for API calls

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/       # React components
│   │   ├── MapView.tsx          # Interactive map
│   │   ├── DistrictDrawer.tsx   # District info drawer
│   │   ├── CandidateCard.tsx    # Candidate summary card
│   │   └── CandidateModal.tsx   # Candidate details modal
│   ├── hooks/           # Custom React hooks
│   │   ├── useDistricts.ts
│   │   └── useCandidates.ts
│   ├── services/        # API and external services
│   │   ├── api.ts              # Axios API client
│   │   └── mapService.ts       # Mapbox utilities
│   ├── types/          # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/          # Utility functions
│   │   └── partyColors.ts
│   ├── App.tsx         # Main app component
│   ├── index.tsx       # Entry point
│   └── index.css       # Global styles
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and add your configuration:
   - `REACT_APP_API_URL`: Backend API URL (default: http://localhost:8000)
   - `REACT_APP_MAPBOX_TOKEN`: Your Mapbox access token (get one at https://www.mapbox.com/)

4. Start the development server:
   ```bash
   npm start
   ```

The application will open at http://localhost:3000

## Available Scripts

### `npm start`

Runs the app in development mode.
Open http://localhost:3000 to view it in the browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.
The build is minified and optimized for best performance.

## Components

### MapView

Interactive map displaying congressional districts using Mapbox GL JS. Features:
- GeoJSON district boundaries
- Hover effects on districts
- Click to select a district
- Responsive design

### DistrictDrawer

Slide-in drawer (right side) that displays:
- District information (name, state, population, median income)
- Current representatives
- Future candidates
- Click on any candidate to view full details

### CandidateCard

Summary card showing:
- Candidate photo
- Name and party
- Incumbent status
- Campaign funding total
- Hover effects

### CandidateModal

Full-screen modal with complete candidate information:
- Biography
- Contact information
- Campaign funding breakdown
- Voting record (for current representatives)
- Party-colored theme

## Data Fetching

The app uses TanStack Query (React Query) for data fetching with:
- Automatic caching (5-minute stale time)
- Background refetching
- Error handling
- Loading states

Custom hooks:
- `useDistricts()` - Fetch all districts
- `useDistrict(id)` - Fetch specific district
- `useDistrictCandidates(id)` - Fetch candidates for a district
- `useCandidate(id)` - Fetch candidate details

## Styling

TailwindCSS is used for all styling with:
- Custom political party color schemes
- Responsive design utilities
- Hover and transition effects
- Dark mode support (future enhancement)

## TypeScript

The project uses TypeScript strict mode with:
- Full type coverage
- Interface definitions for all data models
- Type-safe API calls
- No implicit any

## Environment Variables

Required:
- `REACT_APP_MAPBOX_TOKEN` - Mapbox access token

Optional:
- `REACT_APP_API_URL` - Backend API URL (defaults to http://localhost:8000)

## Browser Support

Modern browsers supporting:
- ES2020
- CSS Grid
- Flexbox
- WebGL (for Mapbox)

## Future Enhancements

- [ ] Search functionality for districts and candidates
- [ ] Filter candidates by party
- [ ] Mobile-optimized drawer behavior
- [ ] Dark mode support
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)
- [ ] Unit and integration tests
- [ ] Performance optimizations (code splitting, lazy loading)
