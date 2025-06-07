## Main Redux 

1. We use 2 libraries (react-redux) and (redux/toolkit) which is new redux that can easily debug and understand 


2. Main Funcion: 
    - inside slicers -> we return slice.reducer and methods from slice.actions 
        ```js
        export const { addTodo, removeTodo } = todoSlice.actions;
        export default todoSlice.reducer;
        ```

    - inside store -> we put all reducer inside reducer : {} object 
        ```js
        import todoReducer from "../slicers/todoslice";

        const store = configureStore({
            reducer : {
                todos : todoReducer // here u can see 
            }
        });     
        ```


3. Main Keys: 
    - state -> it pointing to the current initialstate (u can see 4. point *useSelector* for better visualization)
    - action -> it pointing to the data which is coming from using dipatch , inside action.payload = {title : "" , complted: ""}
             -> (u can see 4. point *useDispatch* for better visualization)

4. TO send data to redux store ( react-redux methods )

    - useSelector -> *To get the initial state of reducer*
    ```js
      const todos = useSelector((state) => {
        return state.todos
    })
    ```
    Here "state" refers to the store.reducer:
    ```js
    const store = configureStore({
    reducer : {
        todos : todoReducer 
    }
    });
    ```
    

    - useDispatch -> *To send the data to particular slicer method*
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