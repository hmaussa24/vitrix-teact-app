import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './Login/Login';
import Registro from './SingUp/Registro';
import './Assets/styles.scss'
import './Assets/productos.scss'
import './Assets/spiner.scss'
import 'react-notifications-component/dist/theme.css'
import Spiner from './Component/Spiner';
import ReactNotification from 'react-notifications-component'
import CrearTienda from './Home/CrearTienda';
import ListarTiendas from './Home/ListarTiendas';
import { useAppSelector,  } from './Redux/hooks/hooks';
import ListarEmpleados from './Home/ListarEmpleados';
import CrearEmpleados from './Home/CrearEmpleados';
import Productos from './Tienda/NewProductos';
import CrearProducto from './Tienda/CrearProducto';
import VerProducto from './Tienda/VerProducto';
import ModuloVentas from './Tienda/ModuloVentas';

import Creditos from './Tienda/Creditos';
import PagosCuotas from './Tienda/PagosCuotas';
import InfoCredito from './Tienda/InfoCredito';
import ReporteVentas from './Tienda/ReporteDiarioVentas';
import ReporteInventario from './Tienda/ReporteInventario';
// function App() {
  
  function App() {
  
  const spiner = useAppSelector((state) => state.spiner)
    return (
      <>
        { spiner.spiner && <Spiner />}
        <ReactNotification />
        <BrowserRouter>
          <Switch>
            <Route path="/" component={Login} exact />
            <Route path="/registro" component={Registro} exact />
            <Route path="/home" component={ListarTiendas} exact />
            <Route path="/creartienda" component={CrearTienda} exact />
            <Route path="/empleados" component={ListarEmpleados} exact />
            <Route path="/registraempleado" component={CrearEmpleados} exact />
            <Route path="/productos" component={Productos} exact />
            <Route path="/crearproductos" component={CrearProducto} exact />
            <Route path="/verproducto" component={VerProducto} exact />
            <Route path="/moduloventas" component={ModuloVentas} exact />
            <Route path="/creditos" component={Creditos} exact />
            <Route path="/pagos" component={PagosCuotas} exact />
            <Route path="/pagos/credito" component={InfoCredito} exact />
            <Route path="/reporteventas" component={ReporteVentas} exact />
            <Route path="/reporteinventario" component={ReporteInventario} exact />
          </Switch>
        </BrowserRouter>
      </>
    );
}

export default App;
