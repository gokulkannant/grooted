# GROOTED Research Notes

## Working Idea

GROOTED is a mobile-first app that reframes farming and plant care as a fun, social, and competitive activity. Instead of treating farming as a slow or mundane chore, the app turns real-world plant growth into a digital game loop where users complete daily farming tasks, upload plant updates, view nearby farmers on a map, compete locally, and use image or short-video analysis to understand plant health.

The core promise is simple:

> Make farming feel like a real-world game where every plant is progress, every task earns status, and every neighborhood can become greener.

## Problem

Many young users see farming, gardening, and plant care as:

- Too slow to feel rewarding.
- Too knowledge-heavy for beginners.
- Isolated, with little social motivation.
- Less exciting than digital entertainment.
- Difficult to continue consistently after the first few days.

At the same time, people are increasingly interested in wellness, sustainability, local food, and hands-on hobbies. GROOTED can sit at the intersection of those trends by using familiar digital patterns like streaks, maps, leaderboards, quests, badges, and AI feedback to make plant care feel approachable and alive.

## Target Users

### Primary Users

- Students and young adults who want a fun reason to start growing plants.
- Apartment or balcony gardeners with limited space.
- Beginners who need guidance and motivation.
- People who enjoy challenges, social apps, and location-based games.

### Secondary Users

- Small farmers who want visibility in their local area.
- Schools or colleges running sustainability clubs.
- Local nurseries, seed shops, organic stores, and cafes.
- Communities trying to encourage urban farming.

## Core Product Loop

1. User adds a plant or crop to their digital farm.
2. App assigns daily tasks based on plant type, growth stage, and local conditions.
3. User completes tasks like watering, checking soil, pruning, uploading a photo, or logging growth.
4. User earns Farm Points, streak progress, badges, and map influence.
5. User compares progress with nearby farmers and joins local challenges.
6. User gets AI-based plant health feedback from uploaded images or short videos.
7. Better consistency improves both the real plant and the user's digital standing.

This loop is important because the app should not just be a tracker. It should create a reason to come back every day.

## Map Feature

The map is the social and competitive heart of the app. Users should be able to see nearby farming activity without exposing exact private locations.

### Map Ideas

- Show nearby farmers as approximate activity zones instead of exact home pins.
- Use green intensity to represent farming activity in a neighborhood.
- Show public farms, community gardens, nurseries, seed stores, and event locations.
- Let users join local farming zones, such as college campus, apartment block, street, or neighborhood.
- Display local leaderboard rankings for each zone.
- Highlight active challenges happening nearby.
- Let users discover "green allies" who grow similar plants.

### Competition Ideas

- Area leaderboard based on weekly Farm Points.
- "Lord of the Leaf" title for the top user in a local zone.
- Team-based neighborhood challenges.
- Seasonal resets so new users can still compete.
- Crop-specific contests like "Best Tomato Growth" or "Fastest Microgreens Harvest."
- Community milestones like "100 watering tasks completed in this zone."

### Privacy Considerations

Location should be approximate by default. Users should not be forced to reveal their home, farm, balcony, or exact plant location. A good default is to show users within a general area or grid cell, not precise coordinates.

## Daily Tasks

Daily tasks are the mechanism that turns farming into a habit.

### Example Tasks

- Upload today's plant photo.
- Water the plant.
- Check soil moisture.
- Remove weeds.
- Rotate pot toward sunlight.
- Add compost or nutrients.
- Measure plant height.
- Check leaf color.
- Report pests or disease signs.
- Share one progress update with the local zone.

### Task Types

- **Care Tasks:** watering, pruning, sunlight, soil checks.
- **Observation Tasks:** photo upload, leaf inspection, growth measurement.
- **Learning Tasks:** quick tips, quizzes, crop facts.
- **Community Tasks:** help another user, join a challenge, comment on progress.
- **Seasonal Tasks:** sowing, transplanting, harvesting, preparing soil.

## Plant Health Analysis

Users should be able to upload an image or a 2-second video of their plant. The app can analyze the plant and return simple, beginner-friendly insights.

### What The Analysis Can Detect

- Whether the upload actually contains a plant.
- Plant type or likely species.
- Growth stage, such as seedling, vegetative, flowering, fruiting, or harvest-ready.
- Leaf color issues, such as yellowing or browning.
- Visible pest damage, spots, holes, or wilting.
- General health score.
- Basic care suggestions.

### Suggested Output

The result should avoid sounding too technical. A good format:

- **Health Score:** 82/100
- **Status:** Mostly healthy
- **Possible Issue:** Slight yellowing on lower leaves
- **Likely Cause:** Overwatering or low nitrogen
- **Next Task:** Check soil moisture before watering again
- **Confidence:** Medium

### Video Upload Value

A 2-second video can be useful because it captures more angles than one image. The app can select frames from the video and analyze leaf texture, color, movement, and overall plant shape.

### AI Implementation Notes

For a hackathon MVP, plant health analysis does not need to be perfect. It can start with:

- Image upload.
- Plant detection.
- Basic color and leaf condition analysis.
- AI-generated care suggestion.
- Confidence score.

Later versions can use more advanced crop disease datasets, species-specific models, and TensorFlow Lite or on-device inference.

## Gamification System

The app should make real farming progress feel instantly rewarding.

### Farm Points

Users earn Farm Points for:

- Completing daily care tasks.
- Maintaining streaks.
- Uploading verified plant progress.
- Helping nearby users.
- Joining local challenges.
- Harvesting crops.
- Learning farming basics.

### Streaks

Streaks are powerful because plant care depends on consistency. A "Dirty Streak" can track daily farming activity. Missing days should reduce momentum but not punish users so hard that they quit.

Possible streak design:

- 1 day: Sprout
- 7 days: Rooted
- 21 days: Grower
- 45 days: Cultivator
- 90 days: Season Master

### Badges

- First Plant Added
- First Harvest
- 7-Day Streak
- Pest Defender
- Balcony Farmer
- Community Helper
- Tomato Champion
- Soil Scientist
- Rain Saver
- Local Legend

### Light Competition

Competition should be friendly, not stressful. The point is to motivate farming, not make users feel bad. The leaderboard can reward consistency and community help, not just the biggest garden.

## Social Features

### User Profiles

Each profile can show:

- Current plants.
- Farm Points.
- Streak count.
- Badges.
- Local rank.
- Harvest history.
- Favorite crop.

### Community Interaction

- Follow nearby farmers.
- Join neighborhood farming groups.
- Comment on plant progress.
- Ask for plant care advice.
- Send encouragement.
- Share harvest pictures.
- Create local challenges.

### Digital Garden

Each user can have a digital garden that visually grows as their real plants progress. This gives the app a strong game-like identity. If users upload real progress consistently, their digital garden becomes richer.

## Differentiation

GROOTED should not feel like a plain plant-care reminder app. Its strongest differentiators are:

- Local map-based farming competition.
- Daily real-world farming tasks.
- Plant health analysis through photos or short videos.
- A digital garden tied to real plant progress.
- Seasonal leaderboards and local farming titles.
- Youth-focused visuals and social mechanics.

The app's emotional hook is that it makes users feel like farming is not old-fashioned or boring. It becomes something they can show, compare, improve, and be proud of.

## MVP Scope

For a hackathon, the MVP should focus on a small but impressive vertical slice.

### Must Have

- User onboarding.
- Add a plant.
- Daily task list.
- Upload plant image.
- Basic plant health analysis result screen.
- Map showing nearby farming zones or demo farmers.
- Local leaderboard.
- Farm Points and streaks.

### Nice To Have

- 2-second video upload.
- Badges.
- Community challenges.
- Plant profile timeline.
- AI-generated task recommendations.
- Demo seed drop event.

### Avoid In MVP

- Full ecommerce store.
- Real payments.
- Complex crop disease accuracy claims.
- Exact live geolocation of all users.
- Too many plant species at once.
- Overly complex social feeds.

## Suggested Hackathon Demo Flow

1. User opens GROOTED and sees a map of nearby green activity.
2. User adds a tomato plant to their digital farm.
3. App gives today's tasks: water, upload photo, check leaves.
4. User uploads a plant image.
5. App returns health score and care advice.
6. User earns Farm Points and extends their streak.
7. Local leaderboard updates.
8. Map zone becomes greener because the user contributed farming activity.

This flow shows the entire product idea clearly without requiring a fully built farming ecosystem.

## Technical Architecture Ideas

### Frontend

- React Native or Flutter for mobile.
- Mapbox or Google Maps for map display.
- Camera and media upload support.
- Game-like UI with progress bars, badges, and animated plant growth.

### Backend

- FastAPI, Node.js, or Firebase.
- Store users, plants, tasks, uploads, points, badges, and zone activity.
- Geospatial indexing for nearby farmers and farming zones.
- Background jobs for leaderboard updates and seasonal resets.

### AI Layer

- Image/video upload endpoint.
- Plant verification step.
- Health analysis model or vision API.
- Simple recommendation engine for care tasks.
- Store analysis history per plant.

### Data Model Ideas

- User
- Plant
- PlantUpdate
- HealthAnalysis
- Task
- Zone
- Leaderboard
- Badge
- Challenge

## Anti-Cheat Ideas

Since points and leaderboards are involved, the app should reduce fake submissions.

- Detect whether uploaded media contains a plant.
- Compare new plant images with previous uploads for consistency.
- Require short videos for higher-value tasks.
- Limit points from repeated similar uploads.
- Use timestamps and approximate location checks.
- Let community reports flag suspicious activity.

## Monetization Ideas

GROOTED can eventually earn through:

- Starter kits with seeds, soil, pots, and guides.
- Local nursery partnerships.
- Sponsored green zones.
- Premium plant analysis.
- Advanced crop planning.
- Community farming events.
- School or college sustainability programs.

## Risks

- Users may drop off if daily tasks feel repetitive.
- Plant health AI may be inaccurate for many species.
- Exact location sharing can create privacy concerns.
- Leaderboards can discourage beginners if not reset regularly.
- Farming progress is naturally slow, so the app needs small daily rewards.

## Open Research Questions

- Which plant categories should the app support first?
- Should the first users be balcony gardeners, college students, or small farmers?
- How accurate does plant health analysis need to be for the MVP?
- Should competition be individual, team-based, or both?
- What is the safest way to show nearby farmers without exposing exact locations?
- How can the app keep users engaged during slow growth periods?
- What daily tasks are universal across most beginner plants?

## Recommended First Version

The strongest first version is a gamified plant-care and local competition app for beginner urban growers.

Focus the first build on:

- One clear plant journey.
- A beautiful map-based local competition screen.
- Daily tasks and streaks.
- Upload-based plant health feedback.
- Farm Points and a small leaderboard.

This keeps the product focused while proving the main idea: farming can feel social, rewarding, and fun when the digital layer makes real-world growth visible.
