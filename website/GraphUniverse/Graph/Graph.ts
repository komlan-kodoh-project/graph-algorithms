import { AnyValue } from "@/utils/types";

export interface Graph<V = AnyValue, E = AnyValue> {
    createVertex(data: V): Readonly<Vertex<V>>;

    getAllVertices(): Iterable<Readonly<Vertex<V>>>;

    addEdge(sourceVertex: Vertex<V>, destinationVertex: Vertex<V>, edgeData: E): Readonly<Edge<V, E>>;
}

export enum GraphOperationMode {
    Directed,
    Undirected
}

export type MetaStore = {
    [metadata: string]: any
}

export type Vertex<T = AnyValue> = MetaStore & {
    id: number,
    data: T | null,
}

export type Edge<V = AnyValue, E = AnyValue> = MetaStore & {
    id: number,
    weight: number,
    data: E | null,
    sourceVertex: Vertex<V>,
    targetVertex: Vertex<V>,
}

export function setMeta(store: MetaStore, key: string, value: any) {
    if (store[key] !== undefined) {
        throw new Error("This metadata key is already defined")
    }

    store[key] = value;
}

export function GetOtherEnd<V, E>(edge: Edge<V, E>, vertex: Vertex<V>): Vertex<V> {
    if (edge.sourceVertex == vertex) {
        return edge.targetVertex;
    }

    if (edge.targetVertex == vertex) {
        return edge.sourceVertex;
    }

    else {
        throw new Error(`Get other edge has been invoked but vertex with id ${vertex.id} is at no end of edge with id ${edge.id}`);
    }
}

export function getMeta<TMeta>(store: MetaStore, name: string): TMeta {
    return store[name];
}