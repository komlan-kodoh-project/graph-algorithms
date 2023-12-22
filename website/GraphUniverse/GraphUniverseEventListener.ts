import GraphUniverse from "./GraphUniverse";
import GraphEvents from "@/GraphUniverse/GraphEvents/GraphEvents";
import EdgeAddedEvent from "@/GraphUniverse/GraphEvents/EdgeAddedEvent";
import VertexAddedEvent, {
    VertexClickedEvent,
    VertexDragEvent,
    ViewClickedEvent
} from "@/GraphUniverse/GraphEvents/VertexAddedEvent";
import Vertex from "@/GraphUniverse/Graph/Vertex";
import VertexEntity from "@/GraphUniverse/Entity/VertexEntity";

export default class GraphUniverseEventListener<T> {
    private universe: GraphUniverse<T>;

    private isDraggingVertex : boolean = false;
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
    } as const;


    constructor(universe: GraphUniverse<T>) {
        this.universe = universe
    }

    initialize() {
        this.universe.application.stage.eventMode = 'static';
        this.universe.application.stage.hitArea = this.universe.application.screen;
        this.configureViewEventListener();
    }

    public notifyVertexCreated(newVertex: Vertex<T>) {
        this.configureVertexEventListener(newVertex);
        this.events.vertexAddedEvent.trigger({
            vertex: newVertex,
        })
    }

    private configureVertexEventListener(newVertex: Vertex<T>) {
        newVertex.entity.addEventListener("mousedown", (event) => {
            event.stopPropagation();
            this.mouseDownVertex = event.target as VertexEntity<T>;
            console.log("mouse down")
        });

        newVertex.entity.addEventListener("mousemove", (event) => {
            event.stopPropagation();
            const target = event.target as VertexEntity<T>;

            if (this.mouseDownVertex === target && !this.isDraggingVertex){
                this.isDraggingVertex  = true;
                this.events.vertexDragStart.trigger({
                    x: event.clientX,
                    y: event.clientY,
                    vertex: target.graphVertex,
                });
            }
        });
    }

    private configureViewEventListener() {
        this.universe.viewport.addEventListener("mousedown", (event) => {
            this.mouseDownOnView = true;
        })

        this.universe.viewport.addEventListener("mouseup", (event) => {
            if (this.isDraggingVertex){
                event.stopPropagation();
                this.isDraggingVertex  = false;
                this.events.vertexDragEnd.trigger({
                        x: event.clientX,
                    y: event.clientY,
                    vertex: this.mouseDownVertex?.graphVertex!,
                });
            }

            else{
                this.events.viewClickedEvent.trigger({
                    x: (event.clientX - this.universe.viewport.transform.position.x) / this.universe.viewport.transform.scale.x,
                    y: (event.clientY - this.universe.viewport.transform.position.y) / this.universe.viewport.transform.scale.y,
                    sourceEvent: event
                });
            }

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