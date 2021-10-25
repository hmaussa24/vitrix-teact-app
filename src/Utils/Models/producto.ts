import { Usuario } from './Usuario';
import {ITienda} from './Tiendas';
export interface IProducto {
    codigo: string;
    costo: number;
    descripcion: string;
    id: number;
    image: string;
    nombre: string;
    precio: number;
    Usuario: Usuario;
    Tienda: ITienda;
}