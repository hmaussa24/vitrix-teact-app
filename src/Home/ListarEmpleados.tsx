import { useCallback, useEffect, useState, ChangeEvent } from 'react';
import Boton from '../Component/Boton';
import { useAppDispachs, useAppSelector } from '../Redux/hooks/hooks';
import { ITienda } from '../Utils/Models/Tiendas';
import { httpGet } from '../Services/Http';
import { setSpiner } from '../Redux/slices/Spiner.slice';
import { store } from 'react-notifications-component';
import { danger, warning } from '../Utils/Notificaciones';
import { Roles } from '../Utils/Roles';
import { useHistory } from 'react-router-dom';
import { BsFillTrashFill } from "react-icons/bs";
import NewHome from '../Component/HomeNew'
import { Box, Grid, MenuItem, TextField } from '@material-ui/core';

interface IEmpleado {
    id: number;
    nombre: string;
    rol: number
    sueldo: number;
    tienda: ITienda
}


const ListarEmpleados = () => {
    const urlBase = process.env.REACT_APP_URL_BASE
    const dispacher = useAppDispachs()
    const sesion = useAppSelector((state) => state.login)
    const [tiendas, setTiendas] = useState<ITienda[]>()
    const [empleados, setEmpleados] = useState<IEmpleado[]>([])
    let h = useHistory();
    const getListaTiendas = useCallback((id?: number) => {
        dispacher(setSpiner(true));
        httpGet<ITienda[]>(`${urlBase}tienda/mistiendas/${id}`, { headers: { Authorization: sesion.sesion.token } })
            .then((result) => {
                if (result.data.length > 0) {
                    setTiendas(result.data)
                } else {
                    store.addNotification(warning({ titulo: "Sin tiendas", mensaje: " aun no tiene tiendas inscritas", duracion: 2000 }))
                }
                dispacher(setSpiner(false))
            })
            .catch((error: Error) => {
                dispacher(setSpiner(false))
                store.addNotification(danger({ titulo: "Sin tiendas", mensaje: "No se pudieron listar las tiendas", duracion: 2000 }))
            })
    }, [dispacher, sesion, urlBase])

    useEffect(() => {
        getListaTiendas(sesion.sesion.id)

    }, [getListaTiendas, sesion])

    const RediretLink = (link: string) => {
        h.push(link)
    }
    const handlerSelectStore = (event: ChangeEvent<any>) => {
        if (event.target.value !== "0") {
            dispacher(setSpiner(true));
            httpGet<IEmpleado[]>(`${urlBase}empleados/empleados-tienda/${event.target.value}`, { headers: { Authorization: sesion.sesion.token } })
                .then((result) => {
                    if (result.data.length > 0) {
                        setEmpleados(result.data)
                    } else {
                        setEmpleados([])
                        store.addNotification(warning({ titulo: "Sin Empleados", mensaje: " aun no tiene empleados en la tienda", duracion: 2000 }))
                    }
                    dispacher(setSpiner(false))
                })
                .catch((error) => {
                    dispacher(setSpiner(false))
                    store.addNotification(danger({ titulo: "Ups!", mensaje: "Algo salio mal, intentalo de nuevo", duracion: 2000 }))
                    dispacher(setSpiner(false))
                })
        }

    }

    const employeds = () => {
        if (empleados.length > 0) {
            return empleados?.map((elemen) => (
                <div className="empleado">
                    <label className="empleado-lable">{elemen.nombre}</label>
                    <label className="empleado-lable">{elemen.tienda.nombre}</label>
                    <label className="empleado-lable">{Roles(elemen.rol)}</label>
                    <label className="empleado-lable">${Intl.NumberFormat().format(elemen.sueldo)} COP</label>
                    <label className="icon-delete"><BsFillTrashFill /></label>
                </div>
            ))
        } else {
            return (
                <div className="empleado">
                    <label className="empleado-lable">Sin empleados</label>
                </div>
            )
        }

    }

    return (
        <NewHome>
            <Boton color="bgc3" styleBoton="box-boton-m20" label="Registrar empleado" functionBoton={() => { RediretLink("/registraempleado") }} />

            <div>
                <Box clone>
                    <Grid item xl={12}>
                        <Grid container>
                            <Grid item xl={12}>
                                <TextField
                                    helperText="Selecciona una tienda para ver los empleados"
                                    id="outlined-select-currency"
                                    select
                                    label="Tienda a la que pertenece"
                                    onChange={handlerSelectStore}
                                    variant="outlined"
                                    name="tienda"
                                >
                                    {tiendas && tiendas?.map((item) => (
                                        <MenuItem value={item.id}>
                                            {item.nombre}
                                        </MenuItem>
                                    ))}


                                </TextField>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
                {employeds()}
            </div>
            {/* 
            <div className="empleado">
                <label className="empleado-lable">Harold Maussa Rivas</label>
                <label className="empleado-lable">Teinda tales</label>
                <label className="empleado-lable">Vendedor</label>
                <label className="empleado-lable">$500.000</label>
            </div> */}

        </NewHome>
    )
}

export default ListarEmpleados