import { GraphAlgorithmExecution } from "@/GraphUniverse/Algorithm/AlgorithmExecutor";
import { GraphAlgorithm } from "@/GraphUniverse/Algorithm/GraphAlgorithm";
import GraphUniverse from "@/GraphUniverse/GraphUniverse";
import { userReactiveRef } from "@/utils/hooks";
import { useContext, useRef, useState } from "react";
import { GraphUniverseContext } from "../GraphUniverseContext";
import { AnyValue } from "@/utils/types";

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

export type GraphUniverseFormDataReturn<TConfig> = {
  formValues: Partial<TConfig>;
  registerGraphInput: <K extends keyof TConfig>(
    key: K
  ) => {
    active: boolean;
    universe: GraphUniverse;
    formValues: Partial<TConfig>;
    type: K;
    setInputMode: (mode: K | null) => void;
    setFormValues: (data: Partial<TConfig>) => void;
    updateFormInputMode: (mode: K | null) => void;
    updateFormInput: (data: TConfig[K]) => void;
  };
  execution: {
    isExecuting: boolean;
    explanation: string;
    start: () => void;
    reset: () => void;
    moveForward: () => void;
  };
};

export function useGraphUniverseForm<TConfig, TAlgorithm extends GraphAlgorithm>(
  algorithmBuilder: GraphAlgorithmBuilder<TConfig, TAlgorithm>
): GraphUniverseFormDataReturn<TConfig> {
  const { universe, hasInitiated } = useContext(GraphUniverseContext);

  const [explanation, setExplanation] = useState<string>("");
  const [formValues, setFormValues] = useState<Partial<TConfig>>({});

  const algorithmExecution = useRef<GraphAlgorithmExecution | null>(null);
  const [inputModeRef, setInputMode] = userReactiveRef<keyof TConfig | null>(null);

  const [isExecuting, setIsExecuting] = useState(false);

  function registerGraphInput<K extends keyof TConfig>(key: K) {
    return {
      active: key === inputModeRef.current,
      universe: hasInitiated ? (universe() as GraphUniverse) : ({} as any),
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

    const newAlgorithm = algorithmBuilder(
      formValues as TConfig,
      universe() as GraphUniverse<AnyValue, AnyValue>
    );
    algorithmExecution.current = new GraphAlgorithmExecution(
      newAlgorithm,
      universe() as GraphUniverse<AnyValue, AnyValue>
    );
  }

  function startExecution(): void {
    ensureAlgorithnExecutionExists();

    setIsExecuting(true);
    algorithmExecution.current!.StartExecution().then(() => setIsExecuting(false));
  }

  function moveExecutionForward(): void {
    ensureAlgorithnExecutionExists();

    setIsExecuting(true);
    algorithmExecution.current!.MoveForward().then((result) => {
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
