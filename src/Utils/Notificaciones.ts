import { ReactNotificationOptions } from "react-notifications-component";

interface INotifi {
    titulo: string;
    mensaje: string;
    duracion: number;
}

export const danger = (notifi: INotifi): ReactNotificationOptions => {
    const notif: ReactNotificationOptions = {
        title: notifi.titulo,
        message: notifi.mensaje,
        type: "danger",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: notifi.duracion,
            onScreen: true
        }
    }
    return notif;
}
export const success = (notifi: INotifi): ReactNotificationOptions => {
    const notif: ReactNotificationOptions = {
        title: notifi.titulo,
        message: notifi.mensaje,
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: notifi.duracion,
            onScreen: true
        }
    }
    return notif;
}
export const defaultn= (notifi: INotifi): ReactNotificationOptions => {
    const notif: ReactNotificationOptions = {
        title: notifi.titulo,
        message: notifi.mensaje,
        type: "default",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: notifi.duracion,
            onScreen: true
        }
    }
    return notif;
}
export const info= (notifi: INotifi): ReactNotificationOptions => {
    const notif: ReactNotificationOptions = {
        title: notifi.titulo,
        message: notifi.mensaje,
        type: "info",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: notifi.duracion,
            onScreen: true
        }
    }
    return notif;
}
export const warning= (notifi: INotifi): ReactNotificationOptions => {
    const notif: ReactNotificationOptions = {
        title: notifi.titulo,
        message: notifi.mensaje,
        type: "warning",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: notifi.duracion,
            onScreen: true
        }
    }
    return notif;
}

