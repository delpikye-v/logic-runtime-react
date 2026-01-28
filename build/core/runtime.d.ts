import type { Atom } from "chrono-state-z/build/core/atom";
import { Scope } from "intentx-core-z";
import { EffectDef } from "./effect";
export type AtomAccessor<T> = Atom<T>;
export type ComputedDef<S> = Record<string, (context: {
    state: Readonly<S>;
}) => any>;
export type InferComputed<C> = {
    [K in keyof C]: C[K] extends (...args: any[]) => infer R ? R : never;
};
export declare class LogicRuntime<S extends object, C extends ComputedDef<S>, A extends Record<string, any>> {
    readonly scope: Scope;
    private stateAtoms;
    private computedAtoms;
    private subs;
    private bus;
    private snapshotCache;
    private dirty;
    private isComputing;
    private computedKeys;
    actions: A;
    constructor(initial: S, scope?: Scope);
    private createStateAtoms;
    private buildSnapshot;
    private markDirty;
    private createReactiveState;
    getSnapshot: () => Readonly<S & InferComputed<C>>;
    subscribe: (fn: () => void) => () => boolean;
    get state(): Readonly<S & InferComputed<C>>;
    get computed(): Readonly<InferComputed<C>>;
    getComputedKey<K extends keyof InferComputed<C>>(key: K): InferComputed<C>[K];
    getComputed(snapshot: Readonly<S & InferComputed<C>>): Readonly<InferComputed<C>>;
    private setStateInternal;
    onIntent: <P = any>(type: string, handler: (context: {
        payload: P;
        state: () => Readonly<S & InferComputed<C>>;
        scope: Scope;
        signal: AbortSignal;
        setState(fn: (draft: S) => void): void;
        emit<T = any>(type: string, payload?: T): Promise<void>;
    }) => any) => void;
    useEffect(type: string, eff: EffectDef): void;
    emit: <P = any>(type: string, payload?: P) => Promise<void>;
    attachComputed<K extends keyof C & string>(key: K, compute: C[K]): void;
}
