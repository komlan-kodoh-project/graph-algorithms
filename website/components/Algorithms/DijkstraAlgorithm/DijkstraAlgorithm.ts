import { UpdateVertexRenderingConfiguration } from './../../../GraphUniverse/Algorithm/Commands/UpdateVertexRenderingConfiguration';
import GraphUniverse from "@/GraphUniverse/GraphUniverse";
import { GraphAlgorithm } from "@/GraphUniverse/Algorithm/GraphAlgorithm";
import { AlgorithmCommand } from "@/GraphUniverse/Algorithm/AlgorithmCommands";
import { AnyValue } from "@/utils/types";
import { Edge, GetOtherEnd, Vertex } from "@/GraphUniverse/Graph/Graph";
import { UpdateEdgeRenderingConfiguration } from '@/GraphUniverse/Algorithm/Commands/UpdateEdgeRenderingConfiguration';
import { EdgeDisplayConfiguration } from '@/GraphUniverse/Entity/EdgeEntity';
import { VertexDisplayConfiguration } from '@/GraphUniverse/Entity/VertexEntity';
import SimpleGraph from '@/GraphUniverse/Graph/SimpleGraph/SimpleGraph';
import { PassiveCommand } from '@/GraphUniverse/Algorithm/Commands/PassiveCommand';

export interface GraphAlgorithmExecution {
    done: boolean;
    StartExecution(): Promise<void>;
}

export type DijkstraAlgorithmConfig = {
    graph: SimpleGraph,

    sourceVertex: Vertex,
    destinatonVertex: Vertex,

    exploredEdge: Partial<EdgeDisplayConfiguration>,
    exploredVertex: Partial<VertexDisplayConfiguration>,

    visitedEdge: Partial<EdgeDisplayConfiguration>
    visitedVertex: Partial<VertexDisplayConfiguration>,

    pathEdge: Partial<EdgeDisplayConfiguration>,
    pathVertex: Partial<VertexDisplayConfiguration>,
}

type DijkstraNode = {
    cost: number,
    vertex: Vertex,
    source: DijkstraNode | null,
}

export class DijkstraAlgorithm implements GraphAlgorithm {
    private generator: Generator<AlgorithmCommand> | null = null;

    constructor(private config: DijkstraAlgorithmConfig) {

    }


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

        let vertexLeftToExplore: DijkstraNode[] = [{
            source: null,
            vertex: this.config.sourceVertex,
            cost: 0,
        }];

        yield new UpdateVertexRenderingConfiguration(
            this.config.sourceVertex,
            {
                ...this.config.exploredVertex,
                underLabelDisplayConfiguration: () => `Source : ${0} from self`,
            },
            {
                delay: 3
            },
        );

        let backtrackingNode: DijkstraNode | null = null;

        while (vertexLeftToExplore.length !== 0) {
            const currentVertex = vertexLeftToExplore.shift()!;

            if (currentVertex.vertex.id === this.config.destinatonVertex.id) {
                yield new UpdateVertexRenderingConfiguration(
                    currentVertex.vertex,
                    {
                        underLabelDisplayConfiguration: () => `Destination : ${currentVertex.cost} from ${currentVertex.source?.vertex.id}`,
                    },
                );

                backtrackingNode = currentVertex;

                break;
            }

            if (currentVertex.vertex.id !== this.config.sourceVertex.id) {
                yield new UpdateVertexRenderingConfiguration(
                    currentVertex.vertex,
                    this.config.exploredVertex,
                );

                const sourceEdge = this.config.graph.getEdge(
                    currentVertex.source!.vertex,
                    currentVertex.vertex
                );

                yield new UpdateEdgeRenderingConfiguration(
                    sourceEdge,
                    this.config.exploredEdge
                );
            }

            visitedVertexId.add(currentVertex.vertex.id);

            const vertexEdges = this.config.graph.getNeighborEdges(currentVertex.vertex);


            for (const edge of vertexEdges) {
                const adjacentVertex = GetOtherEnd(edge, currentVertex.vertex);

                if (visitedVertexId.has(adjacentVertex.id)) {
                    continue;
                }

                const explorationCost = edge.weight + currentVertex.cost;

                const previousExplorationCost = vertexCost.get(adjacentVertex.id);

                yield new UpdateEdgeRenderingConfiguration(
                    edge,
                    this.config.visitedEdge
                );

                if (adjacentVertex.id !== this.config.destinatonVertex.id) {
                    yield new UpdateVertexRenderingConfiguration(
                        adjacentVertex,
                        this.config.visitedVertex,
                    );
                }


                if (previousExplorationCost == undefined) {
                    vertexCost.set(adjacentVertex.id, explorationCost);

                    yield new UpdateVertexRenderingConfiguration(
                        adjacentVertex,
                        this.config.visitedVertex,
                    );

                    vertexLeftToExplore.push({
                        source: currentVertex,
                        vertex: adjacentVertex,
                        cost: explorationCost
                    })

                    vertexLeftToExplore.sort((first, second) => first.cost - second.cost)
                }

                else if (explorationCost < previousExplorationCost) {

                    vertexLeftToExplore = vertexLeftToExplore
                        .filter(x => x.vertex.id != adjacentVertex.id);

                    vertexLeftToExplore.push({
                        source: currentVertex,
                        vertex: adjacentVertex,
                        cost: explorationCost
                    })

                    vertexLeftToExplore.sort((first, second) => first.cost - second.cost)
                }
            }

            yield new PassiveCommand(
                { delay: 1 }
            );
        }


        while (backtrackingNode?.source != null) {
            const relevantEdge = this.config.graph.getEdge(backtrackingNode.source.vertex, backtrackingNode.vertex);

            yield new UpdateEdgeRenderingConfiguration(
                relevantEdge,
                this.config.pathEdge,
            );

            yield new UpdateVertexRenderingConfiguration(
                backtrackingNode.vertex,
                this.config.pathVertex,
            )

            yield new PassiveCommand(
                { delay: 1 }
            );

            backtrackingNode = backtrackingNode.source;
        }

        yield new UpdateVertexRenderingConfiguration(
            this.config.sourceVertex,
            this.config.pathVertex,
        )
    }
}
