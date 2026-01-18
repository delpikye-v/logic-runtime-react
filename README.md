# ⚙️ logic-runtime-react-z

[![NPM](https://img.shields.io/npm/v/logic-runtime-react-z.svg)](https://www.npmjs.com/package/logic-runtime-react-z) ![Downloads](https://img.shields.io/npm/dt/logic-runtime-react-z.svg)

<a href="https://codesandbox.io/p/sandbox/x3jf32" target="_blank">LIVE EXAMPLE</a>

**Intent-first business logic runtime**
React is a view. Logic lives elsewhere.

---

## ✨ Core Idea

> **Business logic lives outside React. React only renders state and emits intent.**

* No React hooks in views
* Intent is the only entry point
* Predictable async flows
* Headless & backend-friendly
* Fully testable without rendering

---

## 🧠 Mental Model

```
UI / HTTP / Queue / Cron
        ↓
emit(intent)
        ↓
middleware / effects
        ↓
 intent handlers
        ↓
 mutate state
        ↓
computed / subscribers
```

---

## 📦 Installation

```bash
npm install logic-runtime-react-z
```

---

## 🚀 Quick Start (Headless)

```ts
import { createLogic } from "logic-runtime-react-z"

const counterLogic = createLogic({
  state: { count: 0 },
  intents: bus => {
    bus.on("inc", ({ setState }) => setState(s => { s.count++ }))
    bus.on("add", ({ payload, setState }) => setState(s => { s.count += payload }))
  },
})

const runtime = counterLogic.create()
await runtime.emit("inc")
await runtime.emit("add", 5)
console.log(runtime.state.count) // 6

```

---

## ⚛️ React Integration (No Hooks in View)

```ts
import { createLogic, effect, withLogic } from "logic-runtime-react-z"

interface State {
  count: number;
  loading: boolean;
  double: number;
}

// Async effect for takeLatest behavior
const asyncEffect = effect(async ({ payload, setState }) => {
  console.log("Effect fired for payload:", payload);
}).takeLatest()

const counterLogic = createLogic({
  name: "counter",
  state: { count: 1, loading: false },
  computed: { double: ({ state }) => state.count * 2 },
  intents: bus => {
    bus.on("inc", ({ setState }) => setState(s => { s.count++ }))
    bus.on("inc-async", async ({ payload, setState }) => {
      setState(s => { s.loading = true })
      await new Promise(r => setTimeout(r, 5000))
      setState(s => { s.count += payload; s.loading = false })
    })
    bus.effect("inc-async", asyncEffect)
  },
})

// React view (pure, no hooks)
function CounterView({ state, emit }: { state: State; emit: (intent: string, payload?: any) => void | Promise<void> }) {
  return (
    <div>
      <div>Count: {state.count}</div>
      <button disabled={state.loading} onClick={() => emit("inc")}>Plus</button>
      <button disabled={state.loading} onClick={() => emit("inc-async", 100)}>Async +100</button>
      <div>Double: {state.double}</div>
    </div>
  )
}

export const Counter = withLogic(counterLogic, CounterView)

```

---

## 🧪 Middleware Example (Backend)

```ts
import { createBackendRuntime } from "logic-runtime-react-z"

// Create runtime with initial state
const runtime = createBackendRuntime({
  user: null,
  loading: false,
})

// Optional: attach devtools in dev mode
const devtools = runtime.devtools

// Register some intents
runtime.onIntent("login", async ({ payload, setState }) => {
  setState(s => { s.loading = true })
  // simulate async login
  const user = await fakeLoginApi(payload)
  setState(s => {
    s.user = user
    s.loading = false
  })
})

runtime.onIntent("logout", ({ setState }) => {
  setState(s => { s.user = null })
})

// Emit some intents
await runtime.emit("login", { username: "alice", password: "123" })
await runtime.emit("logout")

// ----------------- Using devtools -----------------

// 1️⃣ Access timeline records
console.log("Timeline records:", devtools.timeline.records)

// 2️⃣ Replay intents
await devtools.timeline.replay(runtime.emit, { scope: "backend" })

// 3️⃣ Clear timeline
devtools.timeline.clear()
console.log("Timeline cleared:", devtools.timeline.records)

```

---

## 🧪 Unit Test Example (Headless)

```ts
const logic = createLogic({
  state: { value: 0 },
  computed: { squared: ({ state }) => state.value * state.value },
  intents: bus => {
    bus.on("set", ({ payload, setState }) => setState(s => { s.value = payload }))
  }
})

const runtime = logic.create()
await runtime.emit("set", 4)
expect(runtime.state.squared).toBe(16)

```

---

## 🔍 Comparison

| Feature                     | logic-runtime-react-z     | Redux                | Zustand  | Recoil/Jotai   |
| --------------------------- | ------------------------  | -------------------- | -------- | -------------- |
| Intent-first                | ✅                        | ❌                    | ❌       | ❌             |
| Headless / backend-friendly | ✅                        | ⚠️                    | ⚠️       | ❌             |
| Async orchestration         | ✅ (takeLatest, debounce) | ⚠️ (middleware add )  | ⚠️       | ⚠️             |
| Computed graph              | ✅                        | ❌                    | ❌       | ✅ (atom deps) |
| Devtools replay async       | ✅                        | ⚠️                    | ❌       | ⚠️             |
| UI-agnostic                 | ✅                        | ⚠️                    | ⚠️       | ❌             |
| Deterministic testability   | ✅                        | ⚠️                    | ⚠️       | ⚠️             |


---

## ⚖️ Comparison with Vue2

While logic-runtime-react-z uses a **reactive + computed pattern** similar to Vue2, the behavior is quite different:

| Feature                   | Vue2                   | logic-runtime-react-z                               |
|---------------------------|----------------------- |---------------------------------------------------- |
| Reactive base state       | ✅ proxy               | ✅ store + computed tracking.                        |
| Computed                  | ✅                     | ✅ dependency tracking + invalidation.               |
| Intent-driven flow        | ❌                     | ✅ all actions go through `emit(intent)`.            |
| Async orchestration       | ❌                     | ✅ effects + middleware (takeLatest, debounce, etc.) |
| Headless / backend-ready  | ❌                     | ✅ can run without React/UI                          |
| Deterministic testing     | ❌                     | ✅ full headless tests possible                      |
| Devtools replay           | ❌                     | ✅ timeline tracking & replay                        |

> **Takeaway:** It feels familiar if you know Vue2 reactivity, but under the hood it's **intent-first, headless, and fully testable**, unlike Vue2.

---

## 🚫 Anti-patterns (What NOT to do)

This library enforces a **clear separation between intent, behavior, and view**.  
If you find yourself doing the following, you are probably fighting the architecture.


#### ❌ 1. Putting business logic inside React components

```tsx
// ❌ Don't do this
function Login() {
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    const user = await api.login()
    setLoading(false)
    navigate("/home")
  }
}
```
Why this is wrong
- Logic tied to React lifecycle
- Hard to test without rendering
- Side-effects scattered in UI

✅ Correct

```ts
runtime.emit("login")
```

```ts
bus.on("login", async ({ setState, emit }) => {
  setState(s => { s.loading = true })
  const user = await api.login()
  setState(s => { s.loading = false })
  emit("login:success", user)
})
```

#### ❌ 2. Calling handlers directly instead of emitting intent
```ts
// ❌ Don't call handlers manually
loginHandler(payload)
```
Why this is wrong

- Skips middleware & effects
- Breaks devtools timeline
- Makes behavior non-deterministic

✅ Correct

```ts
runtime.emit("login", payload)
```
Intent is the only entry point. Always.

#### ❌ 3. Using effects to mutate state directly
```ts
// ❌ Effect mutating state
bus.effect("save", next => async ctx => {
  ctx.setState(s => { s.saving = true })
  await next(ctx)
})
```

Why this is wrong

- Effects are orchestration, not business logic
- Hard to reason about ordering
- Blurs responsibility

✅ Correct

```ts
bus.on("save", ({ setState }) => {
  setState(s => { s.saving = true })
})
```
Effects should only:
- debounce
- retry
- cancel
- log
- trace

#### ❌ 4. Treating intent like Redux actions
```ts
// ❌ Generic, meaningless intent
emit("SET_STATE", { loading: true })
```

Why this is wrong

- Intent should describe user or system intention
- Not raw state mutation

✅ Correct

```ts
emit("login:start")
emit("login:success", user)
emit("login:failed", error)
```
Intents are verbs, not patches.

#### ❌ 5. Reading or mutating state outside the runtime
```ts
// ❌ External mutation
runtime.state.user.name = "admin"
```
Why this is wrong
- Breaks computed cache
- Bypasses subscriptions
- Devtools become unreliable

✅ Correct

```ts
emit("update:user:name", "admin")
```

#### ❌ 6. Using React hooks to replace runtime behavior
```ts
// ❌ useEffect as orchestration
useEffect(() => {
  if (state.loggedIn) {
    fetchProfile()
  }
}, [state.loggedIn])
```
Why this is wrong

- Behavior split across layers
- Impossible to replay or test headlessly

✅ Correct

```ts
bus.on("login:success", async ({ emit }) => {
  await emit("profile:fetch")
})
```
#### ❌ 7. One logic runtime doing everything
```ts
// ❌ God runtime
createLogic({
  state: {
    user: {},
    cart: {},
    products: {},
    settings: {},
    ui: {},
  }
})
```
Why this is wrong
- No ownership boundaries
- Hard to compose
- Does not scale

✅ Correct

```ts
composeLogic(
  userLogic,
  cartLogic,
  productLogic
)
```

---

## 📜 License

MIT / Delpi
