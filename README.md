# Zustand State Management

Zustand is a small, fast, and scalable state management solution for React applications. It provides a simple API with minimal boilerplate and excellent TypeScript support.

## Key Features

### 🚀 Smart Re-rendering Logic
- **Selective Subscriptions**: Components only re-render when the specific state they subscribe to changes
- **Performance Optimized**: No unnecessary re-renders across the application
- **Example**:
  ```javascript
  const MyComponent = () => {
      // This component only subscribes to 'count'
      const count = useStore(state => state.count)
      return (
          <div>
              count: {count}
          </div>
      )
  }
  ```
  - ✅ **This component only re-renders if `count` changes**
  - ✅ **If `age` or `name` changes, this component will NOT re-render**

### 🎯 Core Advantages

1. **Minimal Boilerplate**: No providers, reducers, or action creators needed
2. **TypeScript First**: Excellent TypeScript support out of the box
3. **DevTools Support**: Works with Redux DevTools for debugging
4. **Middleware Support**: Extensible with middleware (persist, devtools, etc.)
5. **Framework Agnostic**: Can be used outside of React
6. **Small Bundle Size**: ~2.5kb gzipped

## Basic Usage

### Creating a Store
```javascript
import { create } from 'zustand'

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))
```

### Using in Components
```javascript
function Counter() {
  // Subscribe to specific state
  const count = useStore((state) => state.count)
  const increment = useStore((state) => state.increment)
  
  return (
    <div>
      <span>{count}</span>
      <button onClick={increment}>Increment</button>
    </div>
  )
}
```

## Advanced Features

### 1. Middleware Usage

#### Persist Middleware
```javascript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }),
    {
      name: 'counter-storage', // localStorage key
      getStorage: () => localStorage, // or sessionStorage
    }
  )
)
```

#### DevTools Middleware
```javascript
import { devtools } from 'zustand/middleware'

const useStore = create(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }),
    {
      name: 'counter-store',
    }
  )
)
```

### 2. Async Actions
```javascript
const useStore = create((set, get) => ({
  users: [],
  loading: false,
  fetchUsers: async () => {
    set({ loading: true })
    try {
      const response = await fetch('/api/users')
      const users = await response.json()
      set({ users, loading: false })
    } catch (error) {
      set({ loading: false })
    }
  },
}))
```

### 3. Computed Values (Selectors)
```javascript
const useStore = create((set, get) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  
  // Computed values
  get itemCount() {
    return get().items.length
  },
  get expensiveItems() {
    return get().items.filter(item => item.price > 100)
  },
}))
```

### 4. Multiple Stores
```javascript
// User store
const useUserStore = create((set) => ({
  user: null,
  login: (userData) => set({ user: userData }),
  logout: () => set({ user: null }),
}))

// Cart store
const useCartStore = create((set) => ({
  items: [],
  addToCart: (item) => set((state) => ({ 
    items: [...state.items, item] 
  })),
}))
```

## Best Practices

### 1. State Structure
```javascript
// ✅ Good: Flat structure
const useStore = create((set) => ({
  user: { name: '', email: '' },
  posts: [],
  loading: false,
}))

// ❌ Avoid: Deeply nested state
const useStore = create((set) => ({
  app: {
    user: {
      profile: {
        personal: {
          name: ''
        }
      }
    }
  }
}))
```

### 2. Action Patterns
```javascript
const useStore = create((set, get) => ({
  items: [],
  
  // ✅ Use immer for complex updates
  addItem: (item) => set(
    produce((state) => {
      state.items.push(item)
    })
  ),
  
  // ✅ Or use spread operator
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),
}))
```

### 3. Selective Subscriptions
```javascript
function UserProfile() {
  // ✅ Subscribe only to what you need
  const userName = useStore((state) => state.user.name)
  
  // ❌ Don't subscribe to entire state
  const state = useStore()
  
  return <div>{userName}</div>
}
```

## TypeScript Support

```typescript
interface StoreState {
  count: number
  increment: () => void
  decrement: () => void
}

const useStore = create<StoreState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}))
```

## Testing

```javascript
import { act, renderHook } from '@testing-library/react'
import { useStore } from './store'

describe('Counter Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useStore.setState({ count: 0 })
  })

  it('should increment count', () => {
    const { result } = renderHook(() => useStore())
    
    act(() => {
      result.current.increment()
    })
    
    expect(result.current.count).toBe(1)
  })
})
```

## Current Project Structure

This project demonstrates:
- ✅ Basic Zustand store with persist middleware
- ✅ Counter functionality with increment/decrement
- ✅ localStorage persistence
- ⚠️ **Note**: The current implementation uses client-side encryption which has security limitations

### Security Considerations for Encrypted Store

The current store implementation uses CryptoJS for encryption, but there are important considerations:

- **Client-side encryption** provides obfuscation, not true security
- **Secret key** is exposed in the client code
- **Better approach**: Use server-side encryption for sensitive data
- **Current use case**: Acceptable for preventing casual inspection of localStorage

## Installation

```bash
npm install zustand
# For encryption (current implementation)
npm install crypto-js
```

## Resources

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Zustand Examples](https://github.com/pmndrs/zustand/tree/main/examples)
- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)