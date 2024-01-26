import { Container, Graphics, Text } from "pixi.js";
import { Edge, GraphOperationMode } from '@/GraphUniverse/Graph/Graph';
import { Coordinates } from "@/GraphUniverse/Coordinates";
import { ConfigurationManager } from "./ConfigurationController";


export type EdgeDisplayConfiguration<V = any, E = any> = {
    texColor: string
    edgeColor: string
    labelBackground: string
    showWeight: boolean,
    directed: boolean,
    edgeMiddleLabel: (edge: Edge<V, E>) => string,
}

const edgeDefaultDisplayConfiguration: EdgeDisplayConfiguration<any, any> = {
    texColor: "black",
    edgeColor: "black",
    labelBackground: "black",
    directed: false,
    showWeight: false,
    edgeMiddleLabel: (edge) => edge.weight.toString(),
}

export class EdgeEntity<V, E> extends Container {
    public edge: Edge<V, E>;
    private length: number = 100;
    private sourceCoordinates: Coordinates;
    private destinationCoordinates: Coordinates;

    private configuration: ConfigurationManager<EdgeDisplayConfiguration<V, E>>;
    private edgeLine: Graphics = new Graphics();
    private arrowLabel: Graphics = new Graphics();

    constructor(
        sourceCoordinates: Coordinates,
        destinationCoordinates: Coordinates,
        edge: Edge<V, E>,
        displayConfiguraton: Partial<EdgeDisplayConfiguration<V, E>> = {}
    ) {
        super();

        this.edge = edge;
        this.sourceCoordinates = sourceCoordinates;
        this.destinationCoordinates = destinationCoordinates;

        this.eventMode = 'static';
        this.sortableChildren = true;
        this.configuration = new ConfigurationManager({ ...edgeDefaultDisplayConfiguration, ...displayConfiguraton });

        this.addChild(this.edgeLine);
        this.addChild(this.arrowLabel);

        this.redraw_arrow();
        this.redraw_label();
    }

    public updateSourceCoordinates(newSourceCoordinates: Coordinates) {
        this.sourceCoordinates = newSourceCoordinates;

        this.handlePositionUpdate();
    }

    public updateDestinationCoordinates(newDestinationCoordinates: Coordinates) {
        this.destinationCoordinates = newDestinationCoordinates;

        this.handlePositionUpdate();
    }

    public updateDisplayConfiguration(displayConfiguration: Partial<EdgeDisplayConfiguration<V, E>>): () => void {
        const remover = this.configuration.addConfiguration(displayConfiguration);

        this.forceRerender();

        return () => {
            remover();
            this.forceRerender();
        };
    }

    resetConfiguration() {
        this.configuration.reset();
        this.forceRerender();
    }

    public forceRerender() {
        this.redraw_arrow();
        this.redraw_label();
    }

    private handlePositionUpdate() {
        const angle = Math.atan2(this.destinationCoordinates.y - this.sourceCoordinates.y, this.destinationCoordinates.x - this.sourceCoordinates.x);

        const distance = Math.sqrt(Math.pow(this.destinationCoordinates.x - this.sourceCoordinates.x, 2) + Math.pow(this.destinationCoordinates.y - this.sourceCoordinates.y, 2));

        const scale = distance / this.length;

        this.edgeLine.rotation = angle;
        this.edgeLine.scale.x = scale;
        this.edgeLine.position.set(this.sourceCoordinates.x, this.sourceCoordinates.y);

        this.arrowLabel.position.set(
            (this.destinationCoordinates.x + this.sourceCoordinates.x) / 2,
            (this.destinationCoordinates.y + this.sourceCoordinates.y) / 2
        )
    }

    private redraw_arrow() {
        const configuration = this.configuration.getCurrentConfiguration();
        if (configuration.directed) {
            this.redraw_directed_arrow();
        }

        else {
            this.redraw_undirected_arrow();
        }
    }

    private redraw_undirected_arrow() {
        const configuration = this.configuration.getCurrentConfiguration();

        if (this.edgeLine === null) {
            const arrow = new Graphics();

            this.edgeLine = arrow;
            this.addChild(this.edgeLine);
        }
        else {
            this.edgeLine.clear();
        }

        this.edgeLine.zIndex = 0;
        this.edgeLine.beginFill(configuration.edgeColor);

        // Set line style
        this.edgeLine.drawRect(0, - 1.5, this.length, 3);
    }


    private redraw_directed_arrow() {
        const configuration = this.configuration.getCurrentConfiguration();

        if (this.edgeLine) {
            this.removeChild(this.edgeLine)
        }

        const arrow = new Graphics();

        arrow.zIndex = 0;
        arrow.beginFill(configuration.edgeColor);

        // Set line style
        arrow.lineStyle(2, "transparent");
        arrow.drawRect(0, - 1.5, this.length, 3);

        this.addChild(arrow);
        this.edgeLine = arrow;
    }

    private redraw_label() {
        const configuration = this.configuration.getCurrentConfiguration();

        if (this.arrowLabel) {
            this.removeChild(this.arrowLabel);
        }

        const label = configuration.edgeMiddleLabel(this.edge);
        let height = 20;
        let width = label.length * 10 + 10;

        const textContainer = new Graphics();
        this.addChild(textContainer);

        textContainer.zIndex = 8;
        textContainer.beginFill(configuration.edgeColor);
        textContainer.drawRoundedRect(- width / 2, -height / 2, width, height, 8);

        width -= 5;
        height -= 5;
        textContainer.beginFill(configuration.labelBackground);
        textContainer.drawRoundedRect(- width / 2, -height / 2, width, height, 5);

        const text = new Text(
            configuration.edgeMiddleLabel(this.edge),
            {
                fontSize: 15,
                align: 'center',
                fontFamily: 'Arial',
                fill: configuration.edgeColor,
            }
        );

        text.resolution = 10;
        text.scale.y = 0.8
        text.position.set(0, 0);
        text.anchor.set(0.5, 0.5);

        textContainer.addChild(text);

        this.arrowLabel = textContainer;
    }
}
