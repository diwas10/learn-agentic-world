export interface InteractiveControl {
  name: string;
  label: string;
  type: 'slider' | 'toggle' | 'button';
  min?: number;
  max?: number;
  step?: number;
  default?: number | boolean;
}

export interface ThreeJsNode {
  id: string;
  label: string;
  type: string;
  position: [number, number, number];
  color: string;
  radius: number;
  metrics?: {
    tokens?: number;
    latencyMs?: number;
    value?: number;
    [key: string]: any;
  };
}

export interface ThreeJsEdge {
  source: string;
  target: string;
  label: string;
  animated?: boolean;
}

export interface ThreeJsSpec {
  sceneTitle: string;
  description: string;
  camera: {
    position: [number, number, number];
    fov: number;
  };
  nodes: ThreeJsNode[];
  edges: ThreeJsEdge[];
  interactiveControls: InteractiveControl[];
}

export interface GraphNode {
  id: string;
  label: string;
  category: 'input' | 'llm' | 'tool' | 'verifier' | 'output' | 'router' | 'worker' | 'hitl' | 'goal' | 'error' | 'trusted' | 'untrusted';
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  style?: string;
}

export interface GraphSpec {
  graphType: string;
  title: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface YouTubeVideo {
  title: string;
  channel: string;
  videoId: string;
  url: string;
  duration: string;
  whyWatch: string;
}

export interface ArticlePaper {
  title: string;
  url: string;
  type: string;
  keyTakeaway: string;
}

export interface Diagram {
  id: string;
  title: string;
  caption: string;
  svgMarkup: string;
}

export interface CodeWalkthrough {
  language: string;
  filename: string;
  description: string;
  code: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface InteractiveExercise {
  title: string;
  prompt: string;
  quizQuestions: QuizQuestion[];
}

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  coreConcepts: string[];
  htmlContent: string;
  visualizations: {
    threeJsSpec: ThreeJsSpec;
    graphSpec: GraphSpec;
  };
  media: {
    youtubeVideos: YouTubeVideo[];
    articlesAndPapers: ArticlePaper[];
    diagrams: Diagram[];
  };
  codeWalkthrough: CodeWalkthrough;
  interactiveExercise: InteractiveExercise;
}

export interface Module {
  id: string;
  number: number;
  title: string;
  category: string;
  estimatedHours: number;
  difficulty: string;
  summary: string;
  bridgeToYourResume: string;
  lessons: Lesson[];
}

export interface LearnerSuperpower {
  skill: string;
  details: string;
  agenticTransfer: string;
}

export interface CriticalGap {
  gap: string;
  whyItMatters: string;
}

export interface StrategicRoadmapPhase {
  phase: string;
  focus: string;
  milestoneProject: string;
}

export interface LearnerProfile {
  name: string;
  currentRole: string;
  yearsOfExperience: number;
  existingSuperpowers: LearnerSuperpower[];
  criticalGapsToBridgeFor100MScale: CriticalGap[];
  strategicRoadmap: StrategicRoadmapPhase[];
}

export interface CurriculumData {
  meta: {
    title: string;
    subtitle: string;
    version: string;
    generatedAt: string;
    targetAudience: string;
    webAppSpec: any;
  };
  learnerProfile: LearnerProfile;
  modules: Module[];
}
