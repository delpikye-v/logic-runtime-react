export type Subscriber = () => void;
export declare function createSignal<T>(value: T): {
    get(): T;
    set(next: T): void;
    subscribe(fn: Subscriber): () => boolean;
};
