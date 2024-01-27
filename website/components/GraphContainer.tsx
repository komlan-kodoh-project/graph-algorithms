"use client";
import { useEffect, useRef, useState } from "react";
import EditButton from "./svg-buttons/EditButton";
import PointerButton from "./svg-buttons/PointerButton";
import GraphUniverse from "@/GraphUniverse/GraphUniverse";
import SimpleGraph from "@/GraphUniverse/Graph/SimpleGraph/SimpleGraph";
import { WellKnownGraphUniverseState } from "@/GraphUniverse/States/GraphUniverseState";
import { Edge } from "@/GraphUniverse/Graph/Graph";
import { AlgorithmDopdownValue, AlgorithmDropdown } from "./Algorithms/AlgorithmDropdown";
import { GraphAlgorithmSelection } from "./Algorithms/GraphAlgorithmSelection";
import { AnimatePresence, motion } from "framer-motion";
import { useWebAssembly } from "@/utils/hooks";

export type GraphUniverseVertexData = {};

// Maximum independent set
// Node excentricity
export type GraphUniverseEdgeData = {};

export type GraphContainerProps = {}

function GraphContainerInner(props: GraphContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphUniverse = useRef<GraphUniverse<any, any> | null>(null);

  const [selectedEdge, setSelectedEdge] = useState<Edge<any, any> | null>(null);
  const [editorState, setEditorState] = useState<WellKnownGraphUniverseState>();

  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmDopdownValue>(null);

  useEffect(() => {
    if (containerRef.current == null || graphUniverse.current != null) {
      return;
    }

    const newUniverse = new GraphUniverse({
      container: containerRef.current,
      graph: new SimpleGraph<GraphUniverseVertexData, GraphUniverseEdgeData>(),
      backgroudColor: "#F1F5FE",
      theme: {
        light: "#BBD3F0",
        dark: "#7C98CD",
      },
      primaryAccent: {
        light: "#e3e0ff",
        dark: "#8d86db",
      },
      secondaryAccent: {
        light: "#bddbc6",
        dark: "#54b06b",
      },
      darkAccent: {
        dark: "#3b3c3d",
        light: "#8d8e8f",
      },
    });

    newUniverse.listener.addEventListener("stateUpdatedEvent", (event) => {
      setEditorState(event.currentState.wellKnownStateName());
    });

    newUniverse.listener.addEventListener("edgeClickedEvent", (event) => {
      setSelectedEdge(event.edge);
    });

    newUniverse.initialize();

    newUniverse.generateRandomGraph(10);


    graphUniverse.current = newUniverse;

    updateEditorState(WellKnownGraphUniverseState.Exploring);
  });

  const updateEditorState = (newState: WellKnownGraphUniverseState) => {
    if (graphUniverse.current == null) {
      throw Error("Attempt to edit state when the universe has not yet been initialized");
    }

    graphUniverse.current?.setWellKnownState(newState);
  };

  return (
    <div className="relative w-full h-full outline-4 outline-primary-color overflow-hidden text-sm ">
      <div className="absolute inline-flex gap-2 top-3.5 left-3.5 z-20 h-9 rounded bg-white px-1.5 py-1 shadow">
        <PointerButton
          active={editorState === WellKnownGraphUniverseState.Exploring}
          onClick={(_) => updateEditorState(WellKnownGraphUniverseState.Exploring)}
        />

        <EditButton
          active={editorState === WellKnownGraphUniverseState.Editing}
          onClick={(_) => updateEditorState(WellKnownGraphUniverseState.Editing)}
        />
      </div>

      <motion.div
        initial={{ top: "0.875rem", right: "0.875rem", width: "20rem" }}
        animate={
          selectedAlgorithm === null || selectedAlgorithm === "None"
            ? { top: "0.875rem", right: "0.875rem", width: "20rem", background: "white" }
            : { top: "0rem", right: "0rem", width: "24rem", background: "white" }
        }
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute inline-flex gap-2 top-3.5 z-30 h-9 border-top rounded  py-1 shadow"
      >
        <AlgorithmDropdown onChange={setSelectedAlgorithm} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={
          selectedAlgorithm === null || selectedAlgorithm === "None"
            ? { opacity: 0, translateY:"0px" }
            : { opacity: 1, translateY:"0px"  }
        }
        transition={{ duration: 0.5, ease: "easeOut", delayChildren: 0.5 }}
        className="absolute gap-2 top-9 z-20 bottom-3.5 h-full py-0 right-0 w-96 p-3 mt-3 pt-3 border-green-400 border-t-2 shadow rounded bg-slate-50"
      >
        {graphUniverse.current !== null && (
          <GraphAlgorithmSelection
            universe={graphUniverse.current}
            name={selectedAlgorithm}
          ></GraphAlgorithmSelection>
        )}
      </motion.div>

      {selectedEdge !== null && (
        <div className="absolute left-0 right-0 mx-auto w-44  z-20 gap-2 top-3.5 rounded bg-white px-1.5 py-1 shadow grid grid-cols-2">
          <div className="w-fit">Weight :</div>
          <input
            className="appearance-none w-full rounded px-1 pr-0 border"
            autoFocus
            type="number"
            onKeyUp={(event) => {
              if (event.key !== "Enter") return;

              setSelectedEdge(null);
              graphUniverse.current?.updateEdge(selectedEdge, +event.currentTarget.value);
            }}
          ></input>
        </div>
      )}

      <div className="absolute top-0 bottom-0 left-0 right-0 z-10 " ref={containerRef}></div>
    </div>
  );
}

function GraphContainer(props: GraphContainerProps){
  var hasInit = useWebAssembly();

  return hasInit ?  <GraphContainerInner {...props}></GraphContainerInner>: <></>;
}
export default GraphContainer;
