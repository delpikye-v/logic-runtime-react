# 🧩 logic-runtime-react-z

[![NPM](https://img.shields.io/npm/v/logic-runtime-react-z.svg)](https://www.npmjs.com/package/logic-runtime-react-z) ![Downloads](https://img.shields.io/npm/dt/logic-runtime-react-z.svg)

<a href="https://codesandbox.io/p/sandbox/jnd992" target="_blank">LIVE EXAMPLE</a>

**Intent-first business logic runtime**: React is a **view** — logic lives **elsewhere**.

A headless, deterministic, intent-driven runtime for frontend & backend logic.
React components stay pure. Business logic is fully testable, replayable, and framework-agnostic.

> **Intent is the only entry point.**

---

## ✨ Why logic-runtime-react-z?

- No React hooks in views
- Intent is the *only* entry point
- Predictable async flows
- Computed graph with caching
- Headless & backend-friendly
- Deterministic testing & devtools replay

---

## 🧠 Mental Model

```
UI / HTTP / Queue / Cron
        ↓
     emit(intent)
        ↓
   effects / middleware
        ↓
   intent handlers
        ↓
     mutate state
        ↓
 computed / subscribers
```

Think **events → behavior → state → derived state**.

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
    bus.on("inc", ({ setState }) => {
      setState(s => {
        s.count++
      })
    })

    bus.on<number>("add", ({ payload, setState }) => {
      setState(s => {
        s.count += payload
      })
    })
  },
})

const runtime = counterLogic.create()

await runtime.emit("inc")
await runtime.emit("add", 5)

console.log(runtime.state.count) // 6
```

✔ No UI  
✔ Fully testable  
✔ Deterministic

---

## ⚛️ React Integration (No Hooks)

### Define Logic

```ts
// counter.logic.ts
import { createLogic, effect } from "logic-runtime-react-z"

export const counterLogic = createLogic({
  name: "counter",

  state: {
    count: 1,
    loading: false,
  },

  computed: {
    double: ({ state }) => state.count * 2,
    triple: ({ state }) => state.count * 3,
  },

  intents: bus => {
    bus.on("inc", ({ setState }) => {
      setState(s => {
        s.count++
      })
    })

    bus.on<number>("add", ({ payload, setState }) => {
      setState(s => {
        s.count += payload
      })
    })

    bus.on<number>("inc-async", async ({ payload, setState }) => {
      setState(s => {
        s.loading = true
      })

      await new Promise(r => setTimeout(r, 1000))

      setState(s => {
        s.count += payload
        s.loading = false
      })
    })

    bus.effect(
      "inc-async",
      effect(async ({ payload }) => {
        console.log("effect run, payload =", payload)
      }).takeLatest()
    )
  },

  actions: {
    inc({ emit }) {
      return () => emit("inc")
    },

    add({ emit }) {
      return (n: number) => emit("add", n)
    },

    incAsync({ emit }) {
      return (n: number) => emit("inc-async", n)
    },
  },
})
```

---

### Pure React View (No Types Needed)

```tsx
import React from "react"
import { withLogic } from "logic-runtime-react-z"
import { counterLogic } from "./counter.logic"

function CounterView(props: any) {
  const { state, actions, emit } = props

  return (
    <div style={{ padding: 12 }}>
      <div>Count: {state.triple}</div>

      <button onClick={actions.inc}>+1 (action)</button>
      <button onClick={() => actions.add(10)}>+10 (action)</button>

      <button
        disabled={state.loading}
        onClick={() => actions.incAsync(5)}
      >
        Async +5
      </button>

      <hr />

      <button onClick={() => emit("inc")}>
        +1 (emit directly)
      </button>
    </div>
  )
}

export const CounterPage =
  withLogic(counterLogic, CounterView)
```

✔ Props inferred automatically  
✔ No generics  
✔ No interfaces  
✔ View stays dumb

---

## 🧪 Backend Runtime Example

```ts
import { createBackendRuntime } from "logic-runtime-react-z"

const runtime = createBackendRuntime({
  user: null,
  loading: false,
})

runtime.registerIntents({
  async login({ set }) {
    set({ loading: true })
    await new Promise(r => setTimeout(r, 500))
    set({
      user: { name: "Alice" },
      loading: false,
    })
  },

  logout({ set }) {
    set({ user: null })
  },
})

await runtime.emit("login")
await runtime.emit("logout")

// 👇 backend devtools
const devtools = runtime.devtools
console.log(devtools.timeline.records)

// relay
// await devtools.timeline.replay(runtime.emit, {
//   scope: "backend"
})
```

✔ Same intent model  
✔ No React  
✔ Replayable  
✔ Devtools is backend-first.

---

## 🪝 Hooks API (Optional)

```ts
// useActions
import { useActions } from "logic-runtime-react-z"
import { counterLogic } from "./counter.logic"

function Buttons() {
  const actions = useActions(counterLogic)

  return (
    <>
      <button onClick={actions.inc}>+1</button>
      <button onClick={() => actions.add(5)}>+5</button>
    </>
  )
}

// useLogicSelector
import { useLogicSelector } from "logic-runtime-react-z"
import { counterLogic } from "./counter.logic"

function DoubleValue() {
  const double = useLogicSelector(
    counterLogic,
    s => s.double
  )

  return <div>Double: {double}</div>
}

// useRuntime
import { useRuntime } from "logic-runtime-react-z"
import { counterLogic } from "./counter.logic"

function DebugPanel() {
  const runtime = useRuntime(counterLogic)

  return (
    <button onClick={() => runtime.emit("inc")}>
      Emit directly
    </button>
  )
}

```

---

## 🧱 Composing Multiple Logic Modules

```ts
import { composeLogic } from "logic-runtime-react-z"
import { userLogic } from "./user.logic"
import { cartLogic } from "./cart.logic"

export const appLogic = composeLogic({
  user: userLogic,
  cart: cartLogic,
})


// usage
const runtime = appLogic.create()

await runtime.emit("user:login", credentials)

const snapshot = runtime.getSnapshot()
snapshot.user   // user state
snapshot.cart   // cart state

```

---

## 🧪 Unit Test Example

```ts
const logic = createLogic({
  state: { value: 0 },

  computed: {
    squared: ({ state }) => state.value * state.value,
  },

  intents: bus => {
    bus.on("set", ({ payload, setState }) => {
      setState(s => {
        s.value = payload
      })
    })
  },
})

const runtime = logic.create()

await runtime.emit("set", 4)

expect(runtime.state.squared).toBe(16)
```

---

## 🚫 Anti-patterns (What NOT to do)

### ❌ Business logic in React

```tsx
useEffect(() => {
  fetchData()
}, [])
```

✅ Correct

```ts
emit("data:fetch")
```

---

### ❌ Mutating state directly

```ts
runtime.state.user.name = "admin"
```

✅ Correct

```ts
emit("update:user:name", "admin")
```

---

### ❌ Generic Redux-style intents

```ts
emit("SET_STATE", { loading: true })
```

✅ Correct

```ts
emit("login:start")
emit("login:success", user)
emit("login:failed", error)
```

---

## 🧩 When to Use This

- Complex async flows
- Shared logic across UI / backend
- Need deterministic tests
- Want to remove logic from React

## 🚫 When NOT to Use

- Simple local UI state
- Throwaway components

---

## 🔍 Comparison with: Redux vs Zustand 

| Capability / Library     | logic-runtime-react-z | Redux | Zustand |
|--------------------------|:---------------------:|:-----:|:-------:|
| Intent-first model       | ✅                    | ❌    | ❌       |
| State-first model        | ❌                    | ✅    | ✅       |
| First-class effects      | ✅                    | ❌    | ❌       |
| Built-in async handling  | ✅                    | ❌    | ❌       |
| Computed state graph     | ✅                    | ❌    | ⚠️       |
| Deterministic execution  | ✅                    | ❌    | ❌       |
| Logic outside React      | ✅                    | ❌    | ❌       |
| Backend-safe             | ✅                    | ❌    | ❌       |
| Intent / effect tracing  | ✅                    | ❌    | ❌       |
| Centralized state store  | ❌                    | ✅    | ✅       |
| Easy global state        | ⚠️                    | ✅    | ✅       |
| Minimal boilerplate      | ✅                    | ❌    | ✅       |



```bash
Redux / Zustand:
UI → setState → store → re-render

logic-runtime-react-z:
UI → intent → logic → effect → state
```

### One-liner takeaway
- Redux and Zustand manage **state**.
- logic-runtime-react-z orchestrates **logic**.

---

## License

MIT
