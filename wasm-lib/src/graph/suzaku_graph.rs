use petgraph::{
    graph::Neighbors,
    stable_graph::NodeIndex,
    visit::EdgeRef,
    Directed,
    Direction::{Incoming, Outgoing},
    Graph,
};
use wasm_bindgen::prelude::*;
use web_sys::js_sys::Int32Array;

#[wasm_bindgen]
pub struct GraphWrapper {
    graph: Graph<(), u32, Directed, u32>,
}

impl GraphWrapper {
    pub fn _neighbors(&self, node_index: NodeIndex<u32>) -> Neighbors<'_, u32> {
        self.graph.neighbors(node_index)
    }

    pub fn _total_connection_weight(
        &self,
        node_index: NodeIndex<u32>,
        neighbor: NodeIndex<u32>,
    ) -> Option<u32> {
        let sum = self
            .graph
            .edges_connecting(node_index, neighbor)
            .map(|edge| edge.weight())
            .sum();

        if sum == 0 {
            return None;
        }

        return Some(sum);
    }
}

#[wasm_bindgen]
impl GraphWrapper {
    #[wasm_bindgen(constructor)]
    pub fn new() -> GraphWrapper {
        let graph = Graph::<(), u32, Directed, u32>::new();

        GraphWrapper { graph: graph }
    }

    pub fn len(&self) -> u32 {
        self.graph.node_count() as u32
    }

    pub fn create_vertex(&mut self) -> usize {
        self.graph.add_node(()).index()
    }

    pub fn neighbors(&self, node_id: usize) -> Int32Array {
        let node_index = NodeIndex::<u32>::new(node_id);

        let node_indexes: Vec<i32> = self
            .graph
            .neighbors_undirected(node_index)
            .map(|node| node.index() as i32)
            .collect();

        Int32Array::from(&node_indexes[..])
    }

    pub fn edge(&self, first_node_id: usize, second_node_id: usize) -> Result<u32, String> {
        let first_node = NodeIndex::<u32>::new(first_node_id);
        let second_node = NodeIndex::<u32>::new(second_node_id);

        let first_to_second = self
            .graph
            .edges_connecting(first_node, second_node)
            .map(|edge| edge.id().index() as u32);

        let second_to_first = self
            .graph
            .edges_connecting(second_node, first_node)
            .map(|edge| edge.id().index() as u32);

        let all_edges: Vec<u32> = first_to_second.chain(second_to_first).collect();

        if all_edges.len() > 1 {
            return Err(format!("An error was logged because there exists more than one edge between {first_node_id} and {second_node_id}"));
        }

        return Ok(all_edges[0]);
    }

    pub fn edge_directed(&self, first_node_id: usize, second_node_id: usize) -> Result<u32, String> {
        let first_node = NodeIndex::<u32>::new(first_node_id);
        let second_node = NodeIndex::<u32>::new(second_node_id);

        let edges : Vec<u32> = self
            .graph
            .edges_connecting(first_node, second_node)
            .map(|edge| edge.id().index() as u32)
            .collect();

        if edges.len() > 1 {
            return Err(format!("An error was logged because there exists more than one edge between {first_node_id} and {second_node_id}"));
        }

        return Ok(edges[0]);

    }

    pub fn adjacent_egdes(&self, node_id: usize) -> Int32Array {
        let node_index = NodeIndex::<u32>::new(node_id);

        let outgoing_edges = self
            .graph
            .edges_directed(node_index, Incoming)
            .map(|edge| edge.id().index() as i32);

        let edge_indexes = self
            .graph
            .edges_directed(node_index, Outgoing)
            .map(|edge| edge.id().index() as i32);

        let all_edges: Vec<i32> = outgoing_edges.chain(edge_indexes).collect();

        Int32Array::from(&all_edges[..])
    }

    pub fn create_edge(
        &mut self,
        source_node_id: usize,
        destination_node_id: usize,
        weight: Option<u32>,
    ) -> Result<usize, String> {
        let source_node_index = NodeIndex::<u32>::new(source_node_id);
        let destination_node_index = NodeIndex::<u32>::new(destination_node_id);

        let new_edge = self.graph.update_edge(
            source_node_index,
            destination_node_index,
            weight.unwrap_or(1),
        );

        return Ok(new_edge.index());
    }
}
