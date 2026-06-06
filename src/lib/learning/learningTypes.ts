export interface LearningPath {
  id: string;
  title: string;
  shortValue: string;
  difficulty: "Beginner" | "Intermediate";
  estimatedMinutes: number;
}

export interface ConceptDefinition {
  id: string;
  term: string;
  simpleExplanation: string;
  technicalExplanation: string;
  whyFansCare: string;
  exampleSentence: string;
  commonMisconception: string;
  raceExplainerFeature: string | null;
}

export interface WatchGuideStep {
  id: string;
  phase: string;
  instruction: string;
  whatToWatch: string;
}

export interface EmotionalHook {
  id: string;
  title: string;
  description: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}
