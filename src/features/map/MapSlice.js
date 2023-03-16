import { createSlice } from "@reduxjs/toolkit";


const initialState = [
    // {
    //     regions_list: ['Okavango', 'Cuvelai', 'Zambezi', 'Limpopo']

    // }
    {
        id:'1',
        name: 'Okavango',
        aoi: ''
   
    },
    {
        id:'2',
        name: 'Cuvelai',
        aoi: ''

    },
    {
        id:'3',
        name: 'Zambezi',
        aoi: ''
   
    },
    {
        id:'4',
        name: 'Limpopo',
        aoi: ''
        
    }
   

]


const mapSlice = createSlice({
    name: 'mapselections',
    initialState,
    reducers: {
    //     selectedRegion: {
    //         reducer(state, action) { //reducer action to handle form data and alter the state
    //         state.push(action.payload)
    //     },

    //     prepare(regions_list) {
    //         return{
    //             payload: {
    //                 regions_list
    //             }
                
    //         }
    //     }
    // }
    }
})


export const selectAllRegions = (state) => state.mapselections;
export default mapSlice.reducer