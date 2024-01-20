import { useEffect, useState } from "react";
import { FormProp } from "@/components/forms/FormProp";
import {
  BreathFirstSearchAlgorithm,
  DijkstraAlgorithm,
  DijkstraAlgorithmConfig,
} from "@/GraphUniverse/GraphAlgorithmExecution";
import { WellKnownGraphUniverseState } from "@/GraphUniverse/States/GraphUniverseState";
import { Button } from "../building-blocks/Button";
import { userReactiveRef } from "@/utils/hooks";

export type DijkstraAlgorithmForm = FormProp & {};

export function DijkstraAlgorithmForm({ universe }: DijkstraAlgorithmForm) {
  const [inputModeRef, setSelectionTarget] = userReactiveRef<
    keyof DijkstraAlgorithmConfig | null
  >(null);

  const [algorithmInput, setAlgorithmInput] = useState<
    Partial<DijkstraAlgorithmConfig>
  >({});

  // TODO: update this so it is less inefficient
  useEffect(() => {
    const cleanupVertexSelected = universe.listener.addEventListener(
      "vertexSelectedEvent",
      (event) => {
        const inputMode = inputModeRef.current;
        if (inputMode === null) {
          return;
        }

        setAlgorithmInput((currentSelection) => {
          var previousSelection = currentSelection[inputMode];

          if (previousSelection !== undefined && previousSelection["dijkstra-cleanup"] !== undefined){
            previousSelection["dijkstra-cleanup"]();
            delete previousSelection["dijkstra-cleanup"]
          }

          event.vertex["dijkstra-cleanup"]  ??= universe.updateVertexRendering(
            event.vertex,
            {
              innerColor: universe.configuration.secondaryAccent.light,
              borderColor: universe.configuration.secondaryAccent.dark,
            }
          );
          

          return {
            ...currentSelection,
            [inputMode]: event.vertex,
          };
        });

        setSelectionTarget(null);
      }
    );

    const cleanupStateUpdate = universe.listener.addEventListener(
      "stateUpdatedEvent",
      (event) => {
        if (
          event.currentState.wellKnownStateName() !==
          WellKnownGraphUniverseState.NodeSelection
        ) {
          setSelectionTarget(null);
        }
      }
    );

    return () => {
      cleanupVertexSelected();
      cleanupStateUpdate();
    };
  }, [universe, inputModeRef, setSelectionTarget]);

  const setInputMode = (inputMode: keyof DijkstraAlgorithmConfig) => {
    setSelectionTarget(inputMode);
    universe.setWellKnownState(WellKnownGraphUniverseState.NodeSelection);
  };

  const startAlgorithm = async () => {
    if (
      algorithmInput.sourceVertex === undefined ||
      algorithmInput.destinatonVertex == undefined
    ) {
      throw new Error(
        "You must select start and end before starting the algorithm"
      );
    }

    const newAlgorithmExecution = new DijkstraAlgorithm(universe, {
      sourceVertex: algorithmInput.sourceVertex,
      destinatonVertex: algorithmInput.destinatonVertex,
    });

    await newAlgorithmExecution.StartExecution();
  };

  return (
    <div className={"p-3 text-sm rounded bg-white shadow w-96 h-full"}>
      <form
        className="grid grid-cols-1 gap-y-2"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex justify-between gap-x-2">
          <Button
            active={inputModeRef.current === "sourceVertex"}
            onClick={() => setInputMode("sourceVertex")}
          >
            Source Vertex
          </Button>

          <input
            readOnly={true}
            className="w-9 text-right"
            value={algorithmInput.sourceVertex?.id ?? ""}
          ></input>
        </div>

        <div className="flex justify-between gap-x-2">
          <Button
            active={inputModeRef.current === "destinatonVertex"}
            onClick={() => setInputMode("destinatonVertex")}
          >
            Destination Vertex
          </Button>

          <input
            readOnly={true}
            className="w-9 text-right"
            value={algorithmInput.destinatonVertex?.id ?? ""}
          ></input>
        </div>

        <div className="p-2">
          Running Dijkstra algorithm from
          <span className={"bg-gray-100 border-b-2 px-0.5 mx-0.5"}>
            {algorithmInput.sourceVertex?.id ?? "_"}
          </span>{" "}
          to
          <span className={"bg-gray-100 border-b-2 px-0.5 mx-0.5"}>
            {algorithmInput.destinatonVertex?.id ?? "_"}
          </span>
        </div>

        <div className="flex  gap-3">
          <Button className="flex-1" onClickAsync={startAlgorithm}>
            Start
          </Button>

          <Button
            className="flex-1"
            onClick={() => universe.resetAllDisplayConfiguration()}
          >
            Reset
          </Button>
        </div>
      </form>

      <h1>Description</h1>

      <p>
        Dijkstra's algorithm (/ˈdaɪkstrəz/ DYKE-strəz) is an algorithm for
        finding the shortest paths between nodes in a weighted graph, which may
        represent, for example, road networks. It was conceived by computer
        scientist Edsger W. Dijkstra in 1956 and published three years
        later.[4][5][6] The algorithm exists in many variants. Dijkstra's
        original algorithm found the shortest path between two given nodes,[6]
        but a more common variant fixes a single node as the "source" node and
        finds shortest paths from the source to all other nodes in the graph,
        producing a shortest-path tree.
      </p>
    </div>
  );
}
