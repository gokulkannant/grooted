# Grooted

A real-world farming RPG. Grow plants, claim territory, compete with friends, and turn your city green.

## Structure

```
grooted/
├── app/          # Expo React Native app (mobile)
├── backend/      # Next.js + Elysia API (Bun)
├── GROOT_1.md    # Feature spec
└── readme.md
```

## Development

### Backend

```bash
cd backend
bun install
bun run dev    # → http://localhost:3000
```

Tunneled at: `https://rootend-dev.dopolabs.com`

### App

```bash
cd app
bun install
bunx expo start --port 8081 --clear
```

Tunneled at: `https://grooted-dev.dopolabs.com`

## Tech Stack

- **App**: Expo 55, React Native 0.83, TypeScript, Zustand
- **Backend**: Next.js 15, Elysia, Bun, MongoDB Atlas
- **Storage**: Cloudflare R2
- **Auth**: Google OAuth + JWT
- **Push**: Firebase Cloud Messaging
