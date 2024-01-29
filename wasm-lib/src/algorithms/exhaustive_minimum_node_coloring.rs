use wasm_bindgen::prelude::*;
use petgraph::stable_graph::NodeIndex;
use crate::graph::suzaku_graph::GraphWrapper;

#[wasm_bindgen]
#[derive(Debug)]
pub struct ExhaustiveMinimumNodeColoring {
    #[wasm_bindgen(skip)]
    pub independent_sets: Vec<Vec<u32>>,
}

#[wasm_bindgen]
impl ExhaustiveMinimumNodeColoring {
    pub fn len(&self) -> usize {
        return self.independent_sets.len();
    }

    pub fn get_node_coloring(&self, index: usize) -> Vec<u32> {
        return self.independent_sets[index].clone();
    }
}

#[wasm_bindgen]
pub fn exhaustive_minimum_node_coloring(graph: &GraphWrapper) -> ExhaustiveMinimumNodeColoring {
    let mut coloring = vec![0; graph.len() as usize];

    let mut coloring_count = ColoringCount {
        len: graph.len() as usize,
        current_index: 0,
        color_count: 0,
        minimum_color_count: u32::MAX,
        minimum_coloring: vec![],
    };

    recursion(graph, &mut coloring, &mut coloring_count);

    return ExhaustiveMinimumNodeColoring {
        independent_sets: coloring_count.minimum_coloring,
    };
}

pub struct ColoringCount {
    pub len: usize,
    pub current_index: usize,

    pub color_count: u32,

    pub minimum_coloring: Vec<Vec<u32>>,
    pub minimum_color_count: u32,
}

pub fn recursion(
    graph: &GraphWrapper,
    current_coloring: &mut Vec<u32>,
    coloring: &mut ColoringCount,
) {
    if coloring.current_index == coloring.len {
        if coloring.color_count < coloring.minimum_color_count {
            coloring.minimum_coloring = vec![current_coloring.clone()];
            coloring.minimum_color_count = coloring.color_count;
            return;
        }

        if coloring.color_count == coloring.minimum_color_count
            && coloring.minimum_coloring.len() < 10
        {
            coloring.minimum_coloring.push(current_coloring.clone());
            return;
        }
    }

    // Return because the number of color of this trial has exceeded a knowm possible minimum
    if coloring.color_count > coloring.minimum_color_count {
        return;
    }

    let mut neighbor_colors = vec![];

    for neibhbor in graph._neighbors(NodeIndex::new(coloring.current_index)) {
        let neighbor_index = current_coloring[neibhbor.index()];
        neighbor_colors.push(neighbor_index);
    }

    for index in 0 + 1..coloring.color_count + 2 {
        if neighbor_colors.contains(&(index as u32)) {
            continue;
        }

        if index == coloring.color_count + 1 {
            coloring.color_count += 1;
        }

        current_coloring[coloring.current_index] = index as u32;

        coloring.current_index += 1;
        recursion(graph, current_coloring, coloring);

        coloring.current_index -= 1;
    }

    current_coloring[coloring.current_index] = 0;
}

#[test]
fn algorithm_should_work_on_graph() {
    let mut graph = GraphWrapper::new();

    let vertex1 = graph.create_vertex();
    let vertex2 = graph.create_vertex();
    let vertex3 = graph.create_vertex();
    let vertex4 = graph.create_vertex();

    graph.create_edge(vertex1, vertex2, Some(1)).unwrap();
    graph.create_edge(vertex1, vertex3, Some(1)).unwrap();
    graph.create_edge(vertex3, vertex4, Some(1)).unwrap();

    let coloring = exhaustive_minimum_node_coloring(&graph);

    print!("{:?}", coloring);
}
