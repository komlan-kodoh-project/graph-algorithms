import { Graphics, Text } from "pixi.js";
import { Vertex } from "@/GraphUniverse/Graph/Graph";
import { EdgeEntity } from "./EdgeEntity";
import { ConfigurationManager } from "./ConfigurationController";
import { AnyValue } from "@/utils/types";

export type VertexDisplayConfiguration<T = AnyValue> = {
  borderColor: string;
  innerColor: string;
  innerLabelGetter: (vertex: Vertex<T>) => string;
  underLabelDisplayConfiguration: (vertex: Vertex<T>) => string;
};

export const VertexDefaultDisplayConfiguration: VertexDisplayConfiguration<any> = {
  borderColor: "black",
  innerColor: "white",
  underLabelDisplayConfiguration: _ => "",
  innerLabelGetter: (vertex) => vertex.staticLabel,
};

export default class VertexEntity<V> extends Graphics {
  public graphVertex: Vertex<V>;
  public outgoingEdges: EdgeEntity<V, any>[] = [];
  public inComingEdges: EdgeEntity<V, any>[] = [];

  private configuration: ConfigurationManager<VertexDisplayConfiguration<V>>;

  constructor(
    x: number,
    y: number,
    vertex: Vertex<V>,
    displayConfiguration: Partial<VertexDisplayConfiguration<V>>
  ) {
    super();
    this.graphVertex = vertex;

    this.x = x;
    this.y = y;

    this.eventMode = "static";
    this.configuration = new ConfigurationManager({
      ...VertexDefaultDisplayConfiguration,
      ...displayConfiguration,
    });

    this.drawSelf();
  }

  public updateDisplayConfiguration(
    displayConfiguration: Partial<VertexDisplayConfiguration<V>>
  ): () => void {
    const remover = this.configuration.addConfiguration(displayConfiguration);

    this.drawSelf();

    return () => {
      remover();
      this.drawSelf();
    };
  }

  public resetConfiguration() {
    this.configuration.reset();
    this.drawSelf();
  }

  private drawSelf() {
    console.log(this.graphVertex)
    const configuration = this.configuration.getCurrentConfiguration();
    this.clear();
    this.removeChildren();

    this.zIndex = 20;

    // border
    this.beginFill(configuration.borderColor);
    this.drawCircle(0, 0, 15);
    this.endFill();

    // interior
    this.beginFill(configuration.innerColor);
    this.drawCircle(0, 0, 12);
    this.endFill();

    // Add text inside the square
    const text = new Text(configuration.innerLabelGetter(this.graphVertex), {
      fontFamily: "Arial",
      fontSize: 15,
      fill: configuration.borderColor,
      align: "center",
    });

    text.resolution = 4;
    text.position.set(0, 0);
    text.anchor.set(0.5, 0.5);

    const label = configuration.underLabelDisplayConfiguration(this.graphVertex);
    // Add text bellow the square
    const underText = new Text(label, {
      fontFamily: "Arial",
      fontSize: 15,
      fill: configuration.borderColor,
      align: "center",
      fontWeight: "bolder",
    });

    underText.resolution = 4;
    underText.position.set(0, 25);
    underText.anchor.set(0.5, 0.5);

    // this
    this.addChild(text);
    this.addChild(underText);
  }
}
