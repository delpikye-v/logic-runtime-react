import type { Timeline } from "../devtools/timeline";
export type Listener = () => void;
export type EffectCtx<W = any, R = W, P = any> = {
    state: Readonly<R>;
    payload: P;
    signal: AbortSignal;
    scope: string;
    emit(intent: string, payload?: any): Promise<void>;
    setState: (fn: (s: W) => void) => void;
};
export type EmitHookCtx<S = any, C = any, P = any> = {
    intent: string;
    payload: P;
    state: Readonly<S & C>;
    scope: string;
};
export type IntentHandler<W = any, R = W, P = any> = (ctx: EffectCtx<W, R, P>) => void | Promise<void>;
export type Effect<W = any, R = W, P = any> = (next: IntentHandler<W, R, P>) => IntentHandler<W, R, P>;
export type IntentMiddleware<W = any, R = W, P = any> = (ctx: EffectCtx<W, R, P>, next: () => Promise<void>) => Promise<void>;
export type LogicRuntime<S extends object, C extends object = {}> = {
    scope: string;
    state(): Readonly<S & C>;
    setState(mutator: (s: S) => void): void;
    reset(): void;
    batch(fn: () => void): void;
    emit(intent: string, payload?: any): Promise<void>;
    effect(intent: string, fx: Effect<S, S & C>): void;
    use(mw: IntentMiddleware<S, S & C>): void;
    subscribe(fn: Listener): () => void;
    onIntent(intent: string, handler: IntentHandler<S, S & C>): void;
    devtools?: {
        timeline: Timeline;
    };
    __internal: {
        onEmitStart(fn: (ctx: EmitHookCtx<S, S & C, any>) => void): void;
        onEmitEnd(fn: (ctx: EmitHookCtx<S, S & C, any>) => void): void;
    };
};
