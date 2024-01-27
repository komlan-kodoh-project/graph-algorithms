import rust_wasm_init, { initialize_web_assembly } from 'wasm-lib';
import { Dispatch, MutableRefObject, SetStateAction, useCallback, useEffect, useRef, useState } from "react";


/**
 * Use effect equivalent to prevent double execution of traditional {@link useEffect} function. 
 * @see {@link https://stackoverflow.com/questions/72238175/why-useeffect-running-twice-and-how-to-handle-it-well-in-react this stackoverflow post} for more information
 * 
 * @param callback callback to execute on first component load
 */
export function useEffectOnce(callback: () => void) {
    const effectRan = useRef(false);

    useEffect(() => {
        if (!effectRan.current) {
            effectRan.current = true;
            callback()
        }

    }, []);
}

export function userReactiveRef<T>(initialValue: T): [MutableRefObject<T>, Dispatch<SetStateAction<T>>] {
    const [_, setState] = useState<T>(initialValue);
    const state = useRef<T>(initialValue);

    const updateState = useCallback(
        (value: SetStateAction<T>) => {
            setState((previousState) => {
                let newValue;

                if (typeof value === "function") {
                    newValue = (value as ((prevState: T) => T))(previousState);
                }

                else {
                    newValue = (value as T);
                }

                state.current = newValue;

                return newValue;
            });
        },
        []
    );

    return [state, updateState];
}

export function useWebAssembly() {
    const [hasInitialized, setHasInitialized] = useState<boolean>(false)

    useEffect(() => {
        new Promise<void>(async (resolve, reject) => {
            await rust_wasm_init();
            await initialize_web_assembly();

            setHasInitialized(true);

            resolve()
        });

    }, []);


    return hasInitialized;
}