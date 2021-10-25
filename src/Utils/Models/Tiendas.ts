export interface ITienda {
    id: number;
    nombre: string;
    image: string;
    email: string;
    direccion: string;
    tipo: number;
    telefono: string;
    ciudad: {
        id: number;
        nombre: string;
    }
}