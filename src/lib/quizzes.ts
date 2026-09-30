export type Question = {
  question: string;
  options: string[];
  answer: number;
};

export type MonumentQuiz = {
  name: string;
  questions: Question[];
};

export const QUIZZES: Record<string, MonumentQuiz> = {
  "taj-mahal": {
    name: "Taj Mahal",
    questions: [
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
        options: [
          "Red sandstone",
          "Black granite",
          "White marble",
          "Wood",
        ],
        answer: 2,
      },
    ],
  },

  "gateway-of-india": {
    name: "Gateway of India",
    questions: [
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
  },

  "qutub-minar": {
    name: "Qutub Minar",
    questions: [
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
  },

  "ajanta-caves": {
    name: "Ajanta Caves",
    questions: [
      {
        question: "The Ajanta Caves are located in which state?",
        options: [
          "Maharashtra",
          "Rajasthan",
          "Gujarat",
          "Madhya Pradesh",
        ],
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
        options: [
          "Buddhism",
          "Jainism",
          "Sikhism",
          "Zoroastrianism",
        ],
        answer: 0,
      },
      {
        question: "The caves were mainly carved into:",
        options: [
          "Granite",
          "Basalt rock",
          "Marble",
          "Sandstone",
        ],
        answer: 1,
      },
      {
        question: "Ajanta is located near which city?",
        options: [
          "Aurangabad",
          "Nashik",
          "Nagpur",
          "Kolhapur",
        ],
        answer: 0,
      },
    ],
  },

  "ellora-caves": {
    name: "Ellora Caves",
    questions: [
      {
        question: "The Ellora Caves are located in which state?",
        options: [
          "Maharashtra",
          "Karnataka",
          "Tamil Nadu",
          "Kerala",
        ],
        answer: 0,
      },
      {
        question:
          "Ellora is notable because it contains monuments associated with:",
        options: [
          "Only Buddhism",
          "Only Hinduism",
          "Buddhism, Hinduism and Jainism",
          "Only Jainism",
        ],
        answer: 2,
      },
      {
        question: "Which famous temple is located at Ellora?",
        options: [
          "Kailasa Temple",
          "Sun Temple",
          "Golden Temple",
          "Meenakshi Temple",
        ],
        answer: 0,
      },
      {
        question: "The Kailasa Temple is primarily dedicated to:",
        options: ["Vishnu", "Shiva", "Buddha", "Mahavira"],
        answer: 1,
      },
      {
        question: "Ellora is located near:",
        options: ["Chennai", "Aurangabad", "Delhi", "Kolkata"],
        answer: 1,
      },
    ],
  },

  "hampi": {
    name: "Hampi",
    questions: [
      {
        question: "Hampi is located in which state?",
        options: [
          "Karnataka",
          "Maharashtra",
          "Telangana",
          "Odisha",
        ],
        answer: 0,
      },
      {
        question: "Hampi was the capital of which empire?",
        options: [
          "Maurya Empire",
          "Vijayanagara Empire",
          "Mughal Empire",
          "Gupta Empire",
        ],
        answer: 1,
      },
      {
        question: "Hampi is situated on the banks of which river?",
        options: ["Tungabhadra", "Yamuna", "Ganga", "Krishna"],
        answer: 0,
      },
      {
        question: "Hampi is famous for its:",
        options: [
          "Ancient ruins and temples",
          "Modern skyscrapers",
          "Colonial railway stations",
          "Buddhist stupas",
        ],
        answer: 0,
      },
      {
        question: "Hampi is recognized as a:",
        options: [
          "UNESCO World Heritage Site",
          "Modern industrial zone",
          "National capital",
          "Military base",
        ],
        answer: 0,
      },
    ],
  },

  "konark-sun-temple": {
    name: "Konark Sun Temple",
    questions: [
      {
        question: "The Konark Sun Temple is located in which state?",
        options: [
          "Odisha",
          "West Bengal",
          "Bihar",
          "Assam",
        ],
        answer: 0,
      },
      {
        question: "The temple is dedicated to which deity?",
        options: ["Shiva", "Vishnu", "Surya", "Brahma"],
        answer: 2,
      },
      {
        question: "The temple is designed in the form of a:",
        options: ["Ship", "Chariot", "Fort", "Lotus"],
        answer: 1,
      },
      {
        question: "The Konark Sun Temple was built during the reign of:",
        options: [
          "Narasimhadeva I",
          "Ashoka",
          "Akbar",
          "Rajendra Chola",
        ],
        answer: 0,
      },
      {
        question: "Konark is located near which coast?",
        options: [
          "Odisha coast",
          "Malabar coast",
          "Konkan coast",
          "Coromandel coast",
        ],
        answer: 0,
      },
    ],
  },

  "india-gate": {
    name: "India Gate",
    questions: [
      {
        question: "India Gate is located in:",
        options: [
          "New Delhi",
          "Mumbai",
          "Kolkata",
          "Chennai",
        ],
        answer: 0,
      },
      {
        question:
          "India Gate primarily commemorates Indian soldiers who died in:",
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
        options: [
          "Bharatpur sandstone",
          "White marble",
          "Granite",
          "Wood",
        ],
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
  },

  "golden-temple": {
    name: "Golden Temple",
    questions: [
      {
        question: "The Golden Temple is located in which city?",
        options: ["Amritsar", "Delhi", "Jaipur", "Chandigarh"],
        answer: 0,
      },
      {
        question: "The Golden Temple is also known as:",
        options: [
          "Harmandir Sahib",
          "Qutub Sahib",
          "Akshardham",
          "Sanchi Vihara",
        ],
        answer: 0,
      },
      {
        question: "The Golden Temple is surrounded by which sacred pool?",
        options: [
          "Amrit Sarovar",
          "Pushkar Lake",
          "Dal Lake",
          "Upper Lake",
        ],
        answer: 0,
      },
      {
        question: "The Golden Temple is an important place of worship for:",
        options: [
          "Sikhism",
          "Buddhism",
          "Jainism",
          "Zoroastrianism",
        ],
        answer: 0,
      },
      {
        question: "The community kitchen at the Golden Temple is known as:",
        options: [
          "Langar",
          "Darbar",
          "Jharokha",
          "Torana",
        ],
        answer: 0,
      },
    ],
  },

  "hawa-mahal": {
    name: "Hawa Mahal",
    questions: [
      {
        question: "Hawa Mahal is located in which city?",
        options: ["Jaipur", "Delhi", "Agra", "Udaipur"],
        answer: 0,
      },
      {
        question: "Hawa Mahal is located in which state?",
        options: [
          "Rajasthan",
          "Maharashtra",
          "Gujarat",
          "Madhya Pradesh",
        ],
        answer: 0,
      },
      {
        question: "Hawa Mahal is popularly known as the:",
        options: [
          "Palace of Winds",
          "City Palace",
          "Pink Fort",
          "Palace of Lakes",
        ],
        answer: 0,
      },
      {
        question: "Who commissioned the Hawa Mahal?",
        options: [
          "Maharaja Sawai Pratap Singh",
          "Shah Jahan",
          "Akbar",
          "Maharana Pratap",
        ],
        answer: 0,
      },
      {
        question: "Hawa Mahal is especially famous for its many:",
        options: [
          "Jharokhas and windows",
          "Minarets",
          "Large domes",
          "Stone pillars",
        ],
        answer: 0,
      },
    ],
  },

  "sanchi-stupa": {
    name: "Sanchi Stupa",
    questions: [
      {
        question: "The Great Stupa at Sanchi is located in which state?",
        options: [
          "Madhya Pradesh",
          "Rajasthan",
          "Maharashtra",
          "Odisha",
        ],
        answer: 0,
      },
      {
        question: "Sanchi is primarily associated with which religion?",
        options: [
          "Buddhism",
          "Sikhism",
          "Jainism",
          "Zoroastrianism",
        ],
        answer: 0,
      },
      {
        question: "Who originally commissioned the Great Stupa at Sanchi?",
        options: [
          "Emperor Ashoka",
          "Akbar",
          "Shah Jahan",
          "Chandragupta II",
        ],
        answer: 0,
      },
      {
        question: "The gateways of the Great Stupa at Sanchi are known as:",
        options: [
          "Toranas",
          "Jharokhas",
          "Minarets",
          "Gopurams",
        ],
        answer: 0,
      },
      {
        question: "The Great Stupa at Sanchi is primarily a:",
        options: [
          "Buddhist monument",
          "Mughal palace",
          "Royal fort",
          "Colonial gateway",
        ],
        answer: 0,
      },
    ],
  },
};