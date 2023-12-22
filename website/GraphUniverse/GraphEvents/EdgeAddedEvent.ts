import Vertex from "@/GraphUniverse/Graph/Vertex";

type EdgeAddedEvent<T> = {
    sourceVertex:  Vertex<T>,
    targetVertex:  Vertex<T>,
    IsDirected : boolean
}


export default  EdgeAddedEvent;