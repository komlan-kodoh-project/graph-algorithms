import {GraphUniverseState, WellKnownGraphUniverseState} from "@/GraphUniverse/States/GraphUniverseState";
import GraphUniverse from "../GraphUniverse";

export class GraphUniverseDesignState<T, E> implements GraphUniverseState<T, E> {
    private universe: GraphUniverse<T, E>;
    private cleanup: (() => void)[] = [];

    constructor(graphUniverse: GraphUniverse<T, E>) {
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

                    entity.updateDisplayConfiguration({
                        edgeColor: "#7ccd88",
                    });
                }
            ),

            this.universe.listener.addEventListener(
                "vertexDragEnd",
                (event) => {
                    const entity = this.universe.renderingController.getVertexEntity(event.target);

                    entity.updateDisplayConfiguration(
                        {
                            edgeColor: "#7C98CD"
                        }
                    );
                }
            ),

            this.universe.listener.addEventListener(
                "vertexToVertexDrag",
                (event) => {
                    this.universe.createEdge(event.sourceVertex, event.targetVertex);
                }
            )
        ]
    }

    uninstall(): void {
        this.cleanup.forEach(callback => callback());
    }
}
