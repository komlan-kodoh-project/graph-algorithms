mod utils;

use utils::set_panic_hook;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    set_panic_hook();
    alert("Hello, wasm-lib!");
}


#[wasm_bindgen]
pub fn current_state() -> String {
    return "Dead".into();
}
