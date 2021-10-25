import { IProducto } from "./producto";
import { store } from 'react-notifications-component';

export interface IInventario{
    producto?: IProducto;
    stock?: number;
    id?:number;
}