import GraphUniverse from "../GraphUniverse";
import {GraphUniverseState, WellKnownGraphUniverseState} from "@/GraphUniverse/States/GraphUniverseState";
import {GraphUniverseVertex} from "@/GraphUniverse/Graph/GraphUniverseVertex";

export class GraphUniverseExplorationState<T extends GraphUniverseVertex> implements GraphUniverseState<T> {
    private universe: GraphUniverse<T>;
    private cleanup: (() => void)[] = [];

    constructor(graphUniverse: GraphUniverse<T>) {
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