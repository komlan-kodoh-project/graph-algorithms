import SimpleGraph from "./Graph/SimpleGraph/SimpleGraph";

type GraphUniverseConfiguration<V, E> = {
    graph: SimpleGraph<V, E>,
    container: HTMLElement,
    getNewVertexData: () => V 
}

export default GraphUniverseConfiguration; 