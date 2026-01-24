import { LogicActions, LogicFactory } from "../logic/createLogic";
import { LogicRuntime } from "../core/runtime";
export declare function useActions<A extends object>(runtime: LogicRuntime<any> & {
    actions: A;
}): A;
export declare function useActions<S extends object, A extends LogicActions>(logic: LogicFactory<S, A>): A;
