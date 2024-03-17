"use client";

import Markdown from "react-markdown";
import { VertexInputButton } from "@/components/forms/VertexInputButton";
import { DijkstraAlgorithm, DijkstraAlgorithmConfig } from "./DijkstraAlgorithm";
import { GraphAlgorithmBuilder, useGraphUniverseForm } from "@/components/forms/FormProp";
import { Button } from "@/components/building-blocks/Button";
import { Drawer } from "@/components/Drawer/Drawer";
import remarkGfm from "remark-gfm";
import  Head from "next/head";

const buildDijkstraAlgorithmExecution: GraphAlgorithmBuilder<
  DijkstraAlgorithmConfig,
  DijkstraAlgorithm
> = (config, universe) => {
  return new DijkstraAlgorithm({
    graph: universe.graph,
    sourceVertex: config.sourceVertex,
    destinatonVertex: config.destinatonVertex,

    exploredEdge: {
      edgeColor: universe.configuration.darkAccent.light,
      labelBackground: universe.configuration.darkAccent.dark,
    },
    exploredVertex: {
      borderColor: universe.configuration.darkAccent.light,
      innerColor: universe.configuration.darkAccent.dark,
    },

    visitedEdge: {
      edgeColor: universe.configuration.primaryAccent.light,
      labelBackground: universe.configuration.primaryAccent.dark,
    },

    visitedVertex: {
      borderColor: universe.configuration.primaryAccent.light,
      innerColor: universe.configuration.primaryAccent.dark,
    },

    pathEdge: {
      edgeColor: universe.configuration.secondaryAccent.dark,
      labelBackground: universe.configuration.secondaryAccent.light,
    },
    pathVertex: {
      borderColor: universe.configuration.secondaryAccent.dark,
      innerColor: universe.configuration.secondaryAccent.light,
    },
  });
};

export default function DijkstraAlgorithmForm() {
  const { registerGraphInput, formValues, execution } = useGraphUniverseForm<
    DijkstraAlgorithmConfig,
    DijkstraAlgorithm
  >(buildDijkstraAlgorithmExecution);

  return (
    <>
      <Head>
        <title>Find Shortest Path in Custom Graph | Dijkstra </title>
        <meta
          name="description"
          content="Create a graph using the graph editor and find the shortest path from two point in the graph using the Dijkstra algorithm. With detail step by step explanation and algorithms details."
          key="desc"
        />
      </Head>
      <div className={"h-full"}>
        <form className="grid grid-cols-1 gap-y-2" onSubmit={(e) => e.preventDefault()}>
          <div className="flex justify-between gap-x-2">
            <VertexInputButton {...registerGraphInput("sourceVertex")}>
              Source Vertex
            </VertexInputButton>

            <input
              readOnly={true}
              className="w-9 text-right bg-transparent"
              value={formValues.sourceVertex?.id ?? ""}
            ></input>
          </div>

          <div className="flex justify-between gap-x-2">
            <VertexInputButton {...registerGraphInput("destinatonVertex")}>
              Destination Vertex
            </VertexInputButton>

            <input
              readOnly={true}
              className="w-9 text-right bg-transparent"
              value={formValues.destinatonVertex?.id ?? ""}
            ></input>
          </div>

          <div className="p-2">
            Running Dijkstra algorithm from
            <span className={"bg-gray-100 border-b-2 px-0.5 mx-0.5"}>
              {formValues.sourceVertex?.id ?? "_"}
            </span>
            to
            <span className={"bg-gray-100 border-b-2 px-0.5 mx-0.5"}>
              {formValues.destinatonVertex?.id ?? "_"}
            </span>
          </div>

          <div className="flex  gap-3">
            <Button
              className="flex-1 bg-blue-500 text-white"
              active={execution.isExecuting}
              onClick={execution.start}
            >
              Start
            </Button>

            <Button
              active={execution.isExecuting}
              className="flex-1"
              onClick={execution.moveForward}
            >
              Move Forward
            </Button>

            <Button className="flex-1" onClick={execution.reset}>
              Reset
            </Button>
          </div>
        </form>

        <div className="mt-2">
          <Drawer title="Execution Summary">
            {execution.explanation ? (
              <Markdown className={"markdown"} remarkPlugins={[remarkGfm]}>
                {execution.explanation}
              </Markdown>
            ) : (
              <div className="flex items-center justify-center h-60">
                <p className="text-center max-w-64 border p-4">
                  Click move forward to enable execution summary
                </p>
              </div>
            )}
          </Drawer>
        </div>

        <div className="separator mt-4 mb-2"></div>

        <Markdown className={"markdown py-2"} remarkPlugins={[remarkGfm]}>
          {markdown}
        </Markdown>
      </div>
    </>
  );
}

const markdown = `
# Introduction to Dijkstra's Algorithm

Dijkstra's algorithm is a fundamental algorithm used in computer science for finding the shortest paths between nodes in a weighted graph. It's named after its inventor, Dutch computer scientist Edsger W. Dijkstra, and is particularly useful in scenarios where finding the shortest path is crucial.

## How Dijkstra's Algorithm Works

1. **Starting Point**: Dijkstra's algorithm begins at a designated starting point, typically called the "source" node.

2. **Initializing Distances**: It initializes the distance to all nodes from the source node to infinity, except for the source node itself, which is set to zero.

3. **Exploring Neighbors**: It systematically explores the neighboring nodes of the current node. For each neighboring node, it calculates the distance from the source node through the current node.

4. **Updating Distances**: If the newly calculated distance to a node is shorter than the previously known distance, Dijkstra's algorithm updates the distance and records the current node as the "previous node" for the shortest path.

5. **Priority Queue**: To efficiently select the next node to explore, Dijkstra's algorithm typically uses a priority queue. Nodes are prioritized based on their current distance from the source node.

6. **Visiting Nodes**: Dijkstra's algorithm continues this process, visiting nodes and updating distances until it has visited all reachable nodes or until the destination node is reached.

7. **Backtracking**: After reaching the destination node, Dijkstra's algorithm backtracks from the destination node to the source node using the recorded "previous node" information, thereby determining the shortest path.

## Applications

- **Routing Algorithms**: Dijkstra's algorithm is widely used in network routing protocols to find the shortest path between nodes in computer networks.
- **Transportation Networks**: It can optimize transportation routes by finding the shortest path between locations, considering factors such as distance or time.
- **Robotics and Autonomous Vehicles**: Dijkstra's algorithm can assist in path planning for robots and autonomous vehicles, ensuring efficient and safe navigation.

Dijkstra's algorithm is a powerful tool with various applications in computer science, transportation, and engineering.

** **Generated with the help of ChatGPT** **
`;
