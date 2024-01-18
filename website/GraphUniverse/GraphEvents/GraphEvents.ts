import {FederatedPointerEvent} from "pixi.js";
import {Coordinates} from "@/GraphUniverse/Coordinates";
import {Edge, Vertex} from "@/GraphUniverse/Graph/Graph";
import {GraphUniverseSelectionState} from "@/GraphUniverse/States/GraphUniverseSelectionState";
import {GraphUniverseState} from "@/GraphUniverse/States/GraphUniverseState";

/***************************** Simple Graph Events *************************/
export type GraphEvents<T> = {
    x: number,
    y: number,
    vertex: Vertex<T>
}

export type VertexToVertexDrag<T> = {
    sourceVertex:  Vertex<T>,
    targetVertex:  Vertex<T>,
}

export type VertexClickedEvent<T> = {
    vertex: Vertex<T>
}

export type VertexSelectedEvent<T> = {
    vertex: Vertex<T>
}

export type VertexDragEvent<T> = {
    x: number,
    y: number,
    vertex: Vertex<T>,
}

export type GraphDragEvent<T> = {
    start: Coordinates,
    x: number,
    y: number,
    target: T,
}

export type ViewClickedEvent<T> = {
    x: number;
    y: number;
    sourceEvent: FederatedPointerEvent
}

export type EdgeAddedEvent<V, E> = {
    edge: Edge<V, E>,
}

export type EdgeClickedEvent<V, E> = {
    edge: Edge<V, E>
}

export type GraphStateUpdateEvent<T, E> = {
    currentState:  GraphUniverseState<T, E>,
    previousState:  GraphUniverseState<T, E>,
}

/***************************** Persistent Graph Events *************************/

export type VertexHoverEvent<T> = {
    targetVertex:  Vertex<T>,
}

export default GraphEvents;