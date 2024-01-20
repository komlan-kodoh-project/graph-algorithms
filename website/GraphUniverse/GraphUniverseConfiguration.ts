import SimpleGraph from "./Graph/SimpleGraph/SimpleGraph";

type GraphUniverseConfiguration<V, E> = {
    graph: SimpleGraph<V, E>,
    container: HTMLElement,
    backgroudColor : string,
    theme: {
        dark: string,
        light: string, 
    },
    primaryAccent: {
        light: string,
        dark: string, 
    },
    secondaryAccent: {
        light: string,
        dark: string, 
    },
    darkAccent: {
        light: string,
        dark: string, 
    }
}


export default GraphUniverseConfiguration; 