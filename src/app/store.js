import { configureStore } from "@reduxjs/toolkit";
import postsReducer from '../features/posts/postsSlice.js'
// import usersReducer from '../features/users/usersSlice'
import mapReducer from '../features/map/MapSlice'
import wetlandReducer from '../features/map/WetlandSlice.js'
import userReducer from '../features/map/userSlice.js'

export const store = configureStore({
    reducer: {
        posts: postsReducer,
        // users: usersReducer,
        mapselections: mapReducer,
        wetlandselections: wetlandReducer,
        user: userReducer

    }
        
})