import {Application} from "pixi.js";
import GraphUniverseState from "./States/GraphUniverseState";
import GraphUniverseConfiguration from "./GraphUniverseConfiguration";
import GraphUniverseExplorationState from "./States/GraphUniverseExplorationState";
import GraphUniverseCamera from "./GraphUniverseCamera";
import GraphUniverseEventListener from "./GraphUniverseEventListener";
import {Viewport} from "pixi-viewport";
import GraphLayoutController from "@/GraphUniverse/Embeddings/Embedding";
import PhysicsBasedEmbedding from "@/GraphUniverse/Embeddings/PhysicsBasedEmbedding";
import SimpleGraph from "@/GraphUniverse/Graph/SimpleGraph";
import Vertex from "@/GraphUniverse/Graph/Vertex";
import Graph from "@/GraphUniverse/Graph/Graph";
import GraphRenderingController from "@/GraphUniverse/GraphRenderingController";
import VertexEntity from "@/GraphUniverse/Entity/VertexEntity";
import {useOnClickOutside} from "next/dist/client/components/react-dev-overlay/internal/hooks/use-on-click-outside";

export default class GraphUniverse<T> {
    application: Application;
    configuration: GraphUniverseConfiguration<T>;
    graph: Graph<Vertex<T>> = new SimpleGraph();

    private hasInitialized = false;

    viewport: Viewport = null as unknown as Viewport;

    // Composite class extensions
    state: GraphUniverseState<T>;
    camera: GraphUniverseCamera<T>;
    embedding: GraphLayoutController<T>;
    listener: GraphUniverseEventListener<T>;
    renderingController: GraphRenderingController<T>;

    constructor(configuration: GraphUniverseConfiguration<T>) {
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

        this.camera = new GraphUniverseCamera(this);
        this.embedding = new PhysicsBasedEmbedding(this);
        this.state = new GraphUniverseExplorationState(this);
        this.listener = new GraphUniverseEventListener(this);
        this.renderingController = new GraphRenderingController(this);
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

    public getNeighbors(vertex: Vertex<T>): Vertex<T>[] {
        return this.graph.getNeighbor(vertex);
    }

    public createVertex(x: number, y: number) {
        const newVertex = new Vertex<T>();

        this.graph.addVertex(newVertex);

        this.listener.notifyVertexCreated({
            x,
            y,
            vertex: newVertex
        });
    }

    public createEdge(firstVertex: Vertex<T>, secondVertex: Vertex<T>) : void {
        const newVertex = new Vertex<T>();

        this.graph.addEdge(firstVertex, secondVertex);

        this.listener.notifyEdgeCreated(
            {
                IsDirected: false,
                sourceVertex:  secondVertex,
                targetVertex:firstVertex,
            }
        );
    }
}

