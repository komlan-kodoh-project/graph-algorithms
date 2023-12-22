import Matter from "matter-js";
import {ColorSource, Graphics} from "pixi.js";
import Vertex from "@/GraphUniverse/Graph/Vertex";
import {underline} from "next/dist/lib/picocolors";

export type VertexDisplayConfiguration = {
    edgeColor?: ColorSource
    innerColor?: ColorSource
}

const VertexDefaultDisplayConfiguration: VertexDisplayConfiguration = {
    edgeColor: 0x7C98CD,
    innerColor: 0xBBD3F0,
}

export default class VertexEntity<T> extends Graphics {
    public graphVertex: Vertex<T>;
    private displayConfiguration: VertexDisplayConfiguration = VertexDefaultDisplayConfiguration;

    constructor(x: number, y: number, vertex: Vertex<T>) {
        super();
        this.graphVertex = vertex;

        this.x = x;
        this.y = y;

        this.eventMode = 'static';
        this.drawSelf(this.displayConfiguration);
    }

    public updateDisplayConfiguration(displayConfiguration: VertexDisplayConfiguration) {
        this.displayConfiguration = {...this.displayConfiguration, ...displayConfiguration};
        this.drawSelf(this.displayConfiguration);
    }

    private drawSelf(displayConfiguration: VertexDisplayConfiguration) {
        // border
        this.beginFill(displayConfiguration.edgeColor);
        this.drawCircle(0, 0, 15);
        this.endFill();

        // interior
        this.beginFill(displayConfiguration.innerColor);
        this.drawCircle(0, 0, 12);
        this.endFill();
    }
}