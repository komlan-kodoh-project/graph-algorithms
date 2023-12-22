import GraphUniverse from "../GraphUniverse";
import GraphUniverseState from "./GraphUniverseState";
import {ViewClickedEvent} from "@/GraphUniverse/GraphEvents/VertexAddedEvent";

export default class GraphUniverseExplorationState<T> implements GraphUniverseState<T> {
    private universe: GraphUniverse<T>;

    constructor(graphUniverse: GraphUniverse<T>) {
        this.universe = graphUniverse;
    }

    initialize(): void {
        this.universe.listener.addEventListener(
            "viewClickedEvent",
            (event) => {
                this.universe.createVertex(
                    event.x,
                    event.y
                )
            }
        );

        this.universe.listener.addEventListener(
            "vertexDragStart",
            (event) => {
                const entity = this.universe.renderingController.getVertexEntity(event.vertex);

                entity.updateDisplayConfiguration({
                    edgeColor: 0x7ccd88,
                });
            }
        );

        this.universe.listener.addEventListener(
            "vertexDragEnd",
            (event) => {
                const entity = this.universe.renderingController.getVertexEntity(event.vertex);

                entity.updateDisplayConfiguration(
                    {
                        edgeColor: 0x7C98CD
                    }
                );
            }
        );

        this.universe.listener.addEventListener(
            "vertexToVertexDrag",
            (event) => {
                this.universe.createEdge(event.sourceVertex, event.targetVertex);
            }
        );
    }

    uninstall(): void {

    }

}