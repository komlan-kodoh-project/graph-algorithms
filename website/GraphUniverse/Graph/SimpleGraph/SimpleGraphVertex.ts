// // import {Vertex} from "@/GraphUniverse/Graph/Graph";
// // import {SimpleGraphEdge} from "@/GraphUniverse/Graph/SimpleGraph/SimpleGraphEdge";

// export default class SimpleGraphVertex<T> implements Vertex<T> {
//     private id: number;
//     private readonly data: T;
//     private metaData: { [key: string]: any } = {};
//     private readonly edges: SimpleGraphEdge<T>[];

//     constructor(data: T, id: number) {
//         this.id = id;
//         this.data = data;
//         this.edges = [];
//     }

//     addNeighbor(neighbor: SimpleGraphVertex<T>): void {
//         const newEdge = new SimpleGraphEdge<T>(
//             this,
//             neighbor
//         );

//         neighbor.edges.push(newEdge);
//         this.edges.push(newEdge);
//     }

//     public setId(id: number): void {
//         this.id = id;
//     }

//     public getId(): number {
//         return this.id;
//     }

//     public getEdges(): SimpleGraphEdge<T>[]{
//         return this.edges;
//     }

//     getData(): T {
//         return this.data;
//     }

//     getMeta<TMeta>(name: string): TMeta {
//         return this.metaData[name] as TMeta;
//     }

//     setMeta(name: string, meta: any) {
//         if (this.metaData[name] !== undefined) {
//             throw new Error("This metadata key is already defined")
//         }

//         this.metaData[name] = meta;
//     }
// // 

