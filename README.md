# 🧩 logic-runtime-react-z

[![NPM](https://img.shields.io/npm/v/logic-runtime-react-z.svg)](https://www.npmjs.com/package/logic-runtime-react-z) ![Downloads](https://img.shields.io/npm/dt/logic-runtime-react-z.svg)

<a href="https://codesandbox.io/p/sandbox/jnd992" target="_blank">LIVE EXAMPLE</a>

**Intent-first business logic runtime**: React is a **view** — logic lives **elsewhere**.

A headless, deterministic, intent-driven runtime for frontend & backend logic.
React components stay pure. Business logic is fully testable, replayable, and framework-agnostic.

> **Intent is the only entry point.**
> **React is optional. `createLogic` is the product. Everything else is an adapter.**

---

## ✨ Why logic-runtime-react-z?

- No business logic in React components
- Intent is the *only* entry point
- Predictable async flows
- Reactive computed graph with caching
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
 computed (derived state) / subscribers
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

async function main() {
  const runtime = counterLogic.create()

  await runtime.emit("inc")
  await runtime.emit("add", 5)

  console.log(runtime.state.count)
}

main()
```

✔ No UI
✔ Fully testable
✔ Deterministic

> 💡 This is the core usage.
> createLogic() + runtime.emit() already gives you state, computed and effects.
> React integration is just a convenience layer on top of this runtime.

---

## 🧠 Computed State

```ts
computed: {
  double: ({ state }) => state.count * 2,
  triple: ({ state }) => state.count * 3,
}
```

- `state` inside `computed` is **reactive**.
- Reading `state.count` automatically tracks dependencies.
- Computed values are cached and only re-evaluated when tracked dependencies change.

---

## ⚛️ React Integration (No Hooks Required)

### Define Logic (Framework-Agnostic)

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

    // effects = side-effects only (no state mutation)
    bus.effect(
      "inc-async",
      effect(async ({ payload }) => {
        console.log("effect run:", payload)
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

### Pure React View (Dumb View)

```tsx
import React from "react"
import { withLogic } from "logic-runtime-react-z"
import { counterLogic } from "./counter.logic"

function CounterView(props) {
  const { state, actions, emit } = props

  return (
    <div style={{ padding: 12 }}>
      <div>Triple Count: {state.triple}</div>

      <button onClick={actions.inc}>+1</button>
      <button onClick={() => actions.add(10)}>+10</button>

      <button
        disabled={state.loading}
        onClick={() => actions.incAsync(5)}
      >
        Async +5
      </button>

      <hr />

      <button onClick={() => emit("inc")}>
        emit("inc")
      </button>
    </div>
  )
}

export const CounterPage = withLogic(counterLogic, CounterView)

```

✔ Props are inferred when using withLogic, no manual generics required.

---

## 🧪 Backend Usage (Same Runtime)

```ts
import { createLogic } from "logic-runtime-react-z"

const authLogic = createLogic({
  state: {
    user: null,
    loading: false,
  },

  intents: bus => {
    bus.on("login", async ({ setState }) => {
      setState(s => {
        s.loading = true
      })

      await new Promise(r => setTimeout(r, 500))

      setState(s => {
        s.user = { name: "Alice" }
        s.loading = false
      })
    })

    bus.on("logout", ({ setState }) => {
      setState(s => {
        s.user = null
      })
    })
  },
})

async function run() {
  const runtime = authLogic.create()

  await runtime.emit("login")
  await runtime.emit("logout")

  console.log(runtime.getSnapshot())
}

run()
```

✔ Same runtime, same behavior, no React involved.  
✔ No React  
✔ Replayable  

---

## 🪝 Hooks Examples (Optional, Thin Adapters)

Hooks are optional convenience layers on top of the same logic runtime.
They do not own state, they only subscribe to it.

#### useRuntime – full snapshot
```ts
import { useRuntime } from "logic-runtime-react-z"

function Debug() {
  const snapshot = useRuntime(counterLogic)
  return <pre>{JSON.stringify(snapshot, null, 2)}</pre>
}
```

✔ Subscribes to full snapshot
✔ Includes state + computed
✔ Read-only

#### useActions – actions only (no re-render)
```ts
import { useActions } from "logic-runtime-react-z"

function Buttons() {
  const actions = useActions(counterLogic)

  return (
    <>
      <button onClick={actions.inc}>+1</button>
      <button onClick={() => actions.add(5)}>+5</button>
    </>
  )
}
```


✔ No re-render on state change
✔ Fully inferred action types
✔ Ideal for buttons / handlers

#### useComputed – Subscribe to computed values
```ts
import { useComputed } from "logic-runtime-react-z"

function Stats() {
  const { double, triple } = useComputed(counterLogic)

  return (
    <>
      <div>Double: {double}</div>
      <div>Triple: {triple}</div>
    </>
  )
}

function DoubleOnly() {
  const double = useComputed(counterLogic, c => c.double)
  return <div>{double}</div>
}
```

✔ Only derived data
✔ Cached & reactive
✔ No state mutation possible

#### useComputed with selector (recommended)
```ts
function DoubleOnly() {
  const double = useComputed(
    counterLogic,
    c => c.double
  )

  return <div>Double: {double}</div>
}
```

✔ Component re-renders only when double changes
✔ No extra dependencies
✔ Type-safe selector

#### useLogicSelector – State selector (Redux-like)
```ts
import { useLogicSelector } from "logic-runtime-react-z"

function CountLabel() {
  const count = useLogicSelector(
    counterLogic,
    state => state.count
  )

  return <span>{count}</span>
}
```

✔ Memoized selector
✔ Fine-grained subscriptions
✔ Familiar mental model

---

## 🧱 Composing Multiple Logic Modules

```ts
import { composeLogic } from "logic-runtime-react-z"
import { userLogic } from "./user.logic"
import { cartLogic } from "./cart.logic"

const app = composeLogic({
  user: userLogic,
  cart: cartLogic,
})

await app.emit("login")

const state = app.getState()
state.user
state.cart

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

const runtime = counterLogic.create()

await runtime.emit("set", 4)
expect(runtime.computed.squared).toBe(16)
```

✔ Computed values are tested like plain data

---

## 🔍 Comparison

| Criteria                                  |  logic-runtime-react-z  |         Redux        |        Zustand        |             Recoil             |             MobX            |
| ----------------------------------------- | :---------------------: | :------------------: | :-------------------: | :----------------------------: | :-------------------------: |
| **Intent-first model**                    |            ✅            |           ❌          |           ❌           |               ⚠️               |              ⚠️             |
| **State-first model**                     |            ❌            |           ✅          |           ✅           |                ✅               |              ✅              |
| **First-class effect orchestration**      |       ✅ (built-in)      |  ⚠️ (via middleware) |  ⚠️ (via middleware)  | ⚠️ (selectors + async helpers) |   ⚠️ (actions + reactions)  |
| **Fine-grained derived state (computed)** |  ✅ (reactive & cached)  |           ❌          | ⚠️ (simple selectors) |      ✅ (dependency graph)      | ⚠️ (observable derivations) |
| **Predictable execution semantics**       |  🔁 intent queue/rules   | 👍 sync + middleware |        👍 sync        |             👍 sync            |           👍 sync           |
| **Async control strategies built-in**     | ✅ takeLatest / debounce |           ❌          |           ❌           |                ❌               |              ❌              |
| **Logic outside React**                   |            ✅            |          ⚠️          |           ⚠️          |               ⚠️               |              ⚠️             |
| **Framework-agnostic**                   |            ✅            |           ⚫          |           ⚫           |                ⚫               |              ⚫              |
| **Backend-ready usage**                   |            ✅            |          ⚠️          |           ⚠️          |               ⚠️               |              ⚠️             |
| **Type-inferred actions**                 |            ✅            |          ⚠️          |           ⚠️          |               ⚠️               |              ⚠️             |
| **Minimal re-render strategies**          |    ✓ selectors/hooks     |      ✓ selectors     |      ✓ selectors      |        ✓ atoms/selectors       |     ✗ global observables    |
| **Devtools ecosystem**                    |       ⚠️ (nascent)       |           ✅          |           ⚠️          |               ⚠️               |              ⚠️             |



<b>⚠️ via selectors, not a true dependency graph. </b>

---

## ❓ Why not Redux + RTK?

Redux focuses on state transitions.

logic-runtime-react-z models system behavior.

In Redux:
- async flow is external (thunk/saga)
- effects are not first-class
- execution model depends on middleware setup

In logic-runtime-react-z:
- async orchestration is built-in
- intent is the only entry point
- execution order is guaranteed


---

## 🧠 One-liner Takeaway

- Redux & Zustand manage **state**
- logic-runtime-react-z orchestrates **logic**

---

## 🧬 Deterministic Execution Model

- Intents are processed sequentially
- State mutations are isolated
- Async effects follow declared strategies (takeLatest, debounce, etc.)
- Execution order is predictable

Given the same intent sequence, the resulting state is reproducible.

---

## 📐 Architecture Diagram (High-level)

```bash
┌─────────────┐
│   React UI  │
└──────┬──────┘
       │ adapter
┌──────▼──────┐
│   Runtime   │
│  (create)   │
├─────────────┤
│  Intent Bus │
│  Effects    │
│  Handlers   │
│  State      │
│  Computed   │
└─────────────┘
```

<b>Runtime is the product. React is an adapter.</b>

---

## ⚠️ When Not to Use

- Simple local component state
- Small apps without async complexity
- Teams unfamiliar with event-driven models

---


## License

MIT
