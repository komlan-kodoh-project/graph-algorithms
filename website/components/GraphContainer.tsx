"use client";
import SimpleGraph from "@/GraphUniverse/Graph/SimpleGraph";
import GraphUniverse from "@/GraphUniverse/GraphUniverse";
import { Application, Graphics, Sprite } from "pixi.js";
import { useEffect, useRef } from "react";
import { greet } from "wasm-lib";

function GraphContainer() {
  const graphUniverse = useRef<GraphUniverse<any> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current == null || graphUniverse.current != null) {
      return;
    }

    const newUniverse = new GraphUniverse({
      graph: new SimpleGraph(),
      container: containerRef.current,
    });

    newUniverse.initialize();

    graphUniverse.current = newUniverse;
  });

  return (
    <div className="h-screen w-screen" ref={containerRef}></div>
  );
}

export default GraphContainer;
