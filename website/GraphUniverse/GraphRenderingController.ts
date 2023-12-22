import GraphUniverse from "@/GraphUniverse/GraphUniverse";
import GraphUniverseComponent from "@/GraphUniverse/GraphUniverseComponent";
import {request} from "http";

export default class GraphRenderingController<T> implements GraphUniverseComponent<T> {
    private universe: GraphUniverse<T>;

    constructor(universe: GraphUniverse<T>) {
        this.universe = universe;
    }

    public initialize(): void {
        this.universe.configuration.container.appendChild(this.universe.application.view as unknown as Node)

        // Disable default ticker so that the rendering controller can date full control of rendering
        this.universe.application.ticker.stop();
        this.universe.application.renderer.background.color = 0xF1F5FE;
        this.universe.application.stage.addChild(this.universe.viewport);
        this.universe.application.resizeTo = this.universe.configuration.container;
    }

    public start(): void {
        this.triggerRendering(0);
    }

    private triggerRendering(timestamp: number): void {
        this.universe.embedding.update(timestamp);
        this.universe.application.ticker.update(timestamp);

        requestAnimationFrame(
            (timestamp) => this.triggerRendering(timestamp)
        );
    }
}
