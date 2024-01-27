import GraphUniverse from "@/GraphUniverse/GraphUniverse";
import { Button } from "../building-blocks/Button";
import { useEffect } from "react";
import { Vertex } from "@/GraphUniverse/Graph/Graph";
import { WellKnownGraphUniverseState } from "@/GraphUniverse/States/GraphUniverseState";

export type VertexInputButtonProps<T, K extends keyof T> = {
  formValues: T;
  children: string;
  className?: string;
  updateFormInput: (input: Vertex) => void;

  type: K;
  active: boolean,
  universe: GraphUniverse;
  updateFormInputMode: (previous: K | null) => void;
};

export function VertexInputButton<T, K extends keyof T>({
  type,
  active,
  children,
  universe,
  className,
  updateFormInputMode,
  updateFormInput,
}: VertexInputButtonProps<T, K>) {
  useEffect(() => {
    // Only listen for vertex selection when input mode is same as current type
    if (!active) return;
    
    const cleanupVertexSelected = universe.listener.addEventListener(
      "vertexSelectedEvent",
      (event) => {
        updateFormInput(event.vertex);
        updateFormInputMode(null);
      }
    );

    const cleanupStateUpdate = universe.listener.addEventListener(
      "stateUpdatedEvent",
      (event) => {
        if (
          event.currentState.wellKnownStateName() !==
          WellKnownGraphUniverseState.NodeSelection
        ) {
          updateFormInputMode(null);
        }
      }
    );

    return () => {
      cleanupVertexSelected();
      cleanupStateUpdate();
    };
  }, [universe, active, updateFormInput, updateFormInputMode]);

  return (
    <Button
      className={className}
      active={active}
      onClick={() => {
        updateFormInputMode(type);
        universe.setWellKnownState(WellKnownGraphUniverseState.NodeSelection);
      }}
    >
      {children}
    </Button>
  );
}
