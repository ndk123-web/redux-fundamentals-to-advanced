import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = [
    {id : nanoid() , name : "Bro" , age : 19}
]

const userSlice = createSlice({
    name : "users",
    initialState : initialState,
    reducers : {
        addUser : (state , action) => {
            const { name , age } = action.payload;
            state.push({id : nanoid() , name ,age});
        },

        removeUser : (state, action) => {
            const { id } = action.payload;
            state = state.filter(
                (user) => (
                    user.id !== id
                )
            )
            return state;
        }
    }
})

// it returns the addUser , removeUser inside that has a type: users/addUser or users/removeUser and function logic  
export const { addUser , removeUser } = userSlice.actions; 

// it has reducer and switch case that selects which reducer to run on the basis of action.type  
export default userSlice.reducer;

