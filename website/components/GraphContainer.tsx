"use client";
import SimpleGraph from "@/GraphUniverse/Graph/SimpleGraph";
import GraphUniverse from "@/GraphUniverse/GraphUniverse";
import {useEffect, useRef} from "react";
import GraphUniverseDesignState from "@/GraphUniverse/States/GraphUniverseDesignState";
import GraphUniverseExplorationState from "@/GraphUniverse/States/GraphUniverseExplorationState";

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
        <>
            <div className="fixed bg-black top-0">
                <button onClick={() => {
                    graphUniverse.current?.setState(
                        new GraphUniverseDesignState(graphUniverse.current)
                    );
                }}>
                    Design
                </button>

                <button onClick={() => {
                    graphUniverse.current?.setState(
                        new GraphUniverseExplorationState(graphUniverse.current)
                    );
                }}>
                    Explore
                </button>
            </div>
            <div className="h-screen w-screen" ref={containerRef}></div>
        </>
    );
}

export default GraphContainer;
