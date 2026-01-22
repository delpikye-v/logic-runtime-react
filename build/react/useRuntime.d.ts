import { LogicRuntime } from "../core/runtime";
import { LogicFactory } from "../logic/createLogic";
export declare function useRuntime<S extends object>(runtime: LogicRuntime<S>): Readonly<S>;
export declare function useRuntime<S extends object, A extends Record<string, any>>(logic: LogicFactory<S, A>): Readonly<S>;
