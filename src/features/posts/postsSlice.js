import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from '@reduxjs/toolkit'
//initial state
const initialState = [
    {
        id:'1',
        title: 'Learning redux toolkit',
        content: 'I have to give this a try'
    },
    {
        id:'2',
        title: 'Slices',
        content: 'Already gave this a try'
    }
]

const postsSlice = createSlice({
    name:'posts',
    initialState,
    reducers: {
        postAdded: {
            reducer(state, action) { //reducer action to handle form data and alter the state
            state.push(action.payload)
        },

        prepare(title, content, userId) {
            return{
                payload: {
                    id: nanoid(), //generate random ids
                    title,
                    content, 
                    userId
                }
                
            }
        }
    }
    }
})


export const selectAllPosts = (state) => state.posts;

export const {postAdded }= postsSlice.actions

export default postsSlice.reducer