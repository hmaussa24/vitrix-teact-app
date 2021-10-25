import {createSlice} from '@reduxjs/toolkit'
import { ILogin } from './Model/Login.model';


interface ISesion{
    sesion: ILogin
}

const initialState: ISesion = {
    sesion: {
        email: "",
        id: 0,
        nombre: "",
        rol: 0,
        token: "",   
    },
}
const loginSlice = createSlice({
    name: "Login Slice",
    initialState,
    reducers: {
        setLoginSesion : (state: ISesion, action: {payload: ILogin}) => {
              state.sesion = action.payload;
        },
        clearSesion: (state: ISesion) => {
            state.sesion = {}
        }
    }
})

export const {setLoginSesion, clearSesion} = loginSlice.actions;
export default loginSlice.reducer;