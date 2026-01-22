import * as React from "react";
import { Scope } from "intentx-core-z";
import { LogicActions, LogicFactory } from "../logic/createLogic";
type InjectedProps<S extends object, A extends LogicActions> = {
    state: Readonly<S>;
    actions: A;
    emit: (intent: string, payload?: any) => Promise<void>;
};
export declare function withLogic<S extends object, A extends LogicActions, P extends object>(logic: LogicFactory<S, A>, View: React.ComponentType<P & InjectedProps<S, A>>, scope?: Scope | string): React.FC<Omit<P, keyof InjectedProps<S, A>>>;
export {};
