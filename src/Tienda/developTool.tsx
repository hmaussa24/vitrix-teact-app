import { Box, Checkbox, Divider, Grid, Typography } from '@material-ui/core';
import NewTienda from '../Component/NewTienda'
const developTools = () => {
    return (
        <NewTienda>
            <Box textAlign="center" className="label-color1 fnt-18">
                Herramientas
            </Box>
            <Box m={2}>
                <Grid container justifyContent="center" spacing={3}>
                    <Grid item xs={8}>
                        <Typography variant="h6" className="label-color1">
                            Activar vitrix shop
                        </Typography>
                        Al activar vitrix shop tus productos podran ser vendidos mediante la tienda vitrix shop, tus productos se publicaran en vitrix shop y podras generar
                        mas gancias con las ventas. Nosotos nos encargamos de todo por ti. consulta terminos en Aqui.
                    </Grid>
                    <Grid item xs={2}>
                        <Checkbox color="primary" checked></Checkbox>
                    </Grid>
                </Grid>

            </Box>
            <Divider></Divider>
            <Box m={2}>
                <Grid container justifyContent="center" spacing={3}>
                    <Grid item xs={8}>
                        <Typography variant="h6" className="label-color1">
                            Activar vitrix key
                        </Typography>
                        Crea tu propia tienda on-line y integrala a nuestros servicios para que la administres, despreocupate de los pagos nosotros hacemos todo para que
                        las ventas on-line no sean un problema. consulta la documentacion Aqui.
                    </Grid>
                    <Grid item xs={2}>
                        <Checkbox color="primary" checked></Checkbox>
                    </Grid>
                </Grid>
                <Box mt={3}>
                    <Grid container justifyContent="center">
                        Tu llave pulica es: jkhbajksdsdgjsgj sgñjfgbnsdfjb
                    </Grid>
                </Box>

            </Box>

        </NewTienda>
    )
}

export default developTools;