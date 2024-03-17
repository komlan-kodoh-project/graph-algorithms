import { GraphAlgorithm, OperationSummary } from "./GraphAlgorithm";
import GraphUniverse from "../GraphUniverse";
import { sleep } from "@/utils/helpers";
import { AlgorithmCommand } from "./AlgorithmCommands";

export class GraphAlgorithmExecution {
  private universe: GraphUniverse;
  private isExecuting: boolean = false;
  private executionCancelRequested: boolean = false;
  private algorithmSteps: IterableIterator<AlgorithmCommand>;

  private pauseRequestCallBack: (() => void) | null = null;

  constructor(graphAlgorithm: GraphAlgorithm, universe: GraphUniverse) {
    this.universe = universe;
    this.algorithmSteps = GraphAlgorithmExecution.getAlgorithmIterator(graphAlgorithm);
  }

  private static *getAlgorithmIterator(
    graphAlgorithm: GraphAlgorithm
  ): IterableIterator<AlgorithmCommand> {
    let nextInstructions = graphAlgorithm.nexts();

    while (nextInstructions.length > 0) {
      for (const instruction of nextInstructions) {
        yield instruction;
      }

      nextInstructions = graphAlgorithm.nexts();
    }
  }

  private async ExecuteNext(applyDelay: boolean): Promise<AlgorithmCommand | null> {
    const { value: instruction, done } = this.algorithmSteps.next();

    if (done) {
      return null;
    }

    instruction.execute(this.universe);

    if (instruction.cofiguration().delay !== 0 && applyDelay) {
      await sleep(instruction.cofiguration().delay * 100);
    }

    return instruction;
  }

  async StartExecution() {
    this.isExecuting = true;

    while (await this.ExecuteNext(true)) {
      if (this.executionCancelRequested) {
        this.isExecuting = false;
        this.executionCancelRequested = false;

        this.pauseRequestCallBack && this.pauseRequestCallBack();
        break;
      }
    }

    this.isExecuting = false;
  }

  async PauseExecution() {
    this.executionCancelRequested = true;

    return new Promise<void>((resolve) => {
      this.pauseRequestCallBack = resolve;
    });
  }

  async MoveForward(): Promise<OperationSummary> {
    this.isExecuting = true;

    while (true) {
      const instruction = await this.ExecuteNext(true);

      if (instruction === null) {
        this.isExecuting = false;

        return { markdown: "Execution completed" };
      }

      if (instruction?.cofiguration().isStep) {
        return { markdown: instruction.cofiguration().explanation ?? "" };
      }

      if (this.executionCancelRequested) {
        this.isExecuting = false;
        this.executionCancelRequested = false;

        this.pauseRequestCallBack && this.pauseRequestCallBack();
        return { markdown: "Execution paused" };
      }
    }
  }

  async MoveBackward() {
    throw new Error("Not implemented");
  }
}
