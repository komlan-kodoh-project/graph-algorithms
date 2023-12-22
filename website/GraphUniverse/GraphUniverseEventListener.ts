import GraphUniverse from "./GraphUniverse";
import GraphEvents from "@/GraphUniverse/GraphEvents/GraphEvents";
import VertexAddedEvent, {
    EdgeAddedEvent,
    VertexClickedEvent,
    VertexDragEvent, VertexToVertexDrag,
    ViewClickedEvent
} from "@/GraphUniverse/GraphEvents/VertexAddedEvent";
import Vertex from "@/GraphUniverse/Graph/Vertex";
import VertexEntity from "@/GraphUniverse/Entity/VertexEntity";

export default class GraphUniverseEventListener<T> {
    private universe: GraphUniverse<T>;

    private isDragging: boolean = false;
    private mouseDownVertex: VertexEntity<T> | null = null;
    private mouseDownEdge: VertexEntity<T> | null = null;
    private mouseDownOnView: boolean = false;

    private events = {
        edgeAddedEvent: new GraphEvents<EdgeAddedEvent<T>>(),
        vertexDragEnd: new GraphEvents<VertexDragEvent<T>>(),
        vertexDragStart: new GraphEvents<VertexDragEvent<T>>(),
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
        this.configureViewEventListener();
    }

    public notifyVertexCreated(event: VertexAddedEvent<T>) {
        this.events.vertexAddedEvent.trigger(event)
    }

    public notifyEdgeCreated(event: EdgeAddedEvent<T>) {
        this.events.edgeAddedEvent.trigger(event);
    }

    public listenOn(entity: VertexEntity<T>) {
        entity.addEventListener("mousedown", (event) => {
            event.stopPropagation();
            this.mouseDownVertex = event.target as VertexEntity<T>;
            console.log("mouse down stuff", this.mouseDownVertex.id);
        });

        entity.addEventListener("mousemove", (event) => {
            event.stopPropagation();
            const target = event.target as VertexEntity<T>;

            if (this.mouseDownVertex === target && !this.isDragging) {
                this.isDragging = true;
                this.events.vertexDragStart.trigger({
                    x: event.clientX,
                    y: event.clientY,
                    vertex: target.graphVertex,
                });
            }
        });

        entity.addEventListener("mouseup", (event) => {
            const target = event.target as VertexEntity<T>;

            if (!this.isDragging || this.mouseDownVertex === target) return;

            this.events.vertexToVertexDrag.trigger({
                IsDirected: false,
                targetVertex: target.graphVertex,
                sourceVertex: this.mouseDownVertex!.graphVertex,
            })
        });

    }

    private configureViewEventListener() {
        this.universe.viewport.addEventListener("mousedown", (event) => {
            this.mouseDownOnView = true;
        })

        this.universe.viewport.addEventListener("mouseup", (event) => {
            if (this.isDragging) {
                event.stopPropagation();
                this.isDragging = false;
                this.events.vertexDragEnd.trigger({
                    x: event.clientX,
                    y: event.clientY,
                    vertex: this.mouseDownVertex?.graphVertex!,
                });
            } else {
                this.events.viewClickedEvent.trigger({
                    x: (event.clientX - this.universe.viewport.transform.position.x) / this.universe.viewport.transform.scale.x,
                    y: (event.clientY - this.universe.viewport.transform.position.y) / this.universe.viewport.transform.scale.y,
                    sourceEvent: event
                });
            }

            console.log("Cleaning up on mouse up");

            this.mouseDownEdge = null;
            this.mouseDownVertex = null;
            this.mouseDownOnView = false;
        });

    }


    public addEventListener<TEventName extends keyof GraphUniverseEventListener<T>["events"]>(
        eventName: TEventName,
        handler: Parameters<GraphUniverseEventListener<T>["events"][TEventName]["addHandler"]>[0]
    ) {
        const event = this.events[eventName];
        // @ts-ignore
        event.addHandler(handler);
    }

}