import { GraphAlgorithmExecution } from "@/GraphUniverse/Algorithm/AlgorithmExecutor";
import { GraphAlgorithm } from "@/GraphUniverse/Algorithm/GraphAlgorithm";
import { Graph } from "@/GraphUniverse/Graph/Graph";
import GraphUniverse from "@/GraphUniverse/GraphUniverse";
import { userReactiveRef } from "@/utils/hooks";
import { createContext, useContext, useMemo, useRef, useState } from "react";
import { GraphUniverseContext } from "../GraphUniverseContext";

export type FormProp = Readonly<{
  universe: GraphUniverse;
}>;

export type GraphUniverseFormContext = {
  universe: GraphUniverse;
};

export type GraphAlgorithmBuilder<TConfig, TAlgorithm extends GraphAlgorithm> = (
  config: TConfig,
  universe: GraphUniverse
) => TAlgorithm;

export function useGraphUniverseForm<TConfig, TAlgorithm extends GraphAlgorithm>(
  algorithmBuilder: GraphAlgorithmBuilder<TConfig, TAlgorithm>
) {
  const { universe, hasInitiated } = useContext(GraphUniverseContext);

  const [explanation, setExplanation] = useState<string>("");
  const [formValues, setFormValues] = useState<Partial<TConfig>>({});

  const algorithmExecution = useRef<GraphAlgorithmExecution | null>(null);
  const [inputModeRef, setInputMode] = userReactiveRef<keyof TConfig | null>(null);

  const [isExecuting, setIsExecuting] = useState(false);

  function registerGraphInput<K extends keyof TConfig>(key: K) {
    return {
      active: key === inputModeRef.current,
      universe: hasInitiated ? universe() : ({} as any),
      formValues,
      type: key,
      setInputMode,
      setFormValues,
      updateFormInputMode: (mode: K | null) => setInputMode(mode),
      updateFormInput: (data: TConfig[K]) =>
        setFormValues((previous) => ({
          ...previous,
          pen: 2,
          [key]: data,
        })),
    };
  }

  function ensureAlgorithnExecutionExists(): void {
    if (algorithmExecution.current !== null) {
      return;
    }

    // Reset all colors of the rendering before starting the algorithm
    universe().resetAllDisplayConfiguration();

    const newAlgorithm = algorithmBuilder(formValues as TConfig, universe());
    algorithmExecution.current = new GraphAlgorithmExecution(newAlgorithm, universe());
  }

  function startExecution(): void {
    ensureAlgorithnExecutionExists();

    setIsExecuting(true);
    algorithmExecution.current!.StartExecution().then(() => setIsExecuting(false));
  }

  function moveExecutionForward(): void {
    ensureAlgorithnExecutionExists();

    setIsExecuting(true);
    algorithmExecution.current!.MoveForward().then(result => {
      setIsExecuting(false);
      setExplanation(result.markdown ?? "");
    });
  }

  function resetUniverse(): void {
    universe().resetAllDisplayConfiguration();
    algorithmExecution.current = null;
  }

  return {
    formValues,
    registerGraphInput,
    execution: {
      isExecuting,
      explanation,
      start: startExecution,
      reset: resetUniverse,
      moveForward: moveExecutionForward,
    },
  };
}
