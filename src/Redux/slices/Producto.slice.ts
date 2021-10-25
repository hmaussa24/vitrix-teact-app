import {createSlice} from '@reduxjs/toolkit'
import { IProductoModel } from './Model/Producto.model';


const initialState: IProductoModel = {
    id: 0,
}


const productoSlice = createSlice({
    name: "Producto Slice",
    initialState,
    reducers: {
        setProducto : (state: IProductoModel, action: {payload: number}) => {
              state.id =  action.payload;
        },
    }
})

export const {setProducto} = productoSlice.actions;
export default productoSlice.reducer;