
import { useAppDispachs, useAppSelector } from '../Redux/hooks/hooks';
import { setSpiner } from "../Redux/slices/Spiner.slice";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { httpGet } from '../Services/Http';
import { store } from "react-notifications-component";
import { danger, warning } from "../Utils/Notificaciones";
import { IProducto } from '../Utils/Models/producto';
import { useHistory } from 'react-router-dom';
import { setProducto } from "../Redux/slices/Producto.slice";
import NewTienda from '../Component/NewTienda'
import { Avatar, Divider, Grid, List, ListItemAvatar, ListItemText, Typography } from "@material-ui/core";
import ListItem from '@material-ui/core/ListItem';
const Productos = () => {
    const urlBase = process.env.REACT_APP_URL_BASE
    const dispacher = useAppDispachs();
    const tienda = useAppSelector((state) => state.tienda);
    const sesion = useAppSelector((state) => state.login);
    const [productos, setProductos] = useState<IProducto[]>();
    const h = useHistory()
    const consultarProductos = useCallback(() => {
        dispacher(setSpiner(true))
        httpGet<any[]>(`${urlBase}producto/listar/${tienda.id}`, { headers: { Authorization: sesion.sesion.token } })
            .then((result) => {
                if (result.data.length > 0) {
                    setProductos(result.data);
                } else {
                    setProductos([])
                    store.addNotification(warning({ titulo: "Sin Productos", mensaje: " aun no tiene productos en la tienda", duracion: 2000 }))
                }
                dispacher(setSpiner(false))
            })
            .catch((error) => {
                dispacher(setSpiner(false))
                store.addNotification(danger({ titulo: "Ups!", mensaje: "Algo salio mal, intentalo de nuevo", duracion: 2000 }))
            })
    }, [dispacher, tienda, sesion, urlBase])

    const redirecToProduc = (id: number) => {
        dispacher(setProducto(id));
        h.push("/verproducto")
    }
    const consultarProductosPorNombre = useCallback((event: ChangeEvent<any>) => {
       // dispacher(setSpiner(true))
        if (event.target.value) {
            httpGet<any[]>(`${urlBase}producto/buscarbynombre/${tienda.id}/${event.target.value}`, { headers: { Authorization: sesion.sesion.token } })
                .then((result) => {
                    if (result.data.length > 0) {
                        setProductos(result.data);
                    } else {
                        setProductos([])
                        //store.addNotification(warning({ titulo: "Sin Productos", mensaje: " aun no tiene productos en la tienda", duracion: 2000 }))
                    }
                    dispacher(setSpiner(false))
                })
                .catch((error) => {
                    dispacher(setSpiner(false))
                    //store.addNotification(danger({ titulo: "Ups!", mensaje: "Algo salio mal, intentalo de nuevo", duracion: 2000 }))
                })
        }else{
            consultarProductos()
        }

    }, [dispacher, tienda, sesion, consultarProductos, urlBase])
    useEffect(() => {
        consultarProductos()
    }, [consultarProductos])
    return (
        <NewTienda funcionBusqueda={consultarProductosPorNombre} busqueda={true}>
            <Grid container alignContent="center" spacing={0} alignItems="center" justifyContent="center" justify="center">
                <Grid item xs={8} alignItems="center" >
                    <List>
                        {productos?.map(prod => (
                            <>
                                <ListItem onClick={() => { redirecToProduc(prod.id) }} style={{ cursor: 'pointer', backgroundColor: "#fff" }}>
                                    <ListItemAvatar>
                                        <Avatar alt={prod.nombre} src={prod.image} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={prod.nombre}
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    // className={classes.inline}
                                                    color="textPrimary"
                                                >
                                                    $ {prod.precio + " "}
                                                </Typography>
                                                {prod.descripcion}
                                            </React.Fragment>
                                        }
                                    />
                                    

                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </>
                        ))}
                    </List>
                </Grid>
            </Grid>

        </NewTienda>
    )
}

export default Productos;