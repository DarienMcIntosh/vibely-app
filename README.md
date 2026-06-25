# Vibely

Event discovery & social platform for Jamaica's nightlife, built end to end — 
from user interviews through a working React Native app.

## The problem

Most people in Kingston and Montego Bay still find out about parties and 
concerts through word of mouth — by the time a flyer gets forwarded around, 
half the details (or the event) are gone. Vibely puts local events, RSVPs, 
and tickets in one place.

## Repo structure

- `Vibely/` — React Native (Expo) + TypeScript app: navigation, JWT-based 
  auth with secure on-device storage, Google Maps integration.
- `Vibely-Website/` — Marketing landing page (HTML/CSS/JS).
- `database/` — Relational schema (MySQL): users, events, comments, media 
  assets, with foreign keys and indexes.

## Tech stack

React Native · Expo · TypeScript · React Navigation · Axios · JWT · MySQL

## Design process

Built from research, not just code: 20+ user interviews, personas, journey 
maps, and a full Figma prototype before any of this was written. Full case 
study on [my portfolio](https://darienmcintosh.netlify.app/) — Figma file 
[here](https://www.figma.com/design/7FlVsRIJthqPC932gHH2Y8/Vibely).

## Status

Concept project. The frontend and data model are built; there's no deployed 
backend or payment processor behind it yet.

## Running it

\`\`\`bash
cd Vibely
npm install
npx expo start
\`\`\`
