import Boton from "../Component/Boton";
import NavBarLogin from "../Component/NavBarLogin";
import Logo from '../Assets/img/logo.png'
import { ChangeEvent, useState } from 'react';
import { useAppDispachs } from '../Redux/hooks/hooks';
import { useHistory } from 'react-router-dom';
import { setSpiner } from '../Redux/slices/Spiner.slice'
import { httpPost } from '../Services/Http';
import { store } from 'react-notifications-component';
import { danger } from '../Utils/Notificaciones';
import { setLoginSesion } from "../Redux/slices/Login.slice";
import { setTienda } from "../Redux/slices/Tienda.slice";
import { Box, FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { useEffect } from 'react';
interface ILogin {
    email?: string;
    password?: string;
    id?: number;
    token?: string;
    nombre?: string;
    rol?: number;
    tienda_id?: number;
    nombreTienda: string;
}

const Login = () => {
    const urlBase = process.env.REACT_APP_URL_BASE
    const dispacher = useAppDispachs();
    let history = useHistory();
    const [login, setLogin] = useState<ILogin>({ nombreTienda: "" });
    const [show, setShow] = useState<boolean>(false);

    const handlerData = (event: ChangeEvent<HTMLInputElement>) => {
        setLogin({
            ...login,
            [event.target.name]: event.target.value
        })
    }

    useEffect(() => {
        dispacher(setSpiner(false))
    }, [dispacher])

    const loginData = () => {
        dispacher(setSpiner(true))
        httpPost<ILogin, ILogin>(`${urlBase}login`, login)
            .then((result) => {
                if (result.data.token) {
                    dispacher(setLoginSesion(result.data))
                    if (result.data.rol) {
                        dispacher(setTienda({ id: Number(result.data.tienda_id), nombre: result.data.nombreTienda }))
                        history.push("/moduloventas")
                    } else {
                        history.push("/home")
                    }
                } else {
                    store.addNotification(danger({ titulo: "Error de seseio", mensaje: "error iniciando sesion", duracion: 2000 }))
                }
                dispacher(setSpiner(false))
            }).catch((error) => {
                dispacher(setSpiner(false))
                //alert(error)
                store.addNotification(danger({ titulo: "Error de sesion", mensaje: "error iniciando sesion, usuario o contraseña incorrectos", duracion: 2000 }))
            })
    }
    return (
        <>
            <NavBarLogin path="/registro" link="Registrame Gratis" />
            <Box>
                <Grid container justifyContent="center">
                    <Grid xs={12} style={{ maxWidth: 600 }}>

                        <Grid item xs={12}>
                            <div className="circle">
                                <img src={Logo} alt="logo" />
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <div className="label-center label-100 label-registro">
                                <label className="label-100 label-color1 fnt-18 label-center ">Bienvenid@</label>
                            </div>
                        </Grid>
                        <Grid className="box-register" xs={12}>
                            <TextField label="E-mail" id="filled-size-normal" name="email" variant="outlined" onChange={handlerData} />
                            <FormControl variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={show ? 'text' : 'password'}
                                    onChange={handlerData}
                                    name="password"
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => { setShow(!show) }}
                                                onMouseDown={() => { setShow(!show) }}
                                                edge="end"
                                            >
                                                {show ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    labelWidth={70}
                                />
                            </FormControl>
                        </Grid>
                        <Grid xs={12}>
                            <Boton color="bgc3" styleBoton="box-boton" label="Iniciar Sesion" functionBoton={loginData} />
                            <div className="rem-pwd">¿Olvidaste tu contraseña?</div>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default Login;