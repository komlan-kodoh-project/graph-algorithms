import { sleep } from "@/utils/helpers";
import GraphUniverse from "../../../GraphUniverse/GraphUniverse";
import { GraphAlgorithm } from "../../../GraphUniverse/Algorithm/GraphAlgorithm";
import { AlgorithmCommand } from "../../../GraphUniverse/Algorithm/AlgorithmCommands";
import { UpdateEdgeRenderingConfiguration } from "../../../GraphUniverse/Algorithm/Commands/UpdateEdgeRenderingConfiguration";
import { UpdateVertexRenderingConfiguration } from "../../../GraphUniverse/Algorithm/Commands/UpdateVertexRenderingConfiguration";
import { Edge, GetOtherEnd, Vertex } from "../../../GraphUniverse/Graph/Graph";
import SimpleGraph from "../../../GraphUniverse/Graph/SimpleGraph/SimpleGraph";
import { PassiveCommand } from "@/GraphUniverse/Algorithm/Commands/PassiveCommand";
import { ColorGenerator } from "@/utils/ColorGenerator";

export type BFSAlgorightmConfig = {
    sourceVertex: Vertex;
    exploredEdgeColor: string,
    exploredTextBackgroundColor: string,
}


export class BreathFirstSearchAlgorithm implements GraphAlgorithm {
    private visitedVertexId = new Set<number>();
    private randomColorGenerator = new ColorGenerator();
    private nextVertices: Vertex<any>[] = [this.config.sourceVertex];

    private commandTracker: AlgorithmCommand[] = [];

    constructor(private graph: SimpleGraph, private config: BFSAlgorightmConfig) { }

    nexts(): AlgorithmCommand[] {
        this.StartExecution();
        const commands = this.commandTracker;
        this.commandTracker = [];

        return commands;
    }

    async StartExecution() {
        let levelColor = this.randomColorGenerator.generateColor();

        if (this.nextVertices.length != 0) {
            const length = this.nextVertices.length;
            const currentBatch = this.nextVertices.map(x => x.id);

            for (let i = 0; i < length; i++) {

                var currentVertex = this.nextVertices.shift()!;

                this.visitedVertexId.add(currentVertex.id);

                this.commandTracker.push(
                    new UpdateVertexRenderingConfiguration(
                        currentVertex,
                        {
                            borderColor: levelColor,
                            innerColor: "#1c1c1c",
                        }
                    )
                );

                const allEdges = this.graph
                    .getNeighborEdges(currentVertex);

                for (const edge of allEdges) {
                    const otherEnd = GetOtherEnd(edge, currentVertex);

                    if (currentBatch.includes(otherEnd.id)) {
                        this.commandTracker.push(
                            new UpdateEdgeRenderingConfiguration(
                                edge,
                                {
                                    edgeColor: levelColor,
                                    labelBackground: "#1c1c1c",
                                }
                            )
                        );
                    }

                    else if (!this.visitedVertexId.has(otherEnd.id)) {
                        this.commandTracker.push(
                            new UpdateEdgeRenderingConfiguration(
                                edge,
                                {
                                    edgeColor: levelColor,
                                    labelBackground: "#1c1c1c",
                                }
                            )
                        );

                        this.nextVertices.push(otherEnd);
                    }
                }
            }

            this.commandTracker.push(
                new PassiveCommand(
                    { delay: 1 }
                )
            );
        }
    }
}