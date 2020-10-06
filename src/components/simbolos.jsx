import React from 'react';
import Simbolo from './simbolo-detalle';
import { DataContext } from '../context/DataProvider';
import { makeStyles, ListItemText, ListItem, List, Typography, InputLabel, MenuItem, FormControl, Select, Container, Grid } from '@material-ui/core/';


const useStyles = makeStyles((theme) => ({
    wrapperSimbolos : {
        paddingTop: theme.spacing(6),
        paddingBottom: theme.spacing(6),
    },
    formControl: {
    display: "block",
      marginBottom: theme.spacing(5),
      minWidth: 160,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));
  

function Simbolos() {
    //estilos
    const classes = useStyles();
    //contexto
    const { usuario, simbolos, panelNombre, simbolosFecha, obtenerData, panel } = React.useContext(DataContext);
    //estados
    const [panelSelec, setpanelSelec] = React.useState(panel);
    const [simboloElegido, setsimboloElegido] = React.useState(null);

    //funciones
    const handleChange = (event) => {
        const nuevoPanel = event.target.value;
        setpanelSelec(nuevoPanel);
        
        obtenerData(nuevoPanel);

        setsimboloElegido(null);
    };

    const clickInSymbol = (index) => {
        
        setsimboloElegido(simbolos[index]);
        
    }

    return usuario.estado ? (
            <div className={classes.wrapperSimbolos}>
                <Container maxWidth="lg">
                    <Grid container direction="row-reverse">
                        <Grid item xs={12} sm={6}>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel id="demo-simple-select-outlined-label">Paneles</InputLabel>
                                <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={panelSelec}
                                onChange={handleChange}
                                label="panel"
                                >
                                    <MenuItem value="panel_general">Panel General</MenuItem>
                                    <MenuItem value="panel_cedears">CEDEARs</MenuItem>
                                </Select>
                            </FormControl>

                            {
                                simboloElegido != null ? <Simbolo simbolo={simboloElegido} /> : null
                            }
                            

                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h2" gutterBottom>
                                {panelNombre}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Fecha: {simbolosFecha}
                            </Typography>
                            
                            <List aria-label="simbolos">
                                {simbolos.map((simbolo, index) => (
                                    <ListItem button key={simbolo.simbolo} onClick={() => {clickInSymbol(index)}}>
                                        <ListItemText>
                                            {simbolo.simbolo} - AR$ {simbolo.ultimoPrecio} - {simbolo.tendencia}
                                        </ListItemText>
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        ) : null
}

export default Simbolos;