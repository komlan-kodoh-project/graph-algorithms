import GraphUniverseComponent from "@/GraphUniverse/GraphUniverseComponent";
import GraphUniverse from "@/GraphUniverse/GraphUniverse";
import GraphUniverseDesignState from "@/GraphUniverse/States/GraphUniverseDesignState";
import GraphUniverseExplorationState from "@/GraphUniverse/States/GraphUniverseExplorationState";


export interface GraphUniverseState<T> extends GraphUniverseComponent<T> {
    uninstall(): void
}

export enum WellKnownGraphUniverseState {
    Editing,
    Exploring
}

export class StateFactory {
    private static stateMap = {
        [WellKnownGraphUniverseState.Editing]: (universe: GraphUniverse<any>) => new GraphUniverseDesignState(universe),
        [WellKnownGraphUniverseState.Exploring]: (universe: GraphUniverse<any>) => new GraphUniverseExplorationState(universe),
    } as const;

    static getState(editorState: WellKnownGraphUniverseState, universe: GraphUniverse<any>): GraphUniverseState<any> {
        return this.stateMap[editorState](universe);
    }
}
