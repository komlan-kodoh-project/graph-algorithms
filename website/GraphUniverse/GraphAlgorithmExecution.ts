import { sleep } from '@/utils/helpers';
import GraphUniverse from './GraphUniverse';
import { Edge, GetOtherEnd, Vertex } from './Graph/Graph';

export type GraphAlgorithmExecutionAction = {
    actionType: string
}

export interface GraphAlgorithmExecution {
    done: boolean;
    StartExecution(): Promise<void>;
}

export type DijkstraAlgorithmConfig = {
    sourceVertex: Vertex<object>,
    destinatonVertex: Vertex<object>
}

export type BreathFirstSearchAlgorithmConfig = {
    sourceVertex: Vertex<object>
}


export type ColorEdgeCommand = {
    commandType: "color-edge",
    targetEdge: Edge<any, any>,
    color: string,
    duration: number
}

export type ColorVertexCommand = {
    commandType: "color-edge",
    targetEdge: Edge<any, any>,
    color: string,
    duration: number
}

export type SetVertexLabel = {
    commandType: "set-vertex-label",
    targetVertex: Vertex<any>,
    lable: "string",
    duration: number
}

export type AlgorithExecutionCommand = ColorEdgeCommand | ColorVertexCommand

export class BreathFirstSearchAlgorithm implements GraphAlgorithmExecution {
    done: boolean = false;
    constructor(private universe: GraphUniverse<object, object>, private config: BreathFirstSearchAlgorithmConfig) { }

    async StartExecution() {
        const visitedVertexId = new Set<number>();
        const nextVertices: Vertex<any>[] = [this.config.sourceVertex];
        let nextEdges: Edge<any, any>[] = [];

        let explorationLevel = 0;

        while (nextVertices.length != 0) {
            for (const edge of nextEdges) {
                this.universe.updateEdgeRendering(
                    edge,
                    {
                        edgeColor: "#cd7ca2",
                    }
                )
            }

            nextEdges = [];
            const length = nextVertices.length;

            for (let i = 0; i < length; i++) {

                var currentVertex = nextVertices.shift()!;

                visitedVertexId.add(currentVertex.id);

                this.universe.updateVertexRendering(
                    currentVertex,
                    {
                        edgeColor: "#cd7ca2",
                        innerColor: "#f0bbe5",
                        underLabelDisplayConfiguration: () => `${explorationLevel}`,
                    }
                );

                const allEdges = this
                    .universe
                    .graph
                    .getNeighborEdges(currentVertex);

                const allNeighbors = this
                    .universe
                    .graph
                    .getNeighbors(currentVertex);

                for (const vertex of allNeighbors) {
                    if (!visitedVertexId.has(vertex.id)) {
                        nextVertices.push(vertex);
                    }
                }

                nextEdges.push.apply(nextEdges, allEdges);
            }

            await sleep(100);
            console.log(nextVertices);
            explorationLevel++;
        }
    }
}


type DijkstraNode = {
    vertex: Vertex<any>,
    cost: number
}


export class DijkstraAlgorithm implements GraphAlgorithmExecution {
    done: boolean = false;

    constructor(private universe: GraphUniverse<object, object>, private config: DijkstraAlgorithmConfig) { }

    async StartExecution() {
        const vertexCost = new Map<number, number>();
        const visitedVertexId = new Set<number>();

        let vertexLeftToExplore: DijkstraNode[] = [{
            vertex: this.config.sourceVertex,
            cost: 0
        }];

        this.universe.updateVertexRendering(
            this.config.sourceVertex,
            {
                edgeColor: "#cd7ca2",
                innerColor: "#f0bbe5",
                underLabelDisplayConfiguration: () => `Source : ${0} from self`,
            }
        );

        await sleep(1000);

        while (vertexLeftToExplore.length !== 0) {
            const currentVertex = vertexLeftToExplore.shift()!;

            if (currentVertex.vertex.id === this.config.destinatonVertex.id) {
                this.universe.updateVertexRendering(
                    currentVertex.vertex,
                    {
                        edgeColor: "#cd7ca2",
                        innerColor: "green",
                        underLabelDisplayConfiguration: () => `Destination : ${currentVertex.cost} from ${this.config.sourceVertex.id}`,
                    }
                );
            }

            this.universe.updateVertexRendering(
                currentVertex.vertex,
                {
                    edgeColor: "#cd7ca2",
                    innerColor: "black",
                }
            );

            visitedVertexId.add(currentVertex.vertex.id);

            const vertexEdges = this.universe.graph.getNeighborEdges(currentVertex.vertex);


            for (const edge of vertexEdges) {
                const adjacentVertex = GetOtherEnd(edge, currentVertex.vertex);

                if (visitedVertexId.has(adjacentVertex.id)) {
                    continue;
                }

                const explorationCost = edge.weight + currentVertex.cost;

                const previousExplorationCost = vertexCost.get(adjacentVertex.id);

                this.universe.updateEdgeRendering(
                    edge,
                    {
                        edgeColor: "#cd7ca2",
                    }
                );

                this.universe.updateVertexRendering(
                    adjacentVertex,
                    {
                        edgeColor: "#cd7ca2",
                        innerColor: "#f0bbe5",
                        underLabelDisplayConfiguration: () => `${explorationCost} from ${currentVertex.vertex.id}`,
                    }
                );

                if (previousExplorationCost == undefined) {
                    vertexCost.set(adjacentVertex.id, explorationCost);

                    this.universe.updateVertexRendering(
                        adjacentVertex,
                        {
                            underLabelDisplayConfiguration: () => `${explorationCost} from ${currentVertex.vertex.id}`,
                        }
                    );

                    vertexLeftToExplore.push({
                        vertex: adjacentVertex,
                        cost: explorationCost
                    })

                    vertexLeftToExplore.sort((first, second) => first.cost - second.cost)
                }

                else if (explorationCost < previousExplorationCost) {

                    vertexLeftToExplore = vertexLeftToExplore
                        .filter(x => x.vertex.id != adjacentVertex.id);

                    vertexLeftToExplore.push({
                        vertex: adjacentVertex,
                        cost: explorationCost
                    })

                    vertexLeftToExplore.sort((first, second) => first.cost - second.cost)

                    this.universe.updateVertexRendering(
                        adjacentVertex,
                        {
                            underLabelDisplayConfiguration: () => `${explorationCost} from ${currentVertex.vertex.id}`,
                        }
                    );
                }

                console.log(JSON.stringify(vertexLeftToExplore.map(x => x.vertex.id)));
            }

            await sleep(100);
        }
    }
}





