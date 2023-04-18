import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    wetlands: ['South Africa','Tanzania', 'Zimbabwe', 'Malawi', 'Angola', 'Botswana']
}

const wetlandSlice = createSlice({
    name: 'wetlandselections',
    initialState,
    reducers: {
    
    }
})

export const selectAllWetlands = (state) => state.wetlandselections;
export default wetlandSlice.reducer