import { IntentMiddleware } from "./middleware";
import { RuntimeIntentContext } from "./types";
export declare function applyMiddleware<S>(middlewares: IntentMiddleware<S>[], final: (context: RuntimeIntentContext<S>) => Promise<void>): (context: RuntimeIntentContext<S>) => Promise<void>;
