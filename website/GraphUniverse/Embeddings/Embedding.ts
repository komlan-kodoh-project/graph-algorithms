import GraphUniverseComponent from "@/GraphUniverse/GraphUniverseComponent";

/**
 * A graph embedding defines how nodes should display on a string. For example a physics based embedding would mimic
 * physical forces to create a graph embedding. On the other hand a community based embedding might group nodes so
 * that nodes of the same community are close to one another
 */
export default interface Embedding<T> extends GraphUniverseComponent<T> {
    /**
     * Update the graph embedding with consideration to the delta time that has passed.
     * @param delta The time that has based since the last invocation of this method
     */
    update(delta: number) : void;
}