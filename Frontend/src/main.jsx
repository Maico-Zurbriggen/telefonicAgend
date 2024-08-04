import React from 'react' //Importamos las librerias de REACT
import ReactDOM from 'react-dom/client'
import App from './App.jsx' //Importamos nuestro modulo principal de la aplicacion
import './index.css' //Importamos nuestra hoja de estilos

ReactDOM.createRoot(document.getElementById('root')).render( //Renderizamos nuestro modulo principal
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
