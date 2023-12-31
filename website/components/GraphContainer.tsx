"use client";
import SimpleGraph from "@/GraphUniverse/Graph/SimpleGraph";
import GraphUniverse from "@/GraphUniverse/GraphUniverse";
import {useEffect, useRef, useState} from "react";
import EditButton from "./svg-buttons/EditButton";
import PointerButton from "./svg-buttons/PointerButton";
import {WellKnownGraphUniverseState} from "@/GraphUniverse/States/GraphUniverseState";

function GraphContainer() {
    const containerRef = useRef<HTMLDivElement>(null);
    const graphUniverse = useRef<GraphUniverse<any> | null>(null);
    const [editorState, setEditorState] = useState<WellKnownGraphUniverseState>(WellKnownGraphUniverseState.Editing);

    useEffect(() => {
        if (containerRef.current == null || graphUniverse.current != null) {
            return;
        }
        console.log(containerRef.current.clientHeight)

        const newUniverse = new GraphUniverse({
            graph: new SimpleGraph(),
            container: containerRef.current,
        });

        newUniverse.initialize();

        graphUniverse.current = newUniverse;
    });

    const updateEditorState = (newState: WellKnownGraphUniverseState) => {
        if (graphUniverse.current == null) {
            throw Error("Attempt to edit state when the universe has not yet been initialized");
        }

        graphUniverse.current?.setStateEnum(newState);
        setEditorState(newState);
    }

    return (
        <div className="relative w-full h-full outline-4 outline-primary-color overflow-hidden">
            <div className="absolute inline-flex gap-2 top-5 left-5 z-20 h-9 rounded bg-white px-1.5 py-1">
                <PointerButton
                    active={editorState === WellKnownGraphUniverseState.Exploring}
                    onClick={(_) => updateEditorState(WellKnownGraphUniverseState.Exploring)}
                />

                <EditButton
                    active={editorState === WellKnownGraphUniverseState.Editing}
                    onClick={(_) => updateEditorState(WellKnownGraphUniverseState.Editing)}
                />
            </div>

            <div className="absolute top-0 bottom-0 left-0 right-0 z-10" ref={containerRef}></div>
        </div>
    );
}

export default GraphContainer;
