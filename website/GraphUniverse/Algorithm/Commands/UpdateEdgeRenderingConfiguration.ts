import { DefaultCommandConfiguration } from './../AlgorithmCommands';
import { Edge } from "@/GraphUniverse/Graph/Graph";
import { AlgorithmCommand, ComandConfiguraiton } from "../AlgorithmCommands";
import GraphUniverse from "@/GraphUniverse/GraphUniverse";
import { EdgeDisplayConfiguration } from "@/GraphUniverse/Entity/EdgeEntity";


export class UpdateEdgeRenderingConfiguration implements AlgorithmCommand<any, any> {
    private configuraton : ComandConfiguraiton;  
    private targetEdge: Edge;
    private forwardDisplayConfiguration: Partial<EdgeDisplayConfiguration>;

    private rollbackCommand?: () => void;

    constructor(
        targetVertex: Edge,
        newDisplayConfiguration: Partial<EdgeDisplayConfiguration>,
        configuration: Partial<ComandConfiguraiton> = {},
    ) {
        this.targetEdge = targetVertex;
        this.forwardDisplayConfiguration = newDisplayConfiguration;
        this.configuraton = {...DefaultCommandConfiguration, ...configuration};
    }

    cofiguration(): ComandConfiguraiton {
        return this.configuraton;
    }

    execute(universe: GraphUniverse): void {
        this.rollbackCommand = universe.updateEdgeRendering(this.targetEdge, this.forwardDisplayConfiguration);
    }

    rollBack(): void {
        if (!this.rollbackCommand){
            throw new Error("Cannot roll back edge rendering update because it has not been forward applied yet");
        }
        this.rollbackCommand();
    }
}
