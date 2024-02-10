import GraphUniverseComponent from "@/GraphUniverse/GraphUniverseComponent";
import { GraphUniverseDesignState } from "@/GraphUniverse/States/GraphUniverseDesignState";
import { GraphUniverseExplorationState } from "@/GraphUniverse/States/GraphUniverseExplorationState";
import { GraphUniverseSelectionState } from "@/GraphUniverse/States/GraphUniverseSelectionState";
import GraphUniverse from "../GraphUniverse";
import { AnyValue } from "@/utils/types";
import { GraphUniverseDeletionState } from "./GraphUniverseDeletionState";


export interface GraphUniverseState<T = AnyValue, E = AnyValue> extends GraphUniverseComponent<T, E> {
    uninstall(): void
    wellKnownStateName(): WellKnownGraphUniverseState;
}

type StateMap = { [K in WellKnownGraphUniverseState]: (u: GraphUniverse) => GraphUniverseState };

export enum WellKnownGraphUniverseState {
    Editing,
    Exploring,
    Deleting, 
    NodeSelection
}

export class StateFactory {
    private static stateMap:  StateMap= {
        [WellKnownGraphUniverseState.Deleting]: universe => new GraphUniverseDeletionState(universe),
        [WellKnownGraphUniverseState.Editing]: universe => new GraphUniverseDesignState(universe),
        [WellKnownGraphUniverseState.Exploring]: universe => new GraphUniverseExplorationState(universe),
        [WellKnownGraphUniverseState.NodeSelection]: universe => new GraphUniverseSelectionState(universe),
    } as const;

    static getState(editorState: WellKnownGraphUniverseState, universe: GraphUniverse<any, any>): GraphUniverseState<any, any> {
        return this.stateMap[editorState](universe);
    }
}
