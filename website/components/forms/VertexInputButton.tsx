import GraphUniverse from "@/GraphUniverse/GraphUniverse";
import { Button } from "../building-blocks/Button";
import { useEffect } from "react";
import { Vertex } from "@/GraphUniverse/Graph/Graph";
import { WellKnownGraphUniverseState } from "@/GraphUniverse/States/GraphUniverseState";
import { Snackbar } from "@mui/material";

export type VertexInputButtonProps<T, K extends keyof T> = Readonly<{
  formValues: T;
  children: string;
  className?: string;

  updateFormInput: (input: Vertex) => void;

  /**
   * name of the input properities that this button is mapping too. This must be one of the key supported by the form
   */
  type: K;

  /**
   * True when the button is down and we are actively trying to select
   */
  active: boolean;

  /**
   * Universe on which the vertex selection is taking place
   */
  universe: GraphUniverse;

  /**
   * The form input mode is the currently field that the form will when this button is selected
   * @param previous The previoius input mode
   */
  updateFormInputMode: (previous: K | null) => void;
}>;

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
        updateFormInputMode(null);
        updateFormInput(event.vertex);
        universe.setWellKnownState(WellKnownGraphUniverseState.Exploring);
      }
    );

    const cleanupStateUpdate = universe.listener.addEventListener("stateUpdatedEvent", (event) => {
      if (event.currentState.wellKnownStateName() !== WellKnownGraphUniverseState.NodeSelection) {
        updateFormInputMode(null);
      }
    });

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
