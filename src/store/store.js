import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "../slicers/todoslice";
import userReducer from "../slicers/userslice"

const store = configureStore({

    // here todos,users is for useSelector  
    reducer : {
        todos : todoReducer, // it has its own initialstate 
        users : userReducer // it has its own initialstate
    }
});

export { store }