import { Link } from 'react-router-dom';
import Logo from '../Assets/img/logo.png'

interface IProps{
    link: string;
    img?: boolean;
    path: string;
}

const NavBarLogin = (props: IProps) => {
    const {link, img, path} = props
    return (
        <header className="header">
            {img && <img src={Logo} alt="logo vitrix" className="logo"/>}
            <label className="label-text link"><Link className=" label-text link" to={path} >{link}</Link></label>
        </header>
    )
}

export default NavBarLogin;