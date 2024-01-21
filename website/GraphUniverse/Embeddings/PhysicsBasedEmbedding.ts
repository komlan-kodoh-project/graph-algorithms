import Embedding from "@/GraphUniverse/Embeddings/Embedding";
import Matter, { Bodies, Body, Constraint, Engine, Sleeping, World } from "matter-js";
import { Edge, getMeta, setMeta, Vertex } from "@/GraphUniverse/Graph/Graph";
import GraphUniverse from "../GraphUniverse";

export default class PhysicsBasedEmbedding<T, E> implements Embedding<T, E> {
    private static readonly META_PROPERTY_NAME: string = "physics-render-object";

    private readonly engine: Engine;
    private readonly universe: GraphUniverse<T, E>;

    constructor(graphUniverse: GraphUniverse<T, E>) {
        this.engine = Engine.create({
            gravity: { x: 0, y: 0 },
        });

        this.universe = graphUniverse;
    }

    initialize(): void {
        this.universe.listener.addEventListener("vertexAddedEvent", event => {
            const newPhysicVertex = this.addVertex(event.x, event.y);

            setMeta(
                event.vertex,
                PhysicsBasedEmbedding.META_PROPERTY_NAME,
                newPhysicVertex
            );
        });

        this.universe.listener.addEventListener("edgeAdded", event => {
            this.handleNewEdge(event.edge);
        });
    }

    control(target: Vertex<T>): void {
        const physicsVertex = getMeta<Matter.Body>(target, PhysicsBasedEmbedding.META_PROPERTY_NAME);

        Body.setStatic(
            physicsVertex,
            false
        );
    }

    free(target: Vertex<T>): void {
        const physicsVertex = getMeta<Matter.Body>(target, PhysicsBasedEmbedding.META_PROPERTY_NAME);

        Body.setStatic(
            physicsVertex,
            true
        );
    }

    moveVertex(target: Vertex<T>, x: number, y: number): void {
        const physicsVertex = getMeta<Matter.Body>(target, PhysicsBasedEmbedding.META_PROPERTY_NAME);

        Body.setPosition(
            physicsVertex,
            { x, y }
        );
    }


    private move(delta: number): void {
        Engine.update(this.engine, delta * 400);

        for (const graphNode of this.universe.graph.getAllVertices()) {
            const body = getMeta<Matter.Body>(graphNode, PhysicsBasedEmbedding.META_PROPERTY_NAME);

            this.universe.renderingController.moveVertex(
                graphNode,
                body.position.x,
                body.position.y
            );
        };
    }

    private handleNewEdge(newEdge : Edge<T, E>): void {
        const firstBody = getMeta<Matter.Body>(newEdge.sourceVertex, PhysicsBasedEmbedding.META_PROPERTY_NAME);
        const secondBody = getMeta<Matter.Body>(newEdge.targetVertex, PhysicsBasedEmbedding.META_PROPERTY_NAME);

        const constraint = Constraint.create({
            bodyA: firstBody,
            bodyB: secondBody,
            damping: 0,
            stiffness: 1 / 30,
            length: 150
        });

        World.addConstraint(this.engine.world, constraint);
    }

    private addVertex(x: number, y: number): Matter.Body {
        const particle = Bodies.circle(
            x,
            y,
            19
        );

        particle.frictionAir = 0.5;

        World.add(this.engine.world, particle);

        return particle;
    }

    public update(delta: number): void {
        this.move(delta / 1000);
    }
}