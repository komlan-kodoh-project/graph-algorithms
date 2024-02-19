import GraphUniverse from "./GraphUniverse";
import GraphUniverseComponent from "@/GraphUniverse/GraphUniverseComponent";
import { Wheel } from "pixi-viewport";

export default class GraphUniverseCamera<T, E> implements GraphUniverseComponent<T, E> {
  private universe: GraphUniverse<T, E>;

  constructor(universe: GraphUniverse<T, E>) {
    this.universe = universe;
  }

  public initialize(): void {
    // Disable default screen zoom on canvas element so that the universe can handle it
    this.universe.configuration.container.addEventListener("wheel", (event) => {
      event.preventDefault();
    });

    this.initializeZoomController();
  }

  private initializeZoomController() {
    // this.universe.viewport.plugins.
    this.universe.viewport.plugins.add(
      "custom-wheel",
      new Wheel(this.universe.viewport, {
        keyToPress: ["ControlLeft", "ControlRight"],
      })
    );

    this.universe.viewport
      .wheel({
        wheelZoom: false,
      })
      .drag({
        pressDrag: false,
      })
      .decelerate();
  }
}
