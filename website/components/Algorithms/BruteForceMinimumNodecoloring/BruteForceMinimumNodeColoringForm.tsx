import { FormProp, useGraphUniverseForm } from "@/components/forms/FormProp";
import { Button } from "../../building-blocks/Button";
import { GraphAlgorithmExecution as GraphAlgorithmExecutor } from "@/GraphUniverse/Algorithm/AlgorithmExecutor";
import { BruteForceMinimumNodecoloring } from "./BruteForceMinimumNodeColoring";

export type BreathFirstSearchAgorithmForm = FormProp & {};

export function BruteForceMinimumNodeColoringForm({ universe }: BreathFirstSearchAgorithmForm) {
  const startAlgorithm = async () => {
    const algorithm = new BruteForceMinimumNodecoloring(universe.graph);

    const newAlgorithmExecutor = new GraphAlgorithmExecutor(algorithm, universe);

    await newAlgorithmExecutor.StartExecution();
  };

  return (
    <div className={"h-full"}>
      <form className="grid grid-cols-1 gap-y-2" onSubmit={(e) => e.preventDefault()}>
        <div className="p-2">
          Click start to generate of the following grpah minimum node coloring
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
