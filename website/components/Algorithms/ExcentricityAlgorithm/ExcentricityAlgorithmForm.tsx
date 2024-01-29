import { useState } from "react";
import { FormProp, useGraphUniverseForm } from "@/components/forms/FormProp";
import { Button } from "../../building-blocks/Button";
import { VertexInputButton } from "@/components/forms/VertexInputButton";
import { ExcentricityAlgorithm, ExcentricityAlgorithmConfig } from "./ExcentricityAlgorithm";
import { GraphAlgorithmExecution } from "@/GraphUniverse/Algorithm/AlgorithmExecutor";

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
          <Button className="flex-1 bg-green-300 text-green-950" onClickAsync={startAlgorithm}>
            Start
          </Button>

          <Button className="flex-1" onClick={() => universe.resetAllDisplayConfiguration()}>
            Reset
          </Button>
        </div>
      </form>

      <h1>Description</h1>

      <p>
        Dijkstra's algorithm (/ˈdaɪkstrəz/ DYKE-strəz) is an algorithm for finding the shortest
        paths between nodes in a weighted graph, which may represent, for example, road networks. It
        was conceived by computer scientist Edsger W. Dijkstra in 1956 and published three years
        later.[4][5][6] The algorithm exists in many variants. Dijkstra's original algorithm found
        the shortest path between two given nodes,[6] but a more common variant fixes a single node
        as the "source" node and finds shortest paths from the source to all other nodes in the
        graph, producing a shortest-path tree.
      </p>
    </div>
  );
}

export default ExcentricityAglgorithmForm;
