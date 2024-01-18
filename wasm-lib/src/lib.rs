mod graph;
mod utils;
mod algorithms;

use gloo_console::log;
use utils::set_panic_hook;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn initialize_web_graph_packagec() {
    set_panic_hook();
    log!("hello world {}", 45);
    alert("Hello, wasm-lib!");
}

#[wasm_bindgen]
pub fn current_state() -> String {
    return "Dead".into();
}
