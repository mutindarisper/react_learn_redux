import PostsList from "./features/posts/PostsList";
import AddPostForm from "./features/posts/AddPostForm";
import Map from "./features/map/Map";
import { configureStore } from "@reduxjs/toolkit";
import mapReducer from './features/map/MapSlice'

import {  useDispatch, useSelector } from 'react-redux';
import { selectAllRegions } from './features/map/MapSlice'

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
    <main className="App">
         {/* <AddPostForm />
     <PostsList /> */}
     {/* {region_name} */}

     {/* {selected_region} */}
    
     <Map />
     
  
    </main>
  );
}

export default App;
