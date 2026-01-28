import { LogicFactory } from "../logic/createLogic";
import { LogicRuntime, ComputedDef, InferComputed } from "../core/runtime";
export declare function useComputed<S extends object, C extends ComputedDef<S>>(runtime: LogicRuntime<S, C, any>): Readonly<InferComputed<C>>;
export declare function useComputed<S extends object, C extends ComputedDef<S>, R>(runtime: LogicRuntime<S, C, any>, selector: (computed: Readonly<InferComputed<C>>) => R): R;
export declare function useComputed<S extends object, C extends ComputedDef<S>, A extends Record<string, any>>(logic: LogicFactory<S, C, A>): Readonly<InferComputed<C>>;
export declare function useComputed<S extends object, C extends ComputedDef<S>, A extends Record<string, any>, R>(logic: LogicFactory<S, C, A>, selector: (computed: Readonly<InferComputed<C>>) => R): R;
