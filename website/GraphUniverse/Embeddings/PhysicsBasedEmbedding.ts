import GraphUniverse from "../GraphUniverse";
import Embedding, { WellKnownGraphUniverseEmbedding } from "@/GraphUniverse/Embeddings/Embedding";
import Matter, { Bodies, Body, Constraint, Engine, World } from "matter-js";
import { deleteMeta, Edge, getMeta, setMeta, Vertex } from "@/GraphUniverse/Graph/Graph";
import { render } from "react-dom";
import { renderToStaticNodeStream } from "react-dom/server";

export default class PhysicsBasedEmbedding<V, E> implements Embedding<V, E> {
  private static readonly META_PROPERTY_NAME: string = "physics-render-object";

  private isInstalled: boolean = false;
  private readonly engine: Engine;
  private cleanup: (() => void)[] = [];
  private readonly universe: GraphUniverse<V, E>;

  constructor(graphUniverse: GraphUniverse<V, E>) {
    this.engine = Engine.create({
      gravity: { x: 0, y: 0 },
    });

    this.universe = graphUniverse;
  }

  wellKnownEmbedingName(): WellKnownGraphUniverseEmbedding {
    return WellKnownGraphUniverseEmbedding.PhysicsBasedEmbedding;
  }

  uninstall(): void {
    this.isInstalled = false;

    // Remove all added metadata
    for (const vertex of this.universe.graph.getAllVertices()) {
      deleteMeta(vertex, PhysicsBasedEmbedding.META_PROPERTY_NAME);
<<<<<<< HEAD
=======
      console.log("uninstalled all the shit", vertex.id);
>>>>>>> origin/main
    }

    // Remove all added metadata
    for (const edge of this.universe.graph.getAllEdges()) {
      deleteMeta(edge, PhysicsBasedEmbedding.META_PROPERTY_NAME);
    }

    this.cleanup.forEach((callback) => callback());
  }

  initialize(): void {
    this.cleanup = [
      this.universe.listener.addEventListener("vertexAddedEvent", (event) => {
        const newPhysicVertex = this.addVertex(event.x, event.y);

        setMeta(event.vertex, PhysicsBasedEmbedding.META_PROPERTY_NAME, newPhysicVertex);
      }),

      this.universe.listener.addEventListener("edgeAdded", (event) => {
        const constraint = this.createContraint(event.edge);

        setMeta(event.edge, PhysicsBasedEmbedding.META_PROPERTY_NAME, constraint);
      }),

      this.universe.listener.addEventListener("edgeDeletedEvent", (event) => {
        this.removeEdgeConstraint(event.target);
      }),

      this.universe.listener.addEventListener("vertexDeletedEvent", (event) => {
        this.removeVertex(event.target);
      }),
    ];

    // Initializes all necessary physcis vertex
    for (const vertex of this.universe.graph.getAllVertices()) {
      const renderedVertex = this.universe.renderingController.getVertexEntity(vertex);

      const newPhysicVertex = this.addVertex(renderedVertex.x, renderedVertex.y);
      setMeta(vertex, PhysicsBasedEmbedding.META_PROPERTY_NAME, newPhysicVertex);
    }

    // Initializes all necessary physics constraint
    for (const edge of this.universe.graph.getAllEdges()) {
      const constraint = this.createContraint(edge);

      setMeta(edge, PhysicsBasedEmbedding.META_PROPERTY_NAME, constraint);
    }

    this.isInstalled = true;
  }

  control(target: Vertex<V>): void {
    const physicsVertex = getMeta<Matter.Body>(target, PhysicsBasedEmbedding.META_PROPERTY_NAME);

    Body.setStatic(physicsVertex, false);
  }

  free(target: Vertex<V>): void {
    const physicsVertex = getMeta<Matter.Body>(target, PhysicsBasedEmbedding.META_PROPERTY_NAME);

    Body.setStatic(physicsVertex, true);
  }

  moveVertex(target: Vertex<V>, x: number, y: number): void {
    const physicsVertex = getMeta<Matter.Body>(target, PhysicsBasedEmbedding.META_PROPERTY_NAME);

    Body.setPosition(physicsVertex, { x, y });
  }

  private move(delta: number): void {
    if (!this.isInstalled) {
      throw new Error(
        "Cannot perform operation on an uninstalled embedding. Please install the embedding first."
      );
    }

    Engine.update(this.engine, delta * 400);

    for (const graphNode of this.universe.graph.getAllVertices()) {
      const body = getMeta<Matter.Body>(graphNode, PhysicsBasedEmbedding.META_PROPERTY_NAME);

      this.universe.renderingController.moveVertex(graphNode, body.position.x, body.position.y);
    }
  }

  private createContraint(newEdge: Edge<V, E>): Constraint {
    const firstBody = getMeta<Matter.Body>(
      newEdge.sourceVertex,
      PhysicsBasedEmbedding.META_PROPERTY_NAME
    );
    const secondBody = getMeta<Matter.Body>(
      newEdge.targetVertex,
      PhysicsBasedEmbedding.META_PROPERTY_NAME
    );

    const constraint = Constraint.create({
      bodyA: firstBody,
      bodyB: secondBody,
      damping: 0,
      stiffness: 1 / 30,
      length: 150,
    });

    World.addConstraint(this.engine.world, constraint);

    return constraint;
  }

  private removeEdgeConstraint(edge: Edge<V, E>) {
    const constraint = getMeta<Constraint>(edge, PhysicsBasedEmbedding.META_PROPERTY_NAME);

    World.remove(this.engine.world, constraint);
  }

  private removeVertex(vertex: Vertex<V>) {
    const body = getMeta<Matter.Body>(vertex, PhysicsBasedEmbedding.META_PROPERTY_NAME);

    World.remove(this.engine.world, body);

    for (const edge of this.universe.graph.getNeighborEdges(vertex)) {
      this.removeEdgeConstraint(edge);
    }
  }

  private addVertex(x: number, y: number): Matter.Body {
    const particle = Bodies.circle(x, y, 19);

    particle.frictionAir = 0.5;

    World.add(this.engine.world, particle);

    return particle;
  }

  public update(delta: number): void {
    this.move(delta / 1000);
  }
}
