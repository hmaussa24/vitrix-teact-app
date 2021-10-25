import { useAppSelector, useAppDispachs } from '../Redux/hooks/hooks';

import { useEffect, useState, ChangeEvent } from 'react';
import { setSpiner } from "../Redux/slices/Spiner.slice";
import { httpGet, httpPost } from '../Services/Http';
import { store } from "react-notifications-component";
import { danger, warning, success } from '../Utils/Notificaciones';
import { IProducto } from '../Utils/Models/producto';
import { IInventario } from '../Utils/Models/Inventario';
import { storage } from '../Utils/UploadFireBase';
import NewTienda from '../Component/NewTienda'
import { Divider, Grid, IconButton, InputBase, Paper, TextField } from '@material-ui/core';
import UpdateIcon from '@material-ui/icons/Update';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {useCallback} from 'react';
interface IImagen {
    id?: number;
    imagen: string;
    producto: {
        id: number
    }
}
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: 200,
        },
        input: {
            marginLeft: theme.spacing(1),
            flex: 1,
            width: 120
        },
        iconButton: {
            padding: 10,
        },
        divider: {
            height: 28,
            margin: 4,
        },
        img:{
            height: 250,
            objectFit: "cover",
        }
    }),
);
const VerProducto = () => {
    const urlBase = process.env.REACT_APP_URL_BASE
    const classes = useStyles();
    const Url=process.env.REACT_APP_VISOR_DE_PRODUCTO
    const producto = useAppSelector((state) => state.producto);
    const sesion = useAppSelector((state) => state.login);
    const dispacher = useAppDispachs()
    const [prod, setProd] = useState<IProducto>();
    const [inventario, setInventario] = useState<IInventario>({});
    const [stock, setStock] = useState<number>();
    const [images, setImages] = useState<IImagen[]>([]);
    const [portada, setPortada] = useState<string>();

    const getImages = useCallback(() => {
        httpGet<IImagen[]>(`${urlBase}images/imagenesproducto/${producto.id}`, { headers: { Authorization: sesion.sesion.token } })
            .then((result) => {
                if (result.data.length > 0) {
                    setImages(result.data)
                    //setStock(result.data.stock)
                    setPortada(result.data[0].imagen)
                }
                else {
                    //setStock(0)
                    //store.addNotification(warning({ titulo: "No hay producto", mensaje: "No se encontro el producto", duracion: 2000 }))
                }
                dispacher(setSpiner(false))
            })
            .catch((error) => {
                dispacher(setSpiner(false))
                store.addNotification(danger({ titulo: "Ups!", mensaje: "Algo salio mal, intentalo de nuevo", duracion: 2000 }))
            })
    },[dispacher, producto.id, sesion.sesion.token])

    useEffect(() => {
        dispacher(setSpiner(true))
        httpGet<IProducto>(`${urlBase}producto/buscrabyid/${producto.id}`, { headers: { Authorization: sesion.sesion.token } })
            .then((result) => {
                if (result.data.id) {
                    setProd(result.data)
                }
                else {

                    store.addNotification(warning({ titulo: "No hay producto", mensaje: "No se encontro el producto", duracion: 2000 }))
                }
                dispacher(setSpiner(false))
            })
            .catch((error) => {
                dispacher(setSpiner(false))
                store.addNotification(danger({ titulo: "Ups!", mensaje: "Algo salio mal, intentalo de nuevo", duracion: 2000 }))
            })

        httpGet<IInventario>(`${urlBase}inventario/${producto.id}`, { headers: { Authorization: sesion.sesion.token } })
            .then((result) => {
                if (result.data.id) {
                    setInventario(result.data)
                    setStock(result.data.stock)
                }
                else {
                    setStock(0)
                    //store.addNotification(warning({ titulo: "No hay producto", mensaje: "No se encontro el producto", duracion: 2000 }))
                }
                dispacher(setSpiner(false))
            })
            .catch((error) => {
                dispacher(setSpiner(false))
                store.addNotification(danger({ titulo: "Ups!", mensaje: "Algo salio mal, intentalo de nuevo", duracion: 2000 }))
            })

        getImages()

    }, [dispacher, producto.id, sesion, getImages])



    const changeInvetario = (event: ChangeEvent<any>) => {
        setStock(Number(event.target.value))
        setInventario({...inventario, stock: event.target.value})
        //alert(event.target.value)
    }
    // useEffect(() => {
    //     setInventario({ ...inventario, stock: stock });
    // }, [])


    const actualizarInventario = () => {
        dispacher(setSpiner(true));
        if (inventario.id) {
            httpPost<IInventario, IInventario>(`${urlBase}inventario/guardar`, inventario, { headers: { Authorization: sesion.sesion.token } })
                .then((result) => {
                    if (result.data.id) {
                        store.addNotification(success({ titulo: "Actualizado", mensaje: "Inventario actualizado", duracion: 2000 }))
                        setInventario(result.data)
                    } else {
                        store.addNotification(warning({ titulo: "Algo salio mal", mensaje: "no se actualizo el inventario", duracion: 2000 }))
                    }
                    dispacher(setSpiner(false))
                })
                .catch(error => {
                    dispacher(setSpiner(false))
                    store.addNotification(danger({ titulo: "Upss¡", mensaje: "_No se realizo el registro, intntelo nuevamente", duracion: 2000 }))
                })
        } else {
            let inven: IInventario = {
                producto: prod,
                stock: stock,
            }
            httpPost<IInventario, IInventario>(`${urlBase}inventario/guardar`, inven, { headers: { Authorization: sesion.sesion.token } })
                .then((result) => {
                    if (result.data.id) {
                        store.addNotification(success({ titulo: "Actualizado", mensaje: "Inventario actualizado", duracion: 2000 }))
                        setInventario(result.data)
                    } else {
                        store.addNotification(warning({ titulo: "Algo salio mal", mensaje: "no se actualizo el inventario", duracion: 2000 }))
                    }
                    dispacher(setSpiner(false))
                })
                .catch(error => {
                    dispacher(setSpiner(false))
                    store.addNotification(danger({ titulo: "Upss¡", mensaje: "_No se realizo el registro, intntelo nuevamente", duracion: 2000 }))
                })
        }

    }

    const subirImagen = (event: ChangeEvent<any>) => {
        ///obtener archivo
        const file = event.target.files[0];

        ///crear referencia
        const ref = storage.ref("Tiendas/" + new Date().getTime() + "-" + file.name);

        ///subir

        const upload = ref.put(file);

        //supervisar

        upload.on("state_changed", (snapshot: any) => {
            dispacher(setSpiner(true))
            console.warn((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        },
            (error: any) => {
                dispacher(setSpiner(false))
                console.error(error);
            },
            () => {
                upload.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    //guardarTienda({ ...store, image: downloadURL })
                    console.log('File available at', downloadURL);
                    dispacher(setSpiner(false))
                    //getListaTiendas()
                    guardarImagen(downloadURL)
                });
            }
        )

    }


    const guardarImagen = (img: string) => {
        dispacher(setSpiner(true))
        httpPost<IImagen, IImagen>("http://localhost:8080/api/images/registrar", { imagen: img, producto: { id: producto.id } }, { headers: { Authorization: `${sesion.sesion.token}` } })
            .then(result => {
                if (result.data.id) {
                    getImages()
                    store.addNotification(success({ titulo: "Imagen guardada", mensaje: "Seguardo la imagen", duracion: 2000 }))
                } else {
                    getImages()
                    store.addNotification(warning({ titulo: "No se guardo", mensaje: "no se puedo guardar la imagen", duracion: 2000 }))
                }

                dispacher(setSpiner(false))
            })
            .catch(error => {
                dispacher(setSpiner(false))
                store.addNotification(danger({ titulo: "Upss!", mensaje: "Error inesperado intetelo nuevamente", duracion: 2000 }))
            })
    }

    const copyLink = (id: number) => {
        navigator.clipboard.writeText(`${Url}${id}`)
        store.addNotification(success({titulo: "¡¡Copiado!!", mensaje: "Se copio el link de producto", duracion: 2000}))
    }

    return (
        <NewTienda>
            <Grid container justifyContent="center" >
                <Grid container  justifyContent="center">
                    <Grid item xs={5}>
                        <Grid container>
                            <Grid item xs={12} className={classes.img}>
                                <img className="img-portada" src={portada ?? "https://via.placeholder.com/500x300"} alt="producto-1" />

                            </Grid>
                            <Grid item xs={12}>
                                {
                                    images.map(img => (<img width={80} src={img.imagen ?? "https://via.placeholder.com/80"} alt={img.imagen} onClick={() => { setPortada(img.imagen) }} />))
                                }

                            </Grid>

                        </Grid>
                    </Grid>
                    <Grid item xs={3}>
                        <Grid container justifyContent="space-around" spacing={2}>

                            <Grid item xs={12} className="fnt-family fnt-18 label-bold mt-10">
                                {prod?.nombre}
                            </Grid>
                            <Grid item xs={12} className="mt-10 fnt-15 fnt-family">
                                precio: {prod?.precio}
                            </Grid>
                            <Grid item xs={12} className="mt-10 fnt-15 fnt-family">
                                costo: {prod?.costo}
                            </Grid>
                            <Grid item xs={12} className="mt-10 fnt-15">
                                <Paper component="form" className={classes.root}>
                                    <InputBase
                                        className={classes.input}
                                        placeholder="Stock del producto"
                                        inputProps={{ 'aria-label': 'search google maps' }}
                                        onChange={changeInvetario}
                                        value={stock}
                                    />
                                    <Divider className={classes.divider} orientation="vertical" />
                                    <IconButton color="primary" className={classes.iconButton} aria-label="directions" onClick={actualizarInventario}>
                                        <UpdateIcon />
                                    </IconButton>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} className="mt-10 fnt-15">
                                <input type="file" className="custom-file-input-pro" name="img-producto" onChange={subirImagen} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField size="small" disabled variant="outlined" value={`${Url}${prod?.id}`} onClick={() => {copyLink(prod?.id || 0)}} />
                            </Grid>

                        </Grid>
                    </Grid>

                </Grid>
                <Grid container justifyContent="center">
                    <Grid item xs={9}>
                        <div className=" margin-left mt-10 mt-20 label-color5 ">
                            <div className="label-color5 fnt-family fnt-18 label-bold mt-10">Descripcion</div>
                            <div>{prod?.descripcion}</div>
                        </div>

                    </Grid>

                </Grid>
            </Grid>

        </NewTienda>
    )
}

export default VerProducto;