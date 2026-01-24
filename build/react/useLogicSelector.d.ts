import { LogicRuntime } from "../core/runtime";
export declare function useLogicSelector<S extends object, R>(runtime: LogicRuntime<S>, selector: (state: Readonly<S>) => R): R;
