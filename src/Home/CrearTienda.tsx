import { useState, ChangeEvent } from 'react';
import { store } from 'react-notifications-component';
import Boton from "../Component/Boton";
import { useAppDispachs, useAppSelector } from '../Redux/hooks/hooks'
import { setSpiner } from '../Redux/slices/Spiner.slice';
import { httpPost } from '../Services/Http';
import { danger, success } from '../Utils/Notificaciones';
import { useHistory } from 'react-router-dom';
import NewHome from '../Component/HomeNew'
import { MenuItem, TextField } from '@material-ui/core';

interface ITienda {
    id?: number;
    nombre?: string;
    image?: string;
    email?: string;
    direccion?: string;
    tipo?: number;
    telefono?: string;
    ciudad_id?: number;
    ciudad?: {
        id?: number;
    }
    usuario?: {
        id?: number;
    }
}
const CrearTienda = () => {
    const urlBase = process.env.REACT_APP_URL_BASE
    const dispacher = useAppDispachs();
    const sesion = useAppSelector(state => state.login);
    const [tienda, setTienda] = useState<ITienda>({ usuario: { id: sesion.sesion.id } });
    let history = useHistory()

    const handlerData = (event: ChangeEvent<any>) => {
        setTienda({
            ...tienda,
            [event.target.name]: event.target.value
        })
    }

    const handlerSelectCiudad = (event: ChangeEvent<any>) => {

        setTienda({ ...tienda, ciudad: { id: event.target.value } })
    }

    const guardarTienda = () => {
        dispacher(setSpiner(true))
        httpPost<ITienda, ITienda>(`${urlBase}tienda/registrar`, tienda, { headers: { Authorization: `${sesion.sesion.token}` } })
            .then((result) => {
                if (result.data.id) {
                    store.addNotification(success({ titulo: "Tienda creada", mensaje: `Se a creado la tienda: ${result.data.nombre}`, duracion: 2000 }))
                    history.push("/home")
                }
                dispacher(setSpiner(false))
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
                    <label className="label-100 label-color1 fnt-18 label-center ">Crear Tienda</label>
                </div>
                <div className="box-register">
                    <TextField label="Nombre" id="filled-size-normal" size="small" name="nombre" variant="outlined" onChange={handlerData} />
                    <TextField label="E-mail" id="filled-size-normal" size="small" name="email" variant="outlined" onChange={handlerData} />
                    <TextField label="Celular" id="filled-size-normal" size="small" name="telefono" variant="outlined" onChange={handlerData} />
                    <TextField label="Direccion" id="filled-size-normal" size="small" name="direccion" variant="outlined" onChange={handlerData} />
                    <TextField
                        id="outlined-select-currency"
                        select
                        label="Ciudad"
                        onChange={handlerSelectCiudad}
                        helperText="Selecciona la ciudad de tu tienda"
                        variant="outlined"
                        name="ciudad"
                        size="small"
                    >
                            <MenuItem value={1}>
                                Monteria
                            </MenuItem>

                    </TextField>
                    <TextField
                        id="outlined-select-currency"
                        select
                        label="Tipo de negocio"
                        onChange={handlerData}
                        helperText="Selecciona el tipo de negocio"
                        variant="outlined"
                        name="tipo"
                        size="small"
                    >
                            <MenuItem value={1}>
                                Fisica
                            </MenuItem>
                            <MenuItem value={2}>
                                On-Line
                            </MenuItem>

                    </TextField>
                    <TextField label="Descripcion corta" id="filled-size-normal" rows={2} name="descripcion" variant="outlined" multiline onChange={handlerData} />
                </div>
                <Boton color="bgc3" styleBoton="box-boton" label="Crear" functionBoton={guardarTienda} />
            </div>
        </NewHome>
    )
}

export default CrearTienda;