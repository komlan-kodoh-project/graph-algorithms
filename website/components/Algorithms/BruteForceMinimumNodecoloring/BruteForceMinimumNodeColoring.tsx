import { AlgorithmCommand } from "@/GraphUniverse/Algorithm/AlgorithmCommands";
import { PassiveCommand } from "@/GraphUniverse/Algorithm/Commands/PassiveCommand";
import { UpdateVertexRenderingConfiguration } from "@/GraphUniverse/Algorithm/Commands/UpdateVertexRenderingConfiguration";
import { GraphAlgorithm } from "@/GraphUniverse/Algorithm/GraphAlgorithm";
import SimpleGraph from "@/GraphUniverse/Graph/SimpleGraph/SimpleGraph";
import { ColorGenerator } from "@/utils/ColorGenerator";
import { getRandomColor } from "@/utils/helpers";
import { AnyValue } from "@/utils/types";
import {
  ExhaustiveMinimumNodeColoring,
  exhaustive_minimum_node_coloring,
  initialize_web_assembly,
} from "wasm-lib";

export type BruteForceMinimumNodecoloringConfig = {};

export class BruteForceMinimumNodecoloring implements GraphAlgorithm {
  private graph: SimpleGraph;

  private index: number = 0;
  private result: ExhaustiveMinimumNodeColoring | null = null;

  constructor(graph: SimpleGraph) {
    this.graph = graph;
  }

  nexts(): AlgorithmCommand[] {
    if (this.result === null) {
      this.result = exhaustive_minimum_node_coloring(this.graph.getWasmGraph());
    }

    if (this.index >= this.result.len()) {
      return [];
    }

    const combination = this.result.get_node_coloring(this.index);
    this.index++;

    return this.GenerateAlgorithmComand(combination);
  }

  private GenerateAlgorithmComand(graphColoring: Uint32Array): AlgorithmCommand[] {
    const colorMap = new Map<number, string>();
    const randomColorGenerator = new ColorGenerator();
    const commands = new Array<AlgorithmCommand>(graphColoring.length + 1);

    for (const [i, value] of graphColoring.entries()) {
      let color = colorMap.get(value);

      if (color === undefined) {
        color = randomColorGenerator.generateColor();
        colorMap.set(value, color);
      }

      const vertex = this.graph.getVertex(i);

      commands[i] = new UpdateVertexRenderingConfiguration(vertex, {
        borderColor: color,
        innerColor: "#1c1c1c",
        // underLabelDisplayConfiguration: () => value.toString(),
      });
    }

    commands[graphColoring.length] = new PassiveCommand({ delay: 10 });

    return commands;
  }
}
