use crate::graph::suzaku_graph::GraphWrapper;

use std::{
    collections::{BinaryHeap, HashMap},
    vec,
};

use petgraph::stable_graph::NodeIndex;

#[derive(Debug, PartialEq, Eq, Clone, Copy)]
struct DijkstraNode {
    node_index: NodeIndex<u32>,
    distance: u32,
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


#[allow(dead_code)]
pub fn dijkstra(graph: GraphWrapper, start_node_id: usize, target_node_id: usize) -> Result<Vec<Option<u32>>, String> {
    let mut distances: HashMap<NodeIndex<u32>, u32> = HashMap::new();
    let start_node_index = NodeIndex::<u32>::new(start_node_id);
    distances.insert(start_node_index, 0);

    let mut heap = BinaryHeap::new();
    heap.push(DijkstraNode {
        node_index: start_node_index,
        distance: 0,
    });

    while let Some(current_node) = heap.pop() {
        if current_node.node_index.index() == target_node_id {
            break;
        }

        for neighbor in graph._neighbors(current_node.node_index) {
            let edge_weight = graph._total_connection_weight(current_node.node_index, neighbor);

            let weight = match edge_weight {
                None => continue,
                Some(weight) => weight,
            };

            let total_distance = current_node.distance + weight;
            let neighbor_index = neighbor;

            let previous_distance = distances.get(&neighbor);

            match previous_distance {
                None => {
                    // Add newly recorded distance to record
                    distances.insert(neighbor_index, total_distance);

                    // Add node to head has one to visiz next
                    heap.push(DijkstraNode {
                        node_index: neighbor_index,
                        distance: total_distance,
                    });
                }

                Some(previous_distance) => {
                    if total_distance < previous_distance.to_owned() {
                        distances.insert(neighbor_index, total_distance);
                    }
                }
            }
        }
    }


    Ok(vec![])
}
