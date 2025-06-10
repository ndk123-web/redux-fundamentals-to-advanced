// This code block is the entry point for our React application.
// It renders the entire App component tree to the DOM element with the id "root".

// First, we import the necessary components and utilities from React and other libraries.
import { StrictMode } from "react"; // A utility component that ensures React checks for errors in development mode.
import { createRoot } from "react-dom/client"; // A utility function that creates a root for our React app.
import "./index.css"; // Our app's CSS styles.
import App from "./App.jsx"; // The top-level component of our app.

// Then, we import the necessary components and utilities for Redux and React Redux.
import { PersistGate } from "redux-persist/integration/react"; // A component that allows us to persist our app's state across page reloads.
import { store, persistor } from "./redux/store/store.js"; // Our Redux store and the persistor that allows us to persist its state.
import { Provider } from "react-redux"; // A component that makes our Redux store available to our app's components.

// Finally, we render our app to the DOM.
createRoot(document.getElementById("root")).render(
  // The Provider component wraps our app and makes our Redux store available to our components.
  <Provider store={store}>
  {/* // The PersistGate component wraps our app and handles the logic for persisting our app's state.
  // It takes a loading prop that specifies what to render while the app is loading its persisted state.
  // It also takes a persistor prop that specifies the persistor to use. */}
    <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
      {/* // And finally, we render our app's top-level component, App. */}
      <App />
    </PersistGate>
  </Provider>
);
