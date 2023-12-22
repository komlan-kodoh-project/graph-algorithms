import Vertex from "@/GraphUniverse/Graph/Vertex";
import Graph from "@/GraphUniverse/Graph/Graph";

export default class SimpleGraph<T> implements Graph<T> {
    nodes: Vertex<T>[] = [];

    addVertex(vertex: Vertex<T>) {
        this.nodes.push(vertex);
    }

    addEdge(node1: Vertex<T>, node2: Vertex<T>): void {
        if (!this.nodes.includes(node1) || !this.nodes.includes(node2)) {
            throw new Error("Nodes must be part of the graph before adding an edge.");
        }

        node1.addNeighbor(node2);
        node2.addNeighbor(node1);
    }

    getAllNodes(): Vertex<T>[] {
        return this.nodes;
    }
}