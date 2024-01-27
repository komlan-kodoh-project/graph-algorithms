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
pub fn initialize_web_assembly() {
    set_panic_hook();
    log!("Rust wasm has been initialized {}", 45);
}

