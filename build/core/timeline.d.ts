export type IntentRecordType = "emit" | "emit:start" | "emit:end";
export type IntentRecord<S = any> = {
    readonly id: number;
    readonly type: IntentRecordType;
    readonly intent: string;
    readonly payload?: any;
    readonly scope: string;
    readonly state: Readonly<S>;
    readonly timestamp: number;
};
export type EmitFn = (intent: string, payload?: any) => void | Promise<void>;
export type Timeline<S = any> = {
    readonly records: readonly IntentRecord<S>[];
    record(entry: Omit<IntentRecord<S>, "id">): void;
    replay(emit: EmitFn, options?: {
        from?: number;
        to?: number;
        scope?: string;
    }): Promise<void>;
    clear(): void;
};
export declare function createTimeline<S = any>(): Timeline<S>;
