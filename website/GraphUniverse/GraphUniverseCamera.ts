import { extensions } from "pixi.js";
import GraphUniverse from "./GraphUniverse";

export default class GraphUniverseCamera {
    private universe: GraphUniverse;

    constructor(universe: GraphUniverse) {
        this.universe = universe;

        window.addEventListener('keydown', (e) => {

            let delta_x = 0;
            let delta_y = 0;

            if (e.key == "ArrowUp") {
                delta_y = - 10;
            }

            if (e.key == "ArrowDown") {
                delta_y = 10;
            }

            if (e.key == "ArrowLeft") {
                delta_x = - 10;
            }

            if (e.key == "ArrowRight") {
                delta_x = + 10;
            }

            this.universe.viewport.moveCenter(
                this.universe.viewport.center.x + delta_x,
                this.universe.viewport.center.y + delta_y
            )
        });
    }
}