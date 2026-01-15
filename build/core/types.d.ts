import type { Timeline } from "./timeline";
export type Listener = () => void;
export type EffectCtx<W = any, R = W, P = any> = {
    state: Readonly<R>;
    payload: P;
    signal: AbortSignal;
    scope: string;
    emit(intent: string, payload?: any): Promise<void>;
    setState: (fn: (s: W) => void) => void;
};
export type IntentHandler<W = any, R = W, P = any> = (ctx: EffectCtx<W, R, P>) => void | Promise<void>;
export type Effect<W = any, R = W, P = any> = (next: IntentHandler<W, R, P>) => IntentHandler<W, R, P>;
export type LogicRuntime<S extends object, C extends object = {}> = {
    scope: string;
    state(): Readonly<S & C>;
    setState(mutator: (s: S) => void): void;
    reset(): void;
    emit(intent: string, payload?: any): Promise<void>;
    subscribe(fn: Listener): () => void;
    onIntent(intent: string, handler: IntentHandler<S, S & C>): void;
    devtools?: {
        timeline: Timeline;
    };
    __internal: {
        onEmitStart(fn: any): void;
        onEmitEnd(fn: any): void;
    };
};
