import Vertex from "@/GraphUniverse/Entity/VertexEntity";
import Graph from "@/GraphUniverse/Graph/Graph";

type GraphUniverseConfiguration<T> = {
    graph: Graph<Vertex<T>>
    container: HTMLElement,
}

export default GraphUniverseConfiguration; 