import GraphUniverse from "@/GraphUniverse/GraphUniverse";
import GraphUniverseComponent from "@/GraphUniverse/GraphUniverseComponent";
import VertexEntity from "@/GraphUniverse/Entity/VertexEntity";
import Vertex from "@/GraphUniverse/Graph/Vertex";
import UndirectedEdgeEntity from "@/GraphUniverse/Entity/UndirectedEdge";

export default class GraphRenderingController<T> implements GraphUniverseComponent<T> {
    private static readonly META_PROPERTY_NAME: string = "graph-renderer-meta-property-name";
    private universe: GraphUniverse<T>;

    constructor(universe: GraphUniverse<T>) {
        this.universe = universe;
    }

    public start(): void {
        this.triggerRendering(0);
    }

    public initialize(): void {
        this.universe.configuration.container.appendChild(this.universe.application.view as unknown as Node)

        // Disable default ticker so that the rendering controller can take  full control of rendering
        this.universe.application.ticker.stop();
        this.universe.application.renderer.background.color = 0xF1F5FE;
        this.universe.application.stage.addChild(this.universe.viewport);
        this.universe.application.resizeTo = this.universe.configuration.container;

        // event listener
        this.universe.listener.addEventListener("vertexAddedEvent", (event) => {
            // create a vertex corresponding to the new graph vertex in the visual world
            const vertexEntity = new VertexEntity(
                event.x,
                event.y,
                event.vertex
            );

            // Attach metadata to the graph vertex to carry a reference to its corresponding universe rendering
            event.vertex.addMeta(
                GraphRenderingController.META_PROPERTY_NAME,
                vertexEntity
            );

            // Configure the listener, so it detects event targeting the vertex new vertex
            this.universe.listener.listenOn(
                vertexEntity
            );

            // Finally add the new element to the view
            this.universe.viewport.addChild(
                vertexEntity
            );
        })

        this.universe.listener.addEventListener("edgeAddedEvent", event => {
            const target = this.getVertexEntity(event.targetVertex);
            const source = this.getVertexEntity(event.sourceVertex);

            const newEdge = new UndirectedEdgeEntity(
                {
                    x: source.x,
                    y: source.y
                },
                {
                    x: target.x,
                    y: target.y
                }
            );

            target.inComingEdges.push(newEdge);
            source.outgoingEdges.push(newEdge);

            // TODO: Attach data to the new create edge
            this.universe.viewport.addChild(
                newEdge
            );
        })
    }

    public moveVertex(vertex: Vertex<T>, x: number, y: number) {
        const entity = vertex.getMeta<VertexEntity<T>>(
            GraphRenderingController.META_PROPERTY_NAME
        );

        entity.x = x;
        entity.y = y;

        for (const edge of entity.outgoingEdges) {
            edge.updateSourceCoordinates({
                x: entity.x,
                y: entity.y
            });
        }

        for (const edge of entity.inComingEdges) {
            edge.updateDestinationCoordinates({
                x: entity.x,
                y: entity.y
            });
        }
    }

    public getVertexEntity(vertex: Vertex<T>): VertexEntity<T> {
        return vertex.getMeta<VertexEntity<T>>(
            GraphRenderingController.META_PROPERTY_NAME
        );
    }

    private triggerRendering(timestamp: number): void {
        this.universe.embedding.update(timestamp);
        this.universe.application.ticker.update(timestamp);

        requestAnimationFrame(
            (timestamp) => this.triggerRendering(timestamp)
        );
    }
}
