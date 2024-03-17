import { UpdateVertexRenderingConfiguration } from "../../../GraphUniverse/Algorithm/Commands/UpdateVertexRenderingConfiguration";
import { GraphAlgorithm } from "@/GraphUniverse/Algorithm/GraphAlgorithm";
import { AlgorithmCommand } from "@/GraphUniverse/Algorithm/AlgorithmCommands";
import { AnyValue } from "@/utils/types";
import { GetOtherEnd, Vertex } from "@/GraphUniverse/Graph/Graph";
import { UpdateEdgeRenderingConfiguration } from "@/GraphUniverse/Algorithm/Commands/UpdateEdgeRenderingConfiguration";
import { EdgeDisplayConfiguration } from "@/GraphUniverse/Entity/EdgeEntity";
import { VertexDisplayConfiguration } from "@/GraphUniverse/Entity/VertexEntity";
import SimpleGraph from "@/GraphUniverse/Graph/SimpleGraph/SimpleGraph";
import { PassiveCommand } from "@/GraphUniverse/Algorithm/Commands/PassiveCommand";

export interface GraphAlgorithmExecution {
  done: boolean;
  StartExecution(): Promise<void>;
}

export type DijkstraAlgorithmConfig = {
  graph: SimpleGraph;

  sourceVertex: Vertex;
  destinatonVertex: Vertex;

  exploredEdge: Partial<EdgeDisplayConfiguration>;
  exploredVertex: Partial<VertexDisplayConfiguration>;

  visitedEdge: Partial<EdgeDisplayConfiguration>;
  visitedVertex: Partial<VertexDisplayConfiguration>;

  pathEdge: Partial<EdgeDisplayConfiguration>;
  pathVertex: Partial<VertexDisplayConfiguration>;
};

type DijkstraNode = {
  cost: number;
  vertex: Vertex;
  source: DijkstraNode | null;
};

type MarkdownTable = {
  header: string[];
  rows: string[][];
};

function buildMarkdownTable(table: MarkdownTable): string {
  let markdownTable = `| ${table.header.join(" | ")} |\n| ${table.header
    .map(() => "---")
    .join(" | ")} |\n`;

  for (const row of table.rows) {
    markdownTable += `| ${row.join(" | ")} |\n`;
  }

  return markdownTable;
}

function objectToMarkdownTable(map: Map<unknown, unknown>): string {
  let table = "| Key | Value |\n| --- | --- |\n";

  for (const [key, value] of map) {
    table += `| ${key} | ${value} |\n`;
  }

  return table;
}

export class DijkstraAlgorithm implements GraphAlgorithm {
  private generator: Generator<AlgorithmCommand> | null = null;

  constructor(private config: DijkstraAlgorithmConfig) {}

  public nexts(): AlgorithmCommand<AnyValue, AnyValue>[] {
    if (this.generator === null) {
      this.generator = this.execute();
    }

    const nextValue = this.generator.next();

    if (nextValue.done) {
      return [];
    }

    return [nextValue.value];
  }

  private *execute(): Generator<AlgorithmCommand, void> {
    const vertexCost = new Map<number, number>();
    const visitedVertexId = new Set<number>();

    let vertexLeftToExplore: DijkstraNode[] = [
      {
        source: null,
        vertex: this.config.sourceVertex,
        cost: 0,
      },
    ];

    function getAlgorithmState(): string {
      return `
# Vertex Queue 
${buildMarkdownTable({  
  header: ["Vertex", "Cost", "Source"],
  rows: vertexLeftToExplore.map((x) => [
    x.vertex.id.toString(),
    x.cost.toString(),
    x.source?.vertex.id.toString() ?? "Self",
  ]),
})}

# Known vertex cost
${buildMarkdownTable({
  header: ["Vertex", "Cost"],
  rows: Array.from(vertexCost.entries()).map(([key, value]) => [key.toString(), value.toString()]),
})}
      `;
    }

    yield new UpdateVertexRenderingConfiguration(
      this.config.sourceVertex,
      {
        ...this.config.visitedVertex,
        underLabelDisplayConfiguration: () => `Source : ${0} from self`,
      },
      {
        delay: 3,
        isStep: true,
        explanation: `
Initialization of the source vertex with cost to zero
${getAlgorithmState()}
        `,
      }
    );

    let backtrackingNode: DijkstraNode | null = null;

    while (vertexLeftToExplore.length !== 0) {
      const currentVertex = vertexLeftToExplore[0];

      if (currentVertex.vertex.id === this.config.destinatonVertex.id) {
        yield new UpdateVertexRenderingConfiguration(currentVertex.vertex, {
          underLabelDisplayConfiguration: () =>
            `Destination : ${currentVertex.cost} from ${currentVertex.source?.vertex.id}`,
        });

        backtrackingNode = currentVertex;

        break;
      }

      if (currentVertex.vertex.id !== this.config.sourceVertex.id) {
        yield new UpdateVertexRenderingConfiguration(
          currentVertex.vertex,
          this.config.exploredVertex
        );

        const sourceEdge = this.config.graph.getEdge(
          currentVertex.source!.vertex,
          currentVertex.vertex
        );

        yield new UpdateEdgeRenderingConfiguration(sourceEdge, this.config.exploredEdge);
      }

      const vertexEdges = this.config.graph.getNeighborEdges(currentVertex.vertex);

      for (const edge of vertexEdges) {
        const adjacentVertex = GetOtherEnd(edge, currentVertex.vertex);

        if (visitedVertexId.has(adjacentVertex.id)) {
          continue;
        }

        const explorationCost = edge.weight + currentVertex.cost;

        const previousExplorationCost = vertexCost.get(adjacentVertex.id);

        yield new UpdateEdgeRenderingConfiguration(edge, this.config.visitedEdge);

        if (adjacentVertex.id !== this.config.destinatonVertex.id) {
          yield new UpdateVertexRenderingConfiguration(adjacentVertex, this.config.visitedVertex);
        }

        if (previousExplorationCost == undefined) {
          vertexCost.set(adjacentVertex.id, explorationCost);

          yield new UpdateVertexRenderingConfiguration(adjacentVertex, this.config.visitedVertex);

          vertexLeftToExplore.push({
            source: currentVertex,
            vertex: adjacentVertex,
            cost: explorationCost,
          });

          vertexLeftToExplore.sort((first, second) => first.cost - second.cost);
        } else if (explorationCost < previousExplorationCost) {
          vertexLeftToExplore = vertexLeftToExplore.filter((x) => x.vertex.id != adjacentVertex.id);

          vertexLeftToExplore.push({
            source: currentVertex,
            vertex: adjacentVertex,
            cost: explorationCost,
          });

          vertexLeftToExplore.sort((first, second) => first.cost - second.cost);
        }
      }

      vertexLeftToExplore.shift();
      visitedVertexId.add(currentVertex.vertex.id);
      yield new UpdateVertexRenderingConfiguration(
        currentVertex.vertex,
        this.config.exploredVertex,
        {
          delay: 1,
          isStep: true,
          explanation: `
Vertex ${currentVertex.vertex.id} is being explored. All of its neighbors will be added to the queue
${getAlgorithmState()}
        `,
        }
      );
    }

    while (backtrackingNode?.source != null) {
      const relevantEdge = this.config.graph.getEdge(
        backtrackingNode.source.vertex,
        backtrackingNode.vertex
      );

      yield new UpdateEdgeRenderingConfiguration(relevantEdge, this.config.pathEdge);

      yield new UpdateVertexRenderingConfiguration(backtrackingNode.vertex, this.config.pathVertex);

      yield new PassiveCommand({
        delay: 1,
        isStep: false,
        explanation: "Doing something reallly cool",
      });

      backtrackingNode = backtrackingNode.source;
    }

    yield new UpdateVertexRenderingConfiguration(this.config.sourceVertex, this.config.pathVertex, {
      isStep: true,
      explanation: "Shortest path has been found is being highlighted\n" + getAlgorithmState(),
    });
  }
}
