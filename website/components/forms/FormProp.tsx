import {GraphUniverseEdgeData, GraphUniverseVertexData} from "@/components/GraphContainer";
import GraphUniverse from "@/GraphUniverse/GraphUniverse";
import {WellKnownGraphUniverseState} from "@/GraphUniverse/States/GraphUniverseState";

export type FormProp = {
    universe: GraphUniverse<GraphUniverseVertexData, GraphUniverseEdgeData>;
}
