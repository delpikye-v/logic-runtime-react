import { LogicActions, LogicFactory } from "../logic/createLogic";
export declare function useActions<A extends object>(runtime: {
    actions: A;
}): A;
export declare function useActions<S extends object, A extends LogicActions>(logic: LogicFactory<S, A>): A;
