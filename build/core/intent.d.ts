import type { IntentHandler, Effect } from "./types";
export declare function createIntentBus<W extends object, // Writable State
R extends object = W, // Read State (snapshot / derived)
P = any>(scope: string): {
    on: (intent: string, handler: IntentHandler<W, R, P>) => void;
    effect: (intent: string, fx: Effect<W, R, P>) => void;
    emit: (intent: string, payload: P, ctx: {
        getState: () => R;
        setState: (fn: (s: W) => void) => void;
    }) => Promise<void>;
};
