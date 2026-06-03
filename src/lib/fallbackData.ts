import type {
  ConstructorStanding,
  DriverStanding,
  GlossaryTerm,
  HistoryMoment,
  Race,
  RaceResult,
} from "./types";

export const fallbackRaceSchedule: Race[] = [
  {
    season: "2026",
    round: "10",
    raceName: "Canadian Grand Prix",
    circuitName: "Circuit Gilles Villeneuve",
    country: "Canada",
    locality: "Montreal",
    date: "2026-06-07",
    time: "18:00:00Z",
    weekendStartDate: "2026-06-05",
    weekendEndDate: "2026-06-07",
    previousRaceSummary: "Monaco delivered a processional race where track position proved king. Verstappen managed tyres expertly from pole to hold off Norris, while Ferrari struggled with graining in the warmer conditions.",
    currentWeekendSummary: "Low-grip exits and heavy braking zones can punish tyre wear and reward decisive undercut timing. Watch for the 'Wall of Champions' to claim victims in Qualifying.",
    keyRaceFactor: "Low-grip exits and heavy braking zones can punish tyre wear and reward decisive undercut timing.",
  },
  {
    season: "2026",
    round: "11",
    raceName: "Austrian Grand Prix",
    circuitName: "Red Bull Ring",
    country: "Austria",
    locality: "Spielberg",
    date: "2026-06-28",
    time: "13:00:00Z",
    weekendStartDate: "2026-06-26",
    weekendEndDate: "2026-06-28",
    previousRaceSummary: "Montreal saw mixed conditions favoring McLaren's setup, but Red Bull's straight-line speed ultimately secured the win after a late safety car restart.",
    currentWeekendSummary: "Short laps, track limits, and DRS trains can make qualifying position unusually valuable. The Sprint format this weekend adds pressure to FP1 setups.",
    keyRaceFactor: "Short laps, track limits, and DRS trains can make qualifying position unusually valuable.",
  },
];

export const fallbackDriverStandings: DriverStanding[] = [
  { position: 1, driverId: "verstappen", driverName: "Max Verstappen", code: "VER", constructorName: "Red Bull", points: 169, wins: 4 },
  { position: 2, driverId: "norris", driverName: "Lando Norris", code: "NOR", constructorName: "McLaren", points: 150, wins: 2 },
  { position: 3, driverId: "leclerc", driverName: "Charles Leclerc", code: "LEC", constructorName: "Ferrari", points: 138, wins: 1 },
  { position: 4, driverId: "piastri", driverName: "Oscar Piastri", code: "PIA", constructorName: "McLaren", points: 132, wins: 1 },
  { position: 5, driverId: "sainz", driverName: "Carlos Sainz", code: "SAI", constructorName: "Ferrari", points: 108, wins: 1 },
  { position: 6, driverId: "hamilton", driverName: "Lewis Hamilton", code: "HAM", constructorName: "Mercedes", points: 92, wins: 0 },
  { position: 7, driverId: "russell", driverName: "George Russell", code: "RUS", constructorName: "Mercedes", points: 86, wins: 0 },
  { position: 8, driverId: "perez", driverName: "Sergio Perez", code: "PER", constructorName: "Red Bull", points: 74, wins: 0 },
  { position: 9, driverId: "alonso", driverName: "Fernando Alonso", code: "ALO", constructorName: "Aston Martin", points: 45, wins: 0 },
  { position: 10, driverId: "tsunoda", driverName: "Yuki Tsunoda", code: "TSU", constructorName: "RB", points: 29, wins: 0 },
];

export const fallbackConstructorStandings: ConstructorStanding[] = [
  { position: 1, constructorId: "mclaren", constructorName: "McLaren", nationality: "British", points: 282, wins: 3 },
  { position: 2, constructorId: "ferrari", constructorName: "Ferrari", nationality: "Italian", points: 246, wins: 2 },
  { position: 3, constructorId: "red_bull", constructorName: "Red Bull", nationality: "Austrian", points: 243, wins: 4 },
  { position: 4, constructorId: "mercedes", constructorName: "Mercedes", nationality: "German", points: 178, wins: 0 },
  { position: 5, constructorId: "aston_martin", constructorName: "Aston Martin", nationality: "British", points: 66, wins: 0 },
];

export const fallbackLatestRaceResults: RaceResult[] = [
  {
    position: 1,
    driverName: "Max Verstappen",
    constructorName: "Red Bull",
    grid: "2",
    laps: "70",
    status: "Finished",
    raceName: "Monaco Grand Prix",
  },
  {
    position: 2,
    driverName: "Lando Norris",
    constructorName: "McLaren",
    grid: "4",
    laps: "70",
    status: "Finished",
    raceName: "Monaco Grand Prix",
  },
];

export const historyMoments: HistoryMoment[] = [
  {
    id: "1950-british-grand-prix",
    title: "1950 British Grand Prix",
    year: "1950",
    description: "The first official Formula 1 World Championship race.",
    tag: "Origins",
    image: "/history/british-gp-1950.jpg",
    slug: "1950-british-grand-prix",
    longSummary: "The 1950 British Grand Prix, held on May 13, 1950, at the Silverstone Circuit, holds a foundational place in motorsport history as the inaugural race of the FIA-sanctioned Formula One World Championship.\n\nFormally titled 'The Royal Automobile Club Grand Prix d'Europe Incorporating The British Grand Prix', the event was attended by King George VI, Queen Elizabeth, and Princess Margaret, remaining the only time a reigning British monarch has attended a motor race.\n\nThe race established the framework for the modern F1 World Championship, introducing the points-scoring system that would determine the World Champion. It was completely dominated by the Alfa Romeo team. Giuseppe 'Nino' Farina took pole position, set the fastest lap, and won the race, leading an Alfa Romeo 1-2-3 sweep with teammates Luigi Fagioli and Reg Parnell.",
    whyItMattered: "With an attendance of over 100,000, the event solidified the British Grand Prix as one of the most prestigious and enduring fixtures on the international racing calendar. It set the stage for over 70 years of elite motorsport competition.",
    keyFacts: {
      circuit: "Silverstone Circuit",
      winner: "Giuseppe Farina",
      constructorTeam: "Alfa Romeo",
      championshipImpact: "Inaugural Championship Race",
      definingMoment: "First ever F1 World Championship race"
    },
    quoteOrPressReaction: "Contemporary coverage hailed the event as a royal occasion and a triumph for the Alfa Romeo team's dominant engineering.",
    sources: [
      { name: "Formula 1 Official", url: "https://www.formula1.com/en/latest/article.70-years-of-f1-the-first-ever-world-championship-race-in-1950.1E7r3U7H9GqQG4wWgC0aYm.html" },
      { name: "Motorsport Magazine", url: "https://www.motorsportmagazine.com/archive/article/june-1950/14/the-british-grand-prix" }
    ]
  },
  {
    id: "1976-nurburgring",
    title: "1976 Nürburgring",
    year: "1976",
    description: "Niki Lauda's crash and comeback became one of the defining stories of courage in F1 history.",
    tag: "Legacy",
    image: "/history/lauda-nurburgring-1976.jpg",
    slug: "1976-nurburgring",
    longSummary: "Niki Lauda’s near-fatal crash at the 1976 German Grand Prix at the Nürburgring Nordschleife is widely regarded as a watershed moment in Formula 1 history, marking the transition from an era where death was often accepted as an occupational hazard to one where safety became an active engineering priority.\n\nBefore the race, Lauda—who was leading the championship—had famously urged his fellow drivers to boycott the Nürburgring, arguing that the 14-mile circuit was too dangerous and lacked adequate emergency coverage. His colleagues voted against him, but the race resulted in the very disaster he had feared when his Ferrari crashed and was engulfed in flames.\n\nLauda was saved by the heroism of fellow drivers Arturo Merzario, Guy Edwards, Brett Lunger, and Harald Ertl, who risked their own lives to pull him from the burning wreckage.",
    whyItMattered: "The accident directly led to the permanent removal of the full Nürburgring Nordschleife from the Formula 1 calendar. It accelerated systemic changes, including mandatory trackside medical centers, dedicated medical cars, and the implementation of robust survival cells and fire-resistant equipment.",
    keyFacts: {
      circuit: "Nürburgring Nordschleife",
      winner: "James Hunt",
      constructorTeam: "McLaren-Ford",
      championshipImpact: "Allowed Hunt to close the championship gap",
      definingMoment: "Lauda's crash at Bergwerk and rescue by fellow drivers"
    },
    quoteOrPressReaction: "The press focused heavily on the tragic vindication of his pre-race boycott attempt, and later framed his return to the cockpit just six weeks later as a miraculous feat of human resilience.",
    sources: [
      { name: "Autosport Archive", url: "https://www.autosport.com/f1/news/niki-laudas-1976-nurburgring-f1-crash-and-miracle-recovery-4982631/4982631/" },
      { name: "The Guardian", url: "https://www.theguardian.com/sport/2019/may/21/niki-lauda-nurburgring-crash-1976" }
    ]
  },
  {
    id: "1988-senna-vs-prost",
    title: "1988 Senna vs Prost",
    year: "1988",
    description: "One of the most famous teammate rivalries, shaping the McLaren-Honda era.",
    tag: "Rivalry",
    image: "/history/senna-prost-1988.jpg",
    slug: "1988-senna-vs-prost",
    longSummary: "The rivalry between Ayrton Senna and Alain Prost in 1988 marked the beginning of one of the most intense and defining chapters in Formula 1 history. As teammates at McLaren, they dominated the season, winning 15 of the 16 races and pushing each other to extremes that brought the sport to an unprecedented level of intensity.\n\nThe 1988 season set the stage for a three-year war that remains a benchmark for F1 rivalries. It contrasted Senna's all-action, high-octane attack with Prost's silky smooth, strategic, and precise approach to racing.\n\nTheir rivalry extended beyond pure driving skill into psychological warfare. Designers later noted that both drivers were so anxious to avoid being beaten by the other that they often mirrored each other's car setups, driven by a strange fear of the other's potential advantage.",
    whyItMattered: "This rivalry transcended the sport, bringing F1 to a global mainstream audience. It defined an era of absolute dominance for the McLaren-Honda partnership (the MP4/4) and cemented both drivers as absolute legends whose intertwined legacies shaped modern F1.",
    keyFacts: {
      circuit: "Multiple (Global)",
      winner: "Ayrton Senna (1988 Champion)",
      constructorTeam: "McLaren-Honda",
      championshipImpact: "Senna's first World Championship",
      definingMoment: "Suzuka '88 recovery drive to win the title"
    },
    quoteOrPressReaction: "There can only be one winner. - Ayrton Senna, when asked by Prost if they could be 'equal'.",
    sources: [
      { name: "Formula 1 Legacy", url: "https://www.formula1.com/en/latest/article.senna-prost-and-the-mclaren-mp4-4-the-story-of-the-most-dominant-f1-season.2w8mXUvH8t7XpB6TqG0iWq.html" },
      { name: "Goodwood Road & Racing", url: "https://www.goodwood.com/grr/race/historic/2020/5/ayrton-senna-vs-alain-prost-f1s-greatest-rivalry/" }
    ]
  },
  {
    id: "1994-imola",
    title: "1994 Imola",
    year: "1994",
    description: "A tragic weekend that changed Formula 1 safety forever.",
    tag: "Safety",
    image: "/history/imola-1994.jpg",
    slug: "1994-imola",
    longSummary: "The 1994 San Marino Grand Prix at Imola is widely regarded as the darkest weekend in modern Formula 1 history. The deaths of Austrian rookie Roland Ratzenberger during qualifying on April 30, and three-time world champion Ayrton Senna during the race on May 1, marked a profound turning point for the sport.\n\nThe weekend was marred by multiple accidents, beginning with a serious crash by Rubens Barrichello on Friday. The deaths were the first driver fatalities during a race weekend in F1 since 1982. Senna’s death, in particular, shocked the world, as he was a global icon and a vocal advocate for driver safety.\n\nThe tragedies acted as a violent catalyst for a massive safety revolution. While safety discussions were already underway, the events of this weekend created an urgent, non-negotiable mandate for change driven by FIA President Max Mosley and Dr. Sid Watkins.",
    whyItMattered: "The aftermath saw rapid and permanent shifts in safety. Circuits underwent radical redesigns to slow cars down. Cockpit sides were raised, helmets were reinforced, and the Head and Neck Support (HANS) device eventually became mandatory. The Grand Prix Drivers’ Association was also re-established.",
    keyFacts: {
      circuit: "Autodromo Enzo e Dino Ferrari",
      winner: "Michael Schumacher",
      constructorTeam: "Benetton-Ford",
      championshipImpact: "Tragic loss of a title contender and global icon",
      definingMoment: "The re-evaluation of the sport's safety standards"
    },
    quoteOrPressReaction: "Ayrton Senna was the most dedicated racing-driver I have ever met... He lived to drive. And he died driving. - Jackie Stewart",
    sources: [
      { name: "Autosport History", url: "https://www.autosport.com/f1/news/the-f1-safety-revolution-that-followed-imola-1994-4985654/4985654/" },
      { name: "Motorsport Magazine", url: "https://www.motorsportmagazine.com/archive/article/june-1994/12/imola-1994-the-blackest-weekend" }
    ]
  },
  {
    id: "2008-brazilian-grand-prix",
    title: "2008 Brazilian Grand Prix",
    year: "2008",
    description: "Lewis Hamilton won the championship on the final corner of the final lap.",
    tag: "Title Decider",
    image: "/history/brazil-2008.jpg",
    slug: "2008-brazilian-grand-prix",
    longSummary: "The 2008 Brazilian Grand Prix is cemented in Formula 1 history as one of its most dramatic season finales. Going into the final race, McLaren's Lewis Hamilton needed to finish at least fifth to secure his first World Championship, while Ferrari's Felipe Massa needed to win and hope Hamilton finished lower than fifth.\n\nAs rain intensified in the closing stages, the field scrambled for wet tires. Toyota's Timo Glock gambled by staying out on dry-weather tires, struggling immensely for grip on the soaking track. On the final lap, Hamilton was in sixth place. Felipe Massa crossed the finish line as the race winner, thinking he was champion, and the Ferrari garage erupted in celebration.\n\nHowever, in the final corners of the lap, Hamilton overtook the struggling Glock to move into fifth place, clinching the title by a single point in an astonishing, heart-wrenching shift in the championship outcome.",
    whyItMattered: "It remains one of the closest and most thrilling championship deciders in history. Hamilton became the youngest World Champion at the time (later beaten by Vettel), while Massa handled the devastating home defeat with immense grace.",
    keyFacts: {
      circuit: "Interlagos (Autódromo José Carlos Pace)",
      winner: "Felipe Massa",
      constructorTeam: "Ferrari",
      championshipImpact: "Hamilton wins WDC by 1 point; Ferrari wins Constructors",
      definingMoment: "Hamilton passing Glock at Junção on the final lap"
    },
    quoteOrPressReaction: "Is that Glock?! Is that Glock going slowly?! It is! That's Glock! Oh my goodness me! - Martin Brundle's iconic live commentary.",
    sources: [
      { name: "The Guardian", url: "https://www.theguardian.com/sport/2008/nov/02/formulaone-lewishamilton" },
      { name: "Formula 1 Archive", url: "https://www.formula1.com/en/latest/article.is-that-glock-the-story-of-the-2008-brazilian-grand-prix.4j7Z2kP9bZqQW0UeU8qQ8S.html" }
    ]
  },
  {
    id: "2009-brawn-gp",
    title: "2009 Brawn GP",
    year: "2009",
    description: "A shock championship-winning season from a team that almost did not exist.",
    tag: "Underdog",
    image: "/history/brawn-gp-2009.jpg",
    slug: "2009-brawn-gp",
    longSummary: "The 2009 Brawn GP season is widely considered the greatest underdog story in Formula 1 history. Emerging from the ashes of the Honda Racing F1 Team after the parent company withdrew due to the 2008 financial crisis, the team was purchased by Ross Brawn for the nominal sum of £1 just weeks before the season began.\n\nWith no sponsors, a plain white car, and a hastily fitted Mercedes engine, the team arrived at testing and immediately stunned the paddock with their pace. Their success was anchored by the 'double diffuser', a brilliant interpretation of new aerodynamic regulations that gave them a massive performance advantage.\n\nJenson Button won six of the first seven races, building a lead that he successfully defended through the second half of the season as richer teams caught up. Brawn GP won both the Drivers' and Constructors' Championships in their sole season of existence.",
    whyItMattered: "It proved that ingenuity and teamwork could triumph over massive budgets. The team's survival and success kept hundreds of people employed in Brackley and ultimately formed the foundation for the modern Mercedes-AMG team that dominated the turbo-hybrid era.",
    keyFacts: {
      circuit: "Multiple (Global)",
      winner: "Jenson Button (2009 Champion)",
      constructorTeam: "Brawn GP",
      championshipImpact: "Historic double championship in debut/only season",
      definingMoment: "Arriving at pre-season testing and topping the timing sheets"
    },
    quoteOrPressReaction: "A miracle built on desperation, genius engineering, and a legal loophole that changed everything. Contemporary press hailed it as a fairytale.",
    sources: [
      { name: "Formula 1 Historical Features", url: "https://www.formula1.com/en/latest/article.the-story-of-brawn-gp.5XqW0u5NqEWyKc48Ym6qC6.html" },
      { name: "BBC Sport", url: "http://news.bbc.co.uk/sport2/hi/motorsport/formula_one/8313465.stm" }
    ]
  },
  {
    id: "2012-brazilian-grand-prix",
    title: "2012 Brazilian Grand Prix",
    year: "2012",
    description: "A chaotic title finale remembered for drama, rain, and championship pressure.",
    tag: "Chaos",
    image: "/history/brazil-2012.jpg",
    slug: "2012-brazilian-grand-prix",
    longSummary: "The 2012 Brazilian Grand Prix is frequently cited as the gold standard for championship finales. It served as the dramatic conclusion to a fiercely contested battle between Red Bull's Sebastian Vettel and Ferrari's Fernando Alonso.\n\nThe race featured intense, on-and-off rain that forced constant tactical decisions regarding tire changes. On the very first lap, Vettel was spun around at turn four after a collision with Bruno Senna. With significant damage to the sidepod of his car and dropping to last place, his championship hopes seemed shattered.\n\nHowever, Vettel staged a remarkable recovery drive through the field in the treacherous conditions. Meanwhile, Alonso drove impeccably to secure a podium. The 'live' championship standings fluctuated wildly throughout the race, but Vettel eventually secured the sixth-place finish he required to clinch the title by just three points.",
    whyItMattered: "By winning the 2012 title, Sebastian Vettel became the youngest triple world champion in F1 history. The race encapsulated everything that made the 2012 season special: competitive depth, weather-induced drama, and a high-stakes duel. It was also Michael Schumacher's final F1 race.",
    keyFacts: {
      circuit: "Interlagos (Autódromo José Carlos Pace)",
      winner: "Jenson Button",
      constructorTeam: "McLaren-Mercedes",
      championshipImpact: "Vettel secures 3rd World Championship",
      definingMoment: "Vettel's lap 1 spin and subsequent recovery drive"
    },
    quoteOrPressReaction: "When you get turned around at turn four for no reason and it becomes like heading the wrong way down the M25, it is not the most comfortable feeling. - Sebastian Vettel",
    sources: [
      { name: "Autosport Archive", url: "https://www.autosport.com/f1/news/the-greatest-f1-title-decider-brazil-2012-revisited/5323214/" },
      { name: "Red Bull Racing History", url: "https://www.redbull.com/int-en/sebastian-vettel-2012-brazil-grand-prix" }
    ]
  },
  {
    id: "2021-abu-dhabi-grand-prix",
    title: "2021 Abu Dhabi Grand Prix",
    year: "2021",
    description: "One of the most controversial modern title finales in Formula 1.",
    tag: "Controversy",
    image: "/history/abu-dhabi-2021.jpg",
    slug: "2021-abu-dhabi-grand-prix",
    longSummary: "The 2021 Abu Dhabi Grand Prix remains one of the most debated events in Formula 1 history. It was the dramatic season finale where Max Verstappen and Lewis Hamilton entered the race tied on points. Hamilton dominated the race and looked set for a record-breaking eighth title until a late crash by Nicholas Latifi triggered a Safety Car.\n\nThe controversy centered on Race Director Michael Masi's handling of the restart. Masi initially decided that lapped cars could not overtake the Safety Car, but reversed this, allowing only the lapped cars between Hamilton and Verstappen to unlap themselves. He then ordered the Safety Car in immediately, setting up a one-lap sprint.\n\nVerstappen, on fresh soft tires, overtook Hamilton on older hard tires on the final lap to win his maiden World Championship. The decision sparked intense debate regarding the application of FIA sporting regulations and the influence of teams on race control.",
    whyItMattered: "The fallout resulted in significant structural changes within the FIA. Michael Masi was removed as race director, direct radio communication between team principals and race control was banned, and the safety car unlapping rules were rewritten to prevent ambiguity.",
    keyFacts: {
      circuit: "Yas Marina Circuit",
      winner: "Max Verstappen",
      constructorTeam: "Red Bull Racing",
      championshipImpact: "Verstappen wins maiden title; Mercedes wins Constructors",
      definingMoment: "The final lap overtake at Turn 5 after the safety car restart"
    },
    quoteOrPressReaction: "An official FIA inquiry later concluded that 'human error' had led to the irregular procedure. Hamilton famously stated over team radio: 'This has been manipulated, man.'",
    sources: [
      { name: "The Guardian", url: "https://www.theguardian.com/sport/2021/dec/12/max-verstappen-wins-f1-world-title-after-last-lap-drama-in-abu-dhabi" },
      { name: "FIA Official Report", url: "https://www.fia.com/news/fia-announces-world-motor-sport-council-decisions-25" }
    ]
  }
];

export const glossaryTerms: GlossaryTerm[] = [
  { term: "Undercut", definition: "Pitting earlier than a rival to use fresher tyres and gain time before they stop." },
  { term: "Overcut", definition: "Staying out longer than a rival to gain track position or use clear air before pitting." },
  { term: "Tyre degradation", definition: "The loss of tyre performance as laps, heat, and sliding wear the rubber down." },
  { term: "Dirty air", definition: "Disturbed airflow behind another car that reduces grip and makes following harder." },
  { term: "DRS", definition: "A movable rear wing flap that reduces drag on selected straights when a driver is close enough." },
  { term: "Safety car", definition: "A race neutralization that slows the field after an incident and can reshape pit strategy." },
  { term: "Pit window", definition: "The range of laps where stopping is likely to work best for a planned strategy." },
  { term: "Track position", definition: "A car's place on the road, often valuable when overtaking is difficult." },
  { term: "Parc ferme", definition: "The restricted period when teams cannot freely change car setup after qualifying begins." },
  { term: "Formation lap", definition: "The slow lap before the start when drivers warm tyres and line up on the grid." },
  { term: "Blue flags", definition: "Signals shown to slower cars when faster leaders are approaching to lap them." },
  { term: "DNF", definition: "Did Not Finish, used when a driver retires before completing the race." },
];
