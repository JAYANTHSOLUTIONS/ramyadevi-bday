# A letter for you — birthday website (React + Vite)

## Run it
```bash
npm install
npm run dev        # open the link it prints (works on your phone on the same Wi-Fi)
npm run build      # makes the final site in dist/
```
Upload the `dist/` folder to Netlify (drag & drop), Vercel or GitHub Pages.

## Put in your own content
Edit **`src/config.js`**. Everything (names, letter, reasons, story, photos, date, places, dreams, song) comes from there.
Leave a list empty (`[]`) to show that chapter's empty state.

- Photos → put files in `public/photos/` and use `src: "photos/1.jpg"`

## Sounds
- Music → replace `public/music.mp3` (or change `music.src` in `src/config.js`). It starts when "Open the letter" is tapped.
- Most sound effects are made in code in `src/sound.js` — change pitches, lengths or loudness (`BOOST`) there.
- Two are recordings in `public/sfx/`: the clock tick (`tick-1.mp3`, `tick-2.mp3`, on "Your day") and the wish sparkle (`wish.mp3`, on "Our dreams"). Swap those files to change them; their volumes are in `FILES` at the top of `src/sound.js`.
- Turn effects off or change their volume in `src/config.js` → `sounds`. The music button (top-right) switches all sound on or off.

## Change the look
- `public/assets/linen.webp` — the empty tablecloth
- `public/assets/flowers-top.webp`, `flowers-bottom.webp` — the flower and prop layers (transparent PNG/WebP)
- `public/assets/rose*.webp` — roses used in the bouquet
- Camera movement per chapter → `pose` values in `src/App.jsx` (`[x%, y%, scale]` for top and bottom layers)
- Colors and fonts → top of `src/styles.css`
