const Notification = ({ mensaje, tipo }) => { //Creamos el componente REACT para nuestras alertas
    if (mensaje === null) { //Si no se pasa ningun mensaje
      return null //Retornamos null para que no se muestre ninguna alerta y salgamos del componente
    }
  
    return ( //Si hubo mensaje
      <div className={`alerta ${tipo}` /*Retornamos el mensaje dentro de un div con las clases de alerta y el tipo de alerta para que este div tome los estilos*/}>
        {mensaje}
      </div>
    )
}

export default Notification 