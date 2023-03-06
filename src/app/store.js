import { configureStore } from "@reduxjs/toolkit";
import postsReducer from '../features/posts/postsSlice.js'
import usersReducer from '../features/users/usersSlice'

export const store = configureStore({
    reducer: {
        posts: postsReducer,
        users: usersReducer
    }
        
})