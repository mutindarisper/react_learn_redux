import { createSlice } from "@reduxjs/toolkit";


const initialState = [
    // {
    //     regions_list: ['Okavango', 'Cuvelai', 'Zambezi', 'Limpopo']

    // }
    {
        id:'1',
        name: 'Okavango',
        aoi: '',
        indicator: 'Exposure',
        sub_indicator: 'Land Cover',
        year: '2010'
   
    },
    {
        id:'2',
        name: 'Cuvelai',
        aoi: '',
        indicator: 'Resiliance',
        sub_indicator: 'Vegetation Cover',
        year: '2011'

    },
    {
        id:'3',
        name: 'Zambezi',
        aoi: '',
        indicator: 'Sensitivity',
        sub_indicator: 'Wetland Inventory',
        year: '2012'
   
    },
    {
        id:'4',
        name: 'Limpopo',
        aoi: '',
        indicator: 'Expose',
        sub_indicator: 'Land Cover',
        year: '2013'
        
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