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
/**
 * Unified emit function:
 * - sync emit → void
 * - async emit → Promise<void>
 */
export type EmitFn = (intent: string, payload?: any) => void | Promise<void>;
export type Timeline<S = any> = {
    /** immutable snapshot */
    readonly records: readonly IntentRecord<S>[];
    /** record one event */
    record(entry: Omit<IntentRecord<S>, "id">): void;
    /**
     * Replay intent records.
     *
     * ⚠️ Notes:
     * - only replays `type === "emit"`
     * - replay is sequential
     * - replay does NOT record new timeline entries
     */
    replay(emit: EmitFn, options?: {
        from?: number;
        to?: number;
        scope?: string;
    }): Promise<void>;
    clear(): void;
};
export declare function createTimeline<S = any>(): Timeline<S>;
