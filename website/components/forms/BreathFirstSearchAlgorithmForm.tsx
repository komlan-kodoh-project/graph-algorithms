import { useEffect, useState } from "react";
import { FormProp } from "@/components/forms/FormProp";
import {
  BreathFirstSearchAlgorithm,
  BreathFirstSearchAlgorithmConfig,
} from "@/GraphUniverse/GraphAlgorithmExecution";
import { WellKnownGraphUniverseState } from "@/GraphUniverse/States/GraphUniverseState";

export type BreathFirstSearchAgorithmForm = FormProp & {};

export function BreathFirstSearch({ universe }: BreathFirstSearchAgorithmForm) {
  const [selectionTarget, setSelectionTarget] = useState<
    keyof BreathFirstSearchAlgorithmConfig | null
  >(null);
  const [algorithmInput, setAlgorithmInput] = useState<
    Partial<BreathFirstSearchAlgorithmConfig>
  >({});

  // TODO: update this so it is less inefficient
  useEffect(() => {
    const cleanup = universe.listener.addEventListener(
      "vertexSelectedEvent",
      (event) => {
        if (selectionTarget === null) {
          return;
        }

        setAlgorithmInput((currentSelection) => ({
          ...currentSelection,
          [selectionTarget]: event.vertex,
        }));
      }
    );

    return () => {
      cleanup();
    };
  }, [selectionTarget, universe.listener]);

  const setInputMode = (inputMode: keyof BreathFirstSearchAlgorithmConfig) => {
    setSelectionTarget(inputMode);
    universe.setWellKnownState(WellKnownGraphUniverseState.NodeSelection);
  };

  const startAlgorithm = async () => {
    if (algorithmInput.sourceVertex === undefined) {
      throw new Error(
        "You must select start and end before starting the algorithm"
      );
    }

    const newAlgorithmExecution = new BreathFirstSearchAlgorithm(universe, {
      sourceVertex: algorithmInput.sourceVertex,
    });

    await newAlgorithmExecution.StartExecution();
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div
        className={
          "grid grid-cols-1 gap-y-2 p-3 text-sm rounded bg-white shadow"
        }
      >
        <div className="flex justify-between gap-x-2">
          <button
            className="h-full p-2 transition duration-250 rounded shadow"
            onClick={() => setInputMode("sourceVertex")}
          >
            Source Vertex
          </button>

          <input
            readOnly={true}
            className="w-9 text-right"
            value={algorithmInput.sourceVertex?.id ?? ""}
          ></input>
        </div>

        <div className="p-2 text-gray-700">
          Running breath first search algorithm from
          <span className={"bg-gray-100 border-b-2 px-0.5 mx-0.5"}>
            {algorithmInput.sourceVertex?.id ?? "_"}
          </span>
        </div>
      </div>

      <div className="flex justify-center gap-x-2 pt-3">
        <button
          onClick={() => startAlgorithm()}
          className="h-full p-2 transition duration-250 rounded bg-white shadow"
        >
          Start
        </button>
      </div>
    </form>
  );
}
