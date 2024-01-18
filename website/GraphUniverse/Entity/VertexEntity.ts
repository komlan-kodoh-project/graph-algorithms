import { ColorSource, Graphics, Text, TextStyle } from "pixi.js";
import { Vertex } from "@/GraphUniverse/Graph/Graph";
import { UndirectedEdgeEntity } from "./EdgeEntity";

export type VertexDisplayConfiguration<T> = {
    edgeColor: string
    innerColor: string
    innerLabelGetter: (vertex: Vertex<T>) => string,
    underLabelDisplayConfiguration: (vertex: Vertex<T>) => string,
}

const VertexDefaultDisplayConfiguration: VertexDisplayConfiguration<any> = {
    edgeColor: "#7C98CD",
    innerColor: "#BBD3F0",
    innerLabelGetter: (vertex) => vertex.id.toString(),
    underLabelDisplayConfiguration: (vertex) => ""
}

export default class VertexEntity<T> extends Graphics {
    public graphVertex: Vertex<T>;
    public outgoingEdges: UndirectedEdgeEntity<T, any>[] = [];
    public inComingEdges: UndirectedEdgeEntity<T, any>[] = [];

    private displayConfiguration: VertexDisplayConfiguration<T> = VertexDefaultDisplayConfiguration;

    constructor(x: number, y: number, vertex: Vertex<T>) {
        super();
        this.graphVertex = vertex;

        this.x = x;
        this.y = y;

        this.eventMode = 'static';
        this.drawSelf();
    }

    public getDisplayConfiguration(): VertexDisplayConfiguration<T> {
        return { ...this.displayConfiguration };
    }

    public updateDisplayConfiguration(displayConfiguration: Partial<VertexDisplayConfiguration<T>>) {
        this.displayConfiguration = { ...this.displayConfiguration, ...displayConfiguration };
        this.drawSelf();
    }

    private drawSelf() {
        this.clear();
        this.removeChildren();

        this.zIndex = 20;

        // border
        this.beginFill(this.displayConfiguration.edgeColor);
        this.drawCircle(0, 0, 15);
        this.endFill();

        // interior
        this.beginFill(this.displayConfiguration.innerColor);
        this.drawCircle(0, 0, 12);
        this.endFill();

        // Add text inside the square
        const text = new Text(
            this.displayConfiguration.innerLabelGetter(this.graphVertex),
            {
                fontFamily: 'Arial',
                fontSize: 15,
                fill: this.displayConfiguration.edgeColor,
                align: 'center'
            }
        );

        text.position.set(0, 0);
        text.anchor.set(0.5, 0.5);

        // Add text bellow the square
        const underText = new Text(
            this.displayConfiguration.underLabelDisplayConfiguration(this.graphVertex),
            {
                fontFamily: 'Arial',
                fontSize: 15,
                fill: this.displayConfiguration.edgeColor,
                align: 'center',
            }
        );

        underText.position.set(0, 25);
        underText.anchor.set(0.5, 0.5);

        // this
        this.addChild(text);
        this.addChild(underText);
    }
}