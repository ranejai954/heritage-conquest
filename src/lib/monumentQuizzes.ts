export type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
};

export const MONUMENT_QUIZZES: Record<string, QuizQuestion[]> = {
  "sanchi-stupa": [
    {
      question: "Where is the Sanchi Stupa located?",
      options: ["Madhya Pradesh", "Rajasthan", "Maharashtra", "Gujarat"],
      answer: 0,
    },
    {
      question: "Sanchi is mainly associated with which religion?",
      options: ["Hinduism", "Buddhism", "Jainism", "Sikhism"],
      answer: 1,
    },
    {
      question: "Who originally commissioned the Great Stupa at Sanchi?",
      options: ["Ashoka", "Akbar", "Shah Jahan", "Chandragupta II"],
      answer: 0,
    },
    {
      question: "What is a stupa primarily associated with?",
      options: [
        "Royal residence",
        "Buddhist religious tradition",
        "Military defence",
        "Trade centre",
      ],
      answer: 1,
    },
    {
      question: "Sanchi is recognized as a:",
      options: [
        "UNESCO World Heritage Site",
        "Modern city",
        "Military monument",
        "Colonial railway",
      ],
      answer: 0,
    },
  ],

  "ajanta-caves": [
    {
      question: "The Ajanta Caves are located in which state?",
      options: ["Maharashtra", "Rajasthan", "Gujarat", "Odisha"],
      answer: 0,
    },
    {
      question: "The Ajanta Caves are famous mainly for their:",
      options: [
        "Mughal gardens",
        "Buddhist paintings and sculptures",
        "Royal palaces",
        "Fortifications",
      ],
      answer: 1,
    },
    {
      question: "The Ajanta Caves are primarily associated with:",
      options: ["Buddhism", "Jainism", "Sikhism", "Zoroastrianism"],
      answer: 0,
    },
    {
      question: "The caves were mainly carved into:",
      options: ["Granite", "Basalt rock", "Marble", "Sandstone"],
      answer: 1,
    },
    {
      question: "Ajanta is near which city?",
      options: ["Aurangabad", "Nashik", "Nagpur", "Kolhapur"],
      answer: 0,
    },
  ],

  "qutub-minar": [
    {
      question: "Where is Qutub Minar located?",
      options: ["Delhi", "Agra", "Jaipur", "Bhopal"],
      answer: 0,
    },
    {
      question: "Qutub Minar is primarily a:",
      options: ["Fort", "Minaret", "Palace", "Temple"],
      answer: 1,
    },
    {
      question: "Who started the construction of Qutub Minar?",
      options: [
        "Qutb-ud-din Aibak",
        "Shah Jahan",
        "Akbar",
        "Sher Shah Suri",
      ],
      answer: 0,
    },
    {
      question: "Qutub Minar is part of the:",
      options: [
        "Qutub complex",
        "Red Fort complex",
        "Agra Fort complex",
        "Lalbagh complex",
      ],
      answer: 0,
    },
    {
      question: "Qutub Minar is primarily constructed from:",
      options: [
        "Red sandstone and marble",
        "Wood",
        "Granite only",
        "Brick only",
      ],
      answer: 0,
    },
  ],

  "taj-mahal": [
    {
      question: "In which city is the Taj Mahal located?",
      options: ["Delhi", "Agra", "Jaipur", "Lucknow"],
      answer: 1,
    },
    {
      question: "Who commissioned the Taj Mahal?",
      options: ["Akbar", "Aurangzeb", "Shah Jahan", "Humayun"],
      answer: 2,
    },
    {
      question: "The Taj Mahal was primarily built as a:",
      options: ["Fort", "Palace", "Tomb", "Temple"],
      answer: 2,
    },
    {
      question: "The Taj Mahal is located on the banks of which river?",
      options: ["Ganga", "Yamuna", "Godavari", "Narmada"],
      answer: 1,
    },
    {
      question: "The Taj Mahal is mainly constructed using:",
      options: ["Red sandstone", "Black granite", "White marble", "Wood"],
      answer: 2,
    },
  ],

  "gateway-of-india": [
    {
      question: "Where is the Gateway of India located?",
      options: ["Mumbai", "Pune", "Delhi", "Kolkata"],
      answer: 0,
    },
    {
      question: "The Gateway of India faces which body of water?",
      options: [
        "Bay of Bengal",
        "Arabian Sea",
        "Indian Ocean",
        "Gulf of Mannar",
      ],
      answer: 1,
    },
    {
      question: "The Gateway of India was built during the period of:",
      options: [
        "British rule",
        "Mughal rule",
        "Mauryan rule",
        "Maratha rule",
      ],
      answer: 0,
    },
    {
      question: "The monument was built to commemorate the visit of:",
      options: [
        "Queen Victoria",
        "King George V and Queen Mary",
        "Winston Churchill",
        "Prince Charles",
      ],
      answer: 1,
    },
    {
      question: "The Gateway of India is located near:",
      options: ["Marine Drive", "Colaba", "Bandra", "Dadar"],
      answer: 1,
    },
  ],

  "golden-temple": [
    {
      question: "The Golden Temple is located in which city?",
      options: ["Amritsar", "Delhi", "Jaipur", "Chandigarh"],
      answer: 0,
    },
    {
      question: "The Golden Temple is also known as:",
      options: ["Harmandir Sahib", "Qutub Sahib", "Akshardham", "Charminar"],
      answer: 0,
    },
    {
      question: "The Golden Temple is associated mainly with:",
      options: ["Sikhism", "Buddhism", "Jainism", "Zoroastrianism"],
      answer: 0,
    },
    {
      question: "The Golden Temple is surrounded by which sacred pool?",
      options: ["Amrit Sarovar", "Dal Lake", "Pushkar Lake", "Loktak Lake"],
      answer: 0,
    },
    {
      question: "What is the community kitchen at the Golden Temple called?",
      options: ["Langar", "Prasad", "Bhandara", "Bhoj"],
      answer: 0,
    },
  ],

  "hawa-mahal": [
    {
      question: "Where is Hawa Mahal located?",
      options: ["Jaipur", "Delhi", "Agra", "Udaipur"],
      answer: 0,
    },
    {
      question: "Hawa Mahal is popularly known as the:",
      options: [
        "Palace of Winds",
        "Palace of Lakes",
        "Red Palace",
        "Royal Palace",
      ],
      answer: 0,
    },
    {
      question: "Hawa Mahal was built by:",
      options: [
        "Sawai Pratap Singh",
        "Shah Jahan",
        "Akbar",
        "Raja Man Singh",
      ],
      answer: 0,
    },
    {
      question: "Hawa Mahal is famous for its many:",
      options: ["Windows and jharokhas", "Minarets", "Towers", "Moats"],
      answer: 0,
    },
    {
      question: "Hawa Mahal is located in which famous Indian city known as the Pink City?",
      options: ["Jaipur", "Jodhpur", "Bikaner", "Udaipur"],
      answer: 0,
    },
  ],

  "red-fort": [
    {
      question: "Where is the Red Fort located?",
      options: ["Delhi", "Mumbai", "Agra", "Hyderabad"],
      answer: 0,
    },
    {
      question: "Who commissioned the Red Fort?",
      options: ["Shah Jahan", "Akbar", "Babur", "Jahangir"],
      answer: 0,
    },
    {
      question: "The Red Fort was built primarily using:",
      options: ["White marble", "Red sandstone", "Granite", "Limestone"],
      answer: 1,
    },
    {
      question: "The Red Fort is associated mainly with which dynasty?",
      options: ["Maurya", "Mughal", "Chola", "Gupta"],
      answer: 1,
    },
    {
      question: "The Red Fort is located in which part of Delhi?",
      options: ["Old Delhi", "South Delhi", "New Delhi", "Dwarka"],
      answer: 0,
    },
  ],

  "india-gate": [
    {
      question: "India Gate is located in:",
      options: ["New Delhi", "Mumbai", "Kolkata", "Chennai"],
      answer: 0,
    },
    {
      question: "India Gate primarily commemorates soldiers who died in:",
      options: [
        "World War I and related conflicts",
        "The Battle of Plassey",
        "The Revolt of 1857",
        "The Kargil War",
      ],
      answer: 0,
    },
    {
      question: "India Gate was designed by:",
      options: [
        "Edwin Lutyens",
        "Le Corbusier",
        "Charles Correa",
        "Balkrishna Doshi",
      ],
      answer: 0,
    },
    {
      question: "India Gate is made primarily from:",
      options: ["Bharatpur sandstone", "White marble", "Granite", "Wood"],
      answer: 0,
    },
    {
      question: "India Gate is located along:",
      options: [
        "Kartavya Path",
        "Marine Drive",
        "MG Road",
        "Rajpath Market",
      ],
      answer: 0,
    },
  ],
};