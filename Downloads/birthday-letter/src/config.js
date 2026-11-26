/* =====================================================================
   ✏️  EDIT YOUR CONTENT HERE — everything on the site comes from CONFIG.
   The text below is sample content. Leave any list empty ([]) or any
   text blank ("") and that chapter shows its quiet empty state instead.

   Photos: put image files in  public/photos/  and use  src: "photos/1.jpg"
   Music:  put an mp3 in       public/        and set music.background below
   Background art lives in     public/assets/ (swap the .webp files to restyle)
   ===================================================================== */
export const CONFIG = {
  badge: "2L",                      // little logo, top-left
  recipient: "you",                 // big word on the cover
  closing: "with warm wishes,",     // line under the envelope…
  from: "your friend",              // …followed by this name
  sealInitial: "L",                 // letter pressed into the wax seal

  // Chapter names (dock button, table labels, headings) — rename freely
  labels: {
    letter: "The letter",
    love: "Why you shine",
    story: "Your journey",
    photos: "Memories",
    date: "Your day",
    dreams: "Wishes for you",
    song: "Now playing",
    table: "The table"
  },

  letter: {
    greeting: "Happy birthday!",
    paragraphs: [
      "Another year, another chapter — and I've written this one with so much grit and heart.",
      "Look at how far you've come: the goals you chased, the risks you took, the things you learned the hard way and kept going anyway.",
      "This little table is a reminder of all of it, and of everything still ahead of you. Take your time and open each piece."
    ],
    signoff: "Cheering for you, always,",
    signature: "Your friend"
  },

  reasons: [                        // "Why you shine" — each becomes a rose in the bouquet
    "You never give up, even when the odds say you should.",
    "You make hard work look like a habit, not a chore.",
    "You lift the people around you while you climb.",
    "You keep learning, and it shows in everything you do.",
    "You turn every setback into a comeback."
  ],

  // Shown with fireworks after the last reason's rose blooms
  finale: {
    enabled: true,
    eyebrow: "Today is all about you",
    title: "Happy Birthday",
    subtitle: "Here's to your best year yet"
  },

  story: [                          // "Your journey" — one notebook page each
    { when: "The beginning", title: "The first big step", text: "New city, new start, and a whole lot of courage nobody saw coming." },
    { when: "The breakthrough", title: "When it clicked", text: "All those late nights finally paid off — and you proved to yourself what you're capable of." },
    { when: "Today", title: "Still rising", text: "You're not at the top yet, and that's the exciting part. The best chapters are still unwritten." }
  ],

  photos: [                         // "Memories" — leave src "" for a soft placeholder
    { src: "photos/image1.jpeg", caption: "Memories" },
    { src: "photos/image2.jpeg", caption: "2025 Farewell" },
    { src: "photos/image3.jpeg", caption: "2026 Kalai Vizha" },
    { src: "photos/image24.jpeg", caption: "2026 Farewell" }
  ],

  // "Your day" — the birthday (YYYY-MM-DD); the counter shows days lived so far
  date: { iso: "2004-12-08", label: "The day you arrived" },

  wishes: [                         // "Wishes for you" — one per tap on the dandelion
    "May this year bring the promotion you've been working toward",
    "May every late night turn into something you're proud of",
    "New skills, new doors, new heights",
    "May you lead the room you once dreamed of entering",
    "Good health, steady growth, and courage for every leap",
    "May you build the career you imagine — one brave step at a time"
  ],

  // Background music — starts when "Open the letter" is tapped and loops until paused.
  music: {
    background: { src: "music.mp3", title: "Ashley's Flashback", artist: "Bethlehem Kudumba Unit · Mr. Manglish" },
    volume: 0.7
  },

  // Game-like sound effects on buttons and objects
  sounds: { enabled: true, volume: 0.6 }
};
