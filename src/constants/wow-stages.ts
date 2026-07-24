export interface WowStage {
  number: string;
  label: string;
  description: string;
}

export const WOW_STAGES: WowStage[] = [
  {
    number: "01",
    label: "Raw Data",
    description:
      "Unstructured signals arrive from every source — messy, disconnected, waiting to be understood.",
  },
  {
    number: "02",
    label: "AI Processing",
    description:
      "Models parse, classify, and connect the data in real time, finding the patterns hidden inside the noise.",
  },
  {
    number: "03",
    label: "Structured Intelligence",
    description:
      "The noise resolves into a clear, ordered structure — intelligence a team can actually act on.",
  },
  {
    number: "04",
    label: "AI Automation",
    description:
      "That intelligence triggers action automatically, routed to the workflows that need it most.",
  },
];
