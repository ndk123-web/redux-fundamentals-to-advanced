import { useEffect } from "react";
import { useCountStore } from "./store/useCounerStore";

function App() {
  const count = useCountStore((state) => state.count);
  const increament = useCountStore((state) => state.increament);
  const decreament = useCountStore((state) => state.decreament);

  useEffect(() => {
    console.log(count);
  }, [count]);

  return (
    <>
      <h1>Hello</h1>
      <h3>Count: {count}</h3>
      <button onClick={increament}>Increment</button>
      <button onClick={decreament}>Decrement</button>
    </>
  );
}

export default App;
