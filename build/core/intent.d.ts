import type { IntentHandler, Effect, IntentMiddleware } from "./types";
export declare function createIntentBus<W extends object, R extends object = W, P = any>(scope: string): {
    on: (intent: string, handler: IntentHandler<W, R, P>) => void;
    effect: (intent: string, fx: Effect<W, R, P>) => void;
    emit: (intent: string, payload: P, ctx: {
        getState(): R;
        setState(fn: (s: W) => void): void;
        emit(intent: string, payload?: any): Promise<void>;
    }) => Promise<void>;
    use: (mw: IntentMiddleware<W, R, P>) => void;
};
