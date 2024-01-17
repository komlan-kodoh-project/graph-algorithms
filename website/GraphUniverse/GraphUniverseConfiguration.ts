import Vertex from "@/GraphUniverse/Entity/VertexEntity";
import Graph from "@/GraphUniverse/Graph/Graph";

type GraphUniverseConfiguration<T> = {
    graph: Graph<T>,
    container: HTMLElement,
    getNewVertexData: () => T
}

export default GraphUniverseConfiguration; 