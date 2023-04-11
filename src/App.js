import PostsList from "./features/posts/PostsList";
import AddPostForm from "./features/posts/AddPostForm";
import Map from "./features/map/Map";
import { configureStore } from "@reduxjs/toolkit";
import mapReducer from './features/map/MapSlice'
import { Routes, Route } from 'react-router-dom'

import {  useDispatch, useSelector } from 'react-redux';
import { selectAllRegions } from './features/map/MapSlice'
import Home from "./components/Home";
import About from "./components/About";

function App() {
// const reducer = mapReducer()
//   const store = configureStore(reducer)

//   const region_name= store.subscribe(() => {
//     return store.getState().name; // this is isn't returned to REGION_ID
// })
// console.log(region_name, 'region name from app component'); // REGION_ID contains the unsubscribe method


const mapselections = useSelector(selectAllRegions)
   
const selected_region= mapselections.map( selection => (

      selection.name

))


  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="about" element={<About />}></Route>
      <Route path="dashboard" element={ <div className="App"> <Map /></div>}></Route>
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
