const Person = (props) => { //Creamos el componente REACT que muestra cada persona
    return (
        <>
            <p>{props.nombre} {props.numero} <button onClick={props.eliminar /*Mostramos el nombre y numero de la persona y un boton con su controlador de eventos*/}>delete</button></p>
        </>
    )
}

export default Person