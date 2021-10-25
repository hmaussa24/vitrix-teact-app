import {createSlice} from '@reduxjs/toolkit'

import { ISpiner } from './Model/Spiner.model';


const initialState: ISpiner = {
    spiner: false,
}


const spinerSlice = createSlice({
    name: "Spiner Slice",
    initialState,
    reducers: {
        setSpiner : (state: ISpiner, action: {payload: boolean}) => {
              state.spiner = action.payload;
        },
    }
})

export const {setSpiner} = spinerSlice.actions;
export default spinerSlice.reducer;