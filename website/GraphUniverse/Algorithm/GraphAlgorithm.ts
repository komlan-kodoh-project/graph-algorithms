import GraphUniverse from "../GraphUniverse";
import { AlgorithmCommand } from "./AlgorithmCommands";

export interface GraphAlgorithm {
    nexts(): AlgorithmCommand[];
}

