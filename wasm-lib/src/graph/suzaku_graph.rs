use petgraph::{
    graph::{Neighbors, NodeIndices},
    stable_graph::NodeIndex,
    visit::EdgeRef,
    Directed,
    Direction::{Incoming, Outgoing},
    Graph,
};
use wasm_bindgen::prelude::*;
use web_sys::js_sys::{Int32Array, Uint32Array};

#[wasm_bindgen]
pub enum GraphMode {
    Directed,
    Undirected,
}

#[wasm_bindgen]
pub struct GraphWrapper {
    mode: GraphMode,
    graph: Graph<(), u32, Directed, u32>,
}

impl GraphWrapper {
    pub fn _all_vertices(&self) -> NodeIndices {
        return self.graph.node_indices();
    }

    pub fn _neighbors(&self, node_index: NodeIndex<u32>) -> Neighbors<'_, u32> {
        let node_indexes = match self.mode {
            GraphMode::Undirected => self.graph.neighbors_undirected(node_index),
            GraphMode::Directed => self.graph.neighbors_directed(node_index, Outgoing),
        };

        return node_indexes;
    }

    pub fn _total_connection_weight(
        &self,
        node_index: NodeIndex<u32>,
        neighbor: NodeIndex<u32>,
    ) -> Option<u32> {
        let sum = match self.mode {
            GraphMode::Directed => self
                .graph
                .edges_connecting(node_index, neighbor)
                .map(|edge| edge.weight())
                .sum(),

            GraphMode::Undirected => self
                .graph
                .edges_connecting(node_index, neighbor)
                .chain(self.graph.edges_connecting(neighbor, node_index))
                .map(|edge| edge.weight())
                .sum(),
        };

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

        GraphWrapper {
            graph: graph,
            mode: GraphMode::Undirected,
        }
    }

    pub fn to_string(&self) -> String {
        let mut text = String::new();

        for node in self.graph.node_indices() {
            text.push_str(&format!("{}\n", node.index()));
        }

        for edge in self.graph.edge_indices() {
            let (source, destination) = self.graph.edge_endpoints(edge).unwrap();
            text.push_str(&format!("{} {}\n", source.index(), destination.index()));
        }

        return text;
    }

    pub fn len(&self) -> u32 {
        self.graph.node_count() as u32
    }

    pub fn create_vertex(&mut self) -> usize {
        self.graph.add_node(()).index()
    }

    pub fn neighbors(&self, node_id: usize) -> Uint32Array {
        let node_index = NodeIndex::<u32>::new(node_id);

        let node_indexes: Vec<u32> = self
            ._neighbors(node_index)
            .map(|node| node.index() as u32)
            .collect();

        return Uint32Array::from(&node_indexes[..]);
    }

    pub fn delete_vertex(&mut self, node_id: usize) {
        let node_index = NodeIndex::<u32>::new(node_id);
        self.graph.remove_node(node_index);
    }

    pub fn delete_edge(&mut self, edge_id: usize) {
        let edge_index = petgraph::graph::EdgeIndex::<u32>::new(edge_id);
        self.graph.remove_edge(edge_index);
    }

    pub fn edge(
        &self,
        first_node_id: usize,
        second_node_id: usize,
    ) -> Result<Option<u32>, String> {
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

        if all_edges.len() == 0 {
            return Ok(None);
        }

        return Ok(Some(all_edges[0]));
    }

    pub fn edge_directed(
        &self,
        first_node_id: usize,
        second_node_id: usize,
    ) -> Result<Option<u32>, String> {
        let first_node = NodeIndex::<u32>::new(first_node_id);
        let second_node = NodeIndex::<u32>::new(second_node_id);

        let edges: Vec<u32> = self
            .graph
            .edges_connecting(first_node, second_node)
            .map(|edge| edge.id().index() as u32)
            .collect();

        if edges.len() > 1 {
            return Err(format!("An error was logged because there exists more than one edge between {first_node_id} and {second_node_id}"));
        }

        if edges.len() == 0 {
            return Ok(None);
        }

        return Ok(Some(edges[0]));
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
