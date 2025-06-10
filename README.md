# Redux Toolkit + Thunk + Redux-Persist Complete Guide 🚀

A comprehensive guide to setting up Redux Toolkit with async thunks and data persistence in React applications.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Core Concepts](#core-concepts)
4. [Store Configuration](#store-configuration)
5. [Creating Slices](#creating-slices)
6. [Async Thunks](#async-thunks)
7. [App Setup with PersistGate](#app-setup-with-persistgate)
8. [Using Redux in Components](#using-redux-in-components)
9. [File Structure](#file-structure)
10. [Best Practices](#best-practices)

---

## 🔍 Overview

This guide covers:
- **Redux Toolkit**: Simplified Redux setup and usage
- **createAsyncThunk**: Handling asynchronous operations
- **Redux-Persist**: Persisting state to localStorage
- **PersistGate**: Managing rehydration of persisted state

---

## 📦 Installation

```bash
npm install @reduxjs/toolkit react-redux redux-persist
```

**Required packages:**
- `@reduxjs/toolkit` - Modern Redux toolset
- `react-redux` - React bindings for Redux
- `redux-persist` - Persist and rehydrate Redux store

---

## 🧠 Core Concepts

### Redux Toolkit
- Simplified way to write Redux logic
- Includes utilities like `createSlice` and `configureStore`
- Built-in support for immutable updates

### Thunk
- Function that returns another function
- Enables async operations in Redux
- Access to `dispatch` and `getState`

### createAsyncThunk
- RTK utility for async operations
- Automatically generates pending/fulfilled/rejected actions
- Handles loading states automatically

### Redux-Persist
- Saves Redux state to storage (localStorage by default)
- Automatically rehydrates state on app reload
- Configurable whitelist/blacklist for specific reducers

---

## 🏪 Store Configuration

### `src/redux/store.js`

```javascript
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {
  PERSIST,
  REHYDRATE,
  PURGE,
  REGISTER,
  PAUSE,
  FLUSH,
} from 'redux-persist';

// Import all your slice reducers
import userReducer from './slices/user.slice';
import loadingReducer from './slices/loading.slice';
import counterReducer from './slices/counter.slice';

// Combine all reducers
const rootReducer = combineReducers({
  user: userReducer,
  loading: loadingReducer,
  counter: counterReducer,
});

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['counter', 'user'], // Only these slices will be persisted
  // blacklist: ['loading'], // These slices won't be persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with middleware
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions to avoid warnings
        ignoreActions: [PERSIST, REHYDRATE, PURGE, REGISTER, PAUSE, FLUSH],
      },
    }),
});

// Create persistor
const persistor = persistStore(store);

export { store, persistor };
```

**Key Points:**
- `whitelist`: Only specified slices are persisted
- `blacklist`: Specified slices are excluded from persistence
- Middleware configuration prevents redux-persist warnings

---

## 🍰 Creating Slices

### Simple Counter Slice
`src/redux/slices/counter.slice.js`

```javascript
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    reset: (state) => {
      state.value = 0;
    }
  }
});

export const { increment, decrement, incrementByAmount, reset } = counterSlice.actions;
export default counterSlice.reducer;
```

### User Authentication Slice
`src/redux/slices/user.slice.js`

```javascript
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isAuthenticated: false,
    userData: null,
    token: null
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.userData = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userData = null;
      state.token = null;
    },
    updateProfile: (state, action) => {
      state.userData = { ...state.userData, ...action.payload };
    }
  }
});

export const { login, logout, updateProfile } = userSlice.actions;
export default userSlice.reducer;
```

### Loading State Slice
`src/redux/slices/loading.slice.js`

```javascript
import { createSlice } from '@reduxjs/toolkit';

const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    isLoading: false
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    }
  }
});

export const { setLoading, startLoading, stopLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
```

---

## ⚡ Async Thunks

### Basic Async Thunk
`src/redux/thunks/posts.thunk.js`

```javascript
import { createAsyncThunk } from '@reduxjs/toolkit';
import { startLoading, stopLoading } from '../slices/loading.slice';

// Fetch random quote
export const fetchRandomQuote = createAsyncThunk(
  'posts/fetchRandomQuote',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading());
      
      const response = await fetch(
        'https://api.freeapi.app/api/v1/public/quotes/quote/random'
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch quote');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// Fetch user profile
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      
      const response = await fetch(`/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

### Handling Async Thunk in Slice
```javascript
import { createSlice } from '@reduxjs/toolkit';
import { fetchRandomQuote } from '../thunks/posts.thunk';

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    quote: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  reducers: {
    clearQuote: (state) => {
      state.quote = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRandomQuote.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRandomQuote.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.quote = action.payload;
      })
      .addCase(fetchRandomQuote.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { clearQuote } = postsSlice.actions;
export default postsSlice.reducer;
```

---

## 🚪 App Setup with PersistGate

### `src/main.jsx`

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import App from './App';
import './index.css';

// Loading component for PersistGate
const Loading = () => (
  <div className="loading-container">
    <div className="spinner">Loading...</div>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
```

**PersistGate Purpose:**
- Delays rendering until persisted state is retrieved
- Shows loading component during rehydration
- Ensures consistent state on app startup

---

## 🎯 Using Redux in Components

### `src/App.jsx`

```javascript
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, reset } from './redux/slices/counter.slice';
import { login, logout } from './redux/slices/user.slice';
import { fetchRandomQuote } from './redux/thunks/posts.thunk';

function App() {
  const dispatch = useDispatch();
  
  // Selecting state from store
  const count = useSelector((state) => state.counter.value);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const userData = useSelector((state) => state.user.userData);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const quote = useSelector((state) => state.posts?.quote);
  const quoteStatus = useSelector((state) => state.posts?.status);

  const handleLogin = () => {
    dispatch(login({
      user: { name: 'John Doe', email: 'john@example.com' },
      token: 'fake-jwt-token'
    }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleFetchQuote = () => {
    dispatch(fetchRandomQuote());
  };

  return (
    <div className="app">
      <h1>Redux Toolkit Demo</h1>
      
      {/* Authentication Status */}
      <div className="auth-section">
        <h2>Authentication</h2>
        <p>Status: {isAuthenticated ? 'Logged In' : 'Logged Out'}</p>
        {userData && <p>Welcome, {userData.name}!</p>}
        <button onClick={isAuthenticated ? handleLogout : handleLogin}>
          {isAuthenticated ? 'Logout' : 'Login'}
        </button>
      </div>

      {/* Counter */}
      <div className="counter-section">
        <h2>Counter: {count}</h2>
        <button onClick={() => dispatch(increment())}>+</button>
        <button onClick={() => dispatch(decrement())}>-</button>
        <button onClick={() => dispatch(reset())}>Reset</button>
      </div>

      {/* Async Operations */}
      <div className="async-section">
        <h2>Random Quote</h2>
        <button onClick={handleFetchQuote} disabled={quoteStatus === 'loading'}>
          {quoteStatus === 'loading' ? 'Loading...' : 'Fetch Quote'}
        </button>
        {quote && (
          <blockquote>
            <p>"{quote.data?.content}"</p>
            <footer>— {quote.data?.author}</footer>
          </blockquote>
        )}
      </div>

      {/* Loading Indicator */}
      {isLoading && <div className="loading">Loading...</div>}
    </div>
  );
}

export default App;
```

### Custom Hooks for Better Organization

`src/hooks/useRedux.js`
```javascript
import { useSelector, useDispatch } from 'react-redux';

export const useCounter = () => {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();
  
  return {
    count,
    dispatch
  };
};

export const useAuth = () => {
  const { isAuthenticated, userData, token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  
  return {
    isAuthenticated,
    userData,
    token,
    dispatch
  };
};
```

---

## 📁 File Structure

```
src/
├── redux/
│   ├── store.js                 # Store configuration
│   ├── slices/
│   │   ├── counter.slice.js     # Counter state management
│   │   ├── user.slice.js        # User authentication
│   │   ├── loading.slice.js     # Loading states
│   │   └── posts.slice.js       # Posts/quotes management
│   └── thunks/
│       ├── posts.thunk.js       # Async operations for posts
│       └── user.thunk.js        # Async operations for user
├── hooks/
│   └── useRedux.js              # Custom Redux hooks
├── components/
│   └── ...                      # React components
├── App.jsx                      # Main app component
└── main.jsx                     # App entry point
```

---

## ✅ Best Practices

### 1. **Slice Organization**
- One slice per feature/domain
- Keep initial state simple and flat
- Use descriptive action names

### 2. **Persistence Strategy**
- Only persist necessary data
- Avoid persisting loading states
- Use whitelist for better performance

### 3. **Async Operations**
- Always handle loading states
- Use `rejectWithValue` for proper error handling
- Keep thunks focused on single responsibilities

### 4. **Component Integration**
- Create custom hooks for complex selectors
- Minimize re-renders with specific selectors
- Use `useCallback` for dispatch functions in components

### 5. **Error Handling**
```javascript
// In your thunk
export const fetchData = createAsyncThunk(
  'data/fetch',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.getData(params);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        status: error.response?.status
      });
    }
  }
);
```

### 6. **TypeScript Support** (Optional)
```typescript
// types.ts
export interface RootState {
  counter: CounterState;
  user: UserState;
  loading: LoadingState;
}

// In your component
const count = useSelector((state: RootState) => state.counter.value);
```

---

## 🎉 Summary

This setup provides:
- ✅ **Simplified Redux** with Redux Toolkit
- ✅ **Persistent state** across browser sessions
- ✅ **Async operations** with proper loading states
- ✅ **Type-safe** state management
- ✅ **Scalable** architecture for growing applications

Remember: Add new slices to `rootReducer` and include them in the persist `whitelist` if needed!

---

**Happy Coding!** 🚀