import Vertex from "@/GraphUniverse/Graph/Vertex";

export default interface Graph<T> {
    addVertex(value: Vertex<T>):  void;

    getAllNodes(): Vertex<T>[];

    addEdge(node1: Vertex<T>, node2: Vertex<T>): void;
}

