import Vertex from "@/GraphUniverse/Graph/Vertex";
import {FederatedPointerEvent} from "pixi.js";
import {Coordinates} from "@/GraphUniverse/Coordinates";

export type VertexAddedEvent<T> = {
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

export type EdgeAddedEvent<T> = {
    sourceVertex:  Vertex<T>,
    targetVertex:  Vertex<T>,
    IsDirected : boolean
}

export default VertexAddedEvent;