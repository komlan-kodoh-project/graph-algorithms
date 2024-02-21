"use client";

import { Edge } from "@/GraphUniverse/Graph/Graph";
import SimpleGraph from "@/GraphUniverse/Graph/SimpleGraph/SimpleGraph";
import GraphUniverse from "@/GraphUniverse/GraphUniverse";
import { WellKnownGraphUniverseState } from "@/GraphUniverse/States/GraphUniverseState";
import { motion } from "framer-motion";
import { useRef, useState, useContext, useEffect } from "react";
import { GraphUniverseContext } from "./GraphUniverseContext";
import { useEffectOnce, useWebAssembly } from "@/utils/hooks";

export type GraphUniverseVertexData = {};

export type GraphUniverseEdgeData = {};

export type GraphContainerProps = {};

function GraphContainer(props: GraphContainerProps) {
  const hasInitialized = useWebAssembly();
  const inputRef = useRef<HTMLInputElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge<any, any> | null>(null);
  const { hasInitiated, universe, setUniverse } = useContext(GraphUniverseContext);

  useEffect(() => {
    if (!hasInitialized ) {
      return;
    }

    const newUniverse = new GraphUniverse({
      container: containerRef.current!,
      graph: new SimpleGraph<GraphUniverseVertexData, GraphUniverseEdgeData>(),
      backgroudColor: "#F1F5FE",
      dangerAccent: {
        light: "#f0bbbb",
        dark: "#cd7c7c",
      },
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

    // Event listener for top popup for edge weight edition
    newUniverse.listener.addEventListener("edgeClickedEvent", (event) => {
      if (newUniverse.getWellKnownState() !== WellKnownGraphUniverseState.Editing) {
        return;
      }

      if (inputRef.current === null) {
        throw Error("Attempt to edit using input but input has not yet been rendered");
      }

      inputRef.current.value = event.edge.weight.toString();
      inputRef.current.focus();

      setSelectedEdge(event.edge);
    });

    newUniverse.initialize();

    if (hasInitiated) {
      throw Error("Attempt to update the universe context but it has already been initialized");
    }

    setUniverse(newUniverse);
  }, [hasInitialized]);

  return (
    <div className="w-full h-full overflow-hidden" ref={containerRef}>
      <motion.div
        initial={{ y: "-100%", top: 0 }}
        animate={selectedEdge !== null ? { y: "0%", top: "0.875em" } : { y: "-100%", top: 0 }}
        transition={{ duration: 0.3, ease: "easeOut", delayChildren: 0.5 }}
        className="absolute left-0 p-3 right-0 mx-auto w-44  z-20 gap-2 top-0 rounded bg-white shadow grid grid-cols-2"
      >
        <h1 className="col-span-2 mb-2 text-center">
          Edge Id: {selectedEdge?.sourceVertex.id} - {selectedEdge?.targetVertex.id}
        </h1>
        <div className="w-fit">Weight :</div>
        <input
          type="number"
          ref={inputRef}
          className="appearance-none w-full rounded px-1 pr-0 border"
          onKeyUp={(event) => {
            if (selectedEdge === null) {
              throw new Error(
                "Attempt to enter on form but it is hidden and no edge has been selected"
              );
            }

            if (event.key !== "Enter") return;

            setSelectedEdge(null);
            universe().updateEdge(selectedEdge, +event.currentTarget.value);
          }}
        ></input>
      </motion.div>
    </div>
  );
}

export default GraphContainer;
