import GraphUniverseState from "@/GraphUniverse/States/GraphUniverseState";
import GraphUniverse from "@/GraphUniverse/GraphUniverse";

export default class GraphUniverseDesignState<T> implements GraphUniverseState<T> {
    private universe: GraphUniverse<T>;
    private cleanup: (() => void)[] = [];

    constructor(graphUniverse: GraphUniverse<T>) {
        this.universe = graphUniverse;
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
                        edgeColor: 0x7ccd88,
                    });
                }
            ),

            this.universe.listener.addEventListener(
                "vertexDragEnd",
                (event) => {
                    const entity = this.universe.renderingController.getVertexEntity(event.target);

                    entity.updateDisplayConfiguration(
                        {
                            edgeColor: 0x7C98CD
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
