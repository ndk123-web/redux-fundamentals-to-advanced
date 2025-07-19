import { create } from "zustand";
import { persist } from "zustand/middleware";
import CryptoJS from "crypto-js";

const secret = "asdamakfnaknfa"; // Should be stored securely, not hardcoded ideally

const useCountStore = create(
  persist(
    (set, get) => ({
      // Store encrypted value initially
      count: CryptoJS.AES.encrypt("0", secret).toString(),

      // Increment logic
      increament: () => {
        const decrypted = CryptoJS.AES.decrypt(get().count, secret).toString(CryptoJS.enc.Utf8);
        const newCount = parseInt(decrypted) + 1;
        const encrypted = CryptoJS.AES.encrypt(newCount.toString(), secret).toString();
        set({ count: encrypted });
      },

      // Decrement logic
      decreament: () => {
        const decrypted = CryptoJS.AES.decrypt(get().count, secret).toString(CryptoJS.enc.Utf8);
        const newCount = parseInt(decrypted) - 1;
        const encrypted = CryptoJS.AES.encrypt(newCount.toString(), secret).toString();
        set({ count: encrypted });
      },
    }),
    {
      name: "count",
      getStorage: () => localStorage,
    }
  )
);

export { useCountStore };
