import { useState } from "react";
import { FormProp, useGraphUniverseForm } from "@/components/forms/FormProp";
import { Button } from "../../building-blocks/Button";
import { VertexInputButton } from "@/components/forms/VertexInputButton";
import { ExcentricityAlgorithm, ExcentricityAlgorithmConfig } from "./ExcentricityAlgorithm";
import { GraphAlgorithmExecution } from "@/GraphUniverse/Algorithm/AlgorithmExecutor";
import Markdown from "react-markdown";

export type DijkstraAlgorithmForm = FormProp & {};

export function ExcentricityAglgorithmForm({ universe }: DijkstraAlgorithmForm) {
  const { registerGraphInput, formValues } =
    useGraphUniverseForm<ExcentricityAlgorithmConfig>(universe);

  const startAlgorithm = async () => {
    if (formValues.sourceVertex === undefined) {
      throw new Error("You must select start and end before starting the algorithm");
    }

    const newAlgorithmExecution = new ExcentricityAlgorithm({
      graph: universe.graph,

      sourceVertex: formValues.sourceVertex,

      pathEdge: {
        edgeColor: universe.configuration.secondaryAccent.dark,
        labelBackground: universe.configuration.secondaryAccent.light,
      },
      pathVertex: {
        borderColor: universe.configuration.secondaryAccent.dark,
        innerColor: universe.configuration.secondaryAccent.light,
      },
    });

    const newAlgorithmExecutor = new GraphAlgorithmExecution(newAlgorithmExecution, universe);

    await newAlgorithmExecutor.StartExecution();
  };

  return (
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

        <div className="p-2">
          Finding node excentricity of node
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
# Understanding Vertex Eccentricity

Vertex eccentricity is a concept in graph theory that measures the maximum distance from a given vertex to all other vertices in the graph. It provides valuable insights into the centrality and reachability of individual vertices within a graph.

## The Significance of Vertex Eccentricity

In graph theory, vertex eccentricity serves as a fundamental metric for understanding the structure and connectivity of graphs. It helps identify central vertices, which play crucial roles in communication, transportation, and information flow within networks. Additionally, vertex eccentricity is instrumental in various graph algorithms and can aid in network analysis, community detection, and pathfinding.

## How Vertex Eccentricity is Calculated

1. **Initialization**: The algorithm initializes the eccentricity of each vertex to zero.

2. **Exploration**: For each vertex in the graph, the algorithm systematically explores all possible paths to other vertices, calculating the distance from the current vertex to each reachable vertex.

3. **Updating Eccentricity**: The algorithm updates the eccentricity of the current vertex to the maximum distance found during the exploration process.

4. **Repeat**: Steps 2 and 3 are repeated for every vertex in the graph until the eccentricity of all vertices is determined.

## Applications of Vertex Eccentricity

- **Centrality Analysis**: Vertex eccentricity helps identify central vertices, which have high eccentricity values and are crucial for maintaining connectivity within the graph.
- **Network Routing**: It aids in determining efficient routing paths within networks by identifying vertices with low eccentricity, which serve as effective intermediaries.
- **Community Detection**: Vertex eccentricity can assist in detecting communities or clusters within a graph, as vertices with similar eccentricity values often belong to the same structural group.

## Conclusion

Vertex eccentricity provides valuable insights into the structural characteristics of graphs and plays a vital role in various graph analysis tasks. By understanding the eccentricity of vertices, researchers and practitioners can gain deeper insights into the connectivity, centrality, and resilience of networks, ultimately facilitating more informed decision-making and efficient network management.

** **Crafted with insights from ChatGPT** **
`;

export default ExcentricityAglgorithmForm;
