import React from 'react'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { nanoid } from '@reduxjs/toolkit'
import { postAdded } from './postsSlice'
import { selectAllUsers } from '../users/usersSlice'

const AddPostForm = () => {
    const dispatch = useDispatch()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [userId, setUserId] = useState('')


    const users = useSelector(selectAllUsers)


    //when content and title changes
    const onTitleChanged = e => {
        const changed_title = e.target.value
        console.log(changed_title, 'changed title')
       return setTitle(e.target.value)
    } 
    
    const onContentChanged = e => setContent(e.target.value)
    const onAuthorChanged = e => setUserId(e.target.value)



//logic to save posts on click
const onSavePostClicked = () => {
    if(title && content) {
        dispatch(
             postAdded(title, content, userId)
        )

        setTitle('')
        setContent('')
    }
}

const canSave = Boolean(title) && Boolean(content) && Boolean(userId)

const userOptions = users.map( user => (
    <option key={user.id} value={user.id}>
            {user.name}
    </option>
))


      return (
            <section>
                <h2> Add a New Post</h2>
                <form>
                    <label htmlFor='postTitle'>PostTitle:  </label>
                    <input 
                    type="text"
                    id='postTitle'
                    name='postTitle'
                    value={title}
                    onChange={onTitleChanged}
                    
                    />

                    <label htmlFor='postAuthor'>Author:  </label>
                    <select id='postAuthor' 
                    value={userId}
                    onChange={onAuthorChanged}
                    >

                        <option value=''></option>
                        {userOptions}

                    </select>

                     <label htmlFor='postContent'>Content:  </label>
                    <textarea 
                    type="text"
                    id='postContent'
                    name='postContent'
                    value={content}
                    onChange={onContentChanged}
                    
                    />
                    <button
                     type='button'
                     onClick={onSavePostClicked}
                     disabled={!canSave}
                    >Save post</button>
                </form>
            </section>
  )
}

export default AddPostForm