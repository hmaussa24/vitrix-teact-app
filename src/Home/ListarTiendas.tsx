import { useCallback, useEffect, useState, ChangeEvent } from 'react';
import { store } from 'react-notifications-component';
import { useHistory } from 'react-router-dom';
import { useAppDispachs, useAppSelector } from '../Redux/hooks/hooks';
import { setSpiner } from '../Redux/slices/Spiner.slice';
import { setTienda } from '../Redux/slices/Tienda.slice';
import { httpGet, httpPost } from '../Services/Http';
import { warning, danger, success } from '../Utils/Notificaciones';
import { storage } from '../Utils/UploadFireBase';
import HomeNew from '../Component/HomeNew'
import { Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography, Button, Box } from '@material-ui/core';


interface ITienda {
    id: number;
    nombre: string;
    image: string;
    email: string;
    direccion: string;
    tipo: number;
    telefono: string;
    ciudad: {
        id: number;
        nombre: string;
    }
}
const ListarTiendas = () => {

    const urlBase = process.env.REACT_APP_URL_BASE
    const dispacher = useAppDispachs()
    const sesion = useAppSelector((state) => state.login)
    const [tiendas, setTiendas] = useState<ITienda[]>()
    const h = useHistory();
    const getListaTiendas = useCallback(() => {
        dispacher(setSpiner(true));
        if (sesion.sesion.id) {
            httpGet<ITienda[]>(`${urlBase}tienda/mistiendas/${sesion.sesion.id}`, { headers: { Authorization: sesion.sesion.token } })
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
        }
    }, [dispacher, sesion, urlBase])


    useEffect(() => {
        getListaTiendas()

    }, [getListaTiendas, sesion.sesion.id])


    const redirectTienda = (nombre: string, id: number) => {
        dispacher(setTienda({ nombre: nombre, id: id }))
        h.push("/productos")
    }
    const handlerChange = (event: ChangeEvent<any>, store: ITienda) => {
        ///obtener archivo
        const file = event.target.files[0];

        ///crear referencia
        const ref = storage.ref("Tiendas/" + file.name);

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
                    guardarTienda({ ...store, image: downloadURL })
                    console.log('File available at', downloadURL);
                    dispacher(setSpiner(false))
                    getListaTiendas()
                });
            }
        )

    }

    const guardarTienda = (tienda: ITienda) => {
        dispacher(setSpiner(true))
        httpPost<ITienda, ITienda>(`${urlBase}tienda/registrar`, tienda, { headers: { Authorization: `${sesion.sesion.token}` } })
            .then((result) => {
                if (result.data.id) {
                    store.addNotification(success({ titulo: "Imagen subida", mensaje: `Se actualizado la imagen`, duracion: 2000 }))
                }
                dispacher(setSpiner(false))
            })
            .catch((error) => {
                dispacher(setSpiner(false))
                store.addNotification(danger({ titulo: "Upss!", mensaje: "No se puedo realizar el registro, intentelo nuevamente", duracion: 2000 }));
            })
    }

    return (
        <HomeNew>
            <Grid container justifyContent="center">
                <div className="fnt-family fnt-18 label-color1 label-registro label-bold margin-left">Tus Tiendas</div>
            </Grid>
            <Box m={2}>
                <Grid container spacing={3} justifyContent="center">
                    {tiendas?.map((Element) => (
                        <Grid item>

                            <Card style={{ width: 300 }}  >
                                <CardActionArea>
                                    <CardMedia
                                        style={{ height: 140 }}
                                        image={Element.image}
                                        title="Contemplative Reptile"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {Element.nombre}
                                        </Typography>
                                        <Typography variant="body1" color="textSecondary" component="p">
                                            Telefono: {Element.telefono}
                                        </Typography>
                                        <Typography variant="body1" color="textSecondary" component="p">
                                            Direccion: {Element.direccion}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                           Tipo de tienda: {Element.tipo=== 1 ? "Fisica"  : "On-Line" }
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions>
                                    <Button size="small" color="primary" variant="contained" component="label" >
                                        <input
                                            type="file"
                                            hidden
                                            onChange={(e) => { handlerChange(e, Element) }}
                                        />
                                        Cambiar imagen
                                    </Button>
                                    <Button size="small" color="primary" onClick={() => redirectTienda(Element.nombre, Element.id)}>
                                        Ingresar 
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                        // <div className="tienda" >
                        //     <label className="fnt-18 label-color5 fnt-family cursor-pointer" onClick={() => redirectTienda(Element.nombre, Element.id)}>{Element.nombre}</label>
                        //     <div className="box-img">
                        //         {
                        //             Element.image ? (
                        //                 <div>
                        //                     <img className="circle-big bgc1 mt-10 " src={Element.image} alt={"img-" + Element.nombre} />
                        //                 </div>
                        //             ) : (<div className="circle-big bgc1 mt-10 "></div>)
                        //         }
                        //     </div>

                        //     <input type="file" className="custom-file-input" onChange={(e) => { handlerChange(e, Element) }} />
                        // </div>
                    ))}

                    {/* <div className="tienda">
                    <label className="fnt-18 label-color5 fnt-family ">Tienda Albey</label>
                    <div className="circle-big bgc1 mt-10"></div>
                </div> */}
                </Grid>
            </Box>
        </HomeNew >
    )
}

export default ListarTiendas;