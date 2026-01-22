import { RuntimeIntentContext } from "./types";
export type IntentNext<S> = (context: RuntimeIntentContext<S>) => Promise<void>;
export type IntentMiddleware<S> = (next: IntentNext<S>) => IntentNext<S>;
