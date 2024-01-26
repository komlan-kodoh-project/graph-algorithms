import { Application } from "pixi.js";
import { sleep } from "@/utils/helpers";
import { AnyValue } from "@/utils/types";
import { Viewport } from "pixi-viewport";
import { Edge, Graph, Vertex } from "./Graph/Graph";
import GraphUniverseCamera from "./GraphUniverseCamera";
import { EdgeDisplayConfiguration } from "./Entity/EdgeEntity";
import { VertexDisplayConfiguration } from './Entity/VertexEntity';
import GraphUniverseEventListener from "./GraphUniverseEventListener";
import GraphUniverseConfiguration from "./GraphUniverseConfiguration";
import SimpleGraph from "@/GraphUniverse/Graph/SimpleGraph/SimpleGraph";
import GraphLayoutController from "@/GraphUniverse/Embeddings/Embedding";
import GraphRenderingController from "@/GraphUniverse/GraphRenderingController";
import PhysicsBasedEmbedding from "@/GraphUniverse/Embeddings/PhysicsBasedEmbedding";
import { GraphUniverseDesignState } from "@/GraphUniverse/States/GraphUniverseDesignState";
import { WellKnownGraphUniverseState, GraphUniverseState, StateFactory } from "@/GraphUniverse/States/GraphUniverseState";

export default class GraphUniverse<V = AnyValue, E = AnyValue> {
    private hasInitialized: boolean = false;

    application: Application;
    configuration: GraphUniverseConfiguration<V, E>;
    graph: SimpleGraph<V, E> = new SimpleGraph();


    viewport: Viewport = null as unknown as Viewport;

    // Composite class extensions
    state: GraphUniverseState<V, E>;
    camera: GraphUniverseCamera<V, E>;
    embedding: GraphLayoutController<V, E>;
    listener: GraphUniverseEventListener<V, E>;
    renderingController: GraphRenderingController<V, E>;

    constructor(configuration: GraphUniverseConfiguration<V, E>) {
        this.application = new Application({
            resolution: window.devicePixelRatio || 1,
            antialias: true,
            autoDensity: true
        });

        this.viewport = new Viewport({
            events: this.application.renderer.events,
        });

        // TODO: Change this to use layers
        this.viewport.sortableChildren = true;

        this.configuration = configuration;

        this.camera = new GraphUniverseCamera(this as any);
        this.embedding = new PhysicsBasedEmbedding(this as any);
        this.state = new GraphUniverseDesignState(this as any);
        this.listener = new GraphUniverseEventListener(this as any);
        this.renderingController = new GraphRenderingController(this as any);
    }


    public initialize() {
        if (this.hasInitialized) {
            throw new Error("Graph Universe has already been initialized");
        }

        // Initialize universe components
        this.renderingController.initialize();
        this.listener.initialize();

        this.camera.initialize();
        this.embedding.initialize();
        this.state.initialize();

        this.renderingController.start();

        this.hasInitialized = true;
    }

    public setWellKnownState(state: WellKnownGraphUniverseState): void {
        const newState = StateFactory.getState(
            state,
            this
        );

        this.setState(newState)
    }

    public setState(state: GraphUniverseState<V, E>): void {
        const previousState = this.state;
        this.state.uninstall();

        this.state = state;
        this.state.initialize();

        this.listener.notifyUniverseStateUpdate({
            previousState: previousState,
            currentState: this.state,
        })
    }

    public createVertex(x: number, y: number): Vertex<V> {
        const newVertex = this.graph.createVertex(null);

        this.listener.notifyVertexCreated({
            x,
            y,
            vertex: newVertex
        });

        return newVertex;
    }

    public createEdge(firstVertex: Vertex<V>, secondVertex: Vertex<V>): void {
        const newEdge = this.graph.addEdge(firstVertex, secondVertex, null);

        this.listener.notifyEdgeCreated({
            edge: newEdge,
        });
    }

    public updateVertexRendering(vertex: Vertex<V>, newVertexRendering: Partial<VertexDisplayConfiguration<V>>): () => void {
        const newVertex = this.renderingController.getVertexEntity(vertex);

        return newVertex.updateDisplayConfiguration(newVertexRendering);
    }

    public updateEdgeRendering(edge: Edge<V, E>, newEdgeRendering: Partial<EdgeDisplayConfiguration<V, E>>): () => void {
        const edgeEntity = this.renderingController.getEdgeEntity(edge);

        return edgeEntity.updateDisplayConfiguration(newEdgeRendering);

    }

    public updateEdge(edge: Edge<V, E>, weight: number) {
        edge.weight = weight;
        const edgeEntity = this.renderingController.getEdgeEntity(edge);

        edgeEntity.forceRerender();
    }

    public resetAllDisplayConfiguration() {
        for (const vertex of this.graph.getAllVertices()) {
            const vertexEntity = this.renderingController.getVertexEntity(vertex);
            vertexEntity.resetConfiguration();
        }

        for (const edges of this.graph.getAllEdges()) {
            const vertexEntity = this.renderingController.getEdgeEntity(edges);
            vertexEntity.resetConfiguration();
        }
    }


    public async generateRandomGraph(numNodes: number): Promise<void> {
        const vertices = [];
        const edges = [];

        const generateRandomInteger = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

        for (let i = 0; i < numNodes; i++) {
            const x = generateRandomInteger(20, 1000);
            const y = generateRandomInteger(20, 1000);
            const vertex = this.createVertex(x, y);
            vertices.push(vertex);

            if (i > 0) {
                const randomVertexIndex = Math.floor(Math.random() * i);
                const randomExistingVertex = vertices[randomVertexIndex];
                this.createEdge(vertex, randomExistingVertex);
                edges.push({ vertex1: vertex, vertex2: randomExistingVertex });
            }

            await sleep(400);
        }
    }
}

