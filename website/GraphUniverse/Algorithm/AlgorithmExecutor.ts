import { GraphAlgorithm } from './GraphAlgorithm';
import GraphUniverse from "../GraphUniverse";
import { sleep } from '@/utils/helpers';

export class GraphAlgorithmExecution {
    private universe : GraphUniverse;
    private isExecuting: boolean = false;
    private graphAlgorithm: GraphAlgorithm;

    constructor(graphAlgorithm: GraphAlgorithm, universe: GraphUniverse) {
        this.universe = universe;
        this.graphAlgorithm = graphAlgorithm;
    }

    async StartExecution() {
        let nextInstructions = this.graphAlgorithm.nexts();

        while (nextInstructions.length > 0) { 
            for (const instruction of nextInstructions) {
                instruction.execute(this.universe);
                
                if (instruction.cofiguration().delay === 0){
                    continue;
                }

                await sleep(instruction.cofiguration().delay * 100);
            }

            nextInstructions = this.graphAlgorithm.nexts();
        }
    }

    async PauseExecution() {

    }

    async MoveForward() {

    }

    async MoveBackward() {

    }
}