import { GraphWrapper } from "wasm-lib";
import { GraphOperationMode } from './../Graph';
import { Edge, Graph, Vertex } from "@/GraphUniverse/Graph/Graph";

export default class SimpleGraph<V, E> implements Graph<V, E> {
    private edgeData: Map<number, Edge<V, E>> = new Map();
    private vertexData: Map<number, Vertex<V>> = new Map();
    private operationMode: GraphOperationMode = GraphOperationMode.Undirected;

    private graph: GraphWrapper = new GraphWrapper();

    getAllVertices(): Iterable<Readonly<Vertex<V>>> {
        return this.vertexData.values();
    }

    getEdge(sourceVertex: Vertex<V>, destinationVertex: Vertex<V>): Readonly<Edge<V, E>> {
        if (this.operationMode === GraphOperationMode.Directed) {
            const edgeId = this.graph.edge_directed(sourceVertex.id, destinationVertex.id);

            return this.edgeData.get(edgeId)!;
        }

        if (this.operationMode === GraphOperationMode.Undirected) {
            const edgeId = this.graph.edge(sourceVertex.id, destinationVertex.id);

            return this.edgeData.get(edgeId)!;
        }

        throw new Error("The graph is not in a valid state.");
    }

    createVertex(vertexData: V): Readonly<Vertex<V>> {
        const vertexId = this.graph.create_vertex();

        const newVertex: Vertex<V> = {
            id: vertexId,
            data: vertexData,
        }

        this.vertexData.set(vertexId, newVertex);

        return newVertex;
    }

    getNeighborEdges(sourceVertex: Vertex<V>): Edge<V, E>[] {
        const neighbors = this.graph.adjacent_egdes(sourceVertex.id);

        const edgesData = new Array<Edge<V, E>>(neighbors.length);

        for (const [i, value] of neighbors.entries()) {
            const data = this.edgeData.get(value);

            if (data === undefined) {
                throw new Error("Failed to map from edge id in wasm to stored edge data");
            }

            edgesData[i] = data;
        }

        return edgesData;
    }

    getNeighbors(sourceVertex: Vertex<V>): Vertex<V>[] {
        const neighbors = this.graph.neighbors(sourceVertex.id);

        const vertexData = new Array<Vertex<V>>(neighbors.length);

        for (const [i, value] of neighbors.entries()) {
            const data = this.vertexData.get(value);

            if (data === undefined) {
                throw new Error("Failed to map from vertex id in wasm to stored vertex data");
            }

            vertexData[i] = data;
        }

        return vertexData;
    }

    addEdge(sourceVertex: Vertex<V>, destinationVertex: Vertex<V>, edgeData: E | null): Readonly<Edge<V, E>> {
        const newEdgeId = this.graph.create_edge(
            sourceVertex.id,
            destinationVertex.id
        );

        const newEdge: Edge<V, E> = {
            weight: 1,
            id: newEdgeId,
            data: edgeData,
            sourceVertex: sourceVertex,
            targetVertex: destinationVertex,
        };

        this.edgeData.set(newEdgeId, newEdge);

        return newEdge;
    }
}