
import 'date-fns';
import { useAppSelector } from '../Redux/hooks/hooks';
import NewTienda from '../Component/NewTienda'
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { useState } from 'react';
import { Box, Collapse, TableCell, TableRow, Typography, Table, TableBody, TableHead, TableContainer, Paper, Grid } from '@material-ui/core';
import { useEffect, useCallback } from 'react';
import { httpGet } from '../Services/Http';
import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { Line } from 'react-chartjs-2'
const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

interface IReporte {
    mes: string;
    total: number;
}
const ReporteVentas = () => {
    const urlBase = process.env.REACT_APP_URL_BASE
    const sesion = useAppSelector((state) => state.login);
    const tienda = useAppSelector((state) => state.tienda)


    const [openCalendad, setOpenCalendar] = useState(false);
    const [ventas, setVentas] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>();
    const [reporteMensual, setReoporte] = useState<IReporte[]>([]);
    const [meses, setMeses] = useState<string[]>([]);
    const [total, setTotal] = useState<number[]>([]);
    const [totalCredito, setTotalCredito] = useState<number[]>([]);

    const consultarVentasDiarias = useCallback((fecha: Date | null) => {
        setOpenCalendar(false)
        setSelectedDate(fecha)
        //const date = `${fecha?.getFullYear()}-${fecha?.getMonth()}-${fecha?.getDay()}`
        //console.log(date, fecha, moment(fecha).format("YYYY-MM-DD"))
        httpGet<any[]>(`${urlBase}ventas/informediario/${tienda.id}/${moment(fecha).format("YYYY-MM-DD")}`, { headers: { Authorization: sesion.sesion.token } })
            .then(result => {
                setVentas(result.data)
            })
            .catch(error => {

            })
    }, [sesion.sesion.token, tienda.id, urlBase])

    const consultarVentasMensual = useCallback(() => {

        httpGet<IReporte[]>(`${urlBase}inventario/reportemensual/${tienda.id}/${moment().format("YYYY")}`, { headers: { Authorization: sesion.sesion.token } })
            .then(result => {
                // setVentas(result.data)
                if (result.data.length > 0)
                    setReoporte(result.data)
                const meses = result.data.map(item => item.mes)
                const totales = result.data.map(item => item.total)
                setMeses(meses)
                setTotal(totales)
            })
            .catch(error => {

            })
    }, [sesion.sesion.token, tienda.id, urlBase])

    const consultarVentasMensualCredito = useCallback(() => {

        httpGet<IReporte[]>(`${urlBase}inventario/reportemensualcredito/${tienda.id}/${moment().format("YYYY")}`, { headers: { Authorization: sesion.sesion.token } })
            .then(result => {
                // setVentas(result.data)
                if (result.data.length > 0)
                    setReoporte(result.data)
                const meses = result.data.map(item => item.mes)
                const totales = result.data.map(item => item.total)
                //setMeses(meses)
                setTotalCredito(totales)
            })
            .catch(error => {

            })
    }, [sesion.sesion.token, tienda.id, urlBase])


    useEffect(() => {

        consultarVentasDiarias(new Date(moment().format("YYYY-MM-DD hh:mm:ss")))
        consultarVentasMensual()
        consultarVentasMensualCredito()
    }, [consultarVentasDiarias])


    const calcularTotalDia = () => {
        let total = 0;
        ventas.forEach(element => {
            total = total + element.venta.total
        });

        return total
    }

    const calcularTotalGanancias = () => {
        let total = 0;
        ventas.forEach(element => {
            let subt = 0
            element.detalles.forEach((item: any) => {
                subt = subt + Number(item.producto.costo)
            });
            total = Number(total) + subt
        });
        //  console.log(calcularTotalDia(), total ,calcularTotalDia() - total)

        return calcularTotalDia() - total
    }





    const Row = (props: { row: ReturnType<any> }) => {
        const { row } = props;
        const [open, setOpen] = React.useState(false);
        const classes = useRowStyles();
        return (
            <React.Fragment>
                <TableRow className={classes.root}>
                    <TableCell>
                        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {row.venta.cliente.nombre}
                    </TableCell>
                    <TableCell align="right">{moment(row.venta.fecha).format("YYYY-MM-DD hh:mm:ss")}</TableCell>
                    <TableCell align="right">{row.venta.numComprovante ?? 0}</TableCell>
                    <TableCell align="right">{row.venta.tipo === 1 ? "Contado" : "credito"}</TableCell>
                    <TableCell align="right">${Intl.NumberFormat().format(row.venta.total)}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box margin={1}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Prodcutos
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Nombre</TableCell>
                                            <TableCell>Cantidad</TableCell>
                                            <TableCell align="right">P. unitario</TableCell>
                                            <TableCell align="right">Sub. Total</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.detalles.map((producto: any, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell component="th" scope="row">
                                                    {producto.producto.nombre}
                                                </TableCell>
                                                <TableCell>{producto.cantidad}</TableCell>
                                                <TableCell align="right">{producto.producto.precio}</TableCell>
                                                <TableCell align="right">${Intl.NumberFormat().format(producto.precio * producto.cantidad)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment>
        )
    }

    const data = {
        labels: meses,
        datasets: [
            {
                label: 'Ventas Totales por mes',
                data: total,
                fill: false,
                backgroundColor: '#8084f1',
                borderColor: '#8084f1',
            },
            {
                label: 'Cretidos totales',
                data: totalCredito,
                fill: false,
                backgroundColor: '#d62c7b',
                borderColor: '#d62c7b',
            },
        ],
    };

    // const options = {
    //     scales: {
    //         yAxes: [
    //             {
    //                 ticks: {
    //                     beginAtZero: true,
    //                 },
    //             },
    //         ],
    //     },
    // };
    return (
        <NewTienda>
            <Grid xs={3}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        margin="normal"
                        id="date-picker-dialog"
                        label="Seleccione el dia"
                        format="yyyy-MM-dd"
                        value={selectedDate}
                        variant="inline"
                        open={openCalendad}
                        onClick={() => { setOpenCalendar(true) }}
                        onChange={consultarVentasDiarias}
                        maxDate={new Date()}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                </MuiPickersUtilsProvider>
            </Grid>
            <Grid container >
                <Grid xs={2}>
                    Total del dia: ${Intl.NumberFormat().format(calcularTotalDia())}
                </Grid>
                <Grid xs={2}>
                    Ganancias del dia: ${Intl.NumberFormat().format(calcularTotalGanancias())}
                </Grid>
            </Grid>

            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Cliente</TableCell>
                            <TableCell align="right">Fecha</TableCell>
                            <TableCell align="right">Comprobante</TableCell>
                            <TableCell align="right">Tipo</TableCell>
                            <TableCell align="right">Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ventas.map((row, index) => (
                            <Row key={row.venta.id} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box m={3} mt={5}>


                <Box mb={5}>
                    <Grid justifyContent="center" container>
                        Informe mensual de ventas
                    </Grid>
                </Box>
                <Grid container justifyContent="center">
                    <Grid item xs={6}>
                        <Line data={data} options={
                            {

                            }
                        } />

                    </Grid>
                </Grid>
            </Box>


        </NewTienda>
    )
}

export default ReporteVentas;