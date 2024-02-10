import { useEffect, useState } from "react";
import { FormProp, useGraphUniverseForm } from "@/components/forms/FormProp";
import { WellKnownGraphUniverseState } from "@/GraphUniverse/States/GraphUniverseState";
import { Button } from "../../building-blocks/Button";
import {
  BreathFirstSearchAlgorithm,
  BFSAlgorightmConfig,
} from "@/components/Algorithms/BreathFirstAlgorithm/BreathFirstSearchAlgorithm";
import { GraphAlgorithmExecution as GraphAlgorithmExecutor } from "@/GraphUniverse/Algorithm/AlgorithmExecutor";
import { userReactiveRef } from "@/utils/hooks";
import { VertexInputButton } from "@/components/forms/VertexInputButton";
import { Vertex } from "@/GraphUniverse/Graph/Graph";
import Markdown from "react-markdown";

export type BreathFirstSearchAgorithmForm = FormProp & {};

export function BreathFirstSearch({ universe }: BreathFirstSearchAgorithmForm) {
  const { registerGraphInput, formValues } = useGraphUniverseForm<BFSAlgorightmConfig>(universe);

  const startAlgorithm = async () => {
    if (formValues.sourceVertex === undefined) {
      throw new Error("You must select start and end before starting the algorithm");
    }

    const algorithm = new BreathFirstSearchAlgorithm(universe.graph, {
      exploredEdgeColor: universe.configuration.darkAccent.dark,
      exploredTextBackgroundColor: universe.configuration.darkAccent.light,
      sourceVertex: formValues.sourceVertex,
    });

    const newAlgorithmExecutor = new GraphAlgorithmExecutor(algorithm, universe);

    await newAlgorithmExecutor.StartExecution();
  };

  return (
    <div className={"h-full"}>
      <form className="grid grid-cols-1 gap-y-2" onSubmit={(e) => e.preventDefault()}>
        <div className="flex justify-between gap-x-2">
          <VertexInputButton {...registerGraphInput("sourceVertex")}>
            Start Vertex
          </VertexInputButton>

          <input
            readOnly={true}
            className="w-9 text-right bg-transparent"
            value={formValues.sourceVertex?.id ?? ""}
          ></input>
        </div>

        <div className="py-2 px-1">
          Running BFS centered on
          <span className={"bg-gray-100 border-b-2 px-0.5 mx-0.5"}>
            {formValues.sourceVertex?.id ?? "_"}
          </span>
        </div>

        <div className="flex  gap-3">
          <Button className="flex-1 bg-blue-500 text-white" onClickAsync={startAlgorithm}>
            Start
          </Button>

          <Button className="flex-1" onClick={() => universe.resetAllDisplayConfiguration()}>
            Reset
          </Button>
        </div>
      </form>

      <div className="separator"></div>

      <Markdown className={"markdown py-2"}>{markdown}</Markdown>
    </div>
  );
}

const markdown = `
# Introduction to Breadth-First Search (BFS)

Breadth-first search (BFS) is a fundamental algorithm used in computer science for traversing or searching tree or graph data structures. It's often compared to exploring a maze, where you systematically explore all possible paths to find the shortest one.

## How BFS Works

1. **Starting Point**: BFS begins at a designated starting point, typically called the "root" or "starting node."

2. **Exploring Nearby**: It explores all neighboring nodes of the starting point before moving on to deeper nodes.

3. **Expanding Horizontally**: BFS expands outwards horizontally, exploring all nodes at the current depth level before moving deeper.

4. **Queue**: To keep track of which nodes to explore next, BFS uses a data structure called a queue. Nodes are added to the queue as they are discovered and explored in the order they were added.

5. **Marking Visited Nodes**: To avoid revisiting nodes and getting stuck in infinite loops, BFS marks each node as visited after exploring it.

6. **Finding the Goal**: BFS continues this process until it either finds the goal (if searching for a specific node) or exhausts all possible paths.

## Applications

- **Shortest Path Finding**: BFS is commonly used to find the shortest path between two nodes in an unweighted graph.
- **Connectivity**: It can determine whether there is a path between two nodes.
- **Puzzle Solving**: BFS can be applied to solve puzzles and games where finding the shortest path is crucial.

BFS is a versatile algorithm with various applications in computer science and beyond. 

** **Generated with the help of Chat GPT** ** 

`;

export default BreathFirstSearch;
