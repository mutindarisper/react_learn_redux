import { useState } from "react";
import PostsList from "./features/posts/PostsList";
import AddPostForm from "./features/posts/AddPostForm";
import Map from "./features/map/Map.js";
import { configureStore } from "@reduxjs/toolkit";
import mapReducer from './features/map/MapSlice'
import wetlandReducer from './features/map/WetlandSlice'
import { Routes, Route } from 'react-router-dom'
import { Link, NavLink, useNavigate} from "react-router-dom"

import {  useDispatch, useSelector } from 'react-redux';
import { selectAllRegions } from './features/map/MapSlice'
import { selectAllWetlands } from './features/map/WetlandSlice'
import Home from "./components/Home";
import About from "./components/About";

import { IoHome, IoInformationCircle} from "react-icons/io5";

function App() {




const wetlandselections = useSelector(selectAllWetlands)
   
const selected_region= wetlandselections.regions.map( selection => (
console.log(selection, 'app selection')
      // selection

))



const wetlandSlice = useSelector((state => state.wetlandselections)) //return the entire wetland slice

const navigate = useNavigate() //navigate programmatically onclick


  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="about" element={<About />}></Route>
      <Route path="dashboard" element={ 
       
      
      <div className="App">
        {/* <NavLink to='/'>   */}
        <IoHome className="home_icon" onClick={() => navigate('/')}/>
        {/* <p className="home_icon">Home</p> */}
        
         {/* </NavLink> */}
        
         <IoInformationCircle height="100" className="about_icon" onClick={() => navigate('about')}/>
         {/* <p>{selected_region}</p> */}

         <Map />
         {/* <div>Updated Region in root component</div> access the updated region
         <span>{wetlandSlice.selected_region}</span> */}
         
         </div>}></Route>
      {/* <main className="App"> */}
         {/* <AddPostForm />
     <PostsList /> */}
     {/* {region_name} */}

     {/* {selected_region} */}
    
     {/* <Map /> */}
     
  
    {/* </main> */}

      
    </Routes>
    
  );
}

export default App;
