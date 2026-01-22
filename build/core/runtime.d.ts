import { Atom } from "chrono-state-z/build/core/atom";
import { Scope } from "intentx-core-z";
import { EffectDef } from "./effect";
export type AtomAccessor<T> = Atom<T>;
export declare class LogicRuntime<S extends object, A extends Record<string, any> = {}> {
    readonly scope: Scope;
    private atoms;
    private subs;
    private bus;
    private snapshotCache;
    private dirty;
    private isComputing;
    actions: A;
    constructor(initial: S, scope?: Scope);
    private createAtoms;
    private buildSnapshot;
    private markDirty;
    getSnapshot: () => Readonly<S>;
    subscribe: (fn: () => void) => () => boolean;
    private setStateInternal;
    onIntent: <P = any>(type: string, handler: (context: {
        payload: P;
        state: () => Readonly<S>;
        scope: Scope;
        signal: AbortSignal;
        setState(fn: (draft: S) => void): void;
        emit<T = any>(type: string, payload?: T): Promise<void>;
    }) => any) => void;
    useEffect(type: string, eff: EffectDef): void;
    emit: <P = any>(type: string, payload?: P) => Promise<void>;
    attachComputed<K extends string, T>(key: K, compute: () => T): void;
}
