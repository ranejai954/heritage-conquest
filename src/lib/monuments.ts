export type Monument = {
  slug: string;
  name: string;
  region: string;
  era: string;
  tagline: string;

  /** script file under /games */
  script: string;

  /** global start function name */
  start: string;

  /** global end hook used by the "give up" button */
  end: string;

  /** canvas games get a <canvas>, dom games get a <div> host */
  kind: "canvas" | "dom";

  /** position on the India map, in percent of the map box */
  x: number;
  y: number;
};

export const MONUMENTS: Monument[] = [
  {
    slug: "qutub-minar",
    name: "Qutub Minar",
    region: "Delhi",
    era: "1199 CE",
    tagline:
      "Stabilize the Minar before the tower gives way.",
    script: "qutub-minar.js",
    start: "startQutubMinarGame",
    end: "onQutubEnd",
    kind: "canvas",
    x: 40,
    y: 26,
  },

  {
    slug: "taj-mahal",
    name: "Taj Mahal",
    region: "Agra, Uttar Pradesh",
    era: "1653 CE",
    tagline:
      "Restore the perfect mirror symmetry of the marble inlay.",
    script: "taj-mahal.js",
    start: "startTajMahalGame",
    end: "onTajMahalEnd",
    kind: "dom",
    x: 49,
    y: 30,
  },

  {
    slug: "hawa-mahal",
    name: "Hawa Mahal",
    region: "Jaipur, Rajasthan",
    era: "1799 CE",
    tagline:
      "Catch the breeze through the palace of winds.",
    script: "hawa-mahal.js",
    start: "startHawaMahalGame",
    end: "onHawaMahalEnd",
    kind: "canvas",
    x: 30,
    y: 36,
  },

  {
    slug: "golden-temple",
    name: "Golden Temple",
    region: "Amritsar, Punjab",
    era: "1604 CE",
    tagline:
      "Piece together Harmandir Sahib, tile by tile.",
    script: "golden-temple.js",
    start: "startGoldenTempleGame",
    end: "onGoldenTempleEnd",
    kind: "dom",
    x: 33,
    y: 17,
  },

  {
    slug: "sanchi-stupa",
    name: "Sanchi Stupa",
    region: "Madhya Pradesh",
    era: "3rd c. BCE",
    tagline:
      "Decode the Brahmi inscription on the great gateway.",
    script: "sanchi-stupa.js",
    start: "startSanchiStupaGame",
    end: "onSanchiEnd",
    kind: "dom",
    x: 43,
    y: 44,
  },

  {
    slug: "ajanta-caves",
    name: "Ajanta Caves",
    region: "Maharashtra",
    era: "2nd c. BCE",
    tagline:
      "Restore the frescoes from memory.",
    script: "ajanta-caves.js",
    start: "startAjantaCavesGame",
    end: "onAjantaEnd",
    kind: "dom",
    x: 38,
    y: 52,
  },

  {
    slug: "gateway-of-india",
    name: "Gateway of India",
    region: "Mumbai, Maharashtra",
    era: "1924 CE",
    tagline:
      "Align the archway rings until the harbour lines up.",
    script: "gateway-india.js",

    /*
     * Must match gateway-india.js
     */
    start: "startGatewayOfIndiaGame",
    end: "onGatewayIndiaEnd",

    kind: "canvas",
    x: 30,
    y: 58,
  },

  {
    slug: "charminar",
    name: "Charminar",
    region: "Hyderabad, Telangana",
    era: "1591 CE",
    tagline:
      "Hunt for treasures in the bazaar lanes.",
    script: "charminar.js",
    start: "startCharminarGame",
    end: "onCharminarEnd",
    kind: "canvas",
    x: 42,
    y: 63,
  },

  {
    slug: "mysore-palace",
    name: "Mysore Palace",
    region: "Karnataka",
    era: "1912 CE",
    tagline:
      "Light up the palace in time for Dasara.",
    script: "mysore-palace.js",
    start: "startMysorePalaceGame",
    end: "onMysoreEnd",
    kind: "canvas",
    x: 36,
    y: 74,
  },

  {
    slug: "time-machine",
    name: "The Time Machine",
    region: "Beyond the map",
    era: "2125 / The Past",
    tagline:
      "Restore the timeline with every Time Crystal you earned.",
    script: "finale-timeline.js",
    start: "startFinaleGame",
    end: "onFinaleEnd",
    kind: "dom",
    x: 52,
    y: 88,
  },
];

export function getMonument(
  slug: string,
): Monument | undefined {
  return MONUMENTS.find(
    (m) => m.slug === slug,
  );
}

export function nextMonument(
  slug: string,
): Monument | undefined {
  const i = MONUMENTS.findIndex(
    (m) => m.slug === slug,
  );

  return i >= 0
    ? MONUMENTS[i + 1]
    : undefined;
}