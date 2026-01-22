import { Scope } from "intentx-core-z";
export type BackendContext<S> = {
    state: Readonly<S>;
    set(patch: Partial<S>): void;
    emit(intent: string, payload?: any): Promise<void>;
    signal: AbortSignal;
};
export type BackendIntent<S> = (context: BackendContext<S>) => void | Promise<void>;
export type BackendIntents<S> = Record<string, BackendIntent<S>>;
export declare function createBackendRuntime<S extends object>(initial: S): {
    state: () => S;
    reset: () => void;
    emit: (intent: string, payload?: any) => Promise<void>;
    registerIntents: (intents: BackendIntents<S>) => void;
    onIntent: (type: string, handler: import("intentx-core-z").IntentHandler<S>, scope?: Scope) => () => void;
    effect: (type: string, fx: import("intentx-core-z/build/intent/effect").IntentEffect<S>, scope?: Scope) => void;
};
