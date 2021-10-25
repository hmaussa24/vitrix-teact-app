import {createSlice} from '@reduxjs/toolkit'
import { ICredito } from './Model/Credito.model';


const initialState: ICredito = {
    id: 0,
}


const creditoSlice = createSlice({
    name: "Credito Slice",
    initialState,
    reducers: {
        setCredito : (state: ICredito, action: {payload: number}) => {
              state.id =  action.payload;
        },
    }
})

export const {setCredito} = creditoSlice.actions;
export default creditoSlice.reducer;