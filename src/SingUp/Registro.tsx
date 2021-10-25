import { ChangeEvent, useState } from "react";
import Boton from "../Component/Boton";
import NavBarLogin from "../Component/NavBarLogin";
import { httpPost } from '../Services/Http';
import { setSpiner } from '../Redux/slices/Spiner.slice'
import { useAppDispachs } from '../Redux/hooks/hooks'
import { useHistory } from "react-router-dom";
import { store } from 'react-notifications-component';
import { danger } from "../Utils/Notificaciones";
import { TextField, Grid, Box } from '@material-ui/core';
interface IRegistro {
    id?: number;
    nombre?: string;
    celular?: string
    email?: string;
    password?: string
}
const Registro = () => {
    const urlBase = process.env.REACT_APP_URL_BASE
    const dispacher = useAppDispachs();
    let history = useHistory();
    const [registro, setRegistro] = useState<IRegistro>({});

    const handlerData = (event: ChangeEvent<HTMLInputElement>) => {
        setRegistro({
            ...registro,
            [event.target.name]: event.target.value
        })
    }
    const registraUsuario = () => {
        dispacher(setSpiner(true))
        httpPost<IRegistro, IRegistro>(`${urlBase}register`, registro, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Request-Headers': '*'
            }
        })
            .then((result) => {
                if (result.data.id) {
                    history.push("/");
                } else {
                    store.addNotification(danger({ titulo: "Upss!", mensaje: "No se puedo realizar el registro, intentelo nuevamente", duracion: 2000 }));
                }
                dispacher(setSpiner(false))
            }).catch(error => {
                dispacher(setSpiner(false))
                console.log(error)
                store.addNotification(danger({ titulo: "Upss!", mensaje: "No se puedo realizar el registro, intentelo nuevamente", duracion: 2000 }));
            })
    }

    return (
        <>
            <NavBarLogin path="/" link="Iniciar Sesion" img />
            <Box >
                <Grid container justifyContent="center">
                    <Grid xs={12} style={{ maxWidth: 500 }}>
                        <div className="label-center label-100 label-registro">
                            <label className="label-100 label-color1 fnt-18 label-center ">Registro</label>
                        </div>
                        <div className="box-register">
                            <TextField label="Nombre" id="filled-size-normal" size="small" name="nombre" variant="outlined" onChange={handlerData} />
                            <TextField label="E-mail" id="filled-size-normal" size="small" name="email" variant="outlined" onChange={handlerData} />
                            <TextField label="Celular" type="number" id="filled-size-normal" size="small" name="celular" variant="outlined" onChange={handlerData} />
                            <TextField label="Contraseña" type="password" id="filled-size-normal" size="small" name="password" variant="outlined" onChange={handlerData} />
                        </div>
                        <Boton color="bgc3" styleBoton="box-boton" label="Registrarme" functionBoton={registraUsuario} />
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default Registro;