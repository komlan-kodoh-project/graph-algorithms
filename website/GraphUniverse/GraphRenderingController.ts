import GraphUniverseComponent from "@/GraphUniverse/GraphUniverseComponent";
import VertexEntity from "@/GraphUniverse/Entity/VertexEntity";
import { Edge, Vertex, getMeta, setMeta } from "@/GraphUniverse/Graph/Graph";
import GraphUniverse from "./GraphUniverse";
import { EdgeEntity } from "./Entity/EdgeEntity";

export default class GraphRenderingController<V, E> implements GraphUniverseComponent<V, E> {
  private universe: GraphUniverse<V, E>;
  private embeddingIsEnable: boolean = true;
  private previousRenderingTimeStamp: number = performance.now();
  private static readonly META_PROPERTY_NAME: string = "graph-renderer-meta-property-name";

  constructor(universe: GraphUniverse<V, E>) {
    this.universe = universe;
  }

  public start(): void {
    this.previousRenderingTimeStamp = performance.now();
    requestAnimationFrame((timestamp) => this.triggerRendering(timestamp));
  }

  private triggerRendering(timestamp: number): void {
    const delta = timestamp - this.previousRenderingTimeStamp;

    this.embeddingIsEnable && this.universe.embedding.update(delta);
    this.universe.application.ticker.update(timestamp);

    this.previousRenderingTimeStamp = timestamp;

    requestAnimationFrame((timestamp) => this.triggerRendering(timestamp));
  }

  public enableEmbedding(): void {
    this.embeddingIsEnable = true;
  }

  public disableEmbedding(): void {
    this.embeddingIsEnable = false;
  }

  public initialize(): void {
    this.universe.configuration.container.appendChild(
      this.universe.application.view as unknown as Node
    );

    // Disable default ticker so that the rendering controller can take  full control of rendering
    this.universe.application.ticker.stop();
    this.universe.application.renderer.background.color =
      this.universe.configuration.backgroudColor;
    this.universe.application.stage.addChild(this.universe.viewport);
    this.universe.application.resizeTo = this.universe.configuration.container;

    // event listener
    this.universe.listener.addEventListener("vertexAddedEvent", (event) => {
      // create a vertex corresponding to the new graph vertex in the visual world
      const vertexEntity = new VertexEntity(event.x, event.y, event.vertex, {
        innerColor: this.universe.configuration.theme["light"],
        borderColor: this.universe.configuration.theme["dark"],
      });

      // Attach metadata to the graph vertex to carry a reference to its corresponding universe rendering
      setMeta(event.vertex, GraphRenderingController.META_PROPERTY_NAME, vertexEntity);

      // Configure the listener, so it detects event targeting the vertex new vertex
      this.universe.listener.listenOnVertex(vertexEntity);

      // Finally add the new element to the view
      this.universe.viewport.addChild(vertexEntity);
    });

    this.universe.listener.addEventListener("edgeAdded", (event) => {
      const target = this.getVertexEntity(event.edge.targetVertex);
      const source = this.getVertexEntity(event.edge.sourceVertex);

      const newEdge = new EdgeEntity<V, E>(
        {
          x: source.x,
          y: source.y,
        },
        {
          x: target.x,
          y: target.y,
        },
        event.edge,
        {
          texColor: this.universe.configuration.theme["dark"],
          edgeColor: this.universe.configuration.theme["dark"],
          labelBackground: this.universe.configuration.theme["light"],
        }
      );

      setMeta(event.edge, GraphRenderingController.META_PROPERTY_NAME, newEdge);

      target.inComingEdges.push(newEdge);
      source.outgoingEdges.push(newEdge);

      this.universe.listener.listenOnEdge(newEdge);

      this.universe.viewport.addChild(newEdge);
    });

    this.universe.listener.addEventListener("vertexDeletedEvent", (event) => {
      const entity = getMeta<VertexEntity<V>>(
        event.target,
        GraphRenderingController.META_PROPERTY_NAME
      );

      this.universe.viewport.removeChild(entity);

      const neighbors = this.universe.graph.getAllNeighbors(event.target);

      for (const vertex of neighbors) {
        const edge = this.universe.graph.getEdge(event.target, vertex);

        const neighborEntity = getMeta<VertexEntity<V>>(
          vertex,
          GraphRenderingController.META_PROPERTY_NAME
        );

        const edgeEntity = getMeta<EdgeEntity<V, E>>(
          edge,
          GraphRenderingController.META_PROPERTY_NAME
        );

        neighborEntity.outgoingEdges = neighborEntity.outgoingEdges.filter(
          (neighborEdge: EdgeEntity<V, E>) => edgeEntity !== neighborEdge
        );

        neighborEntity.inComingEdges = neighborEntity.inComingEdges.filter(
          (neighborEdge: EdgeEntity<V, E>) => edgeEntity !== neighborEdge
        );

        this.universe.viewport.removeChild(edgeEntity);
      }
    });

    this.universe.listener.addEventListener("edgeDeletedEvent", (event) => {
      const entity = getMeta<EdgeEntity<V, E>>(
        event.target,
        GraphRenderingController.META_PROPERTY_NAME
      );

      this.universe.viewport.removeChild(entity);

      const sourceVertexEntity = getMeta<VertexEntity<V>>(
        event.target.sourceVertex,
        GraphRenderingController.META_PROPERTY_NAME
      );

      const destinationVertexEntity = getMeta<VertexEntity<V>>(
        event.target.targetVertex,
        GraphRenderingController.META_PROPERTY_NAME
      );

      sourceVertexEntity.outgoingEdges = sourceVertexEntity.outgoingEdges.filter(
        (edge: EdgeEntity<V, E>) => edge !== entity
      );

      destinationVertexEntity.inComingEdges = destinationVertexEntity.inComingEdges.filter(
        (edge: EdgeEntity<V, E>) => edge !== entity
      );
    });
  }

  public moveVertex(vertex: Vertex<V>, x: number, y: number) {
    const entity = getMeta<VertexEntity<V>>(vertex, GraphRenderingController.META_PROPERTY_NAME);

    entity.x = x;
    entity.y = y;

    for (const edge of entity.outgoingEdges) {
      edge.updateSourceCoordinates({
        x: entity.x,
        y: entity.y,
      });
    }

    for (const edge of entity.inComingEdges) {
      edge.updateDestinationCoordinates({
        x: entity.x,
        y: entity.y,
      });
    }
  }

  public getVertexEntity(vertex: Vertex<V>): VertexEntity<V> {
    return getMeta<VertexEntity<V>>(vertex, GraphRenderingController.META_PROPERTY_NAME);
  }

  public getEdgeEntity(edge: Edge<V, E>): EdgeEntity<V, E> {
    return getMeta<EdgeEntity<V, E>>(edge, GraphRenderingController.META_PROPERTY_NAME);
  }
}
