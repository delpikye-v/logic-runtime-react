type ComputeFn<S, R> = (ctx: {
    state: S;
}) => R;
export declare function createComputed<S extends object, C extends Record<string, any>>(): {
    compute: <K extends keyof C>(key: K, fn: ComputeFn<S, C[K]>, state: S) => C[K];
    invalidate: (changedKey: keyof S) => void;
    subscribe: <K extends keyof C>(key: K, fn: () => void) => () => boolean;
    reset: () => void;
};
export {};
