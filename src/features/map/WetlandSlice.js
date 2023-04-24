import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    wetlands: ['Nyslvlei','Modemolle', 'Intunjambili','Driefontein','Lake Ngami', 'Barotse','Morapeng','Makuleke'],
    regions: ["Limpopo","Cuvelai","Zambezi", "Okavango"],
    selected_region: '',
    indicators:['Exposure', 'Sensitivity','Resiliance'],
    selected_indicator: '',
    subindicators:['Land Cover', 'Vegetation Cover', "Wetland Inventory"],
    selected_subindicator: '',
    years: ["2016","2017",'2018','2019','2020', '2021', "2022"],
    satellites: ['SENTINEL', 'LANDSAT'],
    seasons: ['WET', 'DRY'],
    parameters: ['Wetland Extent', 'Wetland Status']
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

          if(state.selected_subindicator === 'Wetland Inventory'){
            state.parameters = ['Wetland Extent', 'Wetland Status']
    
          }
          if(state.selected_subindicator=== 'Water Quality'){
            state.parameters = ['Turbidity', 'Sus Sediments']
          }
          
        },
        changeSelectedSubIndicator: (state, action) => {
            state.selected_subindicator = action.payload
        }

        
}
     
})

export const selectAllWetlands = (state) => state.wetlandselections;
export const {changeSelectedRegion, changeSelectedIndicator, changeSelectedSubIndicator} = wetlandSlice.actions
export default wetlandSlice.reducer