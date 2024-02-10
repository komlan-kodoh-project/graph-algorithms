import {
  GraphUniverseState,
  WellKnownGraphUniverseState,
} from "@/GraphUniverse/States/GraphUniverseState";
import GraphUniverse from "../GraphUniverse";
import VertexEntity from "../Entity/VertexEntity";

export class GraphUniverseDeletionState<V, E> implements GraphUniverseState<V, E> {
  private cleanup: (() => void)[] = [];
  private universe: GraphUniverse<V, E>;

  private modificationCleanup: (() => void) | null = null;
  private relativeCurrentVertexDragSource: VertexEntity<V> | null = null;

  constructor(graphUniverse: GraphUniverse<V, E>) {
    this.universe = graphUniverse;
  }

  wellKnownStateName(): WellKnownGraphUniverseState {
    return WellKnownGraphUniverseState.Deleting;
  }

  initialize(): void {
    this.cleanup = [
      this.universe.listener.addEventListener("vertexClickedEvent", (event) => {
        this.universe.deleteVertex(event.vertex);
      }),

      this.universe.listener.addEventListener("edgeClickedEvent", (event) => {
        this.universe.deleteEdge(event.edge);
      }),

      this.universe.listener.addPersistentEventListener(
        "vertexHover",
        (event) => {
          const vertex = this.universe.renderingController.getVertexEntity(event.targetVertex);

          return vertex.updateDisplayConfiguration({
            innerColor: "#e1ebf7",
          });
        },
        (event, cleanup) => {
          cleanup();
        }
      ),
    ];
  }

  uninstall(): void {
    this.cleanup.forEach((callback) => callback());
  }
}
