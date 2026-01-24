import { LogicRuntime } from "../core/runtime";
import type { LogicFactory } from "../logic/createLogic";
type LogicMap = Record<string, LogicFactory<any, any>>;
type RuntimeMap<M extends LogicMap> = {
    [K in keyof M]: ReturnType<M[K]["create"]>;
};
type SnapshotOf<M extends LogicMap> = {
    [K in keyof M]: ReturnType<M[K]["create"]> extends LogicRuntime<infer S extends object, any> ? Readonly<S> : never;
};
export declare function composeLogic<M extends LogicMap>(logics: M): {
    create(scope?: any): {
        emit(intent: string, payload?: any): Promise<void>;
        subscribe(fn: () => void): () => void;
        getSnapshot(): SnapshotOf<M>;
        runtimes: RuntimeMap<M>;
    };
};
export {};
