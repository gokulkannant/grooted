# Fake Image Detection MVP

Detects if a plant photo is a real camera capture or a photo of a screen/printout.

## Approach

Uses OpenAI Vision (gpt-4o-mini) to analyze visual artifacts that indicate recapture:
- Moiré patterns from screen pixel grids
- Screen reflections, glare, bezels
- Halftone/dithering from printed material
- Unnatural lighting and color banding

## Usage

```bash
# Install dependencies
npm install

# Test with a real photo
node detect.mjs ./samples/real-plant.jpg

# Test with a photo of a screen
node detect.mjs ./samples/screen-photo.jpg

# Test with a URL
node detect.mjs https://example.com/plant.jpg
```

## Output

```json
{
  "isRecaptured": true,
  "confidence": 0.92,
  "reason": "Visible moiré pattern and screen pixel grid detected",
  "recommendation": "reject"
}
```
