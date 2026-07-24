export interface InsightFlowStep {
  number: string;
  title: string;
  description: string;
}

export const INSIGHT_FLOW_STEPS: InsightFlowStep[] = [
  {
    number: "01",
    title: "Ingest Data",
    description: "Connect any source — APIs, files, databases. Raw data flows in.",
  },
  {
    number: "02",
    title: "Analyze with AI",
    description: "Models process, classify, and extract patterns in real time.",
  },
  {
    number: "03",
    title: "Generate Insight",
    description: "Clear, structured intelligence delivered to decision-makers.",
  },
];
