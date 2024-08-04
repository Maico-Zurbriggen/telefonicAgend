const PersonForm = (props) => { //Creamos el componente REACT del formulario para agregar contactos
    return (
        <form onSubmit={props.controladorForm /*Creamos el form y en el atributo onSubmit le asignamos su controlador de eventos*/}>
            <div>
                name: <input value={props.estadoName} onChange={props.controladorName /*Creamos cada input con su estado en el value, su controlador de eventos y un texto informativo en el placeholder*/} placeholder="three characters minimum"/>
            </div>
            <div>
                number: <input value={props.estadoNum} onChange={props.controladorNum} placeholder="12-12345.. 123-1234.."/>
            </div>
            <div>
                <button type="submit">add</button>
            </div>
      </form>
    )
}

export default PersonForm