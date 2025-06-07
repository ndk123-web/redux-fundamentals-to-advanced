# Redux Toolkit - Complete Guide

## 📋 Table of Contents
1. [Overview & Setup](#-overview--setup)
2. [Core Concepts](#-core-concepts)
3. [Creating Slices](#-creating-slices)
4. [Setting up Store](#-setting-up-store)
5. [Reading State (useSelector)](#-reading-state-useselector)
6. [Updating State (useDispatch)](#-updating-state-usedispatch)
7. [How Redux Works Internally](#-how-redux-works-internally)
8. [Complete Data Flow](#-complete-data-flow)
9. [Project Structure](#-project-structure)
10. [Key Points to Remember](#-key-points-to-remember)

---

## 🚀 Overview & Setup

### Libraries Used:
- **`react-redux`** - Connects React components to Redux store
- **`@reduxjs/toolkit`** - Modern Redux with better developer experience

### Installation:
```bash
npm install @reduxjs/toolkit react-redux
```

[↑ Back to Contents](#-table-of-contents)

---

## 🧠 Core Concepts

### What is Redux?
- **Central State Management** - One store for entire app
- **Predictable State Updates** - Only through actions
- **Immutable Updates** - Never modify state directly

### Key Terms:
- **Slice** = Feature-specific state + logic
- **Store** = Central state container
- **Action** = What happened (e.g., "add todo")
- **Reducer** = How to update state
- **Dispatch** = Send action to store
- **Selector** = Read data from store

[↑ Back to Contents](#-table-of-contents)

---

## 🔧 Creating Slices

### Step 1: Create a Slice
A slice contains your state and the functions to modify it:

```js
// slices/todoslice.js
import { createSlice, nanoid } from '@reduxjs/toolkit'

const initialState = []

const todoSlice = createSlice({
  name: "mytodos",           // ← Action type prefix
  initialState,
  reducers: {
    addTodo: (state, action) => {
      const { title, completed } = action.payload
      state.push({
        id: nanoid(),
        title,
        completed
      })
    },
    removeTodo: (state, action) => {
      return state.filter(todo => todo.id !== action.payload.id)
    },
    toggleTodo: (state, action) => {
      const todo = state.find(todo => todo.id === action.payload.id)
      if (todo) {
        todo.completed = !todo.completed
      }
    }
  }
})

// Export action creators (auto-generated)
export const { addTodo, removeTodo, toggleTodo } = todoSlice.actions

// Export reducer
export default todoSlice.reducer
```

### What happens here:
- **`name`** becomes the prefix for action types
- **`reducers`** are functions that modify state
- **`slice.actions`** are auto-generated action creators
- **`slice.reducer`** handles all the switch-case logic internally

[↑ Back to Contents](#-table-of-contents)

---

## 🏪 Setting up Store

### Step 2: Configure the Store
Combine all your slices into one central store:

```js
// store/store.js
import { configureStore } from '@reduxjs/toolkit'
import todoReducer from '../slices/todoslice'
import userReducer from '../slices/userslice'

const store = configureStore({
  reducer: {
    todos: todoReducer,    // ← Key becomes state.todos
    users: userReducer,    // ← Key becomes state.users
  }
})

export default store
```

### Step 3: Provide Store to App
```js
// main.jsx or App.js
import { Provider } from 'react-redux'
import store from './store/store'

function App() {
  return (
    <Provider store={store}>
      <TodoApp />
    </Provider>
  )
}
```

### State Structure:
```js
// Your complete state looks like:
state = {
  todos: [...],    // from todoReducer
  users: [...],    // from userReducer
}
```

[↑ Back to Contents](#-table-of-contents)

---

## 📖 Reading State (useSelector)

### Step 4: Get Data FROM Store
Use `useSelector` to read any part of your state:

```js
// components/TodoList.js
import { useSelector } from 'react-redux'

function TodoList() {
  // Get todos from state
  const todos = useSelector((state) => {
    console.log("Complete State:", state)
    // state = { todos: [...], users: [...] }
    
    return state.todos  // ← Returns only todos array
  })

  // Get specific todo count
  const completedCount = useSelector((state) => 
    state.todos.filter(todo => todo.completed).length
  )

  return (
    <div>
      <h2>Total Completed: {completedCount}</h2>
      {todos.map(todo => (
        <div key={todo.id}>
          <span>{todo.title}</span>
          <span>{todo.completed ? "✅" : "❌"}</span>
        </div>
      ))}
    </div>
  )
}
```

### useSelector Rules:
- **Returns specific data** from state
- **Component re-renders** when selected data changes
- **Can transform data** before returning

[↑ Back to Contents](#-table-of-contents)

---

## ✏️ Updating State (useDispatch)

### Step 5: Send Data TO Store
Use `useDispatch` to trigger state updates:

```js
// components/AddTodo.js
import { useDispatch } from 'react-redux'
import { addTodo, removeTodo, toggleTodo } from '../slices/todoslice'

function AddTodo() {
  const dispatch = useDispatch()

  const handleAddTodo = () => {
    dispatch(addTodo({
      title: "Learn Redux Toolkit",
      completed: false
    }))
  }

  const handleRemoveTodo = (todoId) => {
    dispatch(removeTodo({ id: todoId }))
  }

  const handleToggleTodo = (todoId) => {
    dispatch(toggleTodo({ id: todoId }))
  }

  return (
    <div>
      <button onClick={handleAddTodo}>
        Add Todo
      </button>
      <button onClick={() => handleRemoveTodo("some-id")}>
        Remove Todo
      </button>
      <button onClick={() => handleToggleTodo("some-id")}>
        Toggle Todo
      </button>
    </div>
  )
}
```

### useDispatch Process:
1. **Import action creators** from slice
2. **Get dispatch function** using `useDispatch()`
3. **Call dispatch** with action creator and payload

[↑ Back to Contents](#-table-of-contents)

---

## ⚙️ How Redux Works Internally

### What Happens When You Dispatch?

#### Step-by-Step Process:
```js
// 1. You call:
dispatch(addTodo({ title: "Learn Redux", completed: false }))

// 2. Action creator returns:
{
  type: "mytodos/addTodo",
  payload: { title: "Learn Redux", completed: false }
}

// 3. Store sends this action to ALL reducers
// 4. Only matching reducer handles it, others ignore it
```

### slice.actions - Action Creators
```js
// When you export { addTodo }, you get this function:
function addTodo(payload) {
  return {
    type: "mytodos/addTodo",  // slice.name + "/" + reducer.name
    payload: payload
  }
}
```

### slice.reducer - The Big Switch Function
```js
// Redux Toolkit creates this internally:
function todoReducer(state = initialState, action) {
  switch (action.type) {
    case "mytodos/addTodo":
      // Runs your addTodo logic
      return updatedState
    
    case "mytodos/removeTodo":
      // Runs your removeTodo logic
      return updatedState
    
    case "mytodos/toggleTodo":
      // Runs your toggleTodo logic
      return updatedState
    
    default:
      return state  // No change
  }
}
```

### Key Points:
- **`slice.actions`** → Returns `{ type: "sliceName/action", payload: data }`
- **`slice.reducer`** → Listens to `action.type` and updates state using switch-case internally
- **`dispatch(...)`** → Sends the `{ type, payload }` to **all reducers**, only correct reducer handles it

[↑ Back to Contents](#-table-of-contents)

---

## 🔄 Complete Data Flow

### The Redux Cycle:
```
1. User clicks button
   ↓
2. Component calls dispatch(addTodo(data))
   ↓
3. Action creator creates { type: "mytodos/addTodo", payload: data }
   ↓
4. Store sends action to all reducers
   ↓
5. Matching reducer updates state
   ↓
6. Components with useSelector re-render
   ↓
7. UI shows updated data
```

### Visual Example:
```js
// Component
const handleClick = () => {
  dispatch(addTodo({ title: "New Task", completed: false }))
}

// ↓ Becomes ↓

// Action
{
  type: "mytodos/addTodo",
  payload: { title: "New Task", completed: false }
}

// ↓ Goes to ↓

// Reducer (internal switch-case)
case "mytodos/addTodo":
  state.push({
    id: nanoid(),
    title: action.payload.title,
    completed: action.payload.completed
  })

// ↓ Updates ↓

// State
state.todos = [
  ...oldTodos,
  { id: "abc123", title: "New Task", completed: false }
]

// ↓ Triggers ↓

// Component Re-render (useSelector detects change)
```

[↑ Back to Contents](#-table-of-contents)

---

## 📁 Project Structure

### Recommended File Organization:
```
src/
├── store/
│   └── store.js              # Configure store
├── slices/
│   ├── todoslice.js          # Todo state & logic
│   ├── userslice.js          # User state & logic
│   └── authslice.js          # Auth state & logic
├── components/
│   ├── TodoList.js           # useSelector example
│   ├── AddTodo.js            # useDispatch example
│   └── UserProfile.js        # Multiple selectors
├── hooks/
│   └── useAuth.js            # Custom hooks with Redux
└── App.js                    # Provider setup
```

### File Naming Convention:
- **Slices**: `featureslice.js` (e.g., `todoslice.js`)
- **Store**: `store.js`
- **Components**: `ComponentName.js`

[↑ Back to Contents](#-table-of-contents)

---

## 💡 Key Points to Remember

### Do's ✅
- **Use createSlice** for all your state logic
- **Keep slices focused** on single features
- **Use useSelector** to read state
- **Use useDispatch** to update state
- **Directly mutate state** in reducers (Immer handles immutability)
- **Export actions and reducer** from slices

### Don'ts ❌
- **Don't mutate state** outside of reducers
- **Don't put functions/classes** in state
- **Don't make too many slices** for simple state
- **Don't forget to add reducers** to store

### Important Notes:
- **Immer Integration**: Redux Toolkit uses Immer, so you can write `state.push()` safely
- **DevTools**: Automatic integration with Redux DevTools for debugging
- **Action Types**: Auto-generated as `"sliceName/reducerName"`
- **TypeScript**: Redux Toolkit has excellent TypeScript support

### Quick Reference:
| Need to... | Use... |
|------------|--------|
| Define state & logic | `createSlice()` |
| Read state | `useSelector(state => state.feature)` |
| Update state | `dispatch(actionCreator(data))` |
| Combine slices | `configureStore({ reducer: {...} })` |
| Connect to React | `<Provider store={store}>` |

[↑ Back to Contents](#-table-of-contents)