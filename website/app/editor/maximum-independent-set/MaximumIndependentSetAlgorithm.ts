import { GraphAlgorithm } from "@/GraphUniverse/Algorithm/GraphAlgorithm";
import { AlgorithmCommand } from "@/GraphUniverse/Algorithm/AlgorithmCommands";
import { Vertex } from "@/GraphUniverse/Graph/Graph";
import { EdgeDisplayConfiguration } from '@/GraphUniverse/Entity/EdgeEntity';
import { VertexDisplayConfiguration } from '@/GraphUniverse/Entity/VertexEntity';
import SimpleGraph from '@/GraphUniverse/Graph/SimpleGraph/SimpleGraph';
import { ExhaustiveMaximumIndependentSet, find_maximum_independent_sets } from 'wasm-lib';
import { UpdateVertexRenderingConfiguration } from "@/GraphUniverse/Algorithm/Commands/UpdateVertexRenderingConfiguration";
import { ColorGenerator } from "@/utils/ColorGenerator";
import { PassiveCommand } from "@/GraphUniverse/Algorithm/Commands/PassiveCommand";


export type MaximumIndependentSetAlgorithmConfig = {
    graph: SimpleGraph,
    setVertexStyle: Partial<VertexDisplayConfiguration>,
}

export class MaximumIndependentSetAlgorithm implements GraphAlgorithm {
    private index: number = 0;
    private previousCommand: AlgorithmCommand[]  = [];
    private config: MaximumIndependentSetAlgorithmConfig;
    private result: ExhaustiveMaximumIndependentSet | null = null;

    constructor(config: MaximumIndependentSetAlgorithmConfig) {
        this.config = config;
    }

    nexts(): AlgorithmCommand[] {
        if (this.result === null) {
            this.result = find_maximum_independent_sets(this.config.graph.getWasmGraph());
        }

        if (this.index >= this.result.len()) {
            return [];
        }

        const combination = this.result.get_node_coloring(this.index);
        this.index++;

        this.UndoPreviousCommand();
        this.previousCommand = this.GenerateAlgorithmComand(combination);

        return this.previousCommand;
    }

    private UndoPreviousCommand() {
        for (const command of this.previousCommand){
            command.rollBack();
        }
    }

    private GenerateAlgorithmComand(independentSet: Uint32Array): AlgorithmCommand[] {
        const commands = new Array<AlgorithmCommand>();

        for (const value of independentSet.values()) {
            const vertex = this.config.graph.getVertex(value);
            commands.push(
                new UpdateVertexRenderingConfiguration(vertex, this.config.setVertexStyle)
            );
        }

        commands.push(new PassiveCommand({ delay: 10 }));

        return commands;
    }

}
