import { Scope } from "intentx-core-z";
import type { ComputedDef, InferComputed } from "../core/runtime";
import { LogicRuntime } from "../core/runtime";
import type { LogicFactory } from "../logic/createLogic";
type AnyLogicFactory = LogicFactory<any, ComputedDef<any>, any>;
type LogicMap = Record<string, AnyLogicFactory>;
type InferRuntime<L> = L extends LogicFactory<infer S, infer C, infer A> ? LogicRuntime<S, C, A> : never;
type InferState<M extends LogicMap> = {
    [K in keyof M]: InferRuntime<M[K]> extends LogicRuntime<infer S, infer C, any> ? Readonly<S & InferComputed<C>> : never;
};
type InferActions<M extends LogicMap> = {
    [K in keyof M]: InferRuntime<M[K]> extends LogicRuntime<any, any, infer A> ? A : never;
};
export declare function composeLogic<M extends LogicMap>(map: M): {
    scope: Scope;
    runtimes: { [K in keyof M]: InferRuntime<M[K]>; };
    emit: <P = any>(type: string, payload?: P) => Promise<void>;
    actions: InferActions<M>;
    getState: () => InferState<M>;
};
export {};
