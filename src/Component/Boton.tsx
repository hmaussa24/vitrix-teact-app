interface IBoton{
    label: string;
    functionBoton: (value?: any) => void;
    disabled?: boolean;
    styleBoton: string;
    color: string
}

const Boton = (props: IBoton) => {
    const {functionBoton, label, disabled, styleBoton, color} = props;
    return (
        <div className={styleBoton}>
            <button disabled={disabled ? disabled: false}  onClick={functionBoton} className={disabled ? 'boton-disabled' :`boton fnt-18 ${color}`}>{label}</button>
        </div>
    )
}

export default Boton;