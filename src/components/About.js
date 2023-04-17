import React from 'react'
import { useNavigate } from 'react-router-dom'

const About = () => {
  const navigate = useNavigate()
  return (
    <>
     <h1>This is an About Page</h1>
     <button onClick={() => navigate(-17)}>Dashboard</button>
    </>
   
  )
}

export default About