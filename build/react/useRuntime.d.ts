import type { ComputedDef, InferComputed } from "../core/runtime";
import { LogicRuntime } from "../core/runtime";
import type { LogicFactory } from "../logic/createLogic";
export declare function useRuntime<S extends object, C extends ComputedDef<S>, A extends Record<string, any>>(runtime: LogicRuntime<S, C, A>): Readonly<S & InferComputed<C>>;
export declare function useRuntime<S extends object, C extends ComputedDef<S>, A extends Record<string, any>>(logic: LogicFactory<S, C, A>): Readonly<S & InferComputed<C>>;
