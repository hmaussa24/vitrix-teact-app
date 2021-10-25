import {createSlice} from '@reduxjs/toolkit'
import { IMenuState } from './Model/Menu.model';


const initialState: IMenuState = {
    state: false
}


const menuSlice = createSlice({
    name: "menu Slice",
    initialState,
    reducers: {
        setStateMenu : (state: IMenuState, action: {payload: boolean}) => {
              state.state =  action.payload;
        },
    }
})

export const {setStateMenu} = menuSlice.actions;
export default menuSlice.reducer;