import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: 1,
    username:'Anson',
    email: 'anson@anson.com'
}
export const userSlice = createSlice({
    name: 'user',
    initialState,
    //setup reducers....middle man function to update the initial state in an immutable way
    reducers: {
        updateUsername: (state, action) => {
            state.username = action.payload
        },
        updateEmail: (state, action) => {
            state.email = action.payload
        }
    }
    
})
//export all reducers defined 
//destructure instead of userslice.actions.updateusername
export const {updateUsername, updateEmail} = userSlice.actions
export default userSlice.reducer