import { createSlice } from "@reduxjs/toolkit";

const initialState = [
    {
        id:'1',
        name: 'Cbum',
   
    },
    {
        id:'2',
        name: 'Queen Sleeze',
        
    }
]

const usersSlice = createSlice({
    name:'users',
    initialState,
    reducers: {
    //     postAdded: {
    //         reducer(state, action) { //reducer action to handle form data and alter the state
    //         state.push(action.payload)
    //     },

    //     prepare(title, content) {
    //         return{
    //             payload: {
    //                 id: nanoid(), //generate random ids
    //                 title,
    //                 content
    //             }
                
    //         }
    //     }
    // }
    }
})


export const selectAllUsers = (state) => state.users;
export default usersSlice.reducer