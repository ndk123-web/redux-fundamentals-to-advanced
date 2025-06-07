import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { useDispatch , useSelector } from 'react-redux'
import { addTodo , removeTodo } from './slicers/todoslice.js'

function App() {

  // here state means store.js -> store.reducer = {}
  const todos = useSelector((state) => {
    return state.todos
  })

  // here dispatch is use for sending the data to the reducer
  // it has type and payload 
  const dispatch = useDispatch();

  const handlerAddTodo = () => {
    console.log("Add")
    dispatch(addTodo({title: "Sample Title" , completed : true}));
  }

  console.log("Todos: ",todos)

  return (
    <>
  <h1>Todos</h1>

  {todos.map((todo) => {
    return (
      <div key={todo.id}>
        
        <h2>Title: {todo.title}</h2>
        
        <p>Completed: {todo.completed ? 'Yes' : 'No'}</p>

        <button onClick={ () => {
              console.log("Delete")
              dispatch(removeTodo({ id: todo.id }))
        } }>
          Delete </button>
      
      </div>
    );
  })}

  <br/>

  <button onClick={handlerAddTodo}>
    Add Todo  
  </button>
</>

  )
}

export default App
