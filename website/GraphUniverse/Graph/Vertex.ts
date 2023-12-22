import VertexEntity from "@/GraphUniverse/Entity/VertexEntity";

export default class Vertex<T> {
    public entity: VertexEntity<T>;
    private neighbors: Vertex<T>[];
    private metaData: { [key: string]: any } = {};

    constructor(x: number, y: number) {
        this.neighbors = [];
        this.entity = new VertexEntity(x, y, this);
    }

    addMeta(name: string, meta: any) {
        if (this.metaData[name] !== undefined){
            throw new Error("This metadata key is already defined")
        }

        this.metaData[name] = meta;
    }

    getMeta<T>(name: string) : T {
        return this.metaData[name] as T;
    }

    addNeighbor(neighbor: Vertex<T>): void {
        this.neighbors.push(neighbor);
    }
}

