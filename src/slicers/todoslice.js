import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = [
  { id: 1, title: "Learn React Redux", completed: false }
];

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
      console.log("Payload Type: ",action.type);
      return state
    },
    removeTodo: (state, action) => {
      const { id } = action.payload;
      const index = state.findIndex(todo => todo.id === id);
      if (index !== -1) {
        state.splice(index, 1);
      }
    }
  }
});

export const { addTodo, removeTodo } = todoSlice.actions;
export default todoSlice.reducer;
