import GraphUniverse from "../GraphUniverse";
import { GraphUniverseState, WellKnownGraphUniverseState } from "@/GraphUniverse/States/GraphUniverseState";

export class GraphUniverseExplorationState<V, E> implements GraphUniverseState<V, E> {
    private universe: GraphUniverse<V, E>;
    private cleanup: (() => void)[] = [];

    constructor(graphUniverse: GraphUniverse<V, E>) {
        this.universe = graphUniverse;
    }

    wellKnownStateName(): WellKnownGraphUniverseState {
        return WellKnownGraphUniverseState.Exploring;
    }

    initialize(): void {
        this.cleanup = [
            this.universe.listener.addEventListener(
                "vertexDragStart",
                (event) => {
                    this.universe.embedding.free(
                        event.target
                    );

                    this.universe.embedding.moveVertex(
                        event.target,
                        event.x,
                        event.y
                    );
                }
            ),

            this.universe.listener.addEventListener(
                "vertexDrag",
                (event) => {
                    this.universe.embedding.moveVertex(
                        event.target,
                        event.x,
                        event.y
                    );
                }
            ),

            this.universe.listener.addEventListener(
                "vertexDragEnd",
                (event) => {

                    this.universe.embedding.moveVertex(
                        event.target,
                        event.x,
                        event.y
                    );

                    this.universe.embedding.control(
                        event.target
                    );
                }
            ),

        ]
    }

    uninstall(): void {
        this.cleanup.forEach(callback => callback());
    }
}