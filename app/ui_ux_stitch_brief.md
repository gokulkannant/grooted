# GROOTED UI/UX Brief for Stitch

## Purpose of This Document

This document is a UX brief for generating the GROOTED app UI in Stitch. Stitch should handle the visual design, components, spacing, colors, and final screen polish. The goal here is to clearly describe the user experience, app structure, screen flow, content hierarchy, and interaction behavior.

GROOTED is a mobile-first app that makes farming and plant care feel social, competitive, and fun. Users should not feel like they are using a boring farming tracker. They should feel like they are entering a real-world farming game where daily plant care, nearby farmers, and plant health analysis all connect into one motivating loop.

## UX Goal

Design the app around this experience:

> I open the app, see my farming progress, complete today's plant tasks, scan my plant for health feedback, and check how I rank against nearby farmers.

The app should make the user feel:

- Motivated to return daily.
- Proud of their plant progress.
- Connected to nearby growers.
- Curious about plant health.
- Rewarded for small real-world actions.

## Primary User Journey

1. User opens the app.
2. User sees a dashboard with today's farming tasks, plant streak, and Farm Points.
3. User taps the daily plant task.
4. User uploads a plant photo or 2-second video.
5. App shows plant health analysis with simple recommendations.
6. User earns points and streak progress.
7. User checks the nearby farmer map.
8. User sees local rankings and nearby farming zones.
9. User feels encouraged to continue tomorrow.

This journey should be the backbone of the app design.

## App Navigation

Use mobile bottom navigation with 4 primary tabs. Bottom navigation is appropriate because the app has a few top-level destinations that users will switch between often.

### Bottom Navigation Tabs

1. **Home**
   - Daily tasks, current plant status, streak, and quick scan entry.

2. **Map**
   - Nearby farmers, farming zones, local competition, and community challenges.

3. **Scan**
   - Upload plant photo or 2-second video for health analysis.

4. **Profile**
   - User progress, badges, plants, digital garden, and settings entry.

Avoid adding more than 5 bottom tabs. Avoid hiding important app areas inside a hamburger menu for the MVP.

## Information Architecture

### Home

- Greeting and current status.
- Today's task list.
- Main plant card.
- Streak progress.
- Farm Points.
- Quick scan button.
- Local rank preview.

### Map

- Interactive map.
- Nearby farming zones.
- Approximate farmer activity markers.
- Current user's influence area.
- Local leaderboard preview.
- Challenge cards.
- Farmer detail bottom sheet.

### Scan

- Upload photo.
- Upload 2-second video.
- Recent scan results.
- Health score result.
- Suggested next task.
- Confidence indicator.

### Profile

- User level.
- Farm Points.
- Badges.
- Current plants.
- Harvest history.
- Digital garden.
- Settings and privacy controls.

## Onboarding Flow

The onboarding should be short and action-focused. Do not overload users with explanations.

### Screen 1: Welcome

Purpose: Explain the app in one sentence.

Suggested content:

- App name: GROOTED
- Message: "Turn real plant care into a local farming game."
- Primary action: "Start Growing"

### Screen 2: Choose Goal

Purpose: Personalize the experience.

Options:

- Grow my first plant
- Track my existing plant
- Compete with nearby growers
- Learn plant care

### Screen 3: Add First Plant

Purpose: Get the user into the product loop quickly.

Fields:

- Plant name
- Plant type
- Growth stage
- Optional photo

### Screen 4: Location Permission

Purpose: Explain why location is useful before asking.

Message:

- "Use approximate location to show nearby farming zones and local leaderboards."

Important UX instruction:

- Make it clear that exact home location should not be publicly shown.
- Give users a way to continue with limited map features if they skip location.

## Home Screen UX

The Home screen is the user's command center. It should answer:

- What should I do today?
- How is my plant doing?
- Am I keeping my streak alive?
- How close am I to the next reward?

### Required Sections

1. **Top Summary**
   - User greeting.
   - Current streak.
   - Farm Points.
   - Local rank.

2. **Main Plant Status**
   - Plant image or illustration.
   - Plant name.
   - Growth stage.
   - Day progress, for example "Day 14 of 60".
   - Health status, for example "Mostly healthy".

3. **Today's Tasks**
   - 3 to 5 tasks only.
   - Each task should have a clear completion state.
   - Tasks should feel achievable within minutes.

4. **Quick Scan Entry**
   - Strong call to action for uploading plant photo or video.
   - Should be visually prominent because plant scanning is a core feature.

5. **Nearby Challenge Preview**
   - Show one local challenge or leaderboard preview.
   - Tapping should take user to Map.

### Home Screen UX Notes

- Avoid long feeds on the Home screen.
- Keep the main action obvious.
- Use progress indicators for streak, growth, and task completion.
- Make task completion feel rewarding with small feedback moments.

## Map Screen UX

The Map screen is the app's social and competitive layer. It should make users feel like farming is happening around them.

### Map Behavior

- The map should be interactive: users can pan, zoom, and tap.
- Show approximate farming activity zones rather than exact home locations.
- Use area overlays, circles, or heatmap zones to show farming influence.
- Cluster nearby farmer markers when zoomed out.
- Reveal more detail as users zoom in.
- Keep the map readable and not overloaded.

### Map Elements

1. **User Zone**
   - Shows the user's approximate farming influence area.

2. **Nearby Farmers**
   - Display as approximate markers or avatars.
   - Do not show exact address-level locations.

3. **Green Zones**
   - Areas with high farming activity.
   - Could show intensity based on community activity.

4. **Challenges**
   - Local events or zone challenges.
   - Example: "Watering Week: 35/100 tasks completed."

5. **Leaderboard Preview**
   - Top 3 nearby users.
   - User's current rank.

### Farmer Detail Bottom Sheet

When a user taps a farmer or zone, open a bottom sheet instead of navigating away immediately.

Bottom sheet content:

- Farmer name or display name.
- Approximate distance or zone name.
- Main crop.
- Farm Points.
- Streak.
- Badges.
- Actions:
  - View profile
  - Challenge
  - Send encouragement

Bottom sheet UX rules:

- Keep it short.
- Do not put deep multi-step flows inside the bottom sheet.
- Use it for quick context and short actions.

## Scan Screen UX

The Scan screen should feel simple, trustworthy, and fast.

### Main Actions

- Upload plant photo.
- Upload 2-second plant video.
- View latest health report.

### Upload UX

After upload, show an analysis loading state with clear steps:

1. Checking if this is a plant.
2. Looking at leaf color and shape.
3. Estimating health.
4. Preparing care advice.

This makes the analysis feel understandable instead of mysterious.

### Health Result UX

The result screen should be beginner-friendly.

Required fields:

- Health Score, for example 82/100.
- Status, for example "Mostly healthy".
- Possible issue, for example "Lower leaves are slightly yellow."
- Likely cause, for example "Could be overwatering or low nutrients."
- Next task, for example "Check soil moisture before watering."
- Confidence, for example "Medium confidence."

### Important Tone

Avoid scary or overconfident language. Plant diagnosis can be uncertain, so the UI should say "possible issue" or "likely cause" instead of sounding medically exact.

## Daily Task UX

Daily tasks are the habit engine of the product.

### Task Card Requirements

Each task should show:

- Task title.
- Estimated time.
- Reward points.
- Completion status.
- Optional hint.

Example tasks:

- Upload today's plant photo.
- Water the plant.
- Check soil moisture.
- Rotate pot toward sunlight.
- Look for yellow leaves.

### Completion Feedback

When a user completes a task:

- Mark it complete immediately.
- Add Farm Points.
- Update streak progress.
- Show a small success message.
- Suggest the next task.

## Leaderboard UX

Leaderboards should motivate, not discourage.

### Leaderboard Types

- Nearby weekly leaderboard.
- Friends leaderboard.
- Zone leaderboard.
- Seasonal leaderboard.

### Required Content

- User rank.
- Top 3 users.
- Farm Points.
- Streak.
- Main crop.
- Badge or title.

### Beginner-Friendly UX

Do not only show the top players. Always show:

- The user's own rank.
- How many points to reach the next rank.
- A smaller achievable goal, such as "Complete 2 tasks to pass the next farmer."

## Profile UX

The Profile should feel like the user's farming identity.

### Sections

- User display name.
- Level or title.
- Farm Points.
- Current streak.
- Badges.
- Current plants.
- Digital garden.
- Harvest history.
- Privacy settings.

### Digital Garden

The digital garden should visually represent real progress. More consistent real-world care should make the digital garden look richer.

This should not be a separate complex game in the MVP. It should be a satisfying visual reward layer.

## Notifications UX

Notifications should be helpful, not annoying.

Useful notification types:

- Daily task reminder.
- Streak risk warning.
- Plant health follow-up.
- Nearby challenge update.
- Leaderboard movement.

Avoid spammy notifications. Let users control reminders.

## Privacy UX

Privacy is especially important because the app uses location and plant uploads.

### Location

- Use approximate location for map zones.
- Do not reveal exact home, balcony, or farm location publicly.
- Explain why location is needed before asking for permission.
- Allow limited use without location permission.

### Uploads

- Tell users plant images are used for health analysis.
- Let users delete plant uploads.
- Do not require users to make plant photos public.

### Public Identity

- Let users choose display name.
- Do not require real name.
- Allow profile visibility controls.

## Empty States

Design useful empty states for:

- No plants added.
- No nearby farmers.
- No scan history.
- No tasks completed.
- No badges yet.

Each empty state should include one clear action.

Examples:

- "Add your first plant."
- "Scan a plant to get your first health report."
- "Complete today's task to join the leaderboard."

## Error States

Design friendly error states for:

- Upload failed.
- Analysis failed.
- Image does not contain a plant.
- Location permission denied.
- No internet connection.

Error states should always tell the user what to do next.

Examples:

- "We couldn't analyze this image. Try a clearer photo of the leaves."
- "Location is off. You can still complete tasks, but nearby rankings will be limited."

## Accessibility UX

Stitch should design for accessibility from the start.

- Use readable text sizes.
- Keep tap targets large enough for mobile.
- Do not rely only on color to show task status or plant health.
- Make buttons and actions clearly labeled.
- Ensure map markers and health results have text alternatives.
- Keep contrast strong enough over map backgrounds and image cards.

## Stitch Design Direction

Stitch should create a polished mobile app UI for the screens listed below.

### Required Screens for Stitch

1. Onboarding welcome screen.
2. Add first plant screen.
3. Home dashboard.
4. Daily task detail/completion screen.
5. Scan upload screen.
6. Plant health result screen.
7. Map screen with nearby farming zones.
8. Farmer/zone bottom sheet.
9. Local leaderboard screen.
10. Profile/digital garden screen.
11. Empty state examples.
12. Error state examples.

### UX Priority

The most important screens are:

1. Home dashboard.
2. Map screen.
3. Scan upload screen.
4. Health result screen.
5. Leaderboard.

These screens explain the product best in a hackathon demo.

## Suggested Stitch Prompt

Use this prompt in Stitch:

> Create a mobile app UI/UX for GROOTED, a gamified farming and plant-care app. The app helps users complete daily farming tasks, upload plant photos or 2-second videos for health analysis, earn Farm Points, maintain streaks, and compete with nearby farmers on a map. Design the UX around four bottom navigation tabs: Home, Map, Scan, and Profile. The Home screen should show today's tasks, current plant progress, streak, Farm Points, and a quick scan action. The Map screen should show approximate nearby farming zones, green influence areas, local challenges, and a local leaderboard preview without revealing exact user locations. Tapping a nearby farmer or zone should open a short bottom sheet with farmer details and actions. The Scan screen should support photo/video upload and show a clear plant health analysis result with health score, possible issue, likely cause, next task, and confidence. The Profile screen should show badges, plants, digital garden, harvest history, and privacy controls. Keep the experience mobile-first, playful, motivating, beginner-friendly, and privacy-aware. Focus on clear user flows, daily habit formation, map-based competition, and simple plant-health feedback.

## Design References and Research Notes

The UX direction is based on widely used mobile design patterns:

- Bottom navigation is best for 3 to 5 top-level mobile destinations that users need to access frequently.
- Interactive maps should support familiar behaviors like pan, zoom, selectable markers, overlays, and readable detail cards.
- Location-based apps should explain why location is needed and protect user privacy.
- Bottom sheets work well for short supporting actions, such as viewing a nearby farmer without fully leaving the map.
- Gamification should reward small meaningful actions and show progress clearly so users feel motivated instead of overwhelmed.

Research references:

- Material Design bottom navigation: https://m1.material.io/components/bottom-navigation.html
- Material Design bottom sheets: https://m1.material.io/components/bottom-sheets.html
- Apple Human Interface Guidelines, Maps: https://developer.apple.com/design/human-interface-guidelines/maps
- Apple Human Interface Guidelines, Privacy: https://developer.apple.com/design/human-interface-guidelines/privacy
