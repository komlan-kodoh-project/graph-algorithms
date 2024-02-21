import { PersistentGraphEventHandler } from "@/GraphUniverse/GraphEvents/PersistentGraphEventHandler";

/**
 * A persistent graph event is a form of graph event that is lived. Instead of simply firing ones. It fires once at the
 * start of the event and second time at the end.  A good of example of when this is useful is for event such as hover
 * event that start and end where a user might want to apply some code when the element enter a however state and clean when
 * the mouse leaves the hovered element
 */
export class PersistentGraphEvent<T> {
  private active: boolean = false;
  private previousEvent: T | null = null;
  private handlers: PersistentGraphEventHandler<T, object>[] = [];

  public addHandler(handler: PersistentGraphEventHandler<T, object>): void {
    if (this.active) {
      if (this.previousEvent === null) {
        throw new Error("The event is active but the previous event value is null");
      }

      handler.executeStart(this.previousEvent);
    }
    this.handlers.push(handler);
  }

  public isActive(): boolean {
    return this.active;
  }

  public removeHandler(handler: PersistentGraphEventHandler<T, object>): void {
    const index = this.handlers.indexOf(handler);

    if (index > -1) {
      this.handlers.splice(index, 1);
    }
  }

  public triggerStart(event: T): void {
    this.active = true;
    this.previousEvent = event;

    this.handlers.forEach((handler) => handler.executeStart(event));
  }

  public triggerEnd(event: T): void {
    this.handlers.forEach((handler) => handler.executeEnd(event));
    this.active = false;
  }
}
