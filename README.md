
## Main Redux

1. We use 2 libraries (react-redux) and (redux/toolkit) which is new redux that can easily debug and understand

2. Main Funcion:

   * inside slicers -> we return slice.reducer and methods from slice.actions

     ```js
     const todoSlice = createSlice({
     name: "mytodos",
     initialState,
     reducers: {
         addTodo: (state, action) => {
         const { title, completed } = action.payload;
         state.push({
             id: nanoid(),
             title,
             completed
         });
         return state
         }}
     })

     export const { addTodo, removeTodo } = todoSlice.actions;
     export default todoSlice.reducer;
     ```

   * inside store -> we put all reducer inside reducer : {} object

     ```js
     import todoReducer from "../slicers/todoslice";

     const store = configureStore({
         reducer : {
             todos : todoReducer // here u can see 
         }
     });     
     ```

3. Main Keys:

   * state -> it pointing to the current initialstate (u can see 4. point *useSelector* for better visualization)
   * action -> it pointing to the data which is coming from using dipatch , inside action.payload = {title : "" , complted: ""}
     -> (u can see 4. point *useDispatch* for better visualization)

4. TO send data to redux store ( react-redux methods )

   *useSelector -> *To get the initial state of reducer*
    *print int the console "state" u can see the entire initialstate of reducers like below*

   ```js
     const todos = useSelector((state) => {
        
       console.log("All Reducers: ",state) // check we returns the list of reducers with initialstates
       return state.todos
   })
````

Here "state" refers to the store.reducer:

```js
const store = configureStore({
reducer : {
    todos : todoReducer // todoreducer is nothing but initialstate of todoslice
}
});
```

* useDispatch -> *To send the data to particular slicer method*

```js
import { addTodo } from './slice/todoSlice.js'
const dispatch = useDispatch() 
```

We import the method addTodo which is method of slicer

```js
dispatch(addTodo({ title : "Sample title" , completed : false }))
```

it means we are sending this object as a action.payload = { title : "Sample title" , completed : false }

```js
addTodo: (state, action) => {
  const { title, completed } = action.payload;  // here u can see we are destructuring it
  state.push({
    id: nanoid(),
    title,
    completed
  });
  return state
},
```

---

## 5. What happens internally? (Redux Toolkit under the hood)

* When you do:

  ```js
  dispatch(addTodo({ title: "Sample", completed: false }));
  ```

  **Internally** Redux Toolkit converts this to:

  ```js
  {
    type: "mytodos/addTodo",    // ← auto namespaced using slice name
    payload: { title: "Sample", completed: false }
  }
  ```

* `addTodo` and `removeTodo` are **auto-generated action creators**.
  Internally they are like:

  ```js
  function addTodo(payload) {
    return {
      type: "mytodos/addTodo",
      payload
    }
  }
  ```

* `todoSlice.reducer` is a **big reducer function** which does:

  ```js
  function reducer(state, action) {
    switch(action.type) {
      case "mytodos/addTodo":
        // runs addTodo logic defined inside createSlice
        return updatedState;

      case "mytodos/removeTodo":
        // runs removeTodo logic
        return updatedState;

      default:
        return state;
    }
  }
  ```

* Redux Toolkit uses **Immer library** inside, so you can safely write:

  ```js
  state.push({...})
  ```

  and it will automatically return a new immutable state.

