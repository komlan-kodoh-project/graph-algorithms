import GraphUniverse from "../GraphUniverse";
import { AlgorithmCommand } from "./AlgorithmCommands";

export interface GraphAlgorithm {
  nexts(): AlgorithmCommand[];
}

export type OperationSummary = {
  markdown: string;
};
