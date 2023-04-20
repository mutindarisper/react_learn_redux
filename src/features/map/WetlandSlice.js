import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    wetlands: ['Nyslvlei','Modemolle', 'Intunjambili','Driefontein','Lake Ngami', 'Barotse','Morapeng','Makuleke'],
    regions: ["Limpopo","Cuvelai","Zambezi", "Okavango"],
    selected_region: '',
    indicators:['Exposure', 'Sensitivity','Resiliance'],
    selected_indicator: '',
    subindicators:['Land Cover', 'Vegetation Cover', "Wetland Inventory"],
    years: ["2016","2017",'2018','2019','2020', '2021', "2022"]
}

const wetlandSlice = createSlice({
    name: 'wetlandselections',
    initialState,
    reducers: {
        changeSelectedRegion:(state, action) => {
            state.selected_region = action.payload
           
        },
        changeSelectedIndicator: (state, action) => {
            state.selected_indicator = action.payload
          if(state.selected_indicator === 'Exposure'){
            state.subindicators = ['Land Cover', 'Vegetation Cover', "Wetland Inventory"]
          }
          if(state.selected_indicator === 'Sensitivity'){
            state.subindicators = ['Water Quality', 'Soil Moisure Index']
          }
          if(state.selected_indicator === 'Resiliance'){
            state.subindicators = ['Burnt Area FIRMS', 'Precipitation Index', 'Undulation']
          }
          
        }

        
}
     
})

export const selectAllWetlands = (state) => state.wetlandselections;
export const {changeSelectedRegion, changeSelectedIndicator} = wetlandSlice.actions
export default wetlandSlice.reducer