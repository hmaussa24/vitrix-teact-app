
import { useAppSelector, useAppDispachs } from '../Redux/hooks/hooks';
import { ChangeEvent, useEffect, useState } from 'react';
import { IEmpleados } from "../Utils/Models/Empleados";
import { ITienda } from "../Redux/slices/Model/Tienda.model";
import { httpGet, httpPost } from '../Services/Http';
import { store } from "react-notifications-component";
import { danger, warning, success } from '../Utils/Notificaciones';
import { setSpiner } from "../Redux/slices/Spiner.slice";
import ReactModal from "react-modal";
import Boton from "../Component/Boton";
import NewTienda from '../Component/NewTienda'
import { useCallback } from 'react';
import { Avatar, Box, Divider, Fab, Grid, List, ListItem, ListItemAvatar, ListItemText, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import AddIcon from '@material-ui/icons/Add';
import moment from 'moment';
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
    numcuotas: number;
    estado: number;
}


interface IPago {
    id?: number;
    fecha?: string;
    valor?: number;
    credito?: {
        id?: number;
    }
}

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    }
}));
const InfoCredito = () => {
    const urlBase = process.env.REACT_APP_URL_BASE
    const classes = useStyles();
    const dispacher = useAppDispachs();
    const credito = useAppSelector((state) => state.credito);
    const sesion = useAppSelector((state) => state.login);
    const [creditoData, setCredito] = useState<ICredito>()
    const [pagos, setPagos] = useState<IPago[]>([])
    const [pago, setPago] = useState<IPago>({ credito: { id: Number(credito.id) } })
    const [abonos, setAbonos] = useState<number>(0)
    const [restante, setRestante] = useState<number>(0)
    const [openModal, setOpenModal] = useState<boolean>(false)


    const abonado = useCallback((pagos: any[]) => {
        let abonos = 0;
        pagos?.forEach(element => {
            abonos = abonos + Number(element.valor);
            //alert(pago.valor)
        });
        return abonos
    }, [])
    const consultarPagos = useCallback(() => {
        httpGet<IPago[]>(`${urlBase}pagos/${credito.id}`, { headers: { Authorization: sesion.sesion.token } })
            .then(result => {
                if (result.data.length > 0) {
                    //                setCredito(result.data);
                    setPagos(result.data)
                    setAbonos(abonado(result.data))
                } else {
                    store.addNotification(warning({ titulo: "Sin resultados", mensaje: `no se encontraron pagos para esta cuenta`, duracion: 2000 }))
                }
                dispacher(setSpiner(false))

            })
            .catch(error => {
                dispacher(setSpiner(false))
                store.addNotification(danger({ titulo: "Upss!", mensaje: "Error inesperado intentelo mas tarde", duracion: 2000 }))
            })
    }, [dispacher, sesion.sesion.token, credito.id, abonado, urlBase])

    const consutarCredito = useCallback(() => {
        httpGet<ICredito>(`${urlBase}creditos/credito/${credito.id}`, { headers: { Authorization: sesion.sesion.token } })
            .then(result => {
                if (result.data.id) {
                    setCredito(result.data);
                } else {
                    store.addNotification(warning({ titulo: "Sin resultados", mensaje: `no se encontraron resultados para el credito`, duracion: 2000 }))
                }
                dispacher(setSpiner(false))

            })
            .catch(error => {
                dispacher(setSpiner(false))
                store.addNotification(danger({ titulo: "Upss!", mensaje: "Error inesperado intentelo mas tarde", duracion: 2000 }))
            })
    }, [dispacher, sesion.sesion.token, credito.id, urlBase])

    useEffect(() => {
        consutarCredito()
        consultarPagos()

    }, [consultarPagos, consutarCredito])






    useEffect(() => {
        if (creditoData)
            setRestante(creditoData?.venta.total - abonado(pagos))
    }, [creditoData, pagos, abonado])


    const pagar = () => {
        dispacher(setSpiner(true))
        httpPost<IPago, IPago>("http://localhost:8080/api/pagos/registrar", pago, { headers: { Authorization: sesion.sesion.token } })
            .then(result => {
                if (result.data.id) {
                    consultarPagos()
                    consutarCredito()
                    store.addNotification(success({ titulo: "Pago realizado", mensaje: "El abono fue completado", duracion: 2000 }))
                    setOpenModal(false)
                    setPago({ credito: { id: Number(credito.id) } })

                } else {
                    store.addNotification(danger({ titulo: "Pago no realizado", mensaje: "No se completo el pago", duracion: 2000 }))
                }

                dispacher(setSpiner(false))
            })
            .catch(error => {
                store.addNotification(danger({ titulo: "Pago no realizado", mensaje: "No se completo el pago", duracion: 2000 }))
                dispacher(setSpiner(false))

            })
    }

    const fecha = () => {
        const fecha = moment().format("DD-MM-YYYY hh:mm:ss")
        return fecha;
    }
    const handlerValor = (event: ChangeEvent<any>) => {
        //   console.log(event.target.value)
        setPago({ ...pago, valor: event.target.value, fecha: fecha() })
    }


    const period = (value?: number) => {
        switch (value) {
            case 1:
                return "Semanal"
            case 2:
                return "Quincenal"
            case 3:
                return "Mensual"
            case 4:
                return "Trimestral"
            default:
                return "Mensual"

        }
    }


    return (
        <NewTienda>
            <div className="mt-20 pagos-grid">
                {/* <label className="fnt-18 label-cente  margin-left label-bold label-color5 mt-20">Cliente</label> */}

                <Grid justifyContent="center" container>
                    <Grid item xs={8} alignItems="center" >
                        <List className={classes.root}>
                            <ListItem alignItems="flex-start" >
                                <ListItemAvatar>
                                    <Avatar style={{ backgroundColor: "#8084f1" }} alt="Remy Sharp">{creditoData?.venta.cliente.nombre.charAt(0)}</Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={creditoData?.venta.cliente.nombre}
                                    secondary={
                                        <Grid container >
                                            <Grid>


                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    className={classes.inline}
                                                    color="textPrimary"
                                                >
                                                    Cedula: {creditoData?.venta.cliente.cedula}
                                                </Typography>

                                            </Grid>
                                            <Grid>
                                                <Box ml={3}>
                                                    Celular: {creditoData?.venta.cliente.telefono}
                                                </Box>

                                            </Grid>
                                            <Box ml={3}>

                                                <Grid>
                                                    Diureccion: {creditoData?.venta.cliente.direccion}
                                                </Grid>
                                            </Box>

                                        </Grid>
                                    }
                                />
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>
                {/* <div className="empleado">
                    <label className="empleado-lable">{creditoData?.venta.cliente.cedula}</label>
                    <label className="empleado-lable">{creditoData?.venta.cliente.nombre}</label>
                    <label className="empleado-lable">{creditoData?.venta.cliente.telefono}</label>
                    <label className="empleado-lable">{creditoData?.venta.cliente.direccion}</label>
                    <label className="empleado-lable">${Intl.NumberFormat().format(Number(creditoData?.venta.total))}</label>
                
                </div> */}
                {/* <label className="fnt-18 label-cente margin-left label-bold label-color5 mt-20">Credito</label> */}

                <Grid justifyContent="center" container>
                    <Grid item xs={8} alignItems="center" >
                        <List className={classes.root}>
                            <ListItem alignItems="flex-start" >
                                <ListItemText
                                    primary={`Total: ${Intl.NumberFormat().format(Number(creditoData?.venta.total))}`}
                                    secondary={
                                        <Grid container >
                                            <Grid>


                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    className={classes.inline}
                                                    color="textPrimary"
                                                >
                                                    Interes: {creditoData?.interes}%
                                                </Typography>

                                            </Grid>
                                            <Grid>

                                                <Box ml={2}>

                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        className={classes.inline}
                                                        color="textPrimary"
                                                    >
                                                        Numero de cuotas: {creditoData?.numcuotas}
                                                    </Typography>
                                                </Box>

                                            </Grid>
                                            <Grid>

                                                <Box ml={2}>

                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        className={classes.inline}
                                                        color="textPrimary"
                                                    >
                                                        Periodo: {period(creditoData?.periodo)}
                                                    </Typography>
                                                </Box>

                                            </Grid>
                                            <Grid>

                                                <Box ml={2}>

                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        className={classes.inline}
                                                        color="textPrimary"
                                                    >
                                                        Estado: {creditoData?.estado === 1 ? "Activo" : "Pagado"}
                                                    </Typography>
                                                </Box>

                                            </Grid>
                                        </Grid>
                                    }
                                />
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>
                {/* <div className="empleado">
                    <label className="empleado-lable">Cuota: ${Intl.NumberFormat().format(Number(creditoData?.cuota))}</label>
                    <label className="empleado-lable">Interes: {creditoData?.interes}%</label>
                    <label className="empleado-lable">Numero de cuotas: {creditoData?.numcuotas}</label>
                    <label className="empleado-lable">Periodo: {period(creditoData?.periodo)}</label>
                    <label className="empleado-lable">
                        Estado: {creditoData?.estado === 1 ? "Activo" : "Pagado"}
                    </label>
                    <label className="icon-view" onClick={() => { }}><BsFillEyeFill /></label>

                </div>
                <div className="mt-20">
                    <label className="fnt-18 label-cente  margin-left label-bold label-color5 mt-20">Pagos</label>
                    <label className="icon-view" onClick={() => { setOpenModal(true) }}><BsPlusCircle /></label>
                </div> */}
                <Grid justifyContent="center" container>
                    <Grid item xs={8} alignItems="center" >
                        <List className={classes.root}>
                            {
                                pagos?.map(pago => (
                                    <>
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <MonetizationOnIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={`Pago: ${Intl.NumberFormat().format(pago?.valor || 0)}`} secondary={`fecha Abono: ${pago.fecha}`} />
                                        </ListItem>
                                        <Divider />
                                    </>
                                    // <div className="empleado">
                                    //     <label className="empleado-lable">Pago: ${Intl.NumberFormat().format(pago?.valor || 0)}</label>
                                    //     <label className="empleado-lable">fecha Abono: {pago.fecha}</label>
                                    //     {/* <label className="icon-view" onClick={() => redirectCredito(elemen.id || 0)}><BsFillEyeFill /></label> */}

                                    // </div>
                                ))
                            }
                        </List>
                    </Grid>
                </Grid>
                <Grid justifyContent="center" container>
                    <Grid item xs={8} alignItems="center">
                        <label className="fnt-18 label-cente  margin-left label-bold label-color5 mt-20">Resumen</label>
                    </Grid>
                </Grid>
                <Grid justifyContent="center" container>
                    <Grid item xs={8} alignItems="center" >
                        <List className={classes.root}>

                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <MonetizationOnIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={`Restante: ${Intl.NumberFormat().format(restante)}`} secondary={`Pagado: ${Intl.NumberFormat().format(abonos)}`} />
                            </ListItem>

                        </List>
                    </Grid>
                </Grid>
                {/* <label className="fnt-18 label-cente  margin-left label-bold label-color5 mt-20">Resumen</label>
                <div className="empleado">
                    <label className="empleado-lable">Total abonado: ${Intl.NumberFormat().format(abonos)}</label>
                    <label className="empleado-lable">Restante: ${Intl.NumberFormat().format(restante)}</label>
                    <label className="icon-view" onClick={() => redirectCredito(elemen.id || 0)}><BsFillEyeFill /></label>

                </div> */}
                <ReactModal
                    onRequestClose={() => { setOpenModal(false) }}
                    isOpen={openModal}
                >

                    <div className="box-center">
                        <div className="label-center label-100 label-registro">
                            <label className="label-100 label-color1 fnt-18 label-center ">Abonar Cuota</label>
                        </div>
                        <div className="box-register">
                            <TextField variant="outlined" type="number" placeholder="Cuota" onChange={handlerValor} />
                        </div>
                        <div className="botons-ventas">
                            <Boton label="Abonar" functionBoton={() => { pagar() }} styleBoton="box-boton" color="bgc3" />
                            <Boton label="Cerrar" functionBoton={() => { setOpenModal(false) }} styleBoton="box-boton" color="bgc7" />
                        </div>
                    </div>
                </ReactModal>
            </div>
            <Fab onClick={() => { setOpenModal(true) }} size="small" color="secondary" aria-label="add" className={classes.fab}>
                <AddIcon />
            </Fab>
        </NewTienda>
    )
}

export default InfoCredito