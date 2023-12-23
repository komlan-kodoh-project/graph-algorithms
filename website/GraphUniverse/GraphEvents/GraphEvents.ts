export type GraphEventHandler<T> = (event: T) => void;
export default class GraphEvents<T> {
    private handlers: GraphEventHandler<T>[] = [];

    constructor() {

    }

    public addHandler(handler: GraphEventHandler<T>): void {
        this.handlers.push(handler);
    }

    public trigger(event: T): void {
        this.handlers.forEach(handler => handler(event));
    }
}