import { GraphAlgorithmExecution } from "@/GraphUniverse/Algorithm/AlgorithmExecutor";
import GraphUniverse from "@/GraphUniverse/GraphUniverse";
import { userReactiveRef } from "@/utils/hooks";
import { createContext, useEffect, useState } from "react";

export type FormProp = {
  universe: GraphUniverse;
};

export type GraphUniverseFormContext = {
  universe: GraphUniverse;
};

const GraphUniverseFormContext = createContext<GraphUniverseFormContext>(
  undefined as unknown as GraphUniverseFormContext
);

export function useGraphUniverseForm<T>(universe: GraphUniverse) {
  const [inputModeRef, setInputMode] = userReactiveRef<keyof T | null>(null);

  const [formValues, setFormValues] = useState<Partial<T>>({});

  const [currentAlgorithmExecution, setCurrentAlgorithmExecution] =
    useState<GraphAlgorithmExecution | null>(null);

  function registerGraphInput<K extends keyof T>(key: K) {
    return {
      active: key === inputModeRef.current,
      universe,
      formValues,
      type: key,
      setInputMode,
      setFormValues,
      updateFormInputMode: (mode: K | null) => setInputMode(mode),
      updateFormInput: (data: T[K]) =>
        setFormValues((previous) => ({
          ...previous,
          pen: 2,
          [key]: data,
        })),
    };
  }

  function startAlgorithmExecution() {}

  return {
    formValues,
    registerGraphInput,
  };
}
