import React from 'react'
import {useNavigate} from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate() //navigate programmatically onclick
  return (
    
    <>
    <h1>This is the Home Page</h1>
    <button onClick={() => navigate(-1)}>Dashboard</button>
    </>
  )
}

export default Home