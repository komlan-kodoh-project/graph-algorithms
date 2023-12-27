import GraphUniverse from "./GraphUniverse";
import GraphEvents from "@/GraphUniverse/GraphEvents/GraphEvents";
import VertexAddedEvent, {
    EdgeAddedEvent, GraphDragEvent,
    VertexClickedEvent,
    VertexToVertexDrag,
    ViewClickedEvent
} from "@/GraphUniverse/GraphEvents/VertexAddedEvent";
import Vertex from "@/GraphUniverse/Graph/Vertex";
import VertexEntity from "@/GraphUniverse/Entity/VertexEntity";
import {Coordinates} from "@/GraphUniverse/Coordinates";
import {FederatedPointerEvent} from "pixi.js";

type MouseState = {
    down: boolean,
    dragging: boolean,
    location: Coordinates
}

type MouseDownObject = {
    type: "vertex-entity" | "viewport",
    object: object,
}


export default class GraphUniverseEventListener<T> {
    private universe: GraphUniverse<T>;

    private mouseDownObject: MouseDownObject | null = null;
    private dragHoveredVertex: VertexEntity<T> | null = null;

    private mouseState: MouseState = {
        down: false,
        dragging: false,
        location: {x: 0, y: 0}
    };


    private events = {
        edgeAddedEvent: new GraphEvents<EdgeAddedEvent<T>>(),

        vertexDragStart: new GraphEvents<GraphDragEvent<Vertex<T>>>(),
        viewportDragStart: new GraphEvents<GraphDragEvent<null>>(),

        vertexDrag: new GraphEvents<GraphDragEvent<Vertex<T>>>(),
        viewportDrag: new GraphEvents<GraphDragEvent<null>>(),

        vertexDragEnd: new GraphEvents<GraphDragEvent<Vertex<T>>>(),
        viewportDragEnd: new GraphEvents<GraphDragEvent<null>>(),

        vertexAddedEvent: new GraphEvents<VertexAddedEvent<T>>(),
        viewClickedEvent: new GraphEvents<ViewClickedEvent<T>>(),
        vertexClickedEvent: new GraphEvents<VertexClickedEvent<T>>(),
        vertexToVertexDrag: new GraphEvents<VertexToVertexDrag<T>>(),
    } as const;


    constructor(universe: GraphUniverse<T>) {
        this.universe = universe
    }

    initialize() {
        this.universe.application.stage.eventMode = 'static';
        this.universe.application.stage.hitArea = this.universe.application.screen;

        this.configureViewDragListener();
        this.configureViewClickListener();
    }

    public notifyVertexCreated(event: VertexAddedEvent<T>) {
        this.events.vertexAddedEvent.trigger(event)
    }

    public notifyEdgeCreated(event: EdgeAddedEvent<T>) {
        this.events.edgeAddedEvent.trigger(event);
    }

    public listenOn(entity: VertexEntity<T>): void {

        entity.addEventListener("mousedown", (event) => {
            // We stop propagation so the viewport is not alerted with this event
            event.stopPropagation();

            this.mouseState.down = true;
            this.mouseDownObject = {
                type: "vertex-entity",
                object: event.target as VertexEntity<T>,
            };
        });

        entity.addEventListener("mousemove", (event) => {
            // Only execute this handler if there is a drag event that has started on a vertex
            if (!(this.mouseState.dragging && this.mouseDownObject !== null && this.mouseDownObject.type === "vertex-entity")) {
                return;
            }

            const target = event.target as VertexEntity<T>
            const dragVertexStart = this.mouseDownObject.object as VertexEntity<T>;

            if (this.dragHoveredVertex === null && target !== dragVertexStart) {
                this.events.vertexToVertexDrag.trigger({
                    targetVertex: target.graphVertex,
                    sourceVertex: dragVertexStart.graphVertex,
                })

                this.dragHoveredVertex = target;
            } else if (this.dragHoveredVertex !== null && target !== this.dragHoveredVertex) {
                this.events.vertexToVertexDrag.trigger({
                    targetVertex: target.graphVertex,
                    sourceVertex: this.dragHoveredVertex.graphVertex,
                });

                this.dragHoveredVertex = target;
            }
        });
    }

    private configureViewClickListener(): void {
        this.universe.viewport.addEventListener("mouseup", (event) => {
            if (this.mouseDownObject !== null && this.mouseDownObject.type === "viewport") {
                const coordinates = this.getEventCoordinates(event);

                this.events.viewClickedEvent.trigger({
                    sourceEvent: event,
                    x: coordinates.x,
                    y: coordinates.y
                });
            }

            this.mouseDownObject = null;
            this.mouseState.down = false;
            this.dragHoveredVertex = null;
            this.mouseState.dragging = false;
        });
    }

    private configureViewDragListener() {
        this.universe.viewport.addEventListener("mousedown", () => {
            this.mouseState.down = true;
            this.mouseDownObject = {
                type: "viewport",
                object: {},
            };
        })

        this.universe.viewport.addEventListener("mousemove", (event) => {
            // If the mouse is already down, event listener transitions it to a moving state
            if (!this.mouseState.down) return;

            if (this.mouseDownObject === null) {
                throw Error("We detected a dragging event but no down object");
            }

            if (this.mouseDownObject.type === "vertex-entity") {
                const coordinates = this.getEventCoordinates(event);
                const dragTarget = this.mouseDownObject.object as VertexEntity<T>;

                if (!this.mouseState.dragging) {
                    this.mouseState.dragging = true;

                    this.events.vertexDragStart.trigger({
                        x: coordinates.x,
                        y: coordinates.y,
                        start: coordinates,
                        target: dragTarget.graphVertex,
                    })
                } else {
                    this.events.vertexDrag.trigger({
                        x: coordinates.x,
                        y: coordinates.y,
                        start: {x: 0, y: 0},
                        target: dragTarget.graphVertex,
                    })
                }
            }

            if (this.mouseDownObject.type === "viewport") {
                const coordinates = this.getEventCoordinates(event);

                if (!this.mouseState.dragging) {
                    this.mouseState.dragging = true;

                    this.events.viewportDragStart.trigger({
                        x: coordinates.x,
                        y: coordinates.y,
                        start: coordinates,
                        target: null,
                    })
                } else {
                    this.events.viewportDrag.trigger({
                        x: coordinates.x,
                        y: coordinates.y,
                        start: {x: 0, y: 0},
                        target: null,
                    })
                }
            }

        });

        this.universe.viewport.addEventListener("mouseup", (event) => {
            // If the mouse is already down, event listener transitions it to a moving state
            if (!this.mouseState.dragging) return;

            if (this.mouseDownObject === null) {
                throw Error("We detected a end of dragging event but there is no mouse down object");
            }

            if (this.mouseDownObject.type === "vertex-entity") {
                const coordinates = this.getEventCoordinates(event);
                const dragTarget = this.mouseDownObject.object as VertexEntity<T>;

                this.events.vertexDragEnd.trigger({
                    x: coordinates.x,
                    y: coordinates.y,
                    start: {x: 0, y: 0},
                    target: dragTarget.graphVertex,
                })
            }

            if (this.mouseDownObject.type === "viewport") {
                const coordinates = this.getEventCoordinates(event);

                this.events.viewportDragEnd.trigger({
                    x: coordinates.x,
                    y: coordinates.y,
                    start: {x: 0, y: 0},
                    target: null,
                })
            }

            this.mouseDownObject = null;
            this.mouseState.down = false;
            this.dragHoveredVertex = null;
            this.mouseState.dragging = false;
        });
    }

    private getEventCoordinates(event: FederatedPointerEvent): Coordinates {
        return {
            x: (event.clientX - this.universe.viewport.transform.position.x) / this.universe.viewport.transform.scale.x,
            y: (event.clientY - this.universe.viewport.transform.position.y) / this.universe.viewport.transform.scale.y,
        };
    }

    public addEventListener<TEventName extends keyof GraphUniverseEventListener<T> ["events"]>(
        eventName: TEventName,
        handler: Parameters<GraphUniverseEventListener<T> ["events"][TEventName]["addHandler"]> [0]
    ): () => void {
        const event = this.events[eventName];

        // @ts-ignore
        event.addHandler(handler);

        return () => {
            // @ts-ignore
            event.removeHandler(handler);
        }
    }
}