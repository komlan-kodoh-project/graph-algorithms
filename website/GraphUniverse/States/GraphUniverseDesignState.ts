import { GraphUniverseState, WellKnownGraphUniverseState } from "@/GraphUniverse/States/GraphUniverseState";
import GraphUniverse from "../GraphUniverse";
import VertexEntity, { VertexDisplayConfiguration } from "../Entity/VertexEntity";

export class GraphUniverseDesignState<V, E> implements GraphUniverseState<V, E> {
    private cleanup: (() => void)[] = [];
    private universe: GraphUniverse<V, E>;

    private modificationCleanup: (() => void) | null = null;
    private relativeCurrentVertexDragSource: VertexEntity<V> | null = null;

    constructor(graphUniverse: GraphUniverse<V, E>) {
        this.universe = graphUniverse;
    }

    wellKnownStateName(): WellKnownGraphUniverseState {
        return WellKnownGraphUniverseState.Editing;
    }

    initialize(): void {
        this.cleanup = [
            this.universe.listener.addEventListener(
                "viewClickedEvent",
                (event) => {
                    this.universe.createVertex(
                        event.x,
                        event.y
                    )
                }
            ),

            this.universe.listener.addEventListener(
                "vertexDragStart",
                (event) => {
                    const entity = this.universe.renderingController.getVertexEntity(event.target);

                    this.relativeCurrentVertexDragSource = entity;

                    this.modificationCleanup = entity.updateDisplayConfiguration({
                        borderColor: this.universe.configuration.primaryAccent["dark"],
                    });
                }
            ),

            this.universe.listener.addEventListener(
                "vertexDragEnd",
                (event) => {
                    const entity = this.relativeCurrentVertexDragSource;

                    if (this.modificationCleanup === null || entity === null) {
                        throw new Error("Can't reset color after drag end because no color has been defined");
                    }

                    this.modificationCleanup();
                    this.modificationCleanup = null;
                }
            ),

            this.universe.listener.addEventListener(
                "vertexToVertexDrag",
                (event) => {
                    const sourceVertexEntity = this.universe.renderingController.getVertexEntity(event.sourceVertex);
                    const targetVertexEntity = this.universe.renderingController.getVertexEntity(event.targetVertex);

                    this.universe.createEdge(event.sourceVertex, event.targetVertex);

                    if (this.modificationCleanup === null) {
                        throw new Error("Can't reset color after drag end because no color has been defined");
                    }

                    // Reset  color of the source vertex to that it was before drag started
                    this.modificationCleanup();

                    // Use this target vertex as the drag source for the new edge 
                    this.modificationCleanup = targetVertexEntity.updateDisplayConfiguration({
                        borderColor: this.universe.configuration.primaryAccent["dark"],
                    });

                    this.relativeCurrentVertexDragSource = targetVertexEntity;
                }
            )
        ]
    }

    uninstall(): void {
        this.cleanup.forEach(callback => callback());
    }
}
