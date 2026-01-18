import type { LogicRuntime } from "../core";
export type LogicPlugin<S extends object, C extends object = {}> = {
    name: string;
    setup(runtime: LogicRuntime<S, C>): void;
};
