import {createSlice} from '@reduxjs/toolkit'

import { ITienda } from './Model/Tienda.model';


const initialState: ITienda = {
    id: 0,
    nombre: ""
}


const tiendaSlice = createSlice({
    name: "Tienda Slice",
    initialState,
    reducers: {
        setTienda : (state: ITienda, action: {payload: ITienda}) => {
              state.id =  action.payload.id;
              state.nombre = action.payload.nombre;
        },
    }
})

export const {setTienda} = tiendaSlice.actions;
export default tiendaSlice.reducer;