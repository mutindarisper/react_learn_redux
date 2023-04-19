import React from 'react'
import { useDispatch } from 'react-redux'
import { updateUsername, updateEmail } from '../features/map/userSlice'

const UserForm = () => {

    //now we want to update the state using the dispatch function
    const dispatch = useDispatch()

  return (
<form style={{width : '250px'}}>
    <label htmlFor='username'>Username</label>
    <input type='text' id='username'
    onChange={ (e) => {
        dispatch(updateUsername(e.target.value))
    }}
    
    />

    <label htmlFor='email'>Email</label>
    <input type='text' id='email'
    onChange={(e) => {
        dispatch(updateEmail(e.target.value))
    }}
    />
    <button style={{width: '100px'}}>Submit</button>
</form>
  )
}

export default UserForm