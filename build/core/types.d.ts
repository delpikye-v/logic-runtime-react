import { Scope } from "intentx-core-z";
export type RuntimeIntentContext<S, P = any> = {
    payload: P;
    state: () => Readonly<S>;
    scope: Scope;
    signal: AbortSignal;
    setState(fn: (draft: S) => void): void;
    emit<T = any>(type: string, payload?: T): Promise<void>;
};
