const Filter = (props) => { //Creamos el componente REACT para el filtro
    return (
        <div>
            filter shown with <input value={props.valor} onChange={props.controlador /*Retornamos el filtro el atributo value recibe el estado creado para el input y onChange su controlador*/}/>
        </div>
    )
}

export default Filter //Exportamos nuestro filtro