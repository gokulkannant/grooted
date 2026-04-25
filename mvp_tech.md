

## ---

## ---

**1\. The MVP Feature Architecture**

### **A. The "Chrono-Crop" Engine (Features 2 & 3\)**

Instead of complex AI, use **Metadata**.

* When a user uploads a photo, the app checks the **EXIF data** (timestamp and GPS).  
* **Hackathon Logic:** Create a Plant\_Template table: {"name": "Tomato", "days\_to\_harvest": 60, "xp\_per\_day": 10}.  
* The UI shows a **Circular Progress Bar** (e.g., "Day 14/60").

### **B. The "Influence" Map (Features 1 & 5\)**

* Don't try to draw complex polygons for territory.  
* **The Hack:** Use **Heatmaps** or **Radial Circles**. A user’s "territory" is a 500m circle around their GPS coordinate.  
* If two users overlap, the one with the higher **"Green Score"** (Streak × Plant Difficulty) owns the "dominant" color on the map.

### **C. The "War & Peace" Menu (Features 6 & 7\)**

When you tap a nearby farmer's icon, open a BottomSheet with:

* **🤝 Trade:** Send a "Barter Request" (e.g., "My Chillies for your Compost").  
* **🐛 Send Pests:** A "Attack" button. It adds a "Bug" overlay to their app home screen. They have to "tap the bugs" to clear them. It’s funny, annoying, and builds rivalry.  
* **💡 Trivia Duel:** A quick 3-question quiz about the specific plant they are growing. Winner steals 5 points.

## ---

**2\. The 10-Hour Execution Timeline**

| Time | Goal | Action |
| :---- | :---- | :---- |
| **0-2h** | **Foundation** | Set up Supabase. Create tables: Users, Plants, Streaks, Territory. |
| **2-4h** | **The Map** | Integrate flutter\_map. Render markers for users. Use a "Green Radial" for territory. |
| **4-6h** | **The Growth Lab** | Camera integration. Photo upload logic. Streak counter script in FastAPI. |
| **6-8h** | **The Social War** | "Ping" notification (use a simple database flag). "Bug Attack" overlay UI. |
| **8-9h** | **Leaderboard** | Global vs. Local (City-wide) ranking. |
| **9-10h** | **Polish & Pitch** | Add some "Seed" animations. Record a killer demo video. |

## ---

**3\. Keeping Users Hooked (The "Secret Sauce")**

To ensure they don't just delete the app after 2 days:

1. **The "Wilt" Factor:** If they miss a day, their map territory starts turning **brown**. The fear of losing their "conquered" city block is a powerful motivator (Loss Aversion).  
2. **The "Harvest" Reward:** When the 60 days are up, they get a "Digital Trophy" \+ a "Harvest Pack" (virtual currency) they can spend to buy "Legendary" seeds that give more points.  
3. **The "Community Quest":** A global goal: "If Kochi plants 500 trees this month, everyone gets a Gold Watering Can."

## ---

**Quick Hackathon Insight**

**Don't build a full barter system.** Just build the **"Handshake."** For the demo, show a "Trade Request Sent" notification. Judges care more about the *flow* and the *vibe* than a fully integrated payment or logistics system.

**Presentation Tip:** Start your pitch with: *"Meet Rahul. He spends 4 hours a day on Instagram. With GROOTED, those 4 hours just turned into 4 kilos of organic tomatoes and the title of 'King of Kochi Central'."*

