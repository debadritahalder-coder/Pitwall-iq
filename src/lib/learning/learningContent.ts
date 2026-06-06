import type {
  LearningPath,
  ConceptDefinition,
  WatchGuideStep,
  EmotionalHook,
  QuizQuestion,
} from "./learningTypes";

export const learningPaths: LearningPath[] = [
  {
    id: "f1-5-min",
    title: "F1 in 5 minutes",
    shortValue: "The absolute basics of how a race works.",
    difficulty: "Beginner",
    estimatedMinutes: 5,
  },
  {
    id: "race-weekend",
    title: "What happens in a race weekend?",
    shortValue: "Practice, Qualifying, and Race Day explained.",
    difficulty: "Beginner",
    estimatedMinutes: 3,
  },
  {
    id: "pit-stops",
    title: "Why do drivers pit?",
    shortValue: "Understanding tyre wear and mandatory stops.",
    difficulty: "Beginner",
    estimatedMinutes: 4,
  },
  {
    id: "tyres",
    title: "Tyres explained",
    shortValue: "Softs, Mediums, Hards, and when to use them.",
    difficulty: "Intermediate",
    estimatedMinutes: 4,
  },
  {
    id: "undercut-overcut",
    title: "Undercut vs Overcut",
    shortValue: "The two most common ways to overtake without passing on track.",
    difficulty: "Intermediate",
    estimatedMinutes: 5,
  },
  {
    id: "sc-vsc",
    title: "Safety Car and VSC",
    shortValue: "How crashes completely change race strategy.",
    difficulty: "Beginner",
    estimatedMinutes: 3,
  },
  {
    id: "read-explainer",
    title: "How to read Race Explainer",
    shortValue: "Your guide to using PitWall IQ.",
    difficulty: "Beginner",
    estimatedMinutes: 2,
  },
];

export const strategyConcepts: ConceptDefinition[] = [
  {
    id: "pit-stop",
    term: "Pit Stop",
    simpleExplanation: "When a driver drives into the pit lane to change tyres.",
    technicalExplanation: "A mandatory process where cars stop in their pit box to exchange degraded tyres for fresh ones, usually taking 2-3 seconds stationary but costing 20-25 seconds of total race time relative to cars on track.",
    whyFansCare: "Pit stops are the main way teams execute strategy. A slow pit stop can ruin a race, and a perfectly timed one can win it.",
    exampleSentence: "He is making a pit stop to get rid of those old hard tyres.",
    commonMisconception: "Teams do not refuel the cars during pit stops anymore. They only change tyres and adjust aerodynamics.",
    raceExplainerFeature: "Pit Stop Analyzer",
  },
  {
    id: "tyre-compound",
    term: "Tyre Compound",
    simpleExplanation: "The type of rubber on the tyre. Soft tyres are fast but wear out quickly. Hard tyres are slower but last a long time.",
    technicalExplanation: "Pirelli provides different rubber hardness levels. Softer compounds offer higher peak grip but suffer from higher thermal and physical degradation. Harder compounds are durable but require more time to reach optimal operating temperature.",
    whyFansCare: "Choosing the right tyre at the right time is the core puzzle of F1 strategy.",
    exampleSentence: "He started on the medium tyre compound to run a longer first stint.",
    commonMisconception: "The 'Soft' tyre isn't always the best tyre for the race; it often wears out too fast to be useful on Sunday.",
    raceExplainerFeature: "Stint Timeline",
  },
  {
    id: "undercut",
    term: "Undercut",
    simpleExplanation: "A driver pits earlier to get fresh tyres before rivals. If the fresh tyres are much faster, they can jump ahead when rivals pit later.",
    technicalExplanation: "The undercut works when the time gained by running on fresh, high-grip tyres (out-lap and subsequent laps) is greater than the time lost to traffic and the pit-lane delta, allowing the pitting driver to pass a car ahead when that car eventually pits.",
    whyFansCare: "This is one of the main reasons a driver can gain position without ever overtaking their rival on the actual racetrack.",
    exampleSentence: "They are trying the undercut to get past the Ferrari.",
    commonMisconception: "An undercut is not guaranteed to work; if the driver comes out of the pits behind slower cars (traffic), the strategy fails.",
    raceExplainerFeature: "Strategy Events",
  },
  {
    id: "overcut",
    term: "Overcut",
    simpleExplanation: "A driver stays out on older tyres while their rival pits. This works if the rival's new tyres take a long time to warm up and get fast.",
    technicalExplanation: "The overcut is effective on low-degradation tracks or tracks where tyre warm-up is difficult. The driver staying out utilizes their lighter fuel load and warm tyres to set fast laps, while the pitting driver struggles to generate grip on cold tyres.",
    whyFansCare: "It is the opposite of the undercut and is often used by drivers who have managed their tyres better than the cars ahead of them.",
    exampleSentence: "He overcut his teammate by staying out three laps longer.",
    commonMisconception: "The overcut is very rare compared to the undercut, as fresh tyres are almost always faster.",
    raceExplainerFeature: "Strategy Events",
  },
  {
    id: "clean-air",
    term: "Clean Air / Dirty Air",
    simpleExplanation: "Clean air is driving with no cars ahead. Dirty air is the turbulent wind behind another car, which makes following difficult and damages tyres.",
    technicalExplanation: "F1 cars rely on aerodynamics for grip. Following another car disrupts the airflow (dirty air), reducing downforce, increasing sliding, and accelerating tyre surface overheating. Clean air allows the car to operate at its optimal aerodynamic efficiency.",
    whyFansCare: "Drivers will often pit early just to get out of dirty air and drive in clean air, even if it means running a non-optimal tyre strategy.",
    exampleSentence: "He pitted early to get out of the dirty air and find some clean air.",
    commonMisconception: "Dirty air isn't about exhaust fumes; it's about invisible wind turbulence.",
    raceExplainerFeature: null,
  },
  {
    id: "safety-car-window",
    term: "Safety Car (SC) Pit Window",
    simpleExplanation: "When a Safety Car slows everyone down, a pit stop costs less time compared to normal racing speed. It's a 'cheap' pit stop.",
    technicalExplanation: "Under SC or VSC conditions, the field is limited to a delta time (roughly 40% slower). Because the cars on track are moving slower, the time lost by driving through the pit lane at the speed limit is significantly reduced relative to the pack.",
    whyFansCare: "A well-timed Safety Car can completely flip the race order by giving lucky drivers a free pit stop.",
    exampleSentence: "He got incredibly lucky and pitted during the Safety Car window.",
    commonMisconception: "Safety cars don't just bunch the pack up; they fundamentally alter the math of when to pit.",
    raceExplainerFeature: "Pit Stop Analyzer",
  },
];

export const watchGuideSteps: WatchGuideStep[] = [
  {
    id: "pre-race",
    phase: "Before lights out",
    instruction: "Check grid position and starting tyres.",
    whatToWatch: "Look at the graphics to see who is starting on Softs (aggressive) vs Mediums/Hards (long game).",
  },
  {
    id: "start",
    phase: "First 10 laps",
    instruction: "Watch the gaps and tyre saving.",
    whatToWatch: "Are drivers pushing hard, or are they driving slightly slower to save their tyres for later?",
  },
  {
    id: "pit-window",
    phase: "The Pit Window",
    instruction: "Watch who blinks first.",
    whatToWatch: "When the first driver pits, watch to see if the cars behind them speed up or pit on the next lap to defend (the undercut).",
  },
  {
    id: "safety-car",
    phase: "Safety Car or Yellow Flags",
    instruction: "Ask who gets a cheap stop.",
    whatToWatch: "If a crash happens, watch the pit lane. Anyone who hasn't pitted yet will dive in to save massive amounts of time.",
  },
  {
    id: "final-stint",
    phase: "The Final Stint",
    instruction: "Compare tyre age and pace.",
    whatToWatch: "Who has the freshest tyres? A driver on new tyres catching a driver on 20-lap-old tyres will be an exciting finish.",
  },
  {
    id: "post-race",
    phase: "After the race",
    instruction: "Open Race Explainer.",
    whatToWatch: "Use PitWall IQ to see the data behind the decisions. Was that undercut actually successful?",
  },
];

export const emotionalHooks: EmotionalHook[] = [
  {
    id: "cars-not-equal",
    title: "Drivers are not equal because cars are not equal",
    description: "F1 is an engineering championship as much as a driving one. A great driver in a slow car cannot win. Fans watch to see drivers outperform their machinery.",
  },
  {
    id: "teammates",
    title: "Teammates are the fairest comparison",
    description: "Your teammate is the only person on the grid driving the exact same car as you. Beating your teammate is rule number one in F1.",
  },
  {
    id: "strategy-beats-pace",
    title: "Strategy can beat raw pace",
    description: "The fastest car doesn't always win. A clever pit stop call or a tyre gamble can outsmart a faster opponent.",
  },
  {
    id: "chess-match",
    title: "A slow-looking race can be a chess match",
    description: "When cars aren't overtaking, they are often managing tyres, saving battery, or waiting for the perfect lap to launch a strategic attack.",
  },
  {
    id: "chaos",
    title: "One crash can reset everything",
    description: "A Safety Car bunches the entire pack up and erases a 20-second lead in an instant. A boring race can turn into a 5-lap sprint to the finish.",
  },
];

export const miniQuiz: QuizQuestion[] = [
  {
    id: "q1",
    question: "What does it mean to 'undercut' an opponent?",
    options: [
      "Crashing into them from the inside of a corner.",
      "Pitting earlier for fresh tyres to drive faster and jump ahead of them.",
      "Driving underneath their rear wing to get a slipstream."
    ],
    correctAnswerIndex: 1,
    explanation: "An undercut is a strategic move where a driver pits for fresh tyres before their rival, using the extra speed to jump ahead."
  },
  {
    id: "q2",
    question: "Why do drivers make pit stops during a dry race?",
    options: [
      "To refuel the car.",
      "To let the engine cool down.",
      "Because tyres wear out and lose grip, and rules require using two different compounds."
    ],
    correctAnswerIndex: 2,
    explanation: "F1 banned refuelling in 2010. Pit stops are strictly for changing worn-out tyres and making minor aerodynamic adjustments."
  },
  {
    id: "q3",
    question: "What is a 'cheap' pit stop?",
    options: [
      "A pit stop that costs the team less money.",
      "A pit stop done very quickly by the mechanics.",
      "A pit stop taken during a Safety Car, saving time relative to the pack."
    ],
    correctAnswerIndex: 2,
    explanation: "During a Safety Car, everyone on track drives very slowly. Pitting then loses you less time compared to pitting at full racing speeds."
  },
  {
    id: "q4",
    question: "Which tyre compound is generally the fastest over a single lap?",
    options: [
      "Soft",
      "Medium",
      "Hard"
    ],
    correctAnswerIndex: 0,
    explanation: "Soft tyres offer the most grip and speed, but they degrade the quickest and don't last many laps."
  },
  {
    id: "q5",
    question: "Why is 'clean air' important?",
    options: [
      "It helps the driver breathe better.",
      "It prevents the engine from inhaling dust.",
      "It provides stable aerodynamics, making the car faster and saving the tyres."
    ],
    correctAnswerIndex: 2,
    explanation: "F1 cars rely on smooth airflow. Following closely behind another car puts you in 'dirty air', causing sliding and tyre damage."
  }
];
