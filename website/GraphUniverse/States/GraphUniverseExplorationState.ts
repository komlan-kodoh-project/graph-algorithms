import GraphUniverse from "../GraphUniverse";
import { GraphUniverseState, WellKnownGraphUniverseState } from "@/GraphUniverse/States/GraphUniverseState";

export class GraphUniverseExplorationState<V, E> implements GraphUniverseState<V, E> {
    private isDragging: boolean = false;
    private cleanup: (() => void)[] = [];
    private universe: GraphUniverse<V, E>;

    private dragModificationCleanup : (() => void) | null = null;

    constructor(graphUniverse: GraphUniverse<V, E>) {
        this.universe = graphUniverse;
    }

    wellKnownStateName(): WellKnownGraphUniverseState {
        return WellKnownGraphUniverseState.Exploring;
    }

    initialize(): void {
        this.cleanup = [
            this.universe.listener.addPersistentEventListener(
                "vertexHover",
                (event) => {
                    const vertexEntity = this.universe.renderingController.getVertexEntity(event.targetVertex);

                    return vertexEntity.updateDisplayConfiguration(
                        {
                            innerColor: this.universe.configuration.primaryAccent.light,
                            borderColor: this.universe.configuration.primaryAccent.dark,
                        }
                    );
                },

                (event, hoverCleanup) => {
                    if (this.isDragging){
                        return;
                    }

                    const vertexEntity = this.universe.renderingController.getVertexEntity(event.targetVertex);

                    hoverCleanup();
                },
            ),

            this.universe.listener.addEventListener(
                "vertexDragStart",
                (event) => {

                    const vertexEntity = this.universe.renderingController.getVertexEntity(event.target);

                    this.dragModificationCleanup = vertexEntity.updateDisplayConfiguration(
                        {
                            innerColor: this.universe.configuration.primaryAccent.light,
                            borderColor: this.universe.configuration.primaryAccent.dark,
                        }
                    );

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
                    if (this.dragModificationCleanup == null){
                        throw new Error("Can't reset have drag end because cleanup function is not defined");
                    }

                    this.dragModificationCleanup();
                    this.dragModificationCleanup = null;;


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