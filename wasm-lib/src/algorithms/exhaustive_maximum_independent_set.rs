use std::collections::HashSet;
use crate::graph::suzaku_graph::GraphWrapper;
use petgraph::stable_graph::NodeIndex;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Debug)]
pub struct ExhaustiveMaximumIndependentSet {
    independent_sets: Vec<Vec<u32>>,
}

impl ExhaustiveMaximumIndependentSet {
    pub fn new(independent_sets: Vec<Vec<u32>>) -> ExhaustiveMaximumIndependentSet {
        return ExhaustiveMaximumIndependentSet { independent_sets };
    }
}

#[wasm_bindgen]
impl ExhaustiveMaximumIndependentSet {
    pub fn len(&self) -> usize {
        return self.independent_sets.len();
    }

    pub fn get_node_coloring(&self, index: usize) -> Vec<u32> {
        return self.independent_sets[index].clone();
    }
}

#[wasm_bindgen]
pub fn find_maximum_independent_sets_greedy(
    graph: &GraphWrapper,
) -> ExhaustiveMaximumIndependentSet {
    let vertices: Vec<NodeIndex> = graph._all_vertices().collect();
    let mut independent_sets: HashSet<Vec<u32>> =
        vertices.iter().map(|x| vec![x.index() as u32]).collect();

    loop {
        let mut new_independent_sets: HashSet<Vec<u32>> = HashSet::new();

        for independent_set in &independent_sets {
            for vertex in &vertices {
                if independent_set.contains(&(vertex.index() as u32)) {
                    continue;
                }

                if node_is_adjacent_to_set(graph, independent_set, vertex.index()) {
                    continue;
                }

                let mut new_independent_set = independent_set.clone();

                new_independent_set.push(vertex.index() as u32);
                new_independent_set.sort();

                new_independent_sets.insert(new_independent_set);
            }
        }

        if new_independent_sets.len() == 0 {
            return ExhaustiveMaximumIndependentSet::new(independent_sets.into_iter().collect());
        }

        independent_sets = new_independent_sets;
    }
}

#[wasm_bindgen]
pub fn find_maximum_independent_sets(graph: &GraphWrapper) -> ExhaustiveMaximumIndependentSet {
    let vertices = graph._all_vertices();
    let mut independent_sets: Vec<Vec<u32>> = vec![vec![]];

    for vertex in vertices {
        let mut new_combinations = Vec::new();

        for independent_set in &independent_sets {
            if node_is_adjacent_to_set(graph, independent_set, vertex.index()) {
                continue;
            }

            let mut new_independent_set = independent_set.clone();

            new_independent_set.push(vertex.index() as u32);
            new_combinations.push(new_independent_set);
        }

        independent_sets.extend(new_combinations);
    }

    let mut maximum_set_size = 0;
    let mut maximum_independent_sets = Vec::<Vec<u32>>::new();

    for independent_set in independent_sets {
        if independent_set.len() > maximum_set_size {
            maximum_set_size = independent_set.len();
            maximum_independent_sets = Vec::new();
        }

        if independent_set.len() < maximum_set_size {
            continue;
        }

        maximum_independent_sets.push(independent_set);
    }

    return ExhaustiveMaximumIndependentSet::new(maximum_independent_sets);
}

fn node_is_adjacent_to_set(graph: &GraphWrapper, independent_node: &Vec<u32>, node: usize) -> bool {
    let node_neighbors: Vec<usize> = graph
        ._neighbors(NodeIndex::new(node))
        .map(|x| x.index())
        .collect();

    for node_in_set in independent_node {
        if node_neighbors.contains(&(*node_in_set as usize)) {
            return true;
        }
    }

    return false;
}

#[test]
fn algorithm_should_work_on_graph() {
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

    let coloring = find_maximum_independent_sets(&graph);

    let elapsed = now.elapsed();
    println!("Elapsed: {:.2?}", elapsed);
    println!("{:?}", coloring);
}

#[test]
fn algorithm_should_work_on_square() {
    use std::time::Instant;

    let mut graph = GraphWrapper::new();

    let vertex0 = graph.create_vertex();
    let vertex1 = graph.create_vertex();
    let vertex2 = graph.create_vertex();
    let vertex3 = graph.create_vertex();

    graph.create_edge(vertex0, vertex1, Some(1)).unwrap();
    graph.create_edge(vertex1, vertex2, Some(1)).unwrap();
    graph.create_edge(vertex2, vertex3, Some(1)).unwrap();
    graph.create_edge(vertex3, vertex0, Some(1)).unwrap();

    let now = Instant::now();

    let coloring = find_maximum_independent_sets_greedy(&graph);

    let elapsed = now.elapsed();
    println!("Elapsed: {:.2?}", elapsed);
    println!("{:?}", coloring);
}

#[test]
fn algorithm_should_work_on_random_graph() {
    use std::time::Instant;
    use crate::utils::generate_random_graph;

    let mut graph = GraphWrapper::new();

    generate_random_graph(&mut graph, 100, 0.1);

    let now = Instant::now();
    let maximum_independent_set = find_maximum_independent_sets(&graph);
    let elapsed = now.elapsed();

    println!("\n\nLinear Method");
    println!("Processing Time: {:.2?}", elapsed);
    println!("Maximum set length: {:?}", maximum_independent_set.len());
    println!("Maximum set found : {:?}", maximum_independent_set);

    let now = Instant::now();
    let maximum_independent_set = find_maximum_independent_sets_greedy(&graph);
    let elapsed = now.elapsed();

    println!("Greedy Method");
    println!("Processing Time: {:.2?}", elapsed);
    println!("Maximum set length : {:?}", maximum_independent_set.len());
    println!("Maximum set found : {:?}", maximum_independent_set);
}
