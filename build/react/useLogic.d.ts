import { Scope } from "intentx-core-z";
import type { LogicActions, LogicFactory } from "../logic/createLogic";
import type { ComputedDef } from "../core/runtime";
export declare function useLogic<S extends object, C extends ComputedDef<S>, A extends LogicActions>(logic: LogicFactory<S, C, A>, scope?: Scope | string): {
    state: Readonly<S & import("../core/runtime").InferComputed<C>>;
    actions: A;
    emit: (intent: string, payload?: any) => Promise<void>;
};
