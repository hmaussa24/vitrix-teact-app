
import { useAppDispachs, useAppSelector } from '../Redux/hooks/hooks';
import React, { ChangeEvent, useState, useEffect, useRef, } from 'react';
import { IProducto } from '../Utils/Models/producto';
import Boton from '../Component/Boton';
import { httpGet, httpPost } from '../Services/Http';
import { setSpiner } from '../Redux/slices/Spiner.slice';
import { store } from 'react-notifications-component';
import { danger, success, warning } from '../Utils/Notificaciones';
import NewVentas from '../Component/NewVentas'
import CloseIcon from '@material-ui/icons/Close';
import { MenuItem, TextField, Grid, List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Dialog, AppBar, Toolbar, IconButton, Slide, TableContainer, Paper, TableHead, TableRow, TableCell, TableBody, ListItemSecondaryAction, Box, LinearProgress } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions/transition';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Table } from 'react-bootstrap';
import { useCallback } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import moment from 'moment';
import ReactToPrint from 'react-to-print';

interface ICliente {
    nombre?: string;
    email?: string;
    direccion?: string;
    telefono?: string;
    cedula?: string;
    id?: number;

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
    tipo?: number;
    empleado: {
        id: number;
    };
    tienda: {
        id: number
    }

}

interface ICredito {
    valorcuotas: number;
    numcuotas: number;
    cuotaInicial: number;
    interes: number;
    cuota: number;
    periodo: number;
    tienda?: {
        id?: number;
    }
}

interface IVentaDetalle {
    cantidad: number;
    precio: number;
    descuento?: number;
    producto: IProducto;
}

interface ventaRquest {
    venta: IVentas;
    detalle: IVentaDetalle[];
    credito: ICredito;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBar: {
            position: 'relative',
        },
        title: {
            marginLeft: theme.spacing(2),
            flex: 1,
        },
    }),
);

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ModuloVentas = () => {
    const classes = useStyles();
    const sesion = useAppSelector(state => state.login);
    const tienda = useAppSelector((state) => state.tienda);
    const dispacher = useAppDispachs();
    const [productos, setProductos] = useState<IProducto[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [codigo, setCodigo] = useState<string>("");
    const [modalIsOpen, setIsOpen] = useState<boolean>(false);
    const [cliente, setCliente] = useState<ICliente>({});
    const [isCliente, setIsCliente] = useState<boolean>(false);
    const [detalle, setDetalle] = useState<IVentaDetalle[]>([]);
    const [isCredito, setIscredito] = useState<boolean>(false);
    const [verFactura, setVerFactura] = useState<boolean>(false);
    const [credito, setCredito] = useState<ICredito>({ tienda: { id: tienda.id }, numcuotas: 0, cuotaInicial: 0, interes: 0, cuota: 0, periodo: 0, valorcuotas: 0 });
    const [valorcuota, setValorCuota] = useState<number>(0);
    const [venta, setVenta] = useState<IVentas>();
    const urlBase = process.env.REACT_APP_URL_BASE

    function openModal() {
        detalleVenta()
        setIsOpen(true);
    }

    function closeModal() {
        setCliente({
            cedula: "",
            id: 0,
            nombre: "",
            telefono: "",
            email: "",
            direccion: ""

        })
        setDetalle([])
        setIsOpen(false);
        setIscredito(false)
        setVerFactura(false)
        setProductos([])
    }

    const cantidadPRoducto = (id: number) => {
        let conteo: number = 0;
        productos.forEach(element => {
            if (id === element.id) {
                conteo++
            }

            return conteo;
        });

        return conteo;
    }



    const filtrarProducto = () => {
        let productosTemp: IProducto[] = []
        productos.forEach(producto => {
            if (!productosTemp.find(item => item.id === producto.id)) {
                productosTemp.push(producto)
            }
        });

        return productosTemp;
    }

    const detalleVenta = () => {
        const productosTemp = filtrarProducto();
        let prodVentasDetalles: IVentaDetalle[] = [];
        productosTemp.forEach(producto => {
            let detalleVenta: IVentaDetalle = {
                cantidad: cantidadPRoducto(producto.id),
                precio: producto.precio,
                producto: producto,
                descuento: 0,
            }
            prodVentasDetalles.push(detalleVenta)
        })
        setDetalle(prodVentasDetalles);
    }
    const handlerProducto = (event: ChangeEvent<any>) => {
        setCodigo(event.target.value)
        // dispacher(setSpiner(true))
        httpGet<IProducto>(`${urlBase}producto/buscarbycodigo/${tienda.id}/${event.target.value}`, { headers: { Authorization: `${sesion.sesion.token}` } })
            .then((result) => {
                if (result.data.id) {
                    const tempProd = result.data;
                    setProductos([...productos, tempProd]);
                    setCodigo("");
                }
            })
            .catch(error => {
            })

    }

    useEffect(() => {
        let totalTemp = 0;
        productos.forEach(element => {
            totalTemp = totalTemp + element.precio;
        });
        setTotal(totalTemp)
    }, [productos])


    const cargarCliente = (event: ChangeEvent<any>) => {
        httpGet<ICliente>(`${urlBase}clientes/${event.target.value}`, { headers: { Authorization: `${sesion.sesion.token}` } })
            .then((result) => {
                if (result.data.id) {
                    setCliente(result.data)
                    if (result.data.nombre) {

                        setIsCliente(true)
                    } else {
                        setIsCliente(false)
                    }
                } else {
                    setIsCliente(false)
                    handlerData(event);
                }
            })
            .catch(error => {
            })
    }

    const handlerData = (event: ChangeEvent<any>) => {
        setCliente({
            ...cliente,
            [event.target.name]: event.target.value
        })
    }
    const handlerDataCredito = (event: ChangeEvent<any>) => {
        setCredito({
            ...credito,
            [event.target.name]: event.target.value
        })


    }

    const registrarCliente = () => {
        dispacher(setSpiner(true));
        httpPost<ICliente, ICliente>(`${urlBase}clientes/registrar`, cliente, { headers: { Authorization: `${sesion.sesion.token}` } })
            .then((result) => {
                if (result.data.id) {
                    setCliente(result.data)
                    setIsCliente(true);
                } else {
                    store.addNotification(warning({ titulo: "No se registro", mensaje: "No se registro el cliente", duracion: 2000 }))
                }
                dispacher(setSpiner(false))
            })
            .catch(error => {
                dispacher(setSpiner(false))
                store.addNotification(danger({ titulo: "Upss!", mensaje: "No se puedo realizar el registro, intentelo nuevamente", duracion: 2000 }));
            })
    }


    const ventaContado = () => {
        if (productos.length > 0) {
            dispacher(setSpiner(true))
            if (cliente.id) {
                const venta: IVentas = {
                    cliente: cliente,
                    empleado: {
                        id: 1
                    },
                    estado: 1,
                    fecha: new Date(moment().format("YYYY-MM-DD: hh:mm:ss")),
                    total: total,
                    impuesto: 0,
                    tipo: isCredito ? 2 : 1,
                    tienda: {
                        id: tienda.id
                    }
                }
                const ventaRes: ventaRquest = {
                    detalle: detalle,
                    venta: venta,
                    credito: credito,
                }
                httpPost<ventaRquest, IVentas>(`${urlBase}ventas/registrar`, ventaRes, { headers: { Authorization: `${sesion.sesion.token}` } })
                    .then((result) => {
                        if (result.data.id) {
                            setVenta(result.data)
                            store.addNotification(success({ titulo: "Venta Exitosa", mensaje: "Venta registrada", duracion: 3000 }))
                            if (sesion.sesion.rol) {
                                setVerFactura(true)

                            } else {
                                setVerFactura(true)
                            }

                        } else {
                            store.addNotification(warning({ titulo: "Venta no registrada", mensaje: "La venta no se registro", duracion: 3000 }))
                        }
                        dispacher(setSpiner(false))

                    })
                    .catch(error => {
                        dispacher(setSpiner(false))
                        store.addNotification(danger({ titulo: "Upss!", mensaje: "algo salio mal intentalo nuevamente", duracion: 3000 }))
                    })

            } else {
                dispacher(setSpiner(false))
                store.addNotification(warning({ titulo: "Sin cliente", mensaje: "No hay cliente seleccionado", duracion: 2000 }))
            }
            console.log(detalle);
        } else {
            store.addNotification(warning({ titulo: "Sin producto", mensaje: "No hay productos para vender", duracion: 3000 }))
        }
    }

    const isCreditoModel = () => {
        setIscredito(true);
        openModal()
    }

    const calcularCuotas = useCallback(() => {
        if (credito.numcuotas > 0) {
            setValorCuota(((total - credito.cuota) / credito.numcuotas) + (((total - credito.cuota) / credito.numcuotas) * credito.interes) / 100);
        }
        else
            setValorCuota(0)
    }, [credito.cuota, credito.interes, credito.numcuotas, total])

    useEffect(() => {
        calcularCuotas()
    }, [calcularCuotas, credito.numcuotas, credito.cuotaInicial])


    const eliminarProductoLista = (index: number) => {
        let prod = productos.filter(function (item) {
            return item.id !== index;
        });

        setProductos(prod)
    }

    const componentRef = useRef<HTMLDivElement>(null);
    return (
        <>
            <NewVentas funcionBusqueda={handlerProducto} value={codigo} busqueda>
                {/* <LinearProgress color="secondary" /> */}
                <Grid container justifyContent="center" spacing={2}>
                    <Grid item xs={9}>
                        <List>
                            {
                                productos.reverse().map((producto, index) => (
                                    <>
                                        <ListItem key={producto.id} style={{ cursor: 'pointer', backgroundColor: "#fff" }}>
                                            <ListItemAvatar>
                                                <Avatar src={producto.image} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={producto.nombre}
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                            color="textPrimary"
                                                        >
                                                            $ {Intl.NumberFormat().format(producto.precio) + " "}
                                                        </Typography>
                                                        {producto.descripcion}
                                                    </React.Fragment>
                                                }
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton onClick={() => { eliminarProductoLista(producto.id) }} edge="end" aria-label="delete">
                                                    <DeleteIcon style={{ color: "#d62c7b" }} />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    </>
                                ))
                            }
                        </List>
                    </Grid>
                    <Grid item xs={3}>
                        <Grid container spacing={2} >
                            <Grid item xs={12}>
                                <label className="fnt-18 label-color1 label-100">Esta Venta</label>
                            </Grid>
                            <Grid item xs={12}>
                                <label className="label-total">Total: ${Intl.NumberFormat().format(total)}</label>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Boton color="bgc3" label="Contado" functionBoton={openModal} styleBoton="" />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Boton color="bgc7" label="Credito" functionBoton={isCreditoModel} styleBoton="" />
                                    </Grid>
                                </Grid>
                            </Grid>

                        </Grid>

                    </Grid>

                </Grid>
                <Dialog fullScreen open={modalIsOpen} onClose={closeModal} TransitionComponent={Transition}>
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={() => { setIsOpen(false) }} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" className={classes.title}>
                                Venta Actual
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    {verFactura ? (
                        <div>

                            <div style={{ width: 400, margin: "auto" }} ref={componentRef}>
                                <Box m={3} >
                                    <Grid container justifyContent="space-between" >
                                        <Grid item xs={12}>{tienda.nombre}</Grid>
                                        <Grid item xs={7}>
                                            <Grid item xs={12}>Fehca: .........................................</Grid>
                                            <Grid item xs={12}>Cliente: .........................................</Grid>
                                            <Grid item xs={12}>Cedula: .........................................</Grid>

                                        </Grid>
                                        <Grid item xs={5}>
                                            <Grid xs={12} item>
                                                {moment().format("YYYY-MM-DD")}
                                            </Grid>
                                            <Grid item xs={12}>{cliente.nombre}</Grid>
                                            <Grid item xs={12}>{cliente.cedula}</Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>Tiket de compra</Grid>
                                </Box>
                                <TableContainer component={Paper} >
                                    <Table style={{ width: '100%' }}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center" colSpan={3}>
                                                    Productos de esta venta
                                                </TableCell>
                                                <TableCell align="right">Priecio</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Desc</TableCell>
                                                <TableCell align="right">Cantidad</TableCell>
                                                <TableCell align="right">Precio unidad</TableCell>
                                                <TableCell align="right">S. total</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {detalle.map((row, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{row.producto.nombre}</TableCell>
                                                    <TableCell align="right">{row.cantidad}</TableCell>
                                                    <TableCell align="right">${Intl.NumberFormat().format(row.producto.precio)}</TableCell>
                                                    <TableCell align="right">${Intl.NumberFormat().format(row.precio * row.cantidad)}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow>
                                                <TableCell rowSpan={3} />
                                                <TableCell colSpan={2}>Total a pagar</TableCell>
                                                <TableCell align="right">${Intl.NumberFormat().format(total)}</TableCell>
                                            </TableRow>
                                        </TableBody>

                                    </Table>

                                </TableContainer>
                            </div>
                            <Box mt={3}>
                                <Grid container justifyContent="center">
                                    <Grid xs={2}>
                                        <ReactToPrint
                                            trigger={() => <button className="btn">imprimir</button>}
                                            content={() => componentRef.current}
                                        />

                                    </Grid>
                                </Grid>

                            </Box>
                        </div>
                    ) : (
                        <Grid container justifyContent="space-between">
                            <Grid item xs={12}>
                                <Grid container justifyContent="space-between">
                                    <Grid item xs={isCredito ? 6 : 8}>
                                        <div className="box-register">
                                            <TableContainer component={Paper} >
                                                <Table style={{ width: '100%' }}>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell align="center" colSpan={3}>
                                                                Productos de esta venta
                                                            </TableCell>
                                                            <TableCell align="right">Priecio</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Desc</TableCell>
                                                            <TableCell align="right">Cantidad</TableCell>
                                                            <TableCell align="right">Precio unidad</TableCell>
                                                            <TableCell align="right">S. total</TableCell>
                                                            <TableCell align="right">S. total</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {detalle.map((row, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>{row.producto.nombre}</TableCell>
                                                                <TableCell align="right">{row.cantidad}</TableCell>
                                                                <TableCell align="right">${Intl.NumberFormat().format(row.producto.precio)}</TableCell>
                                                                <TableCell align="right">${Intl.NumberFormat().format(row.precio * row.cantidad)}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                        <TableRow>
                                                            <TableCell rowSpan={3} />
                                                            <TableCell colSpan={2}>Total a pagar</TableCell>
                                                            <TableCell align="right">${Intl.NumberFormat().format(total)}</TableCell>
                                                        </TableRow>
                                                    </TableBody>

                                                </Table>

                                            </TableContainer>
                                        </div>
                                    </Grid>
                                    <Grid item xs={isCredito ? 3 : 4}>
                                        <div className="box-register">
                                            <label className="label-100 label-color1 fnt-18 label-center ">Cliente</label>
                                            <TextField label="Cedula" id="filled-size-normal" size="small" name="cedula" variant="outlined" onChange={cargarCliente} />
                                            <TextField id="filled-size-normal" size="small" name="nombre" variant="outlined" onChange={handlerData} disabled={isCliente} value={cliente.nombre} />
                                            <TextField id="filled-size-normal" size="small" name="email" variant="outlined" onChange={handlerData} disabled={isCliente} value={cliente.email} />
                                            <TextField id="filled-size-normal" size="small" name="direccion" variant="outlined" onChange={handlerData} disabled={isCliente} value={cliente.direccion} />
                                            <TextField id="filled-size-normal" size="small" name="telefono" variant="outlined" onChange={handlerData} disabled={isCliente} value={cliente.telefono} />
                                        </div>
                                    </Grid>
                                    {isCredito ?
                                        <Grid item xs={3}>
                                            <div className="box-register">
                                                <label className="label-100 label-color1 fnt-18 label-center ">Credito</label>
                                                <TextField label="Numero de cuotas" id="filled-size-normal" size="small" name="numcuotas" variant="outlined" disabled={!isCliente} onChange={handlerDataCredito} />
                                                <TextField label="Intereses %" id="filled-size-normal" size="small" name="interes" variant="outlined" disabled={!isCliente} onChange={handlerDataCredito} />
                                                <TextField label="Valor cuota inicial" id="filled-size-normal" size="small" name="cuota" variant="outlined" disabled={!isCliente} onChange={handlerDataCredito} />
                                                <TextField
                                                    id="outlined-select-currency"
                                                    select
                                                    label="Periodo cuotas"
                                                    onChange={handlerDataCredito}
                                                    variant="outlined"
                                                    name="periodo"
                                                    disabled={!isCliente}
                                                    size="small"
                                                >
                                                    <MenuItem value={1}>
                                                        Semanal
                                                    </MenuItem>
                                                    <MenuItem value={2}>
                                                        Quincenal
                                                    </MenuItem>
                                                    <MenuItem value={3}>
                                                        Mensual
                                                    </MenuItem>
                                                    <MenuItem value={4}>
                                                        Trimestral
                                                    </MenuItem>

                                                </TextField>
                                                <TextField label="Valor cuotas" id="filled-size-normal" size="small" name="valorcuotas" disabled value={Math.round(valorcuota)} variant="outlined" onChange={handlerDataCredito} />
                                            </div>
                                        </Grid>

                                        : null
                                    }
                                </Grid>
                            </Grid>
                            <Grid xs={12}>
                                <Grid container justifyContent="space-evenly">
                                    <Grid item >
                                        <Boton color="bgc3" label="Vender" functionBoton={ventaContado} styleBoton="box-boton" />
                                    </Grid>
                                    <Grid item >
                                        <Boton color="bgc7" label="Registrar" functionBoton={registrarCliente} styleBoton="box-boton" disabled={isCliente} />
                                    </Grid>
                                    <Grid item >
                                        <Boton color="bgc7" label="Cancelar Venta" functionBoton={closeModal} styleBoton="box-boton" />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}


                </Dialog>

            </NewVentas>
        </>
    )
}

export default ModuloVentas;