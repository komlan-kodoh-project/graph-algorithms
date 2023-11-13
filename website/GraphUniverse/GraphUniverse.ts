import { Application, Container, DisplayObject, Graphics, extensions } from "pixi.js";
import GraphUniverseState from "./States/GraphUniverseState";
import GraphUniverseConfiguration from "./GraphUniverseConfiguration";
import GraphUniverseExplorationState from "./States/GraphUniverseExplorationState";
import GraphUniverseCamera from "./GraphUniverseCamera";
import GraphUniverseEventListener, { GraphPointerEvent } from "./GraphUniverseEventListener";
import { Viewport } from "pixi-viewport";

export default class GraphUniverse {
    application: Application;
    configuration: GraphUniverseConfiguration;

    private hasInitialized = false;

    viewport: Viewport = null as unknown as Viewport;

    // Composite class extensions
    state: GraphUniverseState;
    camera: GraphUniverseCamera;
    listener: GraphUniverseEventListener;

    constructor(configuration: GraphUniverseConfiguration) {

        this.application = new Application({
            resolution: window.devicePixelRatio || 1,
            antialias: true,
            autoDensity: true,
        });

        this.viewport = new Viewport({
            events: this.application.renderer.events
        })

        this.configuration = configuration;

        this.camera = new GraphUniverseCamera(this);
        this.state = new GraphUniverseExplorationState(this);
        this.listener = new GraphUniverseEventListener(this);
    }


    public initialize() {
        if (this.hasInitialized) {
            throw new Error("Graph Universe has already been initialized");
        }


        this.application.renderer.background.color = 0xF1F5FE;
        this.application.resizeTo = this.configuration.container;
        this.configuration.container.appendChild(this.application.view as unknown as Node)

        this.viewport
            .pinch()
            .wheel()
            .decelerate();


        this.application.stage.addChild(this.viewport);


        this.listener.addClickEventListener(
            this.viewport,
            event => this.state.onStageClick(event)
        );

        this.hasInitialized = true;
    }


    public createVertex(x: number, y: number) {
        const vertex = new Graphics();

        // border
        vertex.beginFill(0x7C98CD);
        vertex.drawCircle(0, 0, 15);
        vertex.endFill();

        // interior
        vertex.beginFill(0xBBD3F0);
        vertex.drawCircle(0, 0, 12);
        vertex.endFill();

        // cordinate
        vertex.x = x;
        vertex.y = y;

        vertex.eventMode = 'static';

        this.listener.addClickEventListener(
            vertex,
            event => this.state.onStageClick(event)
        );


        this.viewport.addChild(vertex);
    }
}

