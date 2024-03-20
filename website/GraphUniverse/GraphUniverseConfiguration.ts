import { Vertex } from "./Graph/Graph";
import SimpleGraph from "./Graph/SimpleGraph/SimpleGraph";

type GraphUniverseConfiguration<V, E> = {
  graph: SimpleGraph<V, E>;
  container: HTMLElement;
  backgroudColor: string;
  getVertexData: () =>  V;
  getVertexId: () =>  string;
  vertexLabel?: (vertex: Vertex<V>) => string;
  theme: {
    dark: string;
    light: string;
  };
  dangerAccent: {
    light: string;
    dark: string;
  };
  primaryAccent: {
    light: string;
    dark: string;
  };
  secondaryAccent: {
    light: string;
    dark: string;
  };
  darkAccent: {
    light: string;
    dark: string;
  };
};

export default GraphUniverseConfiguration;
