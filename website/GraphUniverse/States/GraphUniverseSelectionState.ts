import {GraphUniverseState, WellKnownGraphUniverseState} from "@/GraphUniverse/States/GraphUniverseState";
import GraphUniverse from "../GraphUniverse";

export class GraphUniverseSelectionState<T, E> implements GraphUniverseState<T, E> {
    private universe: GraphUniverse<T, E>;
    private cleanup: (() => void)[] = [];

    constructor(graphUniverse: GraphUniverse<T, E>) {
        this.universe = graphUniverse;
    }

    wellKnownStateName(): WellKnownGraphUniverseState {
        return WellKnownGraphUniverseState.NodeSelection;
    }
    initialize(): void {
        this.cleanup = [
            this.universe.listener.addPersistentEventListener(
                "vertexHover",
                (event) => {
                    const vertex = this.universe.renderingController.getVertexEntity(event.targetVertex);

                    const previousDisplayConfiguration = vertex.getDisplayConfiguration();

                    vertex.updateDisplayConfiguration({
                        innerColor: "#e1ebf7",
                    })

                    return {
                        previousDisplayConfiguration
                    }
                },
                (event, data) => {

                    this.universe
                        .renderingController
                        .getVertexEntity(event.targetVertex)
                        .updateDisplayConfiguration(data.previousDisplayConfiguration);
                },
            ),
            this.universe.listener.addEventListener(
                "vertexClickedEvent",
                (event) => {
                    this.universe.listener.notifyVertexSelected({vertex: event.vertex});
                }
            )
        ]
    }

    uninstall(): void {
        this.cleanup.forEach(callback => callback());
    }
}