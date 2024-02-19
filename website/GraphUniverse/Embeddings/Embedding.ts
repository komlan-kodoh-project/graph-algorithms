import GraphUniverseComponent from "@/GraphUniverse/GraphUniverseComponent";
import { Vertex } from "@/GraphUniverse/Graph/Graph";
import { initialize } from "next/dist/server/lib/render-server";
import GraphUniverse from "../GraphUniverse";
import { GraphUniverseState } from "../States/GraphUniverseState";
import { AnyValue } from "@/utils/types";
import PhysicsBasedEmbedding from "./PhysicsBasedEmbedding";
import DormantEmbeding from "./DormantEmbedding";

/**
 * A graph embedding defines how nodes should display on a string. For example a physics based embedding would mimic
 * physical forces to create a graph embedding. On the other hand a community based embedding might group nodes so
 * that nodes of the same community are close to one another
 */
export default interface Embedding<V = AnyValue, E = AnyValue> extends GraphUniverseComponent<V, E> {
  /**
   * Return the name that should be attributed to this embedding
   */
  wellKnownEmbedingName(): WellKnownGraphUniverseEmbedding;

  /**
   * Uninstall and deallocates any ressources that has been allocated during the installation phases
   */
  uninstall(): void;

  /**
   * Update the graph embedding with consideration to the delta time that has passed.
   * @param delta The time that has based since the last invocation of this method
   */
  update(delta: number): void;

  /**
   * Request that a vertex be moved at a particular position within the graph embedding
   * @param target vertex to move
   * @param x The new x position of the target vertex
   * @param y The new y position of the target vertex
   */
  moveVertex(target: Vertex<V>, x: number, y: number): void;

  /**
   * Requests that the physics embedding frees the given vertex of any bound that it may apply to vertex
   * in order to obtain the graph embedding
   * @param target
   */
  free(target: Vertex<V>): void;

  /**
   * Requests that the physics embedding takes back control of the given vertex and any bound that it may apply to vertex
   * in order to obtain the graph embedding
   * @param target
   */
  control(target: Vertex<V>): void;
}

export enum WellKnownGraphUniverseEmbedding {
  PhysicsBasedEmbedding,
  DormantEmbedding,
}

type EmbedingMap = {
  [K in WellKnownGraphUniverseEmbedding]: (universe: GraphUniverse) => Embedding;
};

export class EmbeddingFActory {
  private static embeddingMap: EmbedingMap = {
    [WellKnownGraphUniverseEmbedding.DormantEmbedding]: (universe) => new DormantEmbeding(universe),
    [WellKnownGraphUniverseEmbedding.PhysicsBasedEmbedding]: (universe) =>
      new PhysicsBasedEmbedding(universe),
  } as const;

  static getEmbedding(
    editorState: WellKnownGraphUniverseEmbedding,
    universe: GraphUniverse<any, any>
  ): Embedding<any, any> {
    return this.embeddingMap[editorState](universe);
  }
}
