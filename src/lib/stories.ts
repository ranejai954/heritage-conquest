export type StoryScene = {
  image: string;
  caption: string;
};

export type MonumentStory = {
  title: string;
  scenes: StoryScene[];
};

export const STORIES: Record<string, MonumentStory> = {
  "ajanta-caves": {
    title: "Ajanta Caves",
    scenes: [
      {
        image: "/stories/ajanta-caves/1.jpeg",
        caption:
          "Mithoo discovers the ancient Ajanta Caves, carved into the rocky hills of Maharashtra.",
      },
      {
        image: "/stories/ajanta-caves/2.jpeg",
        caption:
          "The caves reveal a remarkable world of ancient art, architecture and history.",
      },
      {
        image: "/stories/ajanta-caves/3.jpeg",
        caption:
          "Inside the caves, beautiful paintings cover the walls and tell stories from the past.",
      },
      {
        image: "/stories/ajanta-caves/4.jpeg",
        caption:
          "Mithoo carefully explores the artwork preserved inside the ancient caves.",
      },
      {
        image: "/stories/ajanta-caves/5.jpeg",
        caption:
          "The artists created detailed paintings using colours and techniques available centuries ago.",
      },
      {
        image: "/stories/ajanta-caves/6.jpeg",
        caption:
          "Every painting gives us a glimpse into the culture and life of ancient India.",
      },
      {
        image: "/stories/ajanta-caves/7.jpeg",
        caption:
          "Mithoo notices different figures, patterns and scenes hidden among the paintings.",
      },
      {
        image: "/stories/ajanta-caves/8.jpeg",
        caption:
          "The ancient artwork has survived for centuries, making Ajanta an important historical treasure.",
      },
      {
        image: "/stories/ajanta-caves/9.jpeg",
        caption:
          "Mithoo begins the challenge of remembering the beautiful paintings inside the caves.",
      },
      {
        image: "/stories/ajanta-caves/10.jpeg",
        caption:
          "Can you remember the details of the artwork before moving on?",
      },
      {
        image: "/stories/ajanta-caves/11.jpeg",
        caption:
          "Mithoo is ready to restore the forgotten paintings from memory.",
      },
      {
        image: "/stories/ajanta-caves/12.jpeg",
        caption:
          "The Ajanta adventure is complete. Now it's time to test what you discovered!",
      },
    ],
  },

  "qutub-minar": {
    title: "The Qutub Minar Adventure",
    scenes: [
      {
        image: "/stories/qutub-minar/1.png",
        caption:
          "Mithoo arrives in Delhi and discovers the towering Qutub Minar rising gracefully into the morning sky.",
      },
      {
        image: "/stories/qutub-minar/2.png",
        caption:
          "From high above, Mithoo flies over the vast Qutub complex, surrounded by historic walls and green courtyards.",
      },
      {
        image: "/stories/qutub-minar/3.png",
        caption:
          "Mithoo observes master craftsmen and architects examining blueprints and carefully shaping heavy sandstone blocks.",
      },
      {
        image: "/stories/qutub-minar/4.png",
        caption:
          "With pulleys, scaffolding, and teamwork, Mithoo watches as the monumental tower begins to rise level by level.",
      },
      {
        image: "/stories/qutub-minar/5.png",
        caption:
          "Looking straight up from the base, Mithoo is amazed by the towering height and intricate fluted storeys.",
      },
      {
        image: "/stories/qutub-minar/6.png",
        caption:
          "Up close, Mithoo examines the delicate floral patterns and beautiful calligraphic bands carved into the red sandstone.",
      },
      {
        image: "/stories/qutub-minar/7.png",
        caption:
          "Exploring the central courtyard, Mithoo discovers the world-famous Iron Pillar standing proudly near ancient arches.",
      },
      {
        image: "/stories/qutub-minar/8.png",
        caption:
          "Mithoo perches near the stone pillared corridors and marvels at how centuries of history live inside these ruins.",
      },
      {
        image: "/stories/qutub-minar/9.png",
        caption:
          "Looking up at the open blue sky, Mithoo admires the incredible balcony brackets supporting each level of the minar.",
      },
      {
        image: "/stories/qutub-minar/10.png",
        caption:
          "Standing near the base, Mithoo gazes up at the magnificent monument framed by lush trees and peaceful greenery.",
      },
      {
        image: "/stories/qutub-minar/11.png",
        caption:
          "Mithoo realizes that centuries have passed around the minar, and now he needs your help to inspect and stabilize the glowing stone blocks!",
      },
      {
        image: "/stories/qutub-minar/12.png",
        caption:
          "The Qutub Minar adventure is complete! The majestic tower stands proudly against the golden sunset sky.",
      },
    ],
  },

  "taj-mahal": {
    title: "The Taj Mahal Adventure",
    scenes: [
      {
        image: "/stories/taj-mahal/1.jpeg",
        caption:
          "Mithoo arrives in Agra, Uttar Pradesh, and catches his first breathless glimpse of the stunning Taj Mahal.",
      },
      {
        image: "/stories/taj-mahal/2.jpeg",
        caption:
          "Looking down from above, Mithoo sees the symmetrical Mughal gardens, reflecting pool, and the gentle Yamuna River.",
      },
      {
        image: "/stories/taj-mahal/3.jpeg",
        caption:
          "Mithoo learns the historical story of Mughal Emperor Shah Jahan and Mumtaz Mahal inside the royal palace.",
      },
      {
        image: "/stories/taj-mahal/4.jpeg",
        caption:
          "The Emperor plans a magnificent marble mausoleum to honor Mumtaz Mahal's memory, reviewing architectural drawings.",
      },
      {
        image: "/stories/taj-mahal/5.jpeg",
        caption:
          "Construction begins in 1632! Mithoo watches artisans and stone craftsmen shaping white marble under wooden scaffolding.",
      },
      {
        image: "/stories/taj-mahal/6.jpeg",
        caption:
          "Thousands of skilled workers carve delicate patterns and assemble marble blocks as the great central structure takes form.",
      },
      {
        image: "/stories/taj-mahal/7.jpeg",
        caption:
          "Mithoo admires the iconic central dome and four tall minarets standing in perfect architectural symmetry.",
      },
      {
        image: "/stories/taj-mahal/8.jpeg",
        caption:
          "Up close, Mithoo examines the fine Pietra Dura stone inlays, floral carvings, and calligraphy adorning the marble walls.",
      },
      {
        image: "/stories/taj-mahal/9.jpeg",
        caption:
          "Exploring the lush gardens, Mithoo admires the clear reflection of the marble dome shimmering in the long pool.",
      },
      {
        image: "/stories/taj-mahal/10.jpeg",
        caption:
          "The completed white marble mausoleum shines brilliantly against the sky, a masterpiece of global heritage.",
      },
      {
        image: "/stories/taj-mahal/11.jpeg",
        caption:
          "Mithoo stands beside visitors from around the world, celebrating the timeless legacy of this UNESCO World Heritage site.",
      },
      {
        image: "/stories/taj-mahal/12.jpeg",
        caption:
          "The Taj Mahal discovery is complete! Now Mithoo is ready to test what you have learned in the upcoming challenge.",
      },
    ],
  },

  "gateway-of-india": {
    title: "The Gateway of India Adventure",
    scenes: [
      {
        image: "/stories/gateway-of-india/1.jpeg",
        caption:
          "Mithoo discovers the magnificent Gateway of India standing beside the Arabian Sea in Mumbai, surrounded by the historic waterfront.",
      },
      {
        image: "/stories/gateway-of-india/2.jpeg",
        caption:
          "The Gateway rises proudly beside Mumbai Harbour, where boats move across the water and the city stretches into the distance.",
      },
      {
        image: "/stories/gateway-of-india/3.jpeg",
        caption:
          "Mithoo travels back in time and watches architects and craftsmen carefully planning the construction of the enormous stone gateway.",
      },
      {
        image: "/stories/gateway-of-india/4.jpeg",
        caption:
          "Workers carefully build the grand arch using stone, while Mithoo watches the Gateway slowly take shape beside the busy harbour.",
      },
      {
        image: "/stories/gateway-of-india/5.jpeg",
        caption:
          "Mithoo explores the enormous central arch and discovers the impressive scale and Indo-Saracenic architectural details of the monument.",
      },
      {
        image: "/stories/gateway-of-india/6.jpeg",
        caption:
          "Up close, Mithoo examines the carved arches, domes and decorative stonework that give the Gateway its distinctive appearance.",
      },
      {
        image: "/stories/gateway-of-india/7.jpeg",
        caption:
          "From the waterfront, Mithoo watches boats passing around the Gateway, showing how closely the monument is connected with Mumbai Harbour.",
      },
      {
        image: "/stories/gateway-of-india/8.jpeg",
        caption:
          "Visitors and boats gather around the historic waterfront as Mithoo explores the lively surroundings of the Gateway of India.",
      },
      {
        image: "/stories/gateway-of-india/9.jpeg",
        caption:
          "Mithoo looks across the Mumbai waterfront and sees the Gateway standing proudly among the historic buildings and busy harbour.",
      },
      {
        image: "/stories/gateway-of-india/10.jpeg",
        caption:
          "As evening arrives, the Gateway of India becomes a striking silhouette against the glowing sky above the Arabian Sea.",
      },
      {
        image: "/stories/gateway-of-india/11.jpeg",
        caption:
          "After travelling through its history, Mithoo realizes that the Gateway of India has remained an enduring landmark of Mumbai's waterfront.",
      },
      {
        image: "/stories/gateway-of-india/12.jpeg",
        caption:
          "The Gateway of India adventure is complete! Mithoo celebrates beside the monument before preparing for the next historical discovery.",
      },
    ],
  },

  // ============================================================
  // GOLDEN TEMPLE
  // ============================================================

  "golden-temple": {
    title: "The Golden Temple Adventure",
    scenes: [
      {
        image: "/stories/golden-temple/1.jpeg",
        caption:
          "Mithoo flies over the shimmering Amrit Sarovar, amazed by the spectacular first reveal of the Golden Temple reflected in the water.",
      },
      {
        image: "/stories/golden-temple/2.jpeg",
        caption:
          "Mithoo arrives excitedly at a historic path in Amritsar, Punjab, leading toward the Golden Temple complex.",
      },
      {
        image: "/stories/golden-temple/3.jpeg",
        caption:
          "Guru Arjan Dev Ji respectfully oversees the early construction of Harmandir Sahib while skilled craftsmen carefully work on the sacred structure.",
      },
      {
        image: "/stories/golden-temple/4.jpeg",
        caption:
          "The Golden Temple rises across the peaceful Amrit Sarovar, its beautiful golden facade reflected clearly in the surrounding water.",
      },
      {
        image: "/stories/golden-temple/5.jpeg",
        caption:
          "Mithoo watches craftsmen working on the historically inspired gold-plated decorative exterior of the Golden Temple.",
      },
      {
        image: "/stories/golden-temple/6.jpeg",
        caption:
          "Mithoo travels along the famous causeway toward the Golden Temple as peaceful visitors make their way across the water.",
      },
      {
        image: "/stories/golden-temple/7.jpeg",
        caption:
          "Mithoo gets a beautiful close-up view of the Golden Temple, perfectly reflected in the calm waters of Amrit Sarovar.",
      },
      {
        image: "/stories/golden-temple/8.jpeg",
        caption:
          "Mithoo explores the intricate golden facade, admiring the detailed patterns, domes and traditional decorative architecture.",
      },
      {
        image: "/stories/golden-temple/9.jpeg",
        caption:
          "Peaceful visitors gather respectfully around the Amrit Sarovar while the Golden Temple is beautifully reflected in the water.",
      },
      {
        image: "/stories/golden-temple/10.jpeg",
        caption:
          "Mithoo discovers the tradition of Langar, where volunteers prepare and serve food to people from diverse backgrounds.",
      },
      {
        image: "/stories/golden-temple/11.jpeg",
        caption:
          "As the sun sets, Mithoo watches the Golden Temple become a striking silhouette while the changing sky creates a peaceful historical atmosphere.",
      },
      {
        image: "/stories/golden-temple/12.jpeg",
        caption:
          "Mithoo stands proudly beside the Amrit Sarovar as the Golden Temple glows beautifully in warm golden-hour light, completing his journey through its history.",
      },
    ],
  },

  // ============================================================
  // HAWA MAHAL
  // ============================================================

  "hawa-mahal": {
    title: "The Hawa Mahal Adventure",
    scenes: [
      {
        image: "/stories/hawa-mahal/1.jpeg",
        caption:
          "Mithoo flies over Jaipur and catches his first spectacular glimpse of the famous Hawa Mahal, glowing warmly against the morning sky.",
      },
      {
        image: "/stories/hawa-mahal/2.jpeg",
        caption:
          "Mithoo arrives in the historic Pink City and discovers the beautiful Hawa Mahal rising above the streets of Jaipur.",
      },
      {
        image: "/stories/hawa-mahal/3.jpeg",
        caption:
          "Mithoo travels back in time and observes Maharaja Sawai Pratap Singh and skilled architects planning the remarkable palace facade.",
      },
      {
        image: "/stories/hawa-mahal/4.jpeg",
        caption:
          "Mithoo explores the purpose of the Hawa Mahal and discovers how its many small windows allowed royal women to observe street life while maintaining privacy.",
      },
      {
        image: "/stories/hawa-mahal/5.jpeg",
        caption:
          "Standing before the facade, Mithoo is amazed by the hundreds of small windows, balconies and detailed pink sandstone decorations.",
      },
      {
        image: "/stories/hawa-mahal/6.jpeg",
        caption:
          "Mithoo flies through the gentle breeze around the many openings of the palace and discovers why the monument is known as the Palace of Winds.",
      },
      {
        image: "/stories/hawa-mahal/7.jpeg",
        caption:
          "Up close, Mithoo examines the beautiful jharokhas, arches and intricate details covering the historic facade.",
      },
      {
        image: "/stories/hawa-mahal/8.jpeg",
        caption:
          "Mithoo steps back to admire the mysterious and fascinating structure, where hundreds of windows create a unique honeycomb-like appearance.",
      },
      {
        image: "/stories/hawa-mahal/9.jpeg",
        caption:
          "Mithoo explores the stories connected with the palace while flying across the detailed pink facade of Hawa Mahal.",
      },
      {
        image: "/stories/hawa-mahal/10.jpeg",
        caption:
          "From above, Mithoo sees Hawa Mahal surrounded by the colourful streets and historic architecture of Jaipur's Pink City.",
      },
      {
        image: "/stories/hawa-mahal/11.jpeg",
        caption:
          "As evening arrives, Mithoo watches Hawa Mahal glow against the changing sky and reflects on its lasting historical legacy.",
      },
      {
        image: "/stories/hawa-mahal/12.jpeg",
        caption:
          "The Hawa Mahal adventure is complete! Mithoo proudly flies beside the magnificent Palace of Winds before continuing his heritage quest.",
      },
    ],
  },

  // ============================================================
  // SANCHI STUPA
  // ============================================================

  "sanchi-stupa": {
    title: "The Sanchi Stupa Adventure",
    scenes: [
      {
        image: "/stories/sanchi-stupa/1.png",
        caption:
          "Mithoo flies across the peaceful landscape of Sanchi and discovers an ancient sanctuary hidden among the green hills.",
      },
      {
        image: "/stories/sanchi-stupa/2.png",
        caption:
          "Mithoo approaches the Great Stupa of Sanchi and is amazed by its enormous dome surrounded by ancient stone structures.",
      },
      {
        image: "/stories/sanchi-stupa/3.png",
        caption:
          "Standing before the Great Stupa, Mithoo observes its massive hemispherical dome and the carefully arranged stone architecture.",
      },
      {
        image: "/stories/sanchi-stupa/4.png",
        caption:
          "Mithoo discovers the beautifully carved torana gateway, filled with ancient stories, symbols and decorative stone panels.",
      },
      {
        image: "/stories/sanchi-stupa/5.png",
        caption:
          "The stone carvings reveal scenes from ancient Indian life, traditions and Buddhist stories preserved through generations.",
      },
      {
        image: "/stories/sanchi-stupa/6.png",
        caption:
          "Mithoo examines the symbolic carvings and wonders about the meanings represented through animals, plants and ancient motifs.",
      },
      {
        image: "/stories/sanchi-stupa/7.png",
        caption:
          "Mithoo meets the skilled stone craftsmen who carefully carved the detailed gateways and architectural elements of Sanchi.",
      },
      {
        image: "/stories/sanchi-stupa/8.png",
        caption:
          "Walking through the torana, Mithoo looks back at the Great Stupa and realizes how much history is preserved in its stonework.",
      },
      {
        image: "/stories/sanchi-stupa/9.png",
        caption:
          "Mithoo discovers an ancient inscription and begins investigating the mysterious symbols carved into the weathered stone.",
      },
      {
        image: "/stories/sanchi-stupa/10.png",
        caption:
          "With the ancient monument behind him, Mithoo carefully studies the clues and prepares to decode the mysterious inscription.",
      },
      {
        image: "/stories/sanchi-stupa/11.png",
        caption:
          "After centuries of silence, the Great Stupa stands peacefully beneath the trees, while Mithoo realizes that the stone still remembers its stories.",
      },
      {
        image: "/stories/sanchi-stupa/12.png",
        caption:
          "Mithoo successfully uncovers the ancient mystery! The Sanchi Stupa adventure is complete, and the hidden heritage story has been unlocked.",
      },
    ],
  },

  // ============================================================
  // MYSORE PALACE
  // ============================================================

  "mysore-palace": {
    title: "The Mysore Palace Adventure",
    scenes: [
      {
        image: "/stories/mysore-palace/1.jpeg",
        caption:
          "Mithoo arrives in Mysore and discovers the magnificent palace rising above the historic city in the warm morning light.",
      },
      {
        image: "/stories/mysore-palace/2.jpeg",
        caption:
          "Flying closer, Mithoo explores the grand palace grounds and gets his first look at the impressive royal architecture.",
      },
      {
        image: "/stories/mysore-palace/3.jpeg",
        caption:
          "Inside the palace, Mithoo discovers an elegant royal hall filled with ornate arches, decorated pillars and a richly detailed throne area.",
      },
      {
        image: "/stories/mysore-palace/4.jpeg",
        caption:
          "Mithoo travels back in time and watches architects and craftsmen working together to create the magnificent royal palace.",
      },
      {
        image: "/stories/mysore-palace/5.jpeg",
        caption:
          "From the grand entrance, Mithoo looks up at the palace domes and detailed towers that make the Mysore skyline so distinctive.",
      },
      {
        image: "/stories/mysore-palace/6.jpeg",
        caption:
          "Mithoo flies through an ornate palace arch and discovers another beautifully decorated passage inside the royal complex.",
      },
      {
        image: "/stories/mysore-palace/7.jpeg",
        caption:
          "Mithoo enters one of the palace's magnificent halls, surrounded by richly decorated ceilings, arches and traditional royal details.",
      },
      {
        image: "/stories/mysore-palace/8.jpeg",
        caption:
          "In another grand royal chamber, Mithoo observes the richly dressed court and the magnificent throne placed at the centre.",
      },
      {
        image: "/stories/mysore-palace/9.jpeg",
        caption:
          "As evening begins, Mithoo watches a royal procession move through the palace grounds, bringing the history of Mysore to life.",
      },
      {
        image: "/stories/mysore-palace/10.jpeg",
        caption:
          "The palace shines brilliantly after sunset, its illuminated facade turning Mysore Palace into a spectacular sight.",
      },
      {
        image: "/stories/mysore-palace/11.jpeg",
        caption:
          "Mithoo watches the palace against the evening sky and realizes how much history is preserved within its walls.",
      },
      {
        image: "/stories/mysore-palace/12.jpeg",
        caption:
          "The Mysore Palace adventure is complete! Mithoo proudly flies before the magnificent palace, ready for the next heritage challenge.",
      },
    ],
  },
   // ============================================================
  // Charminar
  // ============================================================
  "charminar": {
    title: "The Charminar Adventure",
    scenes: [
      {
        image: "/stories/charminar/1.jpeg",
        caption:
          "Mithoo arrives in Hyderabad and catches his first spectacular view of the iconic Charminar standing in the heart of the city.",
      },
      {
        image: "/stories/charminar/2.jpeg",
        caption:
          "Flying through the bustling streets, Mithoo approaches the grand structure surrounded by lively historical markets.",
      },
      {
        image: "/stories/charminar/3.jpeg",
        caption:
          "Mithoo travels back in time to 1591, watching Sultan Muhammad Quli Qutb Shah plan the grand city and layout blueprints for the monument.",
      },
      {
        image: "/stories/charminar/4.jpeg",
        caption:
          "Construction begins! Mithoo watches builders, stone masons, and laborers setting up scaffolding to erect the monumental arches.",
      },
      {
        image: "/stories/charminar/5.jpeg",
        caption:
          "Mithoo flies gracefully over the rising structure, marveling at how the massive square base connects the layout perfectly.",
      },
      {
        image: "/stories/charminar/6.jpeg",
        caption:
          "Gliding right through one of the four magnificent grand arches, Mithoo experiences the incredible architectural scale firsthand.",
      },
      {
        image: "/stories/charminar/7.jpeg",
        caption:
          "Up close, Mithoo admires the ornate balconies and stucco decorations carved intricately into the upper storeys.",
      },
      {
        image: "/stories/charminar/8.jpeg",
        caption:
          "Perched high on a balcony, Mithoo gazes out over the dense, growing historic city stretching toward the horizon.",
      },
      {
        image: "/stories/charminar/9.jpeg",
        caption:
          "Mithoo looks down at the vibrant, bustling bazaar below, where merchants and locals gather near the arches just like centuries ago.",
      },
      {
        image: "/stories/charminar/10.jpeg",
        caption:
          "Flying high against a soft sky, Mithoo admires how the four iconic minarets tower beautifully over the cityscape.",
      },
      {
        image: "/stories/charminar/11.jpeg",
        caption:
          "Centuries have passed, and now Mithoo needs your help to inspect and restore the ancient stone blocks of this historic monument!",
      },
      {
        image: "/stories/charminar/12.jpeg",
        caption:
          "The Charminar adventure is complete! The magnificent monument stands proudly as a timeless symbol of heritage and culture.",
      },
    ],
  },
// ============================================================
  // TIME MACHINE
  // ============================================================

  "time-machine": {
    title: "The Time Machine — Temporal Paradox",
    scenes: [
      {
        image: "/stories/time-machine/1.png",
        caption:
          "Deep inside a hidden chamber, Mithoo discovers a mysterious time machine surrounded by ancient walls and forgotten symbols.",
      },
      {
        image: "/stories/time-machine/2.png",
        caption:
          "As Mithoo approaches the machine, its ancient clock awakens and the gears begin to turn, filling the chamber with a strange golden glow.",
      },
      {
        image: "/stories/time-machine/3.png",
        caption:
          "The machine suddenly comes alive and opens a swirling portal through time. Mithoo realizes that an incredible journey is about to begin.",
      },
      {
        image: "/stories/time-machine/4.png",
        caption:
          "Beyond the portal, Mithoo sees a historical timeline filled with magnificent monuments from different periods of India's history.",
      },
      {
        image: "/stories/time-machine/5.png",
        caption:
          "The monuments of time begin to glow around Mithoo. Each monument represents an important chapter in India's rich cultural heritage.",
      },
      {
        image: "/stories/time-machine/6.png",
        caption:
          "Suddenly, the timeline breaks apart! Pieces of history scatter across time, and Mithoo realizes that something has gone terribly wrong.",
      },
      {
        image: "/stories/time-machine/7.png",
        caption:
          "Different moments in history begin to overlap, creating a dangerous temporal paradox where monuments from different eras appear together.",
      },
      {
        image: "/stories/time-machine/8.png",
        caption:
          "The timeline becomes empty as important memories of history disappear. Mithoo must find a way to restore the lost moments.",
      },
      {
        image: "/stories/time-machine/9.png",
        caption:
          "Mithoo carefully studies the clues left behind by the monuments and begins figuring out where each piece of history belongs.",
      },
      {
        image: "/stories/time-machine/10.png",
        caption:
          "Using the clues, Mithoo starts restoring the monuments to their correct positions and repairing the broken historical timeline.",
      },
      {
        image: "/stories/time-machine/11.png",
        caption:
          "Only one chronological puzzle remains. Mithoo must arrange the final historical clues in the correct order to completely restore the timeline.",
      },
      {
        image: "/stories/time-machine/12.png",
        caption:
          "The timeline has been restored! The time machine awakens once again, and Mithoo is ready to continue his journey through India's history.",
      },
    ],
  },
};