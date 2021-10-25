import { configureStore } from '@reduxjs/toolkit'
//import counterSlice from '../slices/conuter.slices';
import spinerSlice from '../slices/Spiner.slice';
import loginSlice from '../slices/Login.slice'
import tiendaSlice from '../slices/Tienda.slice'
import productoSlice from '../slices/Producto.slice';
import creditoSlice from '../slices/Credito.slice';
import menuSlice from '../slices/Menu.slice';

////////////////////
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist'

const reducers = combineReducers({
    spiner: spinerSlice,
    login: loginSlice,
    tienda: tiendaSlice,
    producto: productoSlice,
    credito: creditoSlice,
    menu: menuSlice,
});

const persistConfig = {
    key: 'root',
    storage,
  };

  const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer: persistedReducer,
})

export type RootState = ReturnType<typeof store.getState>
export type appDispatch = typeof store.dispatch
export default store
