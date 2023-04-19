import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    wetlands: ['Nyslvlei','Modemolle', 'Intunjambili','Driefontein','Lake Ngami', 'Barotse','Morapeng','Makuleke'],
    regions: ["Limpopo","Cuvelai","Zambezi", "Okavango"],
    selected_region: 'Karen',
    indicators:['Exposure', 'Sensitivity','Resiliance'],
    subindicators:['Land Cover', 'Vegetation Cover', "Wetland Inventory"],
    years: ["2016","2017",'2018','2019','2020', '2021', "2022"]
}

const wetlandSlice = createSlice({
    name: 'wetlandselections',
    initialState,
    reducers: {
        // changeSelectedRegion:(state, action) => {
        //     state.selected_region = action.payload
           
        // }

        setRegion: (state, payload) => {
            //state here is an immer draft, do not use that to copy current state
            console.log("before", state); //init state
            state.selected_region = 'Nairobi';
            console.log('after', state)
            //not returning anyting
          },
}
     
})

export const selectAllWetlands = (state) => state.wetlandselections;
export default wetlandSlice.reducer