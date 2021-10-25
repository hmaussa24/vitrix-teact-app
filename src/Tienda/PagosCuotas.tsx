
import { useAppSelector, useAppDispachs } from '../Redux/hooks/hooks';
import { useState, ChangeEvent } from 'react';
import { httpGet } from "../Services/Http";
import { IEmpleados } from '../Utils/Models/Empleados';
import { ITienda } from '../Utils/Models/Tiendas';

import { setCredito } from "../Redux/slices/Credito.slice";
import { useHistory } from 'react-router-dom';
import NewTienda from '../Component/NewTienda'
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { Box, Grid, IconButton, ListItemSecondaryAction } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
}));
interface ICliente {
    nombre: string;
    email: string;
    direccion: string;
    telefono: string;
    cedula: string;
    id: number;

}


interface IVentas {
    id?: number;
    total: number;
    estado: number;
    fecha: Date;
    impuesto?: number;
    serieComprovante?: string;
    numComprovante?: string;
    cliente: ICliente;
    empleado: IEmpleados

}

interface ICredito {
    id?: number;
    numeroCuotas?: number;
    cuotaInicial?: number;
    interes?: number;
    cuota?: number;
    periodo?: number;
    tienda: ITienda;
    venta: IVentas;
}


const PagosCuotas = () => {
    const urlBase = process.env.REACT_APP_URL_BASE
    const classes = useStyles();
    const dispache = useAppDispachs();
    const sesion = useAppSelector((state) => state.login);
    const h = useHistory();
    const [creditos, setCreditos] = useState<ICredito[]>([])

    const consultarCredito = (event: ChangeEvent<any>) => {
        httpGet<ICredito[]>(`${urlBase}creditos/cedula/${event.target.value}`, { headers: { Authorization: sesion.sesion.token } })
            .then(result => {
                if (result.data.length > 0) {

                    setCreditos(result.data);
                } else {
                    //  store.addNotification(warning({ titulo: "Sin resultados", mensaje: `no se encontraron resultados para la cedula: ${cedula}`, duracion: 2000 }))
                }
                //dispache(setSpiner(false))

            })
            .catch(error => {
                //dispache(setSpiner(false))
                //store.addNotification(danger({ titulo: "Upss!", mensaje: "Error inesperado intentelo mas tarde", duracion: 2000 }))
            })
        // } else {
        //     store.addNotification(warning({ titulo: "Digite cedula", mensaje: "Porfavor ingrese una cedula", duracion: 1000 }))
        // }

    }
    const redirectCredito = (credito: number) => {
        dispache(setCredito(credito))
        h.push("pagos/credito")
    }

    const creditosView = () => {
        if (creditos.length > 0) {
            return creditos.map((elemen) => (
                <>
                    <ListItem alignItems="flex-start" >
                        <ListItemAvatar>
                            <Avatar style={{ backgroundColor: "#8084f1" }} alt="Remy Sharp">{elemen.venta.cliente.nombre.charAt(0)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={elemen.venta.cliente.nombre}
                            secondary={
                                <Grid container >
                                    <Grid>

                                        <Box ml={3}>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                className={classes.inline}
                                                color="textPrimary"
                                            >
                                                Cedula: {elemen.venta.cliente.cedula}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid>
                                        <Box ml={3}>
                                            Celular: {elemen.venta.cliente.telefono}
                                        </Box>

                                    </Grid>
                                    <Box ml={3}>

                                        <Grid>
                                            Diureccion: {elemen.venta.cliente.direccion}
                                        </Grid>
                                    </Box>
                                    <Box ml={3}>

                                        <Grid>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                className={classes.inline}
                                                color="textPrimary"
                                            >
                                                Total credito: {elemen.venta.total}
                                            </Typography>

                                        </Grid>
                                    </Box>
                                </Grid>
                            }
                        />
                        <ListItemSecondaryAction>
                            <IconButton onClick={() => redirectCredito(elemen.id || 0)} edge="end" aria-label="delete">
                                <VisibilityIcon style={{ color: "#8084f1" }} />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                </>
                //     <label className="empleado-lable">{elemen.venta.cliente.cedula}</label>
                //     <label className="empleado-lable">{elemen.venta.cliente.nombre}</label>
                //     <label className="empleado-lable">{elemen.venta.cliente.telefono}</label>
                //     <label className="empleado-lable">{elemen.venta.cliente.direccion}</label>
                //     <label className="empleado-lable">{elemen.venta.total}</label>
                //     <label className="icon-view" onClick={() => redirectCredito(elemen.id || 0)}><BsFillEyeFill /></label>
                // </div>
            ))
        } else {
            return (
                <div className="empleado">
                    <label className="empleado-lable">No hay creditos</label>
                </div>
            )
        }

    }
    return (
        <NewTienda funcionBusqueda={consultarCredito} busqueda >
            <div className="fnt-family fnt-18 label-color1 label-registro label-bold margin-left"></div>
            {/* <div className="buscador example ">
            <input type="text" placeholder="Buscar credito" name="search" className="buscador" />
            <button type="submit" className="fa-search"><BsSearch className="icon-buscar" /></button>
        </div> */}
            <h1>Todos los creditos</h1>
            {/* <div className="empleado">
                <label className="empleado-lable label-bold ">Cedula</label>
                <label className="empleado-lable label-bold ">Nombre</label>
                <label className="empleado-lable label-bold ">Telefono</label>
                <label className="empleado-lable label-bold ">Direccion</label>
                <label className="empleado-lable label-bold "> Total</label>
                <label className="icon-delete"></label>
            </div> */}
            <Grid justifyContent="center" container>
                <Grid item xs={8} alignItems="center" >
                    <List className={classes.root}>
                        {creditosView()}
                    </List>
                </Grid>
            </Grid>
        </NewTienda>
    )
}

export default PagosCuotas