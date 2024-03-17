import { EdgeEntity } from "@/GraphUniverse/Entity/EdgeEntity";
import GraphUniverse from "./GraphUniverse";
import VertexCreatedEvent, {
  EdgeAddedEvent,
  GraphDragEvent,
  VertexClickedEvent,
  VertexHoverEvent,
  VertexSelectedEvent,
  VertexToVertexDrag,
  ViewClickedEvent,
  GraphStateUpdateEvent,
  EdgeClickedEvent,
  VertexDeletedEvent,
  EdgeDeletedEvent,
  EdgeHoverEvent,
  GraphEmbeddingUpdatedEvent,
} from "@/GraphUniverse/GraphEvents/GraphEvents";
import VertexEntity from "@/GraphUniverse/Entity/VertexEntity";
import { Coordinates } from "@/GraphUniverse/Coordinates";
import { FederatedPointerEvent } from "pixi.js";
import { PersistentGraphEvent } from "@/GraphUniverse/GraphEvents/PersistentGraphEvent";
import { GraphEvent } from "@/GraphUniverse/GraphEvents/GraphEvent";
import {
  EventEndHandler,
  EventStartHandler,
  PersistentGraphEventHandler,
} from "@/GraphUniverse/GraphEvents/PersistentGraphEventHandler";
import { Vertex } from "@/GraphUniverse/Graph/Graph";

type MouseState = {
  down: boolean;
  dragging: boolean;
  location: Coordinates;
};

type MouseDownObject = {
  type: "vertex-entity" | "viewport" | "edge-entity";
  object: object;
};

export default class GraphUniverseEventListener<V, E> {
  private universe: GraphUniverse<V, E>;

  private mouseDownObject: MouseDownObject | null = null;
  private dragHoveredVertex: VertexEntity<V> | null = null;

  private mouseState: MouseState = {
    down: false,
    dragging: false,
    location: { x: 0, y: 0 },
  };

  private persistentEvents = {
    edgeHover: new PersistentGraphEvent<EdgeHoverEvent<V, E>>(),
    vertexHover: new PersistentGraphEvent<VertexHoverEvent<V>>(),
  } as const;

  private events = {
    stateUpdatedEvent: new GraphEvent<GraphStateUpdateEvent<V, E>>(),
    embeddingUpdatedEvent: new GraphEvent<GraphEmbeddingUpdatedEvent<V, E>>(),

    edgeAdded: new GraphEvent<EdgeAddedEvent<V, E>>(),

    vertexDragStart: new GraphEvent<GraphDragEvent<Vertex<V>>>(),
    viewportDragStart: new GraphEvent<GraphDragEvent<null>>(),

    vertexDrag: new GraphEvent<GraphDragEvent<Vertex<V>>>(),
    viewportDrag: new GraphEvent<GraphDragEvent<null>>(),

    vertexDragEnd: new GraphEvent<GraphDragEvent<Vertex<V>>>(),
    viewportDragEnd: new GraphEvent<GraphDragEvent<null>>(),

    vertexSelectedEvent: new GraphEvent<VertexSelectedEvent<V>>(),

    edgeClickedEvent: new GraphEvent<EdgeClickedEvent<V, E>>(),

    vertexAddedEvent: new GraphEvent<VertexCreatedEvent<V>>(),
    viewClickedEvent: new GraphEvent<ViewClickedEvent<V>>(),
    vertexClickedEvent: new GraphEvent<VertexClickedEvent<V>>(),
    vertexToVertexDrag: new GraphEvent<VertexToVertexDrag<V>>(),

    vertexDeletedEvent: new GraphEvent<VertexDeletedEvent<V>>(),
    edgeDeletedEvent: new GraphEvent<EdgeDeletedEvent<V, E>>(),
  } as const;

  constructor(universe: GraphUniverse<V, E>) {
    this.universe = universe;
  }

  initialize() {
    this.universe.application.stage.eventMode = "static";
    this.universe.application.stage.hitArea = this.universe.application.screen;

    this.configureViewDragListener();
    this.configureViewClickListener();
  }

  public notifyVertexCreated(event: VertexCreatedEvent<V>) {
    this.events.vertexAddedEvent.trigger(event);
  }

  public notifyVertexSelected(event: VertexSelectedEvent<V>) {
    this.events.vertexSelectedEvent.trigger(event);
  }

  public notifyVertexDeleted(event: VertexDeletedEvent<V>) {
    this.events.vertexDeletedEvent.trigger(event);
  }

  public notifyUniverseEmbeddingUpdated(event: GraphEmbeddingUpdatedEvent<V, E>) {
    this.events.embeddingUpdatedEvent.trigger(event);
  }

  public notifyUniverseStateUpdate(event: GraphStateUpdateEvent<V, E>) {
    this.events.stateUpdatedEvent.trigger(event);
  }

  public notifyEdgeCreated(event: EdgeAddedEvent<V, E>) {
    this.events.edgeAdded.trigger(event);
  }

  public notifyEdgeDeleted(event: EdgeDeletedEvent<V, E>) {
    this.events.edgeDeletedEvent.trigger(event);
  }

  public listenOnEdge(entity: EdgeEntity<V, E>): void {
    // Handle vertex click event
    entity.addEventListener("click", (event) => {
      this.events.edgeClickedEvent.trigger({
        edge: entity.graphEdge,
      });
    });

    entity.addEventListener("mousedown", (event) => {
      // We stop propagation so that the view is not alerted of this event  
      event.stopPropagation();

      this.events.edgeClickedEvent.trigger({
        edge: entity.graphEdge,
      });

      this.mouseDownObject = {
        type: "edge-entity",
        object: event.target as VertexEntity<V>,
      };
    });

    // Handles vertex hover event
    entity.addEventListener("mouseenter", (event) => {
      const target = event.target as EdgeEntity<V, E>;
      this.persistentEvents.edgeHover.triggerStart({
        target: target.graphEdge,
      });
    });

    entity.addEventListener("mouseleave", (event) => {
      const target = event.target as EdgeEntity<V, E>;
      this.persistentEvents.edgeHover.triggerEnd({
        target: target.graphEdge,
      });
    });
  }

  public listenOnVertex(entity: VertexEntity<V>): void {
    // Handles vertex hover event
    entity.addEventListener("pointerenter", (event) => {
      const target = event.target as VertexEntity<V>;

      // This if statement might seem redundant. But I ran into an issue where for this event listerner ran twice back to back
      // on pointer down
      if (this.persistentEvents.vertexHover.isActive()) {
        return;
      }

      this.persistentEvents.vertexHover.triggerStart({
        target: target.graphVertex,
      });
    });

    entity.addEventListener("pointerleave", (event) => {
      const target = event.target as VertexEntity<V>;
      this.persistentEvents.vertexHover.triggerEnd({
        target: target.graphVertex,
      });
    });

    // Handles vertex click and drag events
    entity.addEventListener("pointerdown", (event) => {
      // We stop propagation so the viewport is not alerted with this event
      event.stopPropagation();

      this.mouseState.down = true;
      this.mouseDownObject = {
        type: "vertex-entity",
        object: event.target as VertexEntity<V>,
      };
    });

    // Handles vertex drag events
    entity.addEventListener("pointermove", (event) => {
      // Only execute this handler if there is a drag event that has started on a vertex
      if (
        !(
          this.mouseState.dragging &&
          this.mouseDownObject !== null &&
          this.mouseDownObject.type === "vertex-entity"
        )
      ) {
        return;
      }

      const target = event.target as VertexEntity<V>;
      const dragVertexStart = this.mouseDownObject.object as VertexEntity<V>;

      // Handles first vertex after drag start
      if (this.dragHoveredVertex === null && target !== dragVertexStart) {
        this.events.vertexToVertexDrag.trigger({
          targetVertex: target.graphVertex,
          sourceVertex: dragVertexStart.graphVertex,
        });

        this.dragHoveredVertex = target;
      }

      // Handles subsequent vertex after drag start
      else if (this.dragHoveredVertex !== null && target !== this.dragHoveredVertex) {
        this.events.vertexToVertexDrag.trigger({
          targetVertex: target.graphVertex,
          sourceVertex: this.dragHoveredVertex.graphVertex,
        });

        this.dragHoveredVertex = target;
      }
    });
  }

  private configureViewClickListener(): void {
    this.universe.viewport.addEventListener("pointerup", (event) => {
      if (this.mouseState.dragging) {
        return;
      }

      if (this.mouseDownObject !== null && this.mouseDownObject.type === "viewport") {
        const coordinates = this.getEventCoordinates(event);

        this.events.viewClickedEvent.trigger({
          sourceEvent: event,
          x: coordinates.x,
          y: coordinates.y,
        });
      }

      if (this.mouseDownObject !== null && this.mouseDownObject.type === "vertex-entity") {
        const vertexTarget = this.mouseDownObject.object as VertexEntity<V>;

        this.events.vertexClickedEvent.trigger({
          vertex: vertexTarget.graphVertex,
        });
      }

      this.mouseDownObject = null;
      this.mouseState.down = false;
      this.dragHoveredVertex = null;
      this.mouseState.dragging = false;
    });
  }

  private reset() {
    this.mouseDownObject = null;
    this.mouseState.down = false;
    this.dragHoveredVertex = null;
    this.mouseState.dragging = false;
  }

  private configureViewDragListener() {
    this.universe.viewport.addEventListener("pointerdown", () => {
      this.mouseState.down = true;
      this.mouseDownObject = {
        type: "viewport",
        object: {},
      };
    });

    this.universe.viewport.addEventListener("pointermove", (event) => {
      // If the mouse is already down, event listener transitions it to a moving state
      if (!this.mouseState.down) return;

      if (this.mouseDownObject === null) {
        throw Error("We detected a dragging event but no down object");
      }

      if (this.mouseDownObject.type === "vertex-entity") {
        const coordinates = this.getEventCoordinates(event);
        const dragTarget = this.mouseDownObject.object as VertexEntity<V>;

        if (!this.mouseState.dragging) {
          this.mouseState.dragging = true;

          this.events.vertexDragStart.trigger({
            x: coordinates.x,
            y: coordinates.y,
            start: coordinates,
            target: dragTarget.graphVertex,
          });
        } else {
          this.events.vertexDrag.trigger({
            x: coordinates.x,
            y: coordinates.y,
            start: { x: 0, y: 0 },
            target: dragTarget.graphVertex,
          });
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
          });
        } else {
          this.events.viewportDrag.trigger({
            x: coordinates.x,
            y: coordinates.y,
            start: { x: 0, y: 0 },
            target: null,
          });
        }
      }
    });

    const dragStopHandler = (event: FederatedPointerEvent) => {
      // If the mouse is already down, event listener transitions it to a moving state
      if (!this.mouseState.dragging) return;

      if (this.mouseDownObject === null) {
        throw Error("We detected a end of dragging event but there is no mouse down object");
      }

      if (this.mouseDownObject.type === "vertex-entity") {
        const coordinates = this.getEventCoordinates(event);
        const dragTarget = this.mouseDownObject.object as VertexEntity<V>;

        this.events.vertexDragEnd.trigger({
          x: coordinates.x,
          y: coordinates.y,
          start: { x: 0, y: 0 },
          target: dragTarget.graphVertex,
        });
      }

      if (this.mouseDownObject.type === "viewport") {
        const coordinates = this.getEventCoordinates(event);

        this.events.viewportDragEnd.trigger({
          x: coordinates.x,
          y: coordinates.y,
          start: { x: 0, y: 0 },
          target: null,
        });
      }

      this.mouseDownObject = null;
      this.mouseState.down = false;
      this.dragHoveredVertex = null;
      this.mouseState.dragging = false;
    };

    this.universe.viewport.addEventListener("pointerleave", dragStopHandler);
    this.universe.viewport.addEventListener("pointerup", dragStopHandler);
  }

  private getEventCoordinates(event: FederatedPointerEvent): Coordinates {
    return {
      x:
        (event.clientX - this.universe.viewport.transform.position.x) /
        this.universe.viewport.transform.scale.x,
      y:
        (event.clientY - this.universe.viewport.transform.position.y) /
        this.universe.viewport.transform.scale.y,
    };
  }

  public addEventListener<TEventName extends keyof GraphUniverseEventListener<V, E>["events"]>(
    eventName: TEventName,
    handler: Parameters<GraphUniverseEventListener<V, E>["events"][TEventName]["addHandler"]>[0]
  ): () => void {
    const event = this.events[eventName];

    // @ts-ignore
    event.addHandler(handler);

    return () => {
      // @ts-ignore
      event.removeHandler(handler);
    };
  }

  public addPersistentEventListener<
    TEventName extends keyof GraphUniverseEventListener<V, E>["persistentEvents"],
    TEventStartData
  >(
    eventName: TEventName,
    startHandler: EventStartHandler<
      GraphUniverseEventListener<V, E>["persistentEvents"][TEventName] extends PersistentGraphEvent<
        infer T
      >
        ? T
        : unknown,
      TEventStartData
    >,
    endHandler: EventEndHandler<
      GraphUniverseEventListener<V, E>["persistentEvents"][TEventName] extends PersistentGraphEvent<
        infer T
      >
        ? T
        : unknown,
      TEventStartData
    >
  ): () => void {
    const event = this.persistentEvents[eventName];

    const newHandler = new PersistentGraphEventHandler(startHandler, endHandler);

    // @ts-ignore
    event.addHandler(newHandler);

    return () => {
      // @ts-ignore
      event.removeHandler(newHandler);
    };
  }
}
