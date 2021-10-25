import {createSlice} from '@reduxjs/toolkit'

import {ICounter} from './Model/conuter.model'


const initialState: ICounter = {
    counter: 0,
}


const counterSlice = createSlice({
    name: "Conuter Slice",
    initialState,
    reducers: {
        setCounter : (state: ICounter, action: {payload: number}) => {
              state.counter = action.payload;
        },
        resetCounter : (state: ICounter) => {
            state.counter = 0;
        }
    }
})

export const {setCounter, resetCounter} = counterSlice.actions;
export default counterSlice.reducer;