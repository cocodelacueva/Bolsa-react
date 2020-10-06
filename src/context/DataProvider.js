import React from 'react'
import {db, auth, provider} from '../firebase'

export const DataContext = React.createContext();

const DataProvider = (props) => {

    const dataUsuario = {uid: null, email: null, estado: null, displayName: null}
    const panelDefault = 'panel_general';

    //estados:
    const [usuario, setUsuario] = React.useState(dataUsuario)
    const [simbolos, setSimbolos] = React.useState([]);
    const [panel, setPanel] = React.useState(panelDefault);
    const [panelNombre, setPanelNombre] = React.useState(null);//es para escribir el nombre del panel
    const [simbolosFecha, setSimbolosFecha] = React.useState(null);


    React.useEffect(() => {
        detectarUsuario()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const detectarUsuario = () => {
        auth.onAuthStateChanged(user => {
            if(user){
                setUsuario({uid: user.uid, email: user.email, estado: true, displayName: user.displayName});
                obtenerData(panel);
            }else{
                setUsuario({uid: null, email: null, estado: false, displayName: null});
            }
        })
    }


    const iniciarSesion = async() => {
        try {
            await auth.signInWithPopup(provider);
        } catch (error) {
            console.log(error);
        }
    }

    const cerrarSesion = () => {
        auth.signOut();
    }

    //obtener la data de local host, sino esta en local host hace un fetch a firebase
    const obtenerData = async ( panelToFetch='panel_general' ) => {
        
        setPanel(panelToFetch);

        //busca en localhost
        let oldData = localStorage.getItem(panelToFetch);

        if ( oldData ) {
            //chequeamos si es muy vieja y hacemos un nuevo fetch

            oldData = JSON.parse(oldData)
            const now = new Date()
            // compare the expiry time of the item with the current time
            if (now.getTime() > oldData.expiry) {
                // If the item is expired, delete the item from storage
                localStorage.removeItem(panelToFetch);
                // and fetchdata
                fetchData(panelToFetch);
            } else {
                //si esta fresca retornamos:
                
                //seteamos estados
                setSimbolos(oldData.value[0].titulos);
                setSimbolosFecha(oldData.value[0].date);
                setPanelNombre(oldData.value[0].name_panel);
            }

        } else {
            //no esta en localhost, obtenemos la data
            fetchData(panelToFetch);
        }
    
    }

    const fetchData = async ( panel ) => {
        try {  
            const data = await db.collection(panel).orderBy("date", "desc").limit(1).get();        
            
            const arrayData = data.docs.map(doc => ( doc.data() ));
  
            //seteamos estados
            setSimbolos(arrayData[0].titulos);
            setSimbolosFecha(arrayData[0].date);
            setPanelNombre(arrayData[0].name_panel);

            //guardamos en localhost
            const now = new Date();
            const item = {
                value: arrayData,
                expiry: now.getTime() + 1000*60*30,
            }
            localStorage.setItem(panel, JSON.stringify(item));
    
          } catch (error) {
            console.log(error);
          }
    };


    return (
        <DataContext.Provider value={{
            usuario, iniciarSesion, cerrarSesion, obtenerData, simbolos, panelNombre, simbolosFecha, panel
        }}>
           {props.children} 
        </DataContext.Provider>
    )
}

export default DataProvider
