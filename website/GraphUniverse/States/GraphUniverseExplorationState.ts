import GraphUniverse from "../GraphUniverse";
import GraphUniverseState from "./GraphUniverseState";
import {ViewClickedEvent} from "@/GraphUniverse/GraphEvents/VertexAddedEvent";

export default class GraphUniverseExplorationState<T> implements GraphUniverseState<T> {
    private graphUniverse: GraphUniverse<T>;

    constructor(graphUniverse: GraphUniverse<T>) {
        this.graphUniverse = graphUniverse;
    }

    initialize(): void {
        this.graphUniverse.listener.addEventListener(
            "viewClickedEvent",
            (event) => {
                this.graphUniverse.createVertex(
                    event.x,
                    event.y
                )
            }
        );

        this.graphUniverse.listener.addEventListener(
            "vertexDragStart",
            (event) => {
                event.vertex.entity.updateDisplayConfiguration({
                    edgeColor: 0x7ccd88,
                });
            }
        );

        this.graphUniverse.listener.addEventListener(
            "vertexDragEnd",
            (event) => {
                event.vertex.entity.updateDisplayConfiguration(
                    {
                        edgeColor: 0x7C98CD
                    }
                );
            }
        );
    }

    uninstall(): void {

    }

}