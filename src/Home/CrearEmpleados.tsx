import { useCallback, useEffect, useState, ChangeEvent } from 'react';
import { store } from "react-notifications-component"
import Boton from "../Component/Boton"
import { useAppDispachs, useAppSelector } from "../Redux/hooks/hooks"
import { setSpiner } from "../Redux/slices/Spiner.slice"
import { httpGet, httpPost } from '../Services/Http';
import { ITienda } from '../Utils/Models/Tiendas';
import { danger, success, warning } from "../Utils/Notificaciones"
import { IEmpleados } from '../Utils/Models/Empleados';
import { useHistory } from 'react-router-dom';
import NewHome from '../Component/HomeNew'
import { MenuItem, TextField } from '@material-ui/core';

interface IEmpleado {
    id?: number;
    nombre?: string;
    rol?: number
    sueldo?: number;
    tienda?: {
        id?: number
    }

}

const CrearEmpleados = () => {
    const urlBase = process.env.REACT_APP_URL_BASE
    const [tiendas, setTiendas] = useState<ITienda[]>()
    const [empleado, setEmpleado] = useState<IEmpleado>({})
    const dispacher = useAppDispachs()
    const sesion = useAppSelector((state) => state.login)
    let history = useHistory()
    const handlerData = (event: ChangeEvent<any>) => {
        setEmpleado({
            ...empleado,
            [event.target.name]: event.target.value
        })
    }

    const handlerSelectTienda = (event: ChangeEvent<any>) => {
        setEmpleado({ ...empleado, tienda: { id: Number(event.target.value) } })
    }
    const handlerRol = (event: ChangeEvent<any>) => {
        setEmpleado({ ...empleado, rol: Number(event.target.value) })
    }

    const getListaTiendas = useCallback((id?: number) => {
        dispacher(setSpiner(true));
        httpGet<ITienda[]>(`${urlBase}tienda/mistiendas/${id}`, { headers: { Authorization: sesion.sesion.token } })
            .then((result) => {
                if (result.data.length > 0) {
                    setTiendas(result.data)
                } else {
                    store.addNotification(warning({ titulo: "Sin Empleados", mensaje: " aun no tiene empleados", duracion: 2000 }))
                }
                dispacher(setSpiner(false))
            })
            .catch((error: Error) => {
                dispacher(setSpiner(false))
                store.addNotification(danger({ titulo: "Sin tiendas", mensaje: "No se pudieron listar los empleados", duracion: 2000 }))
            })
    }, [dispacher, sesion, urlBase])


    useEffect(() => {
        getListaTiendas(sesion.sesion.id)

    }, [getListaTiendas, sesion])

    const guardarEmpleado = () => {
        dispacher(setSpiner(true));
        httpPost<IEmpleado, IEmpleados>(`${urlBase}empleados/registra`, empleado, { headers: { Authorization: sesion.sesion.token } })
            .then((resul) => {
                if (resul.data.id) {
                    store.addNotification(success({ titulo: "Empleado Creado", mensaje: `Se a creado el empleado: ${resul.data.nombre}`, duracion: 2000 }))
                    history.push("/home")
                } else {
                    store.addNotification(warning({ titulo: "Empleado", mensaje: `No se creo el empleado`, duracion: 2000 }))
                }
            })
            .catch((error) => {
                dispacher(setSpiner(false))
                store.addNotification(danger({ titulo: "Upss!", mensaje: "No se puedo realizar el registro, intentelo nuevamente", duracion: 2000 }));
            })
    }
    return (
        <NewHome>
            <div className="box-center">
                <div className="label-center label-100 label-registro">
                    <label className="label-100 label-color1 fnt-18 label-center ">Registrar Empleado</label>
                </div>
                <div className="box-register">
                    <TextField label="Nombre" id="filled-size-normal" size="small" name="nombre" variant="outlined" onChange={handlerData} />
                    <TextField label="E-mail" id="filled-size-normal" size="small" name="email" variant="outlined" onChange={handlerData} />
                    <TextField
                        id="outlined-select-currency"
                        select
                        label="Tipo de empleado"
                        onChange={handlerRol}
                        variant="outlined"
                        name="tipo"
                    >
                        <MenuItem value={1}>
                            Vendedor
                        </MenuItem>
                        <MenuItem value={2}>
                            Caja
                        </MenuItem>
                        <MenuItem value={3}>
                            Administrador
                        </MenuItem>
                        <MenuItem value={4}>
                            General
                        </MenuItem>

                    </TextField>
                    <TextField
                        id="outlined-select-currency"
                        select
                        label="Tienda a la que pertenece"
                        onChange={handlerSelectTienda}
                        variant="outlined"
                        name="tienda"
                    >
                        {tiendas && tiendas?.map((item) => (
                            <MenuItem value={item.id}>
                                {item.nombre}
                            </MenuItem>
                        ))}


                    </TextField>
                    <TextField label="Sueldo" type="number" id="filled-size-normal" size="small" name="sueldo" variant="outlined" onChange={handlerData} />
                </div>
                <Boton color="bgc3" styleBoton="box-boton" label="Registrar" functionBoton={guardarEmpleado} />
            </div>
        </NewHome>
    )
}

export default CrearEmpleados;