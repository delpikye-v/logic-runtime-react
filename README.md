## ⚙️ logic-runtime-react-z

[![NPM](https://img.shields.io/npm/v/logic-runtime-react-z.svg)](https://www.npmjs.com/package/logic-runtime-react-z)
![Downloads](https://img.shields.io/npm/dt/logic-runtime-react-z.svg)

<a href="https://codesandbox.io/p/sandbox/x3jf32" target="_blank">LIVE EXAMPLE</a>

---

**logic-runtime-react-z** is an intent-first external runtime,
designed to run business logic **outside React**.

React 18+ is required **only for the React bindings**.
It provides a headless runtime layer that lives outside React, responsible for:

> Think of it as:
> **“Business logic runtime outside React — React is just the view.”**

---

## ✨ Why / When to Use
- You want zero hooks in UI components
- Business logic should not live in React
- UI should only emit intent, not orchestrate behavior
- Async flows are complex (login → fetch → redirect)
- Side effects must be predictable & testable
- You want headless tests without rendering
- You prefer architecture-driven design over component-driven logic

---

## 🧠 Mental Model

```txt
UI (Pure View)
 └─ emits intent (no logic)
      ↓
External Runtime (logic-runtime-react-z)
 ├─ state store
 ├─ intent handlers
 ├─ effect pipeline
 ├─ computed graph
 ├─ selectors
 └─ devtools timeline
```

- React is just an adapter.
- The runtime owns behavior.

---

## 📦 Installation
```ts
npm install logic-runtime-react-z
```
---

## Basic
```ts
const logic = createLogic({
  state: { count: 0 },
  intents: bus => {
    bus.on("inc", ({ setState }) => {
      setState(s => { s.count++ })
    })
  }
})

const runtime = logic.create()
runtime.emit("inc")
```

---

## ⚛️ React Usage (No Hooks in View)

```ts
import { createLogic, withLogic, createSelector } from "logic-runtime-react-z"

interface State {
  count: number;

  // computed
  double: number
}

const counterLogic = createLogic({
  name: "counter",
  state: { count: 1 },

  computed: {
    double({ state }): number {
      return state.count * 2
    }
  },

  intents: bus => {
    bus.on("inc", ({ state, setState }) => {
      // if (!selectIsAdult(state)) {
      //   throw new Error("Not allowed")
      // }

      setState(s => {
        s.count++
      })
    })
  },
})

// Pure View (No Hooks)
function CounterView({
  state,
  emit,
}: {
  state: State
  emit: (intent: string) => void
}) {
  return (
    <div>
      <div>Count: {state.count}</div>
      // <button
      //   onClick={async () => {
      //     try {
      //       await emit("inc")
      //       console.log("done")
      //     } catch (e) {
      //       console.error(e)
      //     }
      //   }}
      // >
      //   +
      // </button>
      <div>Double: {state.double}</div>
      <button onClick={() => emit("inc")}>+</button>
    </div>
  )
}

// Bind Logic to React
export const Counter = withLogic(counterLogic, CounterView)
```

## 🧪 No React
```ts

// import { createLogic } from "logic-runtime-react-z"
const counterLogic = createLogic({
  state: {
    count: 0
  },

  computed: {
    double({ state }) {
      return state.count * 2
    }
  },

  intents: bus => {
    bus.on("inc", ({ state, setState, emit }) => {
      // state is READONLY snapshot (read-only)
      // ❌ state.count++
      setState(s => {
        s.count += 1
      })

      // emit("inc") ❌ no nested
    })

    // Intent handlers can be sync or async
    bus.on("add", ({ payload, setState }) => {
      setState(s => {
        s.count += payload
      })
    })

    bus.on("reset", ({ setState }) => {
      setState(s => {
        s.count = 0
      })
    })
  },
})

// initial
// const runtime = counterLogic.create()
const runtime = counterLogic.create("counter:main")

runtime.emit("inc")
// await runtime.emit("inc") // if async
runtime.emit("add", 5)

// console.log
console.log(runtime.state.count)   // 7
console.log(runtime.state.double)   // 14
```

---

## 🧩 Plugins – Runtime extensions (cross-cutting concerns)

#### Plugins extend the runtime behavior **without touching business logic**.

```ts
export const authPlugin: LogicPlugin = {
  name: "auth",

  setup(runtime) {
    runtime.onIntent("delete", ctx => {
      if (!ctx.state.user?.isAdmin) {
        throw new Error("Forbidden")
      }
    })
  }
}

export const persistPlugin: LogicPlugin = {
  name: "persist",

  setup(runtime) {
    runtime.subscribe(() => {
      localStorage.setItem(
        runtime.scope,
        JSON.stringify(runtime.state)
      )
    })
  }
}
```

---

## ⚡ Async Effects + Selectors (Advanced Usage)

#### createSelector
Selectors are pure functions that derive data from state.  
They are read-only, memoized, and safe to reuse anywhere (runtime, effects, intents).  

```ts
import { createSelector } from "logic-runtime-react-z"

const selectIsAdult = createSelector(
  (state: { age: number }) => state.age,
  age => age >= 18
)
```

#### effect – Async / side-effect layer
Effects here are middleware-style intent interceptors, not React effects. They are used for:
- logging
- permission checks
- retries / debounce
- cancellation
- async orchestration

```ts
import { effect, debounce, retry, takeLatest } from "logic-runtime-react-z"

const withLogging = effect(next => {
  return async ctx => {
    console.log("saving...")
    await next(ctx)
  }
})
```

#### Combining Effects + Selectors in Intents
```ts
intents: bus => {
  // attach effect to intent
  bus.effect("save", withLogging)

  // intent handler (business rule)
  bus.on("save", ({ state }) => {
    if (!selectIsAdult(state)) {
      throw new Error("Not allowed")
    }

    // perform save logic...
  })

  bus.on("save-user", async ({ state, setState }) => {
    await api.save(state.form)
    setState(s => {
      s.saved = true
    })
  })

  // bus.effect("save", debounce(300))
  // bus.effect("save", retry(2))
  // bus.effect("save", takeLatest())

}
```

---

## 🧭 Devtools & Timeline
- Every intent is recorded
- Replayable
- Deterministic async flows

```ts
// devtool process.env.NODE_ENV !== "production"
runtime.devtools?.timeline.replay(runtime.emit)
```

---

## Props

| API field  | Type                   | Description                                                                        |
| ---------- | ---------------------- | ---------------------------------------------------------------------------------- |
| `name`     | `string?`              | Optional logic name. Used for debugging, devtools, and default runtime scope.      |
| `state`    | `S`                    | **Base mutable state** (source of truth). Can only be changed via `setState`.      |
| `computed` | `ComputedDef<S, C>?`   | **Derived read-only state**, automatically recomputed when base state changes.     |
| `intents`  | `(bus) => void`        | Defines **business actions** (intent handlers). Intents describe behavior, not UI. |
| `plugins`  | `LogicPlugin<S, C>[]?` | Runtime extensions (devtools, logging, persistence, analytics, etc.).              |

---

## 🔍 Comparison

| Feature         | logic-runtime-react-z   | Redux | Zustand  |
| --------------- | ----------------------- | ----- | -------- |
| No-hook UI      | ✅                      | ❌     | ❌       |
| Intent-first    | ✅                      | ❌     | ❌       |
| Async built-in  | ✅                      | ⚠️     | ⚠️       |
| Computed graph  | ✅                      | ❌     | ❌       |
| Headless test   | ✅                      | ⚠️     | ⚠️       |
| Devtools replay | ✅                      | ⚠️     | ❌       |

> This comparison focuses on **architecture and mental model**, not ecosystem size.

---

## 🚫 What this library is NOT

- ❌ Not a React state manager
- ❌ Not a replacement for Redux Toolkit
- ❌ Not a UI framework
- ❌ Not tied to React (runtime is headless)

It is a **behavior runtime**.

---

## 📜 License

MIT