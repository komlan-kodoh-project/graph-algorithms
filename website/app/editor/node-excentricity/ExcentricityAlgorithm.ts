import { GraphAlgorithm } from "@/GraphUniverse/Algorithm/GraphAlgorithm";
import { AlgorithmCommand } from "@/GraphUniverse/Algorithm/AlgorithmCommands";
import { AnyValue } from "@/utils/types";
import { Vertex } from "@/GraphUniverse/Graph/Graph";
import { UpdateEdgeRenderingConfiguration } from "@/GraphUniverse/Algorithm/Commands/UpdateEdgeRenderingConfiguration";
import { EdgeDisplayConfiguration } from "@/GraphUniverse/Entity/EdgeEntity";
import { VertexDisplayConfiguration } from "@/GraphUniverse/Entity/VertexEntity";
import SimpleGraph from "@/GraphUniverse/Graph/SimpleGraph/SimpleGraph";
import { NodeExcentricity, find_node_eccentricity } from "wasm-lib";
import { UpdateVertexRenderingConfiguration } from "@/GraphUniverse/Algorithm/Commands/UpdateVertexRenderingConfiguration";

export interface GraphAlgorithmExecution {
  done: boolean;
  StartExecution(): Promise<void>;
}

export type ExcentricityAlgorithmConfig = {
  graph: SimpleGraph;
  sourceVertex: Vertex;
  pathEdge: Partial<EdgeDisplayConfiguration>;
  pathVertex: Partial<VertexDisplayConfiguration>;
};

type DijkstraNode = {
  cost: number;
  vertex: Vertex;
  source: DijkstraNode | null;
};

export class ExcentricityAlgorithm implements GraphAlgorithm {
  private generator: Generator<AlgorithmCommand[]> | null = null;

  constructor(private config: ExcentricityAlgorithmConfig) {}

  public nexts(): AlgorithmCommand<AnyValue, AnyValue>[] {
    if (this.generator === null) {
      this.generator = this.execute();
    }

    const nextValue = this.generator.next();

    if (nextValue.done) {
      return [];
    }

    return nextValue.value;
  }

  private *execute(): Generator<AlgorithmCommand[], void> {
    const vertex = this.config.sourceVertex;
    // for (const vertex of this.config.graph.getAllVertices()) {

    const node_excentricity = find_node_eccentricity(
      this.config.graph.getWasmGraph(),
      vertex.wasmId
    );

    yield this.generateNodeExcentricityAction(vertex, node_excentricity);
  }

  private generateNodeExcentricityAction(
    vertex: Vertex,
    excentricity: NodeExcentricity
  ): AlgorithmCommand[] {
    const commands: AlgorithmCommand[] = [
      new UpdateVertexRenderingConfiguration(vertex, this.config.pathVertex),
    ];

    let previousVertex = vertex;

    for (const id of excentricity.get_path()) {
      // Skip first vertex that is included in the path
      if (id === previousVertex.wasmId) {
        continue;
      }

      let currentVertex = this.config.graph.getVertex(id);

      const edgeConnecting = this.config.graph.getEdge(previousVertex, currentVertex);

      if (edgeConnecting === undefined) {
        throw new Error("Failed to find edge between vertex and its neighbor");
      }

      commands.push(
        new UpdateEdgeRenderingConfiguration(edgeConnecting, this.config.pathEdge, { delay: 1 }),
        new UpdateVertexRenderingConfiguration(currentVertex, this.config.pathVertex, { delay: 1 })
      );

      previousVertex = currentVertex;
    }

    return commands;
  }
}
