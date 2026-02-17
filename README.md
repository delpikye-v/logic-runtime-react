# 🧩 logic-runtime-react-z

[![NPM](https://img.shields.io/npm/v/logic-runtime-react-z.svg)](https://www.npmjs.com/package/logic-runtime-react-z) ![Downloads](https://img.shields.io/npm/dt/logic-runtime-react-z.svg)

<a href="https://codesandbox.io/p/sandbox/jnd992" target="_blank">LIVE EXAMPLE</a>

**Intent-First Business Logic Runtime.**. React is a view layer. Business logic lives elsewhere.  

A headless, deterministic, intent-driven runtime for frontend and backend systems.  

> **Intent is the only entry point. Logic is deterministic.**
> **React is optional** — `createLogic` is the product; everything else is an adapter.

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
  state: { count: 0, loading: false },

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

    bus.on("dec", ({ setState }) => {
      setState(s => {
        s.count--
      })
    })

    bus.on("asyncInc", async ({ setState }) => {
      setState(s => { s.loading = true })

      await new Promise(r => setTimeout(r, 1000))

      setState(s => {
        s.count++
        s.loading = false
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

## ⚛️ React Integration

React is a thin adapter.

You have **2 integration styles**:

- `withLogic` → Recommended
- `useLogic` → Direct hook usage

#### 🧩 Option 1 — withLogic (Recommended)

Keeps view pure and declarative.

```tsx
import { withLogic, LogicViewProps } from "logic-runtime-react-z"
import { counterLogic } from "./counter.logic"

type CounterInjected =
  LogicViewProps<typeof counterLogic>

const CounterView = ({ state, computed, intent }: LogicViewProps) => {
  return (
    <div>
      <h2>Count: {state.count}</h2>
      <p>Double: {computed.double}</p>
      <p>Triple: {computed.triple}</p>

      <button onClick={() => intent("inc")}>+</button>
      <button onClick={() => intent("dec")}>-</button>
      <button onClick={() => intent("asyncInc")}>
        {state.loading ? "Loading..." : "Async +"}
      </button>
    </div>
  )
}

// export default withLogic(counterLogic)(CounterView)
export const CounterPage = withLogic(counterLogic, CounterView)
```

<b> Why this is recommended?</b>

- View is fully testable
- No hooks inside view
- Logic can be reused outside React
- Clear separation of concerns

---

#### 🪝 Option 2 — useLogic

Use directly inside a component.

```tsx
import { useLogic } from "logic-runtime-react-z"
import { counterLogic } from "./counter.logic"

export function Counter() {
  const { state, computed, intent } = useLogic(counterLogic)

  return (
    <div>
      <h2>Count: {state.count}</h2>
      <p>Double: {computed.double}</p>
      <p>Triple: {computed.triple}</p>

      <button onClick={() => intent("inc")}>+</button>
      <button onClick={() => intent("dec")}>-</button>
      <button onClick={() => intent("asyncInc")}>
        {state.loading ? "Loading..." : "Async +"}
      </button>
    </div>
  )
}
```

✔ Props are inferred when using useLogic, no manual generics required.

---

## 🌊 Async Support

Async logic is just another intent.

```ts
bus.on("fetchUser", async ({ setState }) => {
  setState(s => { s.loading = true })

  const data = await api.getUser()

  setState(s => {
    s.user = data
    s.loading = false
  })
})
```

No special async API needed.

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

✔ Same runtime, same behavior.  
✔ No React dependency   
✔ Replayable execution   

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
expect(runtime.computed.squared).toBe(16)
```

---

## 🔍 Comparison

This is not about “better” — it's about architectural intent.

| Criteria                        | logic-runtime-react-z        | Redux Toolkit        | Zustand        | Recoil        | MobX           |
|---------------------------------|------------------------------|----------------------|----------------|---------------|----------------|
| **Primary abstraction**         | Intent runtime               | Reducer store        | Store          | Atom graph    | Observable     |
| **Mental model**                | Intent → Behavior → State    | Action → Reducer     | Mutate store   | Atom graph    | Reactive graph |
| **Single mutation entry**       | ✅                           | ✅                   | ❌             | ❌             | ❌             |
| **Business logic isolation**    | ✅                           | ✅                   | ⚠️             | ⚠️             | ⚠️             |
| **Built-in async orchestration**| ✅                           | ⚠️                   | ❌             | ❌             | ❌             |
| **Deterministic execution**     | ✅                           | ✅                   | ⚠️             | ⚠️             | ⚠️             |
| **Derived state built-in**      | ✅                           | ❌                   | ⚠️             | ✅             | ✅             |
| **Headless runtime**            | ✅                           | ⚠️                   | ⚠️             | ❌             | ⚠️             |
| **Backend / worker ready**      | ✅                           | ⚠️                   | ⚠️             | ❌             | ❌             |
| **Side-effect centralization**  | ✅                           | ⚠️                   | ❌             | ❌             | ⚠️             |
| **Devtools maturity**           | ⚠️                           | ✅                   | ⚠️             | ⚠️             | ⚠️             |


<br />

✅ Built-in / first-class  
⚠️ Possible / usage-dependent  
❌ Not built-in

---

### 🧠 Architectural Difference

Most state libraries focus on:

> **How state is stored and updated**

`logic-runtime-react-z` focuses on:

> **How behavior is orchestrated through intents**

Redux/Zustand answer:
> "Where is my state and how do I change it?"

This runtime answers:
> "What behavior is triggered by this event, and how should it execute?"

---

### 🧭 Positioning Summary

- Redux → Structured state container
- Zustand → Lightweight mutable store
- Recoil → Declarative dependency graph
- MobX → Reactive observable system
- **logic-runtime-react-z → Intent-first behavior runtime**

---

### 🎯 When This Makes Sense

Choose this if you need:

- Complex async flows
- Deterministic replayable behavior
- Logic shared between frontend & backend
- Strong separation between UI and domain behavior
- An explicit event-driven boundary

Choose simpler state tools if:

- You mostly manage UI state
- You don’t need orchestration
- Your async flows are trivial
- Your team prefers mutable patterns

---

## 🧠 One-liner Takeaway

- Redux & Zustand manage **state**
- logic-runtime-react-z orchestrates **logic**

---

## 🧬 Deterministic Execution Model

- Intents are processed sequentially
- State mutations are isolated
- Async effects can follow declared execution strategies.
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
