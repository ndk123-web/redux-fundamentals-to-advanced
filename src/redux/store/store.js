import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "../slices/user.slice.js"; // Import the user reducer
import loadingReducer from "../slices/load.slice.js"; // Import the loading reducer
import counterReducer from "../slices/counter.slice.js"; // Import the counter reducer

import { 
  PERSIST, 
  REHYDRATE, 
  PURGE, 
  REGISTER, 
  PAUSE, 
  FLUSH 
} from "redux-persist"; // Import action types from redux-persist

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Use localStorage for web

// Combine all reducers into a single root reducer
const rootReducer = combineReducers({
  user: userReducer, // Handles user-related state
  loading: loadingReducer, // Handles loading state
  counter: counterReducer, // Handles counter state
});

// Configuration for persisting the store
const persistConfig = {
  key: "root", // Key for local storage
  storage, // Storage engine to use
  whitelist: ["counter", "user"], // Specify which reducers' state should be persisted
};

// Create a persisted reducer using the configuration and rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer and middleware
// we add middleware because it was giving warning for non serializable actions
// using this middleware code we can ignore non serializable actions on console 

const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable actions to avoid warnings
        ignoreActions: [PERSIST, REHYDRATE, PURGE, REGISTER, PAUSE, FLUSH],
      },
    }),
});

// Create a persistor to persist the store
const persistor = persistStore(store);

// Export the store and persistor
export { store, persistor };

