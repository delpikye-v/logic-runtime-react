import { LogicRuntime } from "../core/runtime";
type LogicFactory<S extends object> = {
    create(): LogicRuntime<S, any>;
};
type LogicMap = Record<string, LogicFactory<any>>;
type SnapshotOf<M extends LogicMap> = {
    [K in keyof M]: ReturnType<M[K]["create"]> extends LogicRuntime<infer S extends object, any> ? Readonly<S> : never;
};
export declare function composeLogic<M extends LogicMap>(logics: M): {
    create(): {
        emit(intent: string, payload?: any): Promise<void>;
        subscribe(fn: () => void): () => void;
        getSnapshot(): SnapshotOf<M>;
    };
};
export {};
