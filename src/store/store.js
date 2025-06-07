import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "../slicers/todoslice";

const store = configureStore({
    reducer : {
        todos : todoReducer 
    }
});

export { store }