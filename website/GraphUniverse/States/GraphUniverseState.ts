import GraphUniverseComponent from "@/GraphUniverse/GraphUniverseComponent";


export default interface GraphUniverseState<T> extends GraphUniverseComponent<T> {
    uninstall(): void
}