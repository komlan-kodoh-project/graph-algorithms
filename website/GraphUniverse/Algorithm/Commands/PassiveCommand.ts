import { AnyValue } from "@/utils/types";
import { AlgorithmCommand, ComandConfiguraiton, DefaultCommandConfiguration } from "../AlgorithmCommands";

export class PassiveCommand implements AlgorithmCommand<AnyValue, AnyValue> {
    private configuraton : ComandConfiguraiton;  

    constructor(
        configuration: Partial<ComandConfiguraiton>,
    ) {
        this.configuraton = {...DefaultCommandConfiguration, ...configuration};
    }

    cofiguration(): ComandConfiguraiton {
        return this.configuraton;
    }

    execute(): void {
        // This command executes nothing 
    }

    rollBack(): void {
        // This command executes nothing
    }
}