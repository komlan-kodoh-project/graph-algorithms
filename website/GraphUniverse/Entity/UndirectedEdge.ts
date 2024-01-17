import { Graphics, Text } from "pixi.js";
import { Edge } from '@/GraphUniverse/Graph/Graph';
import { Coordinates } from "@/GraphUniverse/Coordinates";


export type EdgeDisplayConfiguration<V, E> = {
    edgeColor: string
    texColor: string
    edgeMiddleLabel: (edge: Edge<V, E>) => string,
}

const edgeDefaultDisplayConfiguration: EdgeDisplayConfiguration<any, any> = {
    texColor: "red",
    edgeColor: "#7C98CD",
    edgeMiddleLabel: (edge) => "1",
}

export class UndirectedEdgeEntity<V, E> extends Graphics {
    private edge: Edge<V, E>;
    private sourceCoordinates: Coordinates;
    private destinationCoordinates: Coordinates;

    private displayConfiguration: EdgeDisplayConfiguration<V, E> = edgeDefaultDisplayConfiguration;

    constructor(sourceCoordinates: Coordinates, destinationCoordinates: Coordinates, edge: Edge<V, E>) {
        super();

        this.edge = edge;
        this.sourceCoordinates = sourceCoordinates;
        this.destinationCoordinates = destinationCoordinates;

        this.drawSelf();
    }

    public updateSourceCoordinates(newSourceCoordinates: Coordinates) {
        this.sourceCoordinates = newSourceCoordinates;

        this.drawSelf();
    }

    public updateDisplayConfiguration(displayConfiguration: Partial<EdgeDisplayConfiguration<V, E>>) {
        this.displayConfiguration = { ...this.displayConfiguration, ...displayConfiguration };
        this.drawSelf();
    }

    public updateDestinationCoordinates(newDestinationCoordinates: Coordinates) {
        this.destinationCoordinates = newDestinationCoordinates;

        this.drawSelf();
    }

    public getDisplayConfiguration(): EdgeDisplayConfiguration<V, E> {
        return { ...this.displayConfiguration };
    }

    private drawSelf() {
        this.clear();
        this.removeChildren();

        this.zIndex = 10;

        this.lineStyle(
            3,
            this.displayConfiguration.edgeColor,
        );

        this.moveTo(
            this.sourceCoordinates.x,
            this.sourceCoordinates.y
        );

        this.lineTo(
            this.destinationCoordinates.x,
            this.destinationCoordinates.y
        );

        // const text = new Text(
        //     this.displayConfiguration.edgeMiddleLabel(this.edge),
        //     {
        //         fontSize: 15,
        //         align: 'center',
        //         fontFamily: 'Arial',
        //         fill: this.displayConfiguration.texColor,
        //     }
        // );

        // text.position.set(
        //     (this.sourceCoordinates.x + this.destinationCoordinates.x) / 2,
        //     (this.sourceCoordinates.y + this.destinationCoordinates.y) / 2
        // );

        // text.anchor.set(0.5, 0.5);

        // this.addChild(text);
    }
}
