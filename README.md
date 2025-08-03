# PG Radar Application
A platform to search, discover, and visualize Paying Guest (PG) accommodations across locations, featuring map visualization, search with async suggestions, detailed info, and more.

# PG Radar Client

A React frontend that shows Paying Guest accommodations on an interactive map with search and detail views.

## Features

- Async search with suggestions
- Leaflet map with clustered markers showing all PG locations
- Popup with PG info on marker click
- Side panel showing details of selected PG
- Responsive layout with Tailwind CSS

## Requirements

- Node.js v14+
- npm or yarn

## Installation

1. Clone the repo and navigate to the client folder:

```
git clone https://github.com/tejvir21/PGradar.git
cd pgradar
```


2. Install dependencies:

```
npm install

or
yarn install
```


3. Create `.env` file to configure API base URL:

```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```


4. Start development server:

```
npm start

or
yarn start
```


5. Open your browser at `http://localhost:3000`

## Usage

- Use Search Bar to find PGs by name.
- See all PG locations as clustered markers on the map.
- Click markers or select from search to view details.
- Responsive design supports desktop and mobile.

## Important Notes

- Import Leaflet CSS in your app entry point:

```
import 'leaflet/dist/leaflet.css';
```


- Place your marker icon files (`default-marker.png`, `selected-marker.png`, `marker-shadow.png`) in the `public/` folder.
- PG coordinate format must be `[latitude, longitude]`.
- Map container must have explicit height (`height: 500px` or via Tailwind).

## Commands

| Command         | Description                 |
| --------------- | ---------------------------|
| `npm install`   | Install dependencies        |
| `npm start`     | Start dev server            |
| `npm run build` | Create production build     |

## Troubleshooting

- If map or markers don't appear, ensure Leaflet CSS and images are loaded.
- Coordinates with incorrect order cause markers to appear misplaced.
- Use console to check API response and React errors.

## License

MIT © Tejvir Chauhan
