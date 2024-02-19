import { GraphWrapper } from "wasm-lib";
import { GraphOperationMode } from "./../Graph";
import { Edge, Vertex } from "@/GraphUniverse/Graph/Graph";
import { AnyValue } from "@/utils/types";

export default class SimpleGraph<V = AnyValue, E = AnyValue> {
  private edgeData: Map<number, Edge<V, E>> = new Map();
  private vertexData: Map<number, Vertex<V>> = new Map();
  private operationMode: GraphOperationMode = GraphOperationMode.Undirected;

  private graph: GraphWrapper = new GraphWrapper();

  public getWasmGraph(): GraphWrapper {
    return this.graph;
  }

  getAllVertices(): Iterable<Readonly<Vertex<V>>> {
    return this.vertexData.values();
  }

  getAllEdges(): Iterable<Readonly<Edge<V, E>>> {
    return this.edgeData.values();
  }

  getVertex(vertexIndex: number): Vertex<V> {
    const vertexData = this.vertexData.get(vertexIndex);

    if (vertexData === undefined) {
      throw Error("Vertex data does not exists");
    }

    return vertexData;
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

  createVertex(vertexData: V | null): Readonly<Vertex<V>> {
    const vertexId = this.graph.create_vertex();

    const newVertex: Vertex<V> = {
      id: vertexId,
      data: vertexData,
    };

    this.vertexData.set(vertexId, newVertex);

    return newVertex;
  }

  deleteVertex(vertex: Vertex<V>): void {
    this.graph.delete_vertex(vertex.id);

    const lastVertex = this.vertexData.get(this.vertexData.size - 1)!;
    

    // Move last element to the place
    lastVertex.id = vertex.id;
    this.vertexData.set(vertex.id, lastVertex);
    this.vertexData.delete(this.vertexData.size - 1);

    for (const edge of this.getNeighborEdges(vertex)) {
      this.deleteEdge(edge);
    }
  }

  deleteEdge(edge: Edge<V, E>): void {
    this.graph.delete_edge(edge.id);

    const lastEdge = this.edgeData.get(this.edgeData.size - 1)!;

    // Move last element to the place
    lastEdge.id = edge.id;
    this.edgeData.set(edge.id, lastEdge);
    this.edgeData.delete(this.edgeData.size - 1);
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

  getAllNeighbors(sourceVertex: Vertex<V>): Vertex<V>[] {
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

  addEdge(
    sourceVertex: Vertex<V>,
    destinationVertex: Vertex<V>,
    edgeData: E | null
  ): Readonly<Edge<V, E>> {
    const newEdgeId = this.graph.create_edge(sourceVertex.id, destinationVertex.id);

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
