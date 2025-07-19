import { useEffect } from "react";
import { useCountStore } from "./store/useCounerStore";
import CryptoJS from "crypto-js";

const secret = "asdamakfnaknfa";

function App() {
  const count = useCountStore((state) => state.count);
  const increament = useCountStore((state) => state.increament);
  const decreament = useCountStore((state) => state.decreament);

  const decryptedCount = CryptoJS.AES.decrypt(count, secret).toString(CryptoJS.enc.Utf8);

  return (
    <>
      <h1>Hello</h1>
      <h3>Count: {decryptedCount}</h3>
      <button onClick={increament}>Increment</button>
      <button onClick={decreament}>Decrement</button>
    </>
  );
}

export default App;
