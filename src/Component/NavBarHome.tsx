import { Link } from 'react-router-dom';
import Logo from '../Assets/img/logo.png'
import { useAppDispachs, useAppSelector } from '../Redux/hooks/hooks';
import { setStateMenu } from '../Redux/slices/Menu.slice';

interface IProps {
    link?: string;
    img?: boolean;
    path: string;
    tienda?: string;
}

const NavBarHome = (props: IProps) => {
    const { link, img, path, tienda } = props
    const dispacher = useAppDispachs();
    const menu = useAppSelector(state => state.menu)
    const menuOpen = () => {
        dispacher(setStateMenu(!menu.state));
    }
    return (
        <header className="header header-home">
            {img && <img src={Logo} alt="logo vitrix" className="logo" onClick={menuOpen} />}
            {tienda ? <label className="label-text link"><Link className=" label-text link" to={"#"} >Estas en: {tienda}</Link></label> : null}
            <label className="label-text link"><Link className=" label-text link" to={path} >Bienvenid@ {link}</Link></label>
        </header>
    )
}

export default NavBarHome;