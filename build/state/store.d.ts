import { Listener } from "../core/types";
export declare function createStore<S extends object>(initial: S): {
    getState: () => S;
    setState: (mutator: (s: S) => void) => void;
    subscribe: (fn: Listener) => () => boolean;
};
