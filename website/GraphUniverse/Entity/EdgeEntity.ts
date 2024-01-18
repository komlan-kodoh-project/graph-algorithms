import { Container, Graphics, Text } from "pixi.js";
import { Edge, GraphOperationMode } from '@/GraphUniverse/Graph/Graph';
import { Coordinates } from "@/GraphUniverse/Coordinates";


export type EdgeDisplayConfiguration<V, E> = {
    edgeColor: string
    texColor: string
    edgeMiddleLabel: (edge: Edge<V, E>) => string,
}

const edgeDefaultDisplayConfiguration: EdgeDisplayConfiguration<any, any> = {
    texColor: "black",
    edgeColor: "#7C98CD",
    edgeMiddleLabel: (edge) => edge.weight.toString(),
}

export class UndirectedEdgeEntity<V, E> extends Container {
    public edge: Edge<V, E>;
    private length: number = 100;
    private sourceCoordinates: Coordinates;
    private destinationCoordinates: Coordinates;
    private mode: GraphOperationMode = GraphOperationMode.Undirected;

    private displayConfiguration: EdgeDisplayConfiguration<V, E> = edgeDefaultDisplayConfiguration;

    constructor(sourceCoordinates: Coordinates, destinationCoordinates: Coordinates, edge: Edge<V, E>) {
        super();

        this.edge = edge;
        this.sourceCoordinates = sourceCoordinates;
        this.destinationCoordinates = destinationCoordinates;

        this.eventMode = 'static';

        this.initialize();
        this.drawSelf();
    }

    public updateSourceCoordinates(newSourceCoordinates: Coordinates) {
        this.sourceCoordinates = newSourceCoordinates;

        this.drawSelf();
    }

    public updateDestinationCoordinates(newDestinationCoordinates: Coordinates) {
        this.destinationCoordinates = newDestinationCoordinates;

        this.drawSelf();
    }

    public updateDisplayConfiguration(displayConfiguration: Partial<EdgeDisplayConfiguration<V, E>>) {
        this.displayConfiguration = { ...this.displayConfiguration, ...displayConfiguration };
        this.initialize();
    }

    public forceRerender() {
        this.initialize();
    }

    public getDisplayConfiguration(): EdgeDisplayConfiguration<V, E> {
        return { ...this.displayConfiguration };
    }

    private drawSelf() {
        const angle = Math.atan2(this.destinationCoordinates.y - this.sourceCoordinates.y, this.destinationCoordinates.x - this.sourceCoordinates.x);

        const distance = Math.sqrt(Math.pow(this.destinationCoordinates.x - this.sourceCoordinates.x, 2) + Math.pow(this.destinationCoordinates.y - this.sourceCoordinates.y, 2));

        const scale = distance / this.length;

        this.rotation = angle;
        this.scale.x = scale;
        this.position.set(this.sourceCoordinates.x, this.sourceCoordinates.y);

        if (Math.abs(distance - this.length) > 30) {
            this.length = distance;
            this.scale.x = 1;
            this.initialize();
        }
    }

    private initialize() {
        if (this.mode === GraphOperationMode.Undirected) {
            this.initialize_undirected();
        }

        else if (this.mode === GraphOperationMode.Directed) {
            this.initialize_directed();
        }
    }

    private initialize_undirected() {
        this.removeChildren();

        this.zIndex = 10;


        // Create a Graphics object
        const arrow = new Graphics();
        this.addChild(arrow);

        arrow.beginFill(this.displayConfiguration.edgeColor);

        // Set line style
        arrow.lineStyle(2, "transparent");


        // Draw a rotated rectangle that serves as edge
        arrow.drawRect(0, - 1.5, this.length, 3);

        arrow.beginFill("#F1F5FE");
        const label = this.displayConfiguration.edgeMiddleLabel(this.edge);
        const width = label.length * 10 + 10;
        
        arrow.drawRoundedRect(this.length / 2 - width / 2, -width / 2, width, width, 5);

        const text = new Text(
            this.displayConfiguration.edgeMiddleLabel(this.edge),
            {
                fontSize: 15,
                align: 'center',
                fontFamily: 'Arial',
                fill: this.displayConfiguration.texColor,
            }
        );

        text.position.set(this.length / 2, 0);
        text.anchor.set(0.5, 0.5);

        this.addChild(text)

    }

    private initialize_directed() {
        this.removeChildren();

        this.zIndex = 10;


        // Create a Graphics object
        const arrow = new Graphics();
        this.addChild(arrow);

        arrow.beginFill(this.displayConfiguration.edgeColor);

        // Set line style
        arrow.lineStyle(2, "transparent");


        // Draw a rotated rectangle
        arrow.drawRect(15, - 1.5, this.length - 40, 3);

        arrow.moveTo(this.length - 15, 0);
        arrow.lineTo(this.length - 25, 0 - 5);
        arrow.lineTo(this.length - 25, 0 + 5);
        arrow.lineTo(this.length - 15, 0);
        arrow.closePath();
        arrow.endFill();


        arrow.beginFill("#F1F5FE");

        const label = this.displayConfiguration.edgeMiddleLabel(this.edge);
        const width = label.length * 10 + 10;
        
        arrow.drawRoundedRect(this.length / 2 - width / 2, -width / 2, width, width, 5);

        const text = new Text(
            this.displayConfiguration.edgeMiddleLabel(this.edge),
            {
                fontSize: 15,
                align: 'center',
                fontFamily: 'Arial',
                fill: this.displayConfiguration.texColor,
            }
        );

        text.position.set(this.length / 2, 0);
        text.anchor.set(0.5, 0.5);

        this.addChild(text)
    }
}
