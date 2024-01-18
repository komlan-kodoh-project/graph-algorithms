export type EventEndHandler<T, Q> = (event: T, data: Q) => void;

export type EventStartHandler<T, Q> = (event: T) => Q;

export class PersistentGraphEventHandler<T, Q> {
    private startData: Q | null = null;
    private readonly endHandler: EventEndHandler<T, Q>;
    private readonly startHandler: EventStartHandler<T, Q>;

    constructor(
        startHandler: EventStartHandler<T, Q>,
        endHandler: EventEndHandler<T, Q>
    ) {
        this.startHandler = startHandler;
        this.endHandler = endHandler;
    }

    public executeStart(event: T): void {
        this.startData = this.startHandler(event);
    }

    public executeEnd(event: T): void {
        if (this.startData === null){
            throw  new Error("Execute end has been called but start Data is null.");
        }

        this.endHandler(event, this.startData);
    }
}