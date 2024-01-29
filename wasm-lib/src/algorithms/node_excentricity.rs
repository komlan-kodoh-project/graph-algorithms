use crate::graph::suzaku_graph::GraphWrapper;
use wasm_bindgen::prelude::*;

use std::collections::{BinaryHeap, HashMap};

use petgraph::stable_graph::NodeIndex;

#[derive(Debug, PartialEq, Eq, Clone, Copy)]
struct DijkstraNode {
    node_index: NodeIndex<u32>,
    distance: u32,
}

struct DijkstraNodeData {
    distance: u32,
    source_node: usize,
}

impl Ord for DijkstraNode {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        other.distance.cmp(&self.distance)
    }
}

impl PartialOrd for DijkstraNode {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        Some(self.cmp(other))
    }
}

#[wasm_bindgen]
#[derive(Debug)]
pub struct NodeExcentricity {
    path: Vec<u32>,
    excentricity: u32,
}

#[wasm_bindgen]
impl NodeExcentricity {
    pub fn get_excentricity(&self) -> u32 {
        return self.excentricity;
    }

    pub fn get_path(&self) -> Vec<u32> {
        return self.path.clone();
    }
}

#[wasm_bindgen]
pub fn find_node_eccentricity(graph: &GraphWrapper, start_node_id: usize) -> NodeExcentricity {
    let start_node_index = NodeIndex::<u32>::new(start_node_id);

    let mut distances: HashMap<usize, DijkstraNodeData> = HashMap::new();
    distances.insert(
        start_node_id,
        DijkstraNodeData {
            source_node: start_node_id,
            distance: 0,
        },
    );

    let mut max_distance = 0;
    let mut max_distance_index = start_node_id;

    let mut heap = BinaryHeap::new();

    heap.push(DijkstraNode {
        distance: 0,
        node_index: start_node_index,
    });

    while let Some(current_node) = heap.pop() {
        if current_node.distance > max_distance {
            max_distance = current_node.distance;
            max_distance_index = current_node.node_index.index();
        }

        for neighbor in graph._neighbors(current_node.node_index) {
            let edge_weight = graph._total_connection_weight(current_node.node_index, neighbor);

            let weight = match edge_weight {
                None => continue,
                Some(weight) => weight,
            };

            let total_distance = current_node.distance + weight;
            let neighbor_index = neighbor;

            let previous_distance = distances.get(&neighbor.index());

            match previous_distance {
                None => {
                    // Add newly recorded distance to record
                    distances.insert(
                        neighbor_index.index(),
                        DijkstraNodeData {
                            distance: total_distance,
                            source_node: current_node.node_index.index(),
                        },
                    );

                    // Add node to head has one to visiz next
                    heap.push(DijkstraNode {
                        node_index: neighbor_index,
                        distance: total_distance,
                    });
                }

                Some(previous_distance) => {
                    if total_distance < previous_distance.distance.to_owned() {
                        // Add newly recorded distance to record
                        distances.insert(
                            neighbor_index.index(),
                            DijkstraNodeData {
                                distance: total_distance,
                                source_node: current_node.node_index.index(),
                            },
                        );
                    }
                }
            }

        }
    }

    let mut path = Vec::<u32>::new();

    let mut node_id = max_distance_index;
    let mut node_path_data = distances
        .get(&max_distance_index)
        .expect("Max distance vertex should alwasy be defined at this point");

    loop {
        path.push(node_id.clone() as u32);

        if node_id == node_path_data.source_node {
            break;
        }

        node_id = node_path_data.source_node;

        node_path_data = distances
            .get(&node_path_data.source_node)
            .expect("Source vetex used within distance tracker should always be defined");
    }

    path.reverse();

    NodeExcentricity {
        path: path,
        excentricity: max_distance,
    }
}



#[test]
fn find_node_eccentricity_should_work() {
    use std::time::Instant;
    use crate::utils::generate_random_graph;

    let mut graph = GraphWrapper::new();

    generate_random_graph(&mut graph, 20, 0.8);

    let now = Instant::now();

    let excentricity = find_node_eccentricity(&graph, 10);

    let elapsed = now.elapsed();
    println!("Elapsed: {:.2?}", elapsed);
    println!("{:?}", excentricity);
}

#[test]
fn algorithm_should_work_on_graph() {
    use petgraph::stable_graph::IndexType;
    use std::time::Instant;

    let mut graph = GraphWrapper::new();

    let vertex0 = graph.create_vertex();
    let vertex1 = graph.create_vertex();
    let vertex2 = graph.create_vertex();
    let vertex3 = graph.create_vertex();
    let vertex4 = graph.create_vertex();
    let vertex5 = graph.create_vertex();
    let vertex6 = graph.create_vertex();

    graph.create_edge(vertex0, vertex1, Some(1)).unwrap();
    graph.create_edge(vertex0, vertex3, Some(1)).unwrap();
    graph.create_edge(vertex0, vertex5, Some(1)).unwrap();

    graph.create_edge(vertex4, vertex1, Some(1)).unwrap();
    graph.create_edge(vertex4, vertex3, Some(1)).unwrap();
    graph.create_edge(vertex4, vertex5, Some(1)).unwrap();

    graph.create_edge(vertex2, vertex1, Some(1)).unwrap();
    graph.create_edge(vertex2, vertex4, Some(1)).unwrap();

    graph.create_edge(vertex1, vertex5, Some(1)).unwrap();
    graph.create_edge(vertex3, vertex5, Some(1)).unwrap();

    graph.create_edge(vertex6, vertex2, Some(1)).unwrap();
    graph.create_edge(vertex6, vertex4, Some(1)).unwrap();

    let now = Instant::now();

    let coloring = find_node_eccentricity(&graph, vertex5.index());

    let elapsed = now.elapsed();
    println!("Elapsed: {:.2?}", elapsed);
    println!("{:?}", coloring);
}
