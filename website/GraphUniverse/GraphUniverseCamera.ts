import GraphUniverse from "./GraphUniverse";
import GraphUniverseComponent from "@/GraphUniverse/GraphUniverseComponent";
import {Drag, Wheel} from "pixi-viewport";


export default class GraphUniverseCamera<T, E> implements GraphUniverseComponent<T, E> {
    private universe: GraphUniverse<T, E>;

    constructor(universe: GraphUniverse<T, E>) {
        this.universe = universe;
    }

    public initialize(): void {
        this.initializeZoomController();
    }

    private initializeZoomController() {
        // this.universe.viewport.plugins.
        this.universe.viewport.plugins.add("custom-wheel", new Wheel(
            this.universe.viewport,
            {
                keyToPress: ["ControlLeft", "ControlRight"],
            }));

        this.universe.viewport
            .wheel({
                wheelZoom: false,
            })
            .drag({
                pressDrag: false,
            })
            .decelerate();
    }
}