import GraphUniverseComponent from "@/GraphUniverse/GraphUniverseComponent";
import { Vertex } from "@/GraphUniverse/Graph/Graph";

/**
 * A graph embedding defines how nodes should display on a string. For example a physics based embedding would mimic
 * physical forces to create a graph embedding. On the other hand a community based embedding might group nodes so
 * that nodes of the same community are close to one another
 */
export default interface Embedding<T, E> extends GraphUniverseComponent<T, E> {
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
    moveVertex(target: Vertex<T>, x: number, y: number): void;

    /**
     * Requests that the physics embedding frees the given vertex of any bound that it may apply to vertex
     * in order to obtain the graph embedding
     * @param target
     */
    free(target: Vertex<T>): void;

    /**
     * Requests that the physics embedding takes back control of the given vertex and any bound that it may apply to vertex
     * in order to obtain the graph embedding
     * @param target
     */
    control(target: Vertex<T>): void;
}