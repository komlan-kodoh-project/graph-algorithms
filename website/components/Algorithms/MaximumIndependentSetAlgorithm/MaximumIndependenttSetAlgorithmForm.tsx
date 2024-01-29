import { useState } from "react";
import { FormProp, useGraphUniverseForm } from "@/components/forms/FormProp";
import { Button } from "../../building-blocks/Button";
import { VertexInputButton } from "@/components/forms/VertexInputButton";
import {
  MaximumIndependentSetAlgorithm,
  MaximumIndependentSetAlgorithmConfig,
} from "./MaximumIndependentSetAlgorithm";
import { GraphAlgorithmExecution } from "@/GraphUniverse/Algorithm/AlgorithmExecutor";

export type DijkstraAlgorithmForm = FormProp & {};

export function MaximumIndependentSetAlgorithmForm({ universe }: DijkstraAlgorithmForm) {
  const { registerGraphInput, formValues } =
    useGraphUniverseForm<MaximumIndependentSetAlgorithmConfig>(universe);

  const startAlgorithm = async () => {
    const newAlgorithmExecution = new MaximumIndependentSetAlgorithm({
      graph: universe.graph,
      setVertexStyle: {
        innerColor: universe.configuration.darkAccent.light,
        borderColor: universe.configuration.darkAccent.dark,
      },
    });

    const newAlgorithmExecutor = new GraphAlgorithmExecution(newAlgorithmExecution, universe);

    await newAlgorithmExecutor.StartExecution();
  };

  return (
    <div className={"h-full"}>
      <form className="grid grid-cols-1 gap-y-2" onSubmit={(e) => e.preventDefault()}>
        <div className="p-2">Reveal maximum independent set</div>

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

export default MaximumIndependentSetAlgorithmForm;
