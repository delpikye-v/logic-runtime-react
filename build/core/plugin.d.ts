import type { LogicRuntime } from "./types";
export type LogicPlugin<S extends object, C extends object = {}> = {
    name: string;
    setup(runtime: LogicRuntime<S, C>): void;
};
