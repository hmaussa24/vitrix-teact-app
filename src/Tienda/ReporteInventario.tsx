
import { useAppDispachs, useAppSelector } from '../Redux/hooks/hooks';
import { setSpiner } from "../Redux/slices/Spiner.slice";
import { useCallback, useEffect, useState, ChangeEvent } from 'react';
import { httpGet } from '../Services/Http';
import { store } from "react-notifications-component";
import { danger, warning } from "../Utils/Notificaciones";
import NewTienda from '../Component/NewTienda'
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const StyledTableCell = withStyles((theme: Theme) =>
    createStyles({
        head: {
            backgroundColor: "#b9b9b9",
            color: theme.palette.common.white,
        },
        body: {
            fontSize: 14,
        },
    }),
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
    createStyles({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.action.hover,
            },
        },
    }),

)(TableRow);
const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});
const ReporteInventario = () => {
    const urlBase = process.env.REACT_APP_URL_BASE
    const classes = useStyles();
    const dispacher = useAppDispachs();
    const tienda = useAppSelector((state) => state.tienda);
    const sesion = useAppSelector((state) => state.login);
    const [productos, setProductos] = useState<any[]>();
    const consultarProductos = useCallback(() => {
        dispacher(setSpiner(true))
        httpGet<any[]>(`${urlBase}producto/listarinventario/${tienda.id}`, { headers: { Authorization: sesion.sesion.token } })
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
    }, [dispacher, tienda, sesion])

    // const redirecToProduc = (id: number) => {
    //     dispacher(setProducto(id));
    //     h.push("/verproducto")
    // }

    const consultarProductosByNombre = (event: ChangeEvent<any>) => {
        //dispacher(setSpiner(true))
        httpGet<any[]>(`${urlBase}producto/listarinventario/${tienda.id}/${event.target.value}`, { headers: { Authorization: sesion.sesion.token } })
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
    }

    const calcularCostoTotal=()=> {
        let total = 0;
        productos?.forEach(element => {
            total = total + element.inventario.producto.costo * element.inventario.stock
        });
        return total
    }
    const calcularGananciaTotal=()=> {
        let total = 0;
        productos?.forEach(element => {
            total = total + (element.inventario.producto.precio - element.inventario.producto.costo) *   element.inventario.stock
        });
        return total
    }
    useEffect(() => {
        consultarProductos()
    }, [consultarProductos])



    return (
        <NewTienda busqueda funcionBusqueda={consultarProductosByNombre} >
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Codigo</StyledTableCell>
                            <StyledTableCell>Nombre del producto</StyledTableCell>
                            <StyledTableCell align="right">Existencia</StyledTableCell>
                            <StyledTableCell align="right">C.unidad ($)</StyledTableCell>
                            <StyledTableCell align="right">Valor Inventaro</StyledTableCell>
                            <StyledTableCell align="right">P. Venta ($)</StyledTableCell>
                            <StyledTableCell align="right">Ganancia potencial</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productos?.map((row) => (
                            <StyledTableRow key={row.id}>
                                <StyledTableCell component="th" scope="row">
                                    {row.inventario.producto.codigo}
                                </StyledTableCell>
                                <StyledTableCell align="right">{row.inventario.producto.nombre}</StyledTableCell>
                                <StyledTableCell align="right">{row.inventario.stock}</StyledTableCell>
                                <StyledTableCell align="right">${Intl.NumberFormat().format(row.inventario.producto.costo)}</StyledTableCell>
                                <StyledTableCell align="right">${Intl.NumberFormat().format(Number(row.inventario.producto.costo * row.inventario.stock))}</StyledTableCell>
                                <StyledTableCell align="right">${Intl.NumberFormat().format(row.inventario.producto.precio)}</StyledTableCell>
                                <StyledTableCell align="right">${Intl.NumberFormat().format((row.inventario.producto.precio - row.inventario.producto.costo) * row.inventario.stock)}</StyledTableCell> 
                                {/* <StyledTableCell align="right">{row.}</StyledTableCell>*/}
                            </StyledTableRow>
                        ))}
                        <StyledTableRow>
                            <StyledTableCell colSpan={6} align={"right"}>
                                Total Costo de inventario
                            </StyledTableCell>
                            <StyledTableCell>
                                ${Intl.NumberFormat().format(calcularCostoTotal())}
                            </StyledTableCell>
                        </StyledTableRow>
                        <StyledTableRow>
                            <StyledTableCell colSpan={6} align={"right"}>
                                Total Ganancia Potencial
                            </StyledTableCell>
                            <StyledTableCell>
                                ${Intl.NumberFormat().format(calcularGananciaTotal())}
                            </StyledTableCell>
                        </StyledTableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            
        </NewTienda>
    )
}

export default ReporteInventario;