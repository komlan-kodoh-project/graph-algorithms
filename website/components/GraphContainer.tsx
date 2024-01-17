"use client";
import { useEffect, useRef, useState } from "react";
import EditButton from "./svg-buttons/EditButton";
import PointerButton from "./svg-buttons/PointerButton";
import GraphUniverse from "@/GraphUniverse/GraphUniverse";
import SimpleGraph from "@/GraphUniverse/Graph/SimpleGraph/SimpleGraph";
import { WellKnownGraphUniverseState } from "@/GraphUniverse/States/GraphUniverseState";
import { DijkstraAlgorithmForm } from "./forms/DijkstraAlgorithmForm";

export type GraphUniverseVertexData = {};

export type GraphUniverseEdgeData = {};

function GraphContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphUniverse = useRef<GraphUniverse<any, any> | null>(null);
  const [editorState, setEditorState] = useState<WellKnownGraphUniverseState>();

  useEffect(() => {
    if (containerRef.current == null || graphUniverse.current != null) {
      return;
    }

    const newUniverse = new GraphUniverse({
      container: containerRef.current,
      graph: new SimpleGraph<GraphUniverseVertexData, GraphUniverseEdgeData>(),
      getNewVertexData: () => ({
        id: Math.random().toString(36).slice(2, 3),
      }),
    });

    newUniverse.listener.addEventListener("stateUpdatedEvent", (event) => {
      setEditorState(event.currentState.wellKnownStateName());
    });

    newUniverse.initialize();

    newUniverse.generateRandomGraph(20);

    // const v1 = newUniverse.createVertex(150, 5);
    // const v2 = newUniverse.createVertex(150, 10);
    // const v3 = newUniverse.createVertex(150, 15);
    // const v4 = newUniverse.createVertex(150, 20);
    // const v5 = newUniverse.createVertex(150, 25);
    // const v6 = newUniverse.createVertex(150, 30);
    // const v7 = newUniverse.createVertex(150, 40);

    // newUniverse.createEdge(v1, v2);
    // newUniverse.createEdge(v1, v3);
    // newUniverse.createEdge(v1, v4);
    // newUniverse.createEdge(v1, v5);
    // newUniverse.createEdge(v1, v6);

    // newUniverse.createEdge(v2, v4);
    // newUniverse.createEdge(v2, v5);

    // newUniverse.createEdge(v3, v5);
    // newUniverse.createEdge(v5, v7);

    graphUniverse.current = newUniverse;

    updateEditorState(WellKnownGraphUniverseState.Editing);
  });

  const updateEditorState = (newState: WellKnownGraphUniverseState) => {
    if (graphUniverse.current == null) {
      throw Error(
        "Attempt to edit state when the universe has not yet been initialized"
      );
    }

    graphUniverse.current?.setWellKnownState(newState);
  };

  return (
    <div className="relative w-full h-full outline-4 outline-primary-color overflow-hidden">
      <div className="absolute inline-flex gap-2 top-3.5 left-3.5 z-20 h-9 rounded bg-white px-1.5 py-1 shadow">
        <PointerButton
          active={editorState === WellKnownGraphUniverseState.Exploring}
          onClick={(_) =>
            updateEditorState(WellKnownGraphUniverseState.Exploring)
          }
        />

        <EditButton
          active={editorState === WellKnownGraphUniverseState.Editing}
          onClick={(_) =>
            updateEditorState(WellKnownGraphUniverseState.Editing)
          }
        />
      </div>

      <div className="absolute gap-2 top-3.5 right-2.5 z-20">
        {graphUniverse.current && (
          <DijkstraAlgorithmForm universe={graphUniverse.current} />
        )}
      </div>

      <div
        className="absolute top-0 bottom-0 left-0 right-0 z-10 "
        ref={containerRef}
      ></div>
    </div>
  );
}

export default GraphContainer;
