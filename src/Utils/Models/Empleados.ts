import { ITienda } from './Tiendas';
export interface IEmpleados {
    id: number;
    nombre: string;
    rol: number
    sueldo: number;
    tienda: ITienda
}
