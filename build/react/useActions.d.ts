import { LogicFactory, LogicActions } from "../logic/createLogic";
import { LogicRuntime, ComputedDef } from "../core/runtime";
export declare function useActions<A extends LogicActions>(runtime: LogicRuntime<any, any, A>): A;
export declare function useActions<S extends object, C extends ComputedDef<S>, A extends LogicActions>(logic: LogicFactory<S, C, A>): A;
