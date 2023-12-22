import {Graphics} from "pixi.js";
import {Coordinates} from "@/GraphUniverse/Coordinates";
import {VertexDisplayConfiguration} from "@/GraphUniverse/Entity/VertexEntity";


export default class UndirectedEdge<T> extends Graphics {
    private sourceCoordinates: Coordinates;
    private destinationCoordinates: Coordinates;

    constructor(sourceCoordinates: Coordinates, destinationCoordinates: Coordinates) {
        super();

        this.sourceCoordinates = sourceCoordinates;
        this.destinationCoordinates = destinationCoordinates;

        this.drawSelf(
            sourceCoordinates,
            destinationCoordinates,
        );
    }

    public updateSourceCoordinates(newSourceCoordinates: Coordinates) {
        this.sourceCoordinates = newSourceCoordinates;

        this.drawSelf(
            this.sourceCoordinates,
            this.destinationCoordinates
        );
    }

    public updateDestinationCoordinates(newDestinationCoordinates: Coordinates) {
        this.destinationCoordinates = newDestinationCoordinates;

        this.drawSelf(
            this.sourceCoordinates,
            this.destinationCoordinates
        );
    }

    private drawSelf(sourceCoordinates: Coordinates, destinationCoordinates: Coordinates) {
        this.clear();

        this.zIndex = 10;
        // Draw the line (endPoint should be relative to myGraph's position)

        this.lineStyle(3, 0x7C98CD);
        this.moveTo(sourceCoordinates.x, sourceCoordinates.y);
        this.lineTo(destinationCoordinates.x, destinationCoordinates.y);
    }
}
