import { FederatedEvent, FederatedEventHandler, FederatedPointerEvent, IFederatedDisplayObject, extensions } from "pixi.js";
import GraphUniverse from "./GraphUniverse";


export type GraphPointerEvent = {
    x: number;
    y: number;
    sourceEvent: FederatedPointerEvent
};

export type EventHandler<T> = (event: T) => void;

export default class GraphUniverseEventListener {
    private universe: GraphUniverse

    constructor(universe: GraphUniverse) {
        this.universe = universe

        this.universe.application.stage.eventMode = 'static';
        this.universe.application.stage.hitArea = this.universe.application.screen;
    }

    public addClickEventListener(target: IFederatedDisplayObject, eventHandler: EventHandler<GraphPointerEvent>) {
        target.addEventListener("mousedown", (event) => {
            eventHandler({
                x: (event.clientX - this.universe.viewport.transform.position.x) / this.universe.viewport.transform.scale.x,
                y: (event.clientY - this.universe.viewport.transform.position.y) / this.universe.viewport.transform.scale.y,
                sourceEvent: event
            });
        })
    }
}