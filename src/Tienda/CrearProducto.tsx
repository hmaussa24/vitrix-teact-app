import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useAppDispachs, useAppSelector } from '../Redux/hooks/hooks';
import { Categoria } from '../Utils/Models/Categoria';
import { httpGet, httpPost } from '../Services/Http';
import { setSpiner } from "../Redux/slices/Spiner.slice";
import { store } from "react-notifications-component";
import { danger, success } from "../Utils/Notificaciones";
import { useHistory } from 'react-router-dom';
import Boton from "../Component/Boton";
import jsBarcode from 'jsbarcode';
import NewTienda from '../Component/NewTienda'
import { MenuItem, TextField } from "@material-ui/core";
interface IProducto {
    id?: number;
    codigo?: string;
    costo?: number;
    descripcion?: string;
    image?: string;
    nombre?: string;
    precio?: number;
    categoria?: {
        id?: number;
    };
    tienda?: {
        id?: number
    };
}
const CrearProducto = () => {
    const urlBase = process.env.REACT_APP_URL_BASE
    const dispacher = useAppDispachs();
    const tienda = useAppSelector((state) => state.tienda);
    const h = useHistory()
    const [producto, setProducto] = useState<IProducto>({
        tienda: {
            id: tienda.id
        }
    });
    const [categorias, setCategorias] = useState<Categoria[]>();
    const sesion = useAppSelector(state => state.login);
    const handlerData = (event: ChangeEvent<any>) => {
        setProducto({
            ...producto,
            [event.target.name]: event.target.value
        })
        if (event.target.name === "codigo")
            jsBarcode("#codigo", event.target.value, {
                height: 25
            })
    }
    const handlerSelectCat = (event: ChangeEvent<any>) => {
        // console.log(event.target.value)
        setProducto({ ...producto, categoria: { id: event.target.value } })
    }

    const guardarProducto = () => {
        dispacher(setSpiner(true))
        httpPost<IProducto, IProducto>(`${urlBase}producto/registrar`, producto, { headers: { Authorization: `${sesion.sesion.token}` } })
            .then((result) => {
                if (result.data.id) {
                    store.addNotification(success({ titulo: "Producto creado", mensaje: `Se a creado el producto: ${result.data.nombre}`, duracion: 2000 }))
                    h.push("/productos")
                } else {

                }
                dispacher(setSpiner(false))
            })
            .catch(error => {
                dispacher(setSpiner(false))
                store.addNotification(danger({ titulo: "Upss!", mensaje: "No se puedo realizar el registro, intentelo nuevamente", duracion: 2000 }));
            })
    }


    const listarCategorias = useCallback(() => {
        dispacher(setSpiner(true))
        httpGet<Categoria[]>(`${urlBase}categorias/listar`, { headers: { Authorization: `${sesion.sesion.token}` } }).then(result => {
            if (result.data.length > 0) {
                setCategorias(result.data)
            }
            dispacher(setSpiner(false))
        })
            .catch(error => {
                dispacher(setSpiner(false))
            })
    }, [sesion, dispacher, urlBase])

    useEffect(() => {
        listarCategorias()
    }, [listarCategorias])
    return (
        <NewTienda>
            <div className="box-center" >
                <div className="label-center label-100 label-registro">
                    <label className="label-100 label-color1 fnt-18 label-center ">Crear Producto</label>
                </div>
                <div className="box-register">
                    <TextField label="Codigo de barras" id="filled-size-normal" size="small" name="codigo" variant="outlined" onChange={handlerData} />
                    <TextField label="Nombre de producto" id="filled-size-normal" size="small" name="nombre" variant="outlined" onChange={handlerData} />
                    <TextField label="Precio de compra" id="filled-size-normal" size="small" name="costo" variant="outlined" onChange={handlerData} />
                    <TextField label="Precio de venta" id="filled-size-normal" size="small" name="precio" variant="outlined" onChange={handlerData} />
                    <TextField
                        id="outlined-select-currency"
                        select
                        label="Categoria"
                        onChange={handlerSelectCat}
                        helperText="Selecciona la categordia del producto"
                        variant="outlined"
                        size="small"
                        name="categoria_id"
                    >
                        {categorias?.map(item => <MenuItem value={item.id}>{item.nombre}</MenuItem>)}
                        

                    </TextField>
                    <TextField label="Descripcion corta" multiline rows={2} id="filled-size-normal" size="small" name="descripcion" variant="outlined" onChange={handlerData} />
                </div>
                <Boton color="bgc3" functionBoton={guardarProducto} label="Crear Producto" styleBoton="box-boton" />
                <div className="codigo-barra">
                    <svg id="codigo" ></svg>
                </div>
            </div>
        </NewTienda>
    )
}

export default CrearProducto;