import { GraphAlgorithm } from "../../../GraphUniverse/Algorithm/GraphAlgorithm";
import { AlgorithmCommand } from "../../../GraphUniverse/Algorithm/AlgorithmCommands";
import { UpdateVertexRenderingConfiguration } from "../../../GraphUniverse/Algorithm/Commands/UpdateVertexRenderingConfiguration";
import { GetOtherEnd, Vertex } from "../../../GraphUniverse/Graph/Graph";
import SimpleGraph from "../../../GraphUniverse/Graph/SimpleGraph/SimpleGraph";

// Specifies that this algorithm needs a start vertex to start the search
// This type can specifies other properties required by this algorithm like colors or themes
// for example
export type DepthFirstSearchConfig = {
  startVertex: Vertex;
  targetVertex: Vertex;
};

export class DepthFirstSearchAlgorithm implements GraphAlgorithm {
  algorithm: Generator<AlgorithmCommand<any, any>, void, unknown>;

  constructor(private graph: SimpleGraph, private config: DepthFirstSearchConfig) {
    this.algorithm = this.execute();
  }

  nexts(): AlgorithmCommand[] {
    const result = this.algorithm.next();

    if (result.done) {
      return [];
    }

    return [result.value];
  }

  private *execute(): Generator<AlgorithmCommand, void> {
    const visited = new Set<Vertex>();
    const stack = [this.config.startVertex];

    while (stack.length > 0) {
      const vertex = stack.pop()!;

      if (visited.has(vertex)) {
        continue;
      }

      if (vertex === this.config.targetVertex) {
        yield new UpdateVertexRenderingConfiguration(
          vertex,
          // Change vertex display
          {
            borderColor: "#bddbc6",
            innerColor: "#54b06b",
          },
          {
            delay: 1, // Specify that this command should be executed after 1 unit of time
            isStep: true, // In the move forward mode, this pauses the algorithm execution and display the provided explanation
            explanation: `Target vertex has been found`,
          }
        );

        return
      }

      visited.add(vertex);

      // Add all the edges to the array that tracks the visited vertices
      for (const edge of this.graph.getNeighborEdges(vertex)) {
        const otherEnd = GetOtherEnd(edge, vertex);

        if (!visited.has(otherEnd)) {
          stack.push(otherEnd);
        }
      }

      // Updates the vertex color and the state of the arlgorithm visualiation
      yield new UpdateVertexRenderingConfiguration(
        vertex,
        // Change vertex display
        {
          borderColor: "#e3e0ff",
          innerColor: "#8d86db",
        },
        {
          delay: 1, // Specify that this command should be executed after 1 unit of time
          isStep: true, // In the move forward mode, this pauses the algorithm execution and display the provided explanation
          explanation: `
## Visiting vertex **${vertex.id}**  
## Vetex remaining to visit: ${stack.map((v) => `**${v.id}**`).join(", ")}
`,
        }
      );
    }
  }
}
