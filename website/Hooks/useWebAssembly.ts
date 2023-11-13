import rust_wasm_init from 'wasm-lib';
import { useEffect } from "react";


function useWebAssembly() {
    useEffect(() => {
        rust_wasm_init();
    }, []);
}

export default useWebAssembly;