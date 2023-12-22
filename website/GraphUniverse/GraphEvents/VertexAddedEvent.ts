import Vertex from "@/GraphUniverse/Graph/Vertex";
import {FederatedPointerEvent} from "pixi.js";

export type VertexAddedEvent<T> = {
    vertex: Vertex<T>
}

export type VertexClickedEvent<T> = {
    vertex: Vertex<T>
}

export type VertexDragEvent<T> = {
    x: number,
    y: number,
    vertex: Vertex<T>,
}

export type ViewClickedEvent<T> = {
    x: number;
    y: number;
    sourceEvent: FederatedPointerEvent
}

export default VertexAddedEvent;