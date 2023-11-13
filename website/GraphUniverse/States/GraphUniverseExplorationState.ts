
import { FederatedPointerEvent } from "pixi.js";
import GraphUniverse from "../GraphUniverse";
import GraphUniverseState from "./GraphUniverseState";
import { GraphPointerEvent } from "../GraphUniverseEventListener";

export default class GraphUniverseExplorationState implements GraphUniverseState {
    private graphUniverse: GraphUniverse;

    constructor(graphUniverse: GraphUniverse) {
        this.graphUniverse = graphUniverse;
    }
    
    onStageClick(pointerEvent: GraphPointerEvent): void {
        this.graphUniverse.createVertex(
            pointerEvent.x,
            pointerEvent.y
        )
    }
} 