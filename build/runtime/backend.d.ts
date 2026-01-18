export type SimpleBackendCtx<S> = {
    state: Readonly<S>;
    set: (patch: Partial<S>) => void;
    emit: (intent: string, payload?: any) => Promise<void>;
    signal: AbortSignal;
};
export declare function createBackendRuntime<S extends object>(initial: S): {
    state(): S;
    setState: (mutator: (s: S) => void) => void;
    batch: (fn: () => void) => void;
    emit(intent: string, payload?: any): Promise<void>;
    onIntent: (intent: string, handler: import("../core").IntentHandler<S, S, any>) => void;
    effect: (intent: string, fx: import("../core").Effect<S, S, any>) => void;
    use: (mw: import("../core").IntentMiddleware<S, S, any>) => void;
    registerIntents: (intentsObj: Record<string, (ctx: SimpleBackendCtx<S>) => void | Promise<void>>) => void;
    __internal: {
        onEmitStart(fn: (ctx: {
            intent: string;
            payload: any;
            state: S;
        }) => void): void;
        onEmitEnd(fn: (ctx: {
            intent: string;
            payload: any;
            state: S;
        }) => void): void;
    };
    reset: () => void;
};
