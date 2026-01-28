import { LogicRuntime, InferComputed } from "../core/runtime";
export declare function useLogicSelector<S extends object, C extends Record<string, any>, R>(runtime: LogicRuntime<S, C, any>, selector: (state: Readonly<S & InferComputed<C>>) => R): R;
