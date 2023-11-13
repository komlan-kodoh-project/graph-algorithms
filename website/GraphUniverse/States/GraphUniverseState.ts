import { GraphPointerEvent } from "../GraphUniverseEventListener";


export default interface GraphUniverseState {
    onStageClick(pointerEvent: GraphPointerEvent): void
}