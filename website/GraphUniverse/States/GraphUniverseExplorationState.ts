import GraphUniverse from "../GraphUniverse";
import {GraphUniverseState} from "@/GraphUniverse/States/GraphUniverseState";

export default class GraphUniverseExplorationState<T> implements GraphUniverseState<T> {
    private universe: GraphUniverse<T>;
    private cleanup: (() => void)[] = [];

    constructor(graphUniverse: GraphUniverse<T>) {
        this.universe = graphUniverse;
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