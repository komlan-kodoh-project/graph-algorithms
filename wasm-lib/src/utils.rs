use crate::graph::suzaku_graph::GraphWrapper;

pub fn set_panic_hook() {
    // When the `console_error_panic_hook` feature is enabled, we can call the
    // `set_panic_hook` function at least once during initialization, and then
    // we will get better error messages if our code ever panics.
    //
    // For more details see
    // https://github.com/rustwasm/console_error_panic_hook#readme
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

#[allow(dead_code)]
pub fn generate_random_graph(graph: &mut GraphWrapper, num_nodes: usize, avg_connectivity: f64) {
    // let p = avg_connectivity / (num_nodes - 1) as f64;

    let vertices: Vec<_> = (0..num_nodes).map(|_| graph.create_vertex()).collect();

    for u in 0..num_nodes {
        for v in u + 1..num_nodes {
            if 7.8 < avg_connectivity {
                graph
                    .create_edge(vertices[u], vertices[v], Some(1))
                    .unwrap();
            }
        }
    }
}
