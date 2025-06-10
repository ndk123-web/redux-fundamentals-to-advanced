import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "./redux/slices/user.slice";
import { fetchPost } from "./redux/thunks/fetchPost.thunk.js";
import { increament, decreament } from "./redux/slices/counter.slice.js";

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.user.auth);
  const isLoading = useSelector((state) => state.loading.loading);
  const count = useSelector((state) => state.counter.value);

  useEffect(() => {
    console.log(isAuth);
    dispatch(fetchPost());
  }, []);

  return (
    <>
      Hello World
      <div>
        <p>{isAuth ? "Log out" : "Log in"}</p>

        <p>{isLoading ? "Loading" : "Not Loading"}</p>

        <button
          onClick={() => {
            if (isAuth) {
              dispatch(logout());
            } else {
              dispatch(login({ user: "Ndk" }));
            }
          }}
        >
          {isAuth ? "Log In" : "Log out"}
        </button>

        <p>Persisted Count : {count}</p>

        <button onClick={() => dispatch(increament())}>Increament</button>
        <button onClick={() => dispatch(decreament())}>Decreament</button>
      </div>
    </>
  );
}

export default App;
