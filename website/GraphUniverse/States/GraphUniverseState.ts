import GraphUniverseComponent from "@/GraphUniverse/GraphUniverseComponent";
import { GraphUniverseDesignState } from "@/GraphUniverse/States/GraphUniverseDesignState";
import { GraphUniverseExplorationState } from "@/GraphUniverse/States/GraphUniverseExplorationState";
import { GraphUniverseSelectionState } from "@/GraphUniverse/States/GraphUniverseSelectionState";
import GraphUniverse from "../GraphUniverse";


export interface GraphUniverseState<T, E> extends GraphUniverseComponent<T, E> {
    uninstall(): void
    wellKnownStateName(): WellKnownGraphUniverseState;
}

export enum WellKnownGraphUniverseState {
    Editing,
    Exploring,
    NodeSelection
}

export class StateFactory {
    private static stateMap = {
        [WellKnownGraphUniverseState.Editing]: (universe: GraphUniverse<any, any>) => new GraphUniverseDesignState(universe),
        [WellKnownGraphUniverseState.Exploring]: (universe: GraphUniverse<any, any>) => new GraphUniverseExplorationState(universe),
        [WellKnownGraphUniverseState.NodeSelection]: (universe: GraphUniverse<any, any>) => new GraphUniverseSelectionState(universe),
    } as const;

    static getState(editorState: WellKnownGraphUniverseState, universe: GraphUniverse<any, any>): GraphUniverseState<any, any> {
        return this.stateMap[editorState](universe);
    }
}
