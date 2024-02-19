import { Vertex } from "../Graph/Graph";
import GraphUniverse from "../GraphUniverse";
import Embedding, { WellKnownGraphUniverseEmbedding } from "./Embedding";

export default class DormantEmbeding<V, E> implements Embedding<V, E> {
  private readonly universe: GraphUniverse<V, E>;

  constructor(graphUniverse: GraphUniverse<V, E>) {
    this.universe = graphUniverse;
  }

  wellKnownEmbedingName(): WellKnownGraphUniverseEmbedding {
    return WellKnownGraphUniverseEmbedding.DormantEmbedding;
  }

  name(): string {
    throw new Error("Method not implemented.");
  }

  uninstall(): void {
    // The doermand engine does not need to do anything for uninstall because it does not attach any information to the vertexes
  }

  update(delta: number): void {
    // The dormant embedding does not need to be updated it applies no specific rendering to nodes
  }

  moveVertex(target: Vertex<V>, x: number, y: number): void {
<<<<<<< HEAD
=======
    console.log(x, y)
>>>>>>> origin/main
    this.universe.renderingController.moveVertex(target, x, y);
  }

  free(target: Vertex<V>): void {
    // The dormant embeding has not need to free nodes as it does ever control them in any way
  }

  control(target: Vertex<V>): void {
    // The dormant embeding has not need to control nodes nodes as it does ever free them since it never controls them
  }

  initialize(): void {
    // The dormant embeding does not need to initialize anything since it does not apply any rendering to nodes
  }
}
