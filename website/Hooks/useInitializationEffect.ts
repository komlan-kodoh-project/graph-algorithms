import { useEffect, useRef } from "react";


/**
 * Use effect equivalent to prevent double execution of traditional {@link useEffect} function. 
 * @see {@link https://stackoverflow.com/questions/72238175/why-useeffect-running-twice-and-how-to-handle-it-well-in-react this stackoverflow post} for more information
 * 
 * @param callback callback to execute on first component load
 */
export default function useEffectOnce(callback: () => void) {
    const effectRan = useRef(false);

    useEffect(() => {
        if (!effectRan.current) {
            effectRan.current = true;
            callback()
        }

    }, []);
}