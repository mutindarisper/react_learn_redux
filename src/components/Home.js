import React from 'react'
import {useNavigate} from 'react-router-dom'
import {  useDispatch, useSelector } from 'react-redux';
import UserForm from './UserForm';
import '../index.css'
import UserDetails from '../features/map/UserDetails';

const Home = () => {
  const navigate = useNavigate() //navigate programmatically onclick

  const userSlice = useSelector((state => state.user)) //return the entire user slice
  
  return (
    
    <>
    <h1>This is the Home Page</h1>
    <button onClick={() => navigate(-1)}>Dashboard</button>
    <br></br>
    default states
    <br></br>
    <br></br>
    <span>{userSlice.id}</span>
    <br></br>
    <br></br>
    <span>{userSlice.username}</span>
    <br></br>
    <br></br>
    <span>{userSlice.email}</span>
    <br />
    <br />
    <br />

    <UserForm />
    <br />
    <UserDetails />
    
    </>
  )
}

export default Home