export type ExpandedStrategyTerm = {
  id: string;
  term: string;
  shortDefinition: string;
  beginnerExplanation: string;
  pitwallMeaning: string;
  whenItMatters: string;
  risk: string;
  relatedTerms?: string[];
};

export type RegulationTopic = {
  id: string;
  title: string;
  shortSummary: string;
  whatChanges: string;
  whatItUnlocks: string;
  whatTeamsWorryAbout: string;
  pitwallImpact: string;
  sourceUrls: string[];
  quoteOrReaction: string;
};

export type EraComparisonRow = {
  area: string;
  currentEra: string;
  newEra: string;
  whyItMatters: string;
};

export type RaceDayImpactCard = {
  title: string;
  description: string;
};

export type BasicF1Rule = {
  id: string;
  term: string;
  simpleMeaning: string;
  whyItMatters: string;
  pitwallNote: string;
};

export const basicF1Rules: BasicF1Rule[] = [
  {
    id: "race-weekend",
    term: "Race Weekend Format",
    simpleMeaning: "Usually consists of three Practice sessions, Qualifying, and the Grand Prix. Sprint weekends replace some practice with a shorter race.",
    whyItMatters: "Teams must dial in the car setup before Qualifying begins. Sprint weekends give less time to perfect the setup.",
    pitwallNote: "Maximizing practice data is crucial for predicting Sunday's tyre degradation."
  },
  {
    id: "qualifying",
    term: "Qualifying Basics",
    simpleMeaning: "A three-part knockout session (Q1, Q2, Q3) to determine the starting grid for the race based on fastest lap times.",
    whyItMatters: "Starting higher up the grid provides clean air and reduces the risk of lap 1 collisions.",
    pitwallNote: "Track evolution means the final lap of a session is often the fastest. Timing the run is everything."
  },
  {
    id: "points-system",
    term: "Points System",
    simpleMeaning: "Points are awarded to the top 10 finishers (25 for 1st, down to 1 for 10th).",
    whyItMatters: "Consistency across the season wins championships, not just single race wins.",
    pitwallNote: "Sometimes settling for 4th place points is mathematically smarter than risking a crash for 3rd."
  },
  {
    id: "tyre-rule",
    term: "Tyre Compound Rule",
    simpleMeaning: "In a dry race, drivers must use at least two different dry tyre compounds (e.g., Soft and Medium).",
    whyItMatters: "It forces every driver to make at least one pit stop, creating strategic variance.",
    pitwallNote: "If it rains and intermediate/wet tyres are used, this mandatory stop rule is lifted."
  },
  {
    id: "parc-ferme",
    term: "Parc Fermé",
    simpleMeaning: "A strict rule that stops teams from making major changes to the car setup after Qualifying begins.",
    whyItMatters: "A car set up perfectly for a fast qualifying lap might suffer high tyre wear in the race.",
    pitwallNote: "We must compromise the setup to balance one-lap pace with long-run race durability."
  },
  {
    id: "drs-rule",
    term: "DRS Basics",
    simpleMeaning: "Drag Reduction System. A driver can open their rear wing to gain speed if they are within one second of the car ahead at the detection point.",
    whyItMatters: "It is the primary tool for overtaking in modern F1.",
    pitwallNote: "You can use DRS on backmarkers. Sometimes we tell drivers to pace themselves to keep DRS from the car ahead for defense."
  },
  {
    id: "safety-car-rule",
    term: "Safety Car / VSC",
    simpleMeaning: "Slows the race down safely after an incident. A full Safety Car bunches the pack up; a VSC maintains the gaps between cars.",
    whyItMatters: "Pitting under a SC or VSC takes significantly less relative race time than pitting under green flag conditions.",
    pitwallNote: "A 'cheap' pit stop under a Safety Car can instantly jump a driver several positions."
  },
  {
    id: "track-limits",
    term: "Track Limits",
    simpleMeaning: "Drivers must keep the car within the white lines. Repeated violations lead to time penalties.",
    whyItMatters: "Pushing too hard can result in a 5-second penalty, ruining a tightly fought strategy.",
    pitwallNote: "We monitor warnings closely. If a driver gets a black-and-white flag, they must back off immediately."
  },
  {
    id: "blue-flags",
    term: "Blue Flags",
    simpleMeaning: "Shown to lapped cars, ordering them to let faster race leaders pass them safely.",
    whyItMatters: "Getting stuck behind a lapped car ignoring blue flags ruins tyre temperatures and loses vital seconds.",
    pitwallNote: "We communicate with Race Control if a backmarker is holding us up unfairly."
  },
  {
    id: "penalties",
    term: "Penalties",
    simpleMeaning: "Time penalties (e.g., 5s, 10s) added to pit stops or race time, grid drops, or drive-throughs for rule breaches.",
    whyItMatters: "A 5-second penalty means the driver must pull a 5-second gap to the car behind to maintain their position.",
    pitwallNote: "If we have a penalty, we push the driver to build a gap before their pit stop to serve it cleanly."
  }
];

export const strategyTerms: ExpandedStrategyTerm[] = [
  {
    id: "undercut",
    term: "Undercut",
    shortDefinition: "Pitting earlier than a rival to use fresher tyres and gain time before they stop.",
    beginnerExplanation: "You pit first to get faster tyres earlier, hoping the speed advantage lets you jump ahead of the car you were following once they finally pit.",
    pitwallMeaning: "Sacrifice temporary track position to gain a massive immediate lap time advantage.",
    whenItMatters: "Tyre warm-up is quick, degradation is high, and the pit exit is clear of traffic.",
    risk: "Rejoining behind slower cars (traffic) or encountering a Safety Car immediately after pitting.",
    relatedTerms: ["Overcut", "Pit window", "Tyre degradation"]
  },
  {
    id: "overcut",
    term: "Overcut",
    shortDefinition: "Staying out longer than a rival to gain track position or use clear air before pitting.",
    beginnerExplanation: "When the car ahead pits, you stay out on track in 'clean air' to set fast laps, hoping to stay ahead when you eventually pit.",
    pitwallMeaning: "Leverage low tyre degradation and clear air to over-perform the rival's out-lap.",
    whenItMatters: "Tyre degradation is low, track position is critical (like Monaco), or it takes a long time to warm up new tyres.",
    risk: "Old tyres fall off a cliff, losing chunks of time before pitting.",
    relatedTerms: ["Undercut", "Dirty air"]
  },
  {
    id: "tyre-degradation",
    term: "Tyre Degradation",
    shortDefinition: "The loss of tyre performance as laps, heat, and sliding wear the rubber down.",
    beginnerExplanation: "As a tyre gets used, it loses its grip. The car slides more and lap times get slower.",
    pitwallMeaning: "The thermal and physical wear curve defining the optimal pit window length.",
    whenItMatters: "At high-speed, high-load circuits (like Silverstone or Suzuka) or in very hot weather.",
    risk: "Staying out too long causes a 'cliff' where the car suddenly loses seconds per lap.",
    relatedTerms: ["Pit window"]
  },
  {
    id: "dirty-air",
    term: "Dirty Air",
    shortDefinition: "Disturbed airflow behind another car that reduces grip and makes following harder.",
    beginnerExplanation: "F1 cars punch a hole in the air. The messy air left behind makes the pursuing car slide and overheat its tyres.",
    pitwallMeaning: "Aerodynamic wake that causes unpredictable downforce loss and accelerates tyre surface overheating.",
    whenItMatters: "When trailing a car by less than 2 seconds, especially through high-speed corners.",
    risk: "Ruins tyres prematurely if a driver cannot quickly overtake.",
    relatedTerms: ["DRS", "Undercut"]
  },
  {
    id: "drs",
    term: "DRS (Drag Reduction System)",
    shortDefinition: "A movable rear wing flap that reduces drag on selected straights to help overtaking.",
    beginnerExplanation: "When a driver is within one second of the car ahead, they can open a flap on their rear wing to gain extra top speed.",
    pitwallMeaning: "A designated overtaking aid relying on a one-second detection gap.",
    whenItMatters: "On long straights where top speed delta is necessary to complete a pass.",
    risk: "Getting caught in a 'DRS Train' where multiple cars have DRS, canceling out the advantage.",
    relatedTerms: ["Dirty air", "Active Aerodynamics (2026)"]
  },
  {
    id: "safety-car",
    term: "Safety Car",
    shortDefinition: "A race neutralization that slows the field after an incident and can reshape pit strategy.",
    beginnerExplanation: "A physical car that leads the pack at a slow speed to allow marshals to clear crashes safely.",
    pitwallMeaning: "A neutralization period that drastically reduces the time cost of a pit stop.",
    whenItMatters: "Street circuits or high-risk tracks where crashes frequently require heavy clearing.",
    risk: "Pitting just before a Safety Car is deployed gives rivals a 'free' stop.",
    relatedTerms: ["Pit window"]
  },
  {
    id: "pit-window",
    term: "Pit Window",
    shortDefinition: "The range of laps where stopping is likely to work best for a planned strategy.",
    beginnerExplanation: "The ideal few laps to change tyres before the old ones become too slow.",
    pitwallMeaning: "The tactical bracket where tyre degradation intersects with a clear track gap to drop into.",
    whenItMatters: "Throughout the race, dynamically shifting based on safety cars or unexpected tyre wear.",
    risk: "Missing the window forces a compromised strategy or drops the driver into heavy traffic.",
    relatedTerms: ["Undercut", "Tyre degradation"]
  },
  {
    id: "soft-tyre",
    term: "Soft Tyre",
    shortDefinition: "The fastest dry tyre over one lap, colored red.",
    beginnerExplanation: "Provides the most grip and fastest lap times, but the soft rubber wears out the quickest.",
    pitwallMeaning: "High-peak, high-degradation compound for qualifying, aggressive undercut stints, or late-race pushes.",
    whenItMatters: "Qualifying sessions and opening race laps to gain immediate track position.",
    risk: "Thermal degradation; it 'falls off a cliff' quickly if pushed too hard in hot air.",
    relatedTerms: ["Tyre degradation"]
  },
  {
    id: "medium-tyre",
    term: "Medium Tyre",
    shortDefinition: "The balanced dry tyre, colored yellow.",
    beginnerExplanation: "A compromise tyre that balances good speed with a decent lifespan.",
    pitwallMeaning: "The versatile core of most race strategies, allowing flexibility to extend or shorten a stint.",
    whenItMatters: "Often used as the starting tyre or middle stint to keep strategy options open.",
    risk: "Can sometimes lack the raw pace of the Soft to defend off the line, or the durability of the Hard to go long.",
    relatedTerms: []
  },
  {
    id: "hard-tyre",
    term: "Hard Tyre",
    shortDefinition: "The most durable dry tyre, colored white.",
    beginnerExplanation: "Made of harder rubber that lasts a long time but provides less immediate grip.",
    pitwallMeaning: "A low-degradation compound essential for long stints and one-stop strategies.",
    whenItMatters: "On highly abrasive tracks where softer tyres degrade too rapidly to be viable.",
    risk: "Slower warm-up phase makes the car vulnerable on the out-lap after a pit stop.",
    relatedTerms: ["Overcut"]
  },
  {
    id: "intermediate-tyre",
    term: "Intermediate Tyre",
    shortDefinition: "Used for damp or light rain conditions, colored green.",
    beginnerExplanation: "A grooved tyre that disperses light water but still maintains some solid rubber contact.",
    pitwallMeaning: "The crossover tyre used when the track is wet but not holding deep standing water.",
    whenItMatters: "During drying tracks or light showers where slick tyres spin and full wets overheat.",
    risk: "Overheats and destroys itself very quickly if the track dries out too much.",
    relatedTerms: []
  },
  {
    id: "wet-tyre",
    term: "Wet Tyre",
    shortDefinition: "Used for heavy rain and standing water, colored blue.",
    beginnerExplanation: "Deeply grooved tyres designed to pump massive amounts of water away to prevent aquaplaning.",
    pitwallMeaning: "The extreme weather survival tyre.",
    whenItMatters: "During torrential rain when the track is flooded.",
    risk: "Very slow relative pace; if conditions improve slightly, intermediates will be vastly faster.",
    relatedTerms: []
  }
];

export const regulationTopics2026: RegulationTopic[] = [
  {
    id: "active-aero",
    title: "Active Aerodynamics",
    shortSummary: "Wings that change shape on the straights and in the corners.",
    whatChanges: "The front and rear wings will dynamically adjust. In 'Straight Mode', wings flatten to slash drag. In 'Corner Mode', they angle up for maximum downforce.",
    whatItUnlocks: "Massively increased top speeds on straights without sacrificing cornering grip, acting as a full-time replacement for the traditional DRS.",
    whatTeamsWorryAbout: "The complexity of the system failing mid-corner, and perfectly syncing the aero shifts with the driver's braking points.",
    pitwallImpact: "Teams must map out the exact zones where drivers should manually toggle the modes to balance battery drain against top speed.",
    sourceUrls: ["https://www.formula1.com/en/latest/article/2026-f1-car-rules-fia-aerodynamics-engine.html"],
    quoteOrReaction: "Industry reaction: Active aero shifts the driver's workload significantly, making energy and drag management a constant, lap-by-lap equation."
  },
  {
    id: "power-unit-split",
    title: "50/50 Power Unit Split",
    shortSummary: "A massive increase in electrical power, matching the combustion engine.",
    whatChanges: "The Internal Combustion Engine (ICE) drops to around 400kW, while the electric motor (MGU-K) output nearly triples to 350kW. The complex MGU-H is removed.",
    whatItUnlocks: "A true hybrid era where electrical power is equally responsible for lap time, pushing road-relevant battery technology.",
    whatTeamsWorryAbout: "Running out of electrical deployment on long straights, causing the car to suddenly 'hit a wall' in top speed.",
    pitwallImpact: "Energy harvesting becomes the defining factor of race pace. Strategists will constantly monitor the battery state of charge.",
    sourceUrls: ["https://www.formula1.com/en/latest/article/2026-f1-car-rules-fia-aerodynamics-engine.html"],
    quoteOrReaction: "Industry reaction: The removal of the MGU-H simplifies the engine, but the massive reliance on the MGU-K means drivers cannot afford to miss harvesting zones."
  },
  {
    id: "manual-override",
    title: "Manual Override (Boost)",
    shortSummary: "A push-to-pass button for strategic attacking and defending.",
    whatChanges: "Drivers will get a manual 'Override' mode that deploys a surge of electrical energy (up to 350kW up to 337km/h) to help them attack the car ahead.",
    whatItUnlocks: "Tactical, driver-controlled overtaking power that isn't purely reliant on being within one second (like DRS).",
    whatTeamsWorryAbout: "Drivers burning their energy allocation too early in a stint, leaving them defenseless on the final laps.",
    pitwallImpact: "Strategists will direct drivers exactly when to deploy 'Boost' to secure an undercut or defend an overcut.",
    sourceUrls: ["https://www.formula1.com/en/latest/article/2026-f1-car-rules-fia-aerodynamics-engine.html"],
    quoteOrReaction: "Industry reaction: This creates a cat-and-mouse game where drivers bluff their battery deployment to force rivals into mistakes."
  },
  {
    id: "nimble-car",
    title: "The 'Nimble Car' Concept",
    shortSummary: "Smaller, lighter cars designed for better wheel-to-wheel racing.",
    whatChanges: "The cars will be 30kg lighter (minimum 768kg), 200mm shorter in wheelbase, and 100mm narrower.",
    whatItUnlocks: "More agility through tight corners and potentially opening up new overtaking lines on narrow street circuits like Monaco.",
    whatTeamsWorryAbout: "Hitting the strict 768kg weight limit while housing massive new batteries for the 350kW electrical system.",
    pitwallImpact: "Lighter cars may change tyre degradation profiles entirely, potentially pushing strategies toward softer compounds or fewer stops.",
    sourceUrls: ["https://www.silverstone.co.uk/news/f1-2026-regulations-explained"],
    quoteOrReaction: "Industry reaction: Drivers have universally praised the push for lighter cars, hoping it brings back the aggressive, darting driving styles of the 2000s."
  },
  {
    id: "sustainable-fuel",
    title: "100% Sustainable Fuel",
    shortSummary: "F1 engines will run on carbon-neutral 'drop-in' fuel.",
    whatChanges: "Transitioning from E10 (10% renewable) to fully sustainable fuel that takes no net new carbon from the earth.",
    whatItUnlocks: "Environmental relevance for the sport, providing research that can be 'dropped in' to standard road cars globally.",
    whatTeamsWorryAbout: "Combustion anomalies, loss of horsepower, or reliability issues as engine manufacturers adapt to the new chemical mixtures.",
    pitwallImpact: "Fuel efficiency mapping will be aggressively managed on the pit wall to ensure the car makes the finish line without losing critical pace.",
    sourceUrls: ["https://global.honda/en/motorsports/Formula-1/2026/"],
    quoteOrReaction: "Industry reaction: A crucial step for the sport's survival, convincing major manufacturers like Audi, Ford, and Honda to commit to the 2026 era."
  }
];

export const eraComparisonRows: EraComparisonRow[] = [
  {
    area: "Overtaking Help",
    currentEra: "DRS (Drag Reduction System) on rear wing only.",
    newEra: "Active Aero (both wings) + Manual Override (Boost).",
    whyItMatters: "Overtaking will rely more on battery tactics than just following closely."
  },
  {
    area: "Power Unit",
    currentEra: "Combustion dominant with MGU-H and MGU-K.",
    newEra: "50/50 split between Combustion and Electrical. No MGU-H.",
    whyItMatters: "Energy harvesting (braking) is now half the car's power equation."
  },
  {
    area: "Car Dimensions",
    currentEra: "Heavy (798kg), wide, and long wheelbase.",
    newEra: "Lighter (768kg), narrower, and shorter wheelbase.",
    whyItMatters: "Cars will be more agile and better suited for street tracks."
  },
  {
    area: "Fuel",
    currentEra: "E10 (10% sustainable ethanol).",
    newEra: "100% sustainable 'drop-in' fuel.",
    whyItMatters: "F1 becomes a testing ground for carbon-neutral road fuel."
  }
];

export const raceDayImpactCards: RaceDayImpactCard[] = [
  {
    title: "Energy is the New Tyre Management",
    description: "Instead of just worrying about tyre wear, drivers will be constantly coached by the pit wall on when to 'harvest' and when to 'deploy' battery power."
  },
  {
    title: "The End of the DRS Train",
    description: "With Manual Override replacing passive DRS, drivers stuck in a train of cars might use their battery boost creatively to break the stalemate."
  },
  {
    title: "Complex Pit Wall Calculations",
    description: "Strategists will likely evaluate 'Boost' deployment specifically on in-laps and out-laps to maximize the power of an undercut."
  },
  {
    title: "Agility Changes Overtaking Lines",
    description: "Because the cars are narrower and shorter, drivers may find new, tighter racing lines through corners that were previously impossible to pass on."
  }
];
