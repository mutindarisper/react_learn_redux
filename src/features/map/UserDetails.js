import React from 'react'
import { useSelector } from 'react-redux'


const UserDetails = () => {
    const userSlice = useSelector((state => state.user))
  return (
    <>
    <h1>Updated User Details</h1>
    <br />
    <p>{userSlice.id}</p>
    <p>{userSlice.username}</p>
    <p>{userSlice.email}</p>
    </>
    
  )
}

export default UserDetails