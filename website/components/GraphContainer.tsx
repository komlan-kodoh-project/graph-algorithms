"use client";
import GraphUniverse from "@/GraphUniverse/GraphUniverse";
import { Application, Graphics, Sprite } from "pixi.js";
import { useEffect, useRef } from "react";
import { greet } from "wasm-lib";

function GraphContainer() {
  const graphUniverse = useRef<GraphUniverse | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current == null || graphUniverse.current != null) {
      return;
    }

    const newUniverse = new GraphUniverse({
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
