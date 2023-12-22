/**
 * Component used to support the operations of the graph universe
 */
export default interface GraphUniverseComponent<T> {
    /**
     * Method called by the graph universe right during initialization. This method can be used write some initialization
     * right after the universe rendering has been configured
     */
    initialize() : void;
}