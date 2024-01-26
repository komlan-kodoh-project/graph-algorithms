import { DefaultCommandConfiguration } from './../AlgorithmCommands';
import GraphUniverse from "@/GraphUniverse/GraphUniverse";
import { AlgorithmCommand, ComandConfiguraiton } from "../AlgorithmCommands";
import { Vertex } from "@/GraphUniverse/Graph/Graph";
import { VertexDisplayConfiguration } from "@/GraphUniverse/Entity/VertexEntity";


export class UpdateVertexRenderingConfiguration implements AlgorithmCommand {
    public delay: number = 1;

    private configuraton: ComandConfiguraiton;
    private targetEdge: Vertex;
    private forwardDisplayConfiguration: Partial<VertexDisplayConfiguration>;

    private rollbackCommand?: () => void;

    constructor(
        targetVertex: Vertex,
        newDisplayConfiguration: Partial<VertexDisplayConfiguration>,
        configuration: Partial<ComandConfiguraiton> = {},
    ) {
        this.targetEdge = targetVertex;
        this.forwardDisplayConfiguration = newDisplayConfiguration;
        this.configuraton = { ...DefaultCommandConfiguration, ...configuration };
    }

    cofiguration(): ComandConfiguraiton {
        return this.configuraton;
    }

    execute(universe: GraphUniverse): void {
        this.rollbackCommand = universe.updateVertexRendering(this.targetEdge, this.forwardDisplayConfiguration);
    }

    rollBack(): void {
        if (!this.rollbackCommand) {
            throw new Error("Cannot roll back edge rendering update because it has not been forward applied yet");
        }

        this.rollbackCommand();
    }

}