import { useState, useEffect } from 'react' //Importamos el modulo useState para definir los estados de nuestra aplicacion
//Y useEffect que sirve para ejecutar una funcion o "efecto" que se pasa como primer parámetro con cierta frecuencia que se pasa como segundo parámetro

import axios from 'axios' //Importamos axios que lo utilizamos para manejar la comunicacion servidor-navegador, es decir las solicitudes HTTP

import services from './services/persons' //Importamos el modulo propio que utilizamos para manejar las solicitudes HTTP con axios

//Importamos los componentes REACT de la aplicacion
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Person from './components/Persons'
import Notification from './components/Notification'

const App = () => { //Definimos el componente REACT principal de la aplicacion
  const [persons, setPersons] = useState([]) //Definimos un estado que contiene un arreglo de objetos de los contactos
  const [newName, setNewName] = useState('') //Definimos un estado que se sincroniza con el input del nombre a agregar
  const [newNumber, setNewNumber] = useState('') //Definimos un estado que se sincroniza con el input del numero a agregar
  const [newFilter, setNewFilter] = useState('') //Definimos un estado que se sincroniza con el input del filtro
  const [message, setMessage] = useState([null, null]) //Definimos un estado que contiene un arreglo de dos elementos para imprimir en pantalla errores, el primer elemento es un mensaje y el segundo el tipo de mensaje

  useEffect(() => { //Definimos la funcion useEffect
    services.getAll() //Llamamos a la solicitud de services que obtiene todos los elementos de la base de datos
    .then(respuesta => {setPersons(respuesta)}) //Guardamos la respuesta de la consulta en el estado correspondiente
  }, []/*Al pasar un arreglo vacio como segundo parametro el efecto solo se ejecuta una vez luego del primer renderizado*/)

  const wait = () => { //Definimos una funcion que utilizaremos luego de imprimir un mensaje para eliminarlo luego de 5 segundos
    setTimeout(() => {
      setMessage([null, null]) //Eliminamos el mensaje
    }, 5000)
  }

  const agregar = (event) => { //Definimos el controlador de eventos de envio del formulario
    event.preventDefault() //Prevenimos que se actualice la pagina
    if ( persons.some( person => person.name.toLowerCase() == newName.toLowerCase() ) ){ //Verificamos que el nombre que se esta queriendo agregar no se encuentre ya en la base de datos
      if ( window.confirm(( `${newName} is already added to phonebook, replace the old number with a new one?` ))){ //Le preguntamos al usuario si quiere actualizar el numero del nombre ya existente
        const personaModificar = persons.find(p => p.name.toLowerCase() === newName.toLowerCase()) //Almacenamos el objeto del nombre ingresado

        services.update(personaModificar.id, {...personaModificar, number: newNumber}) //Realizamos una solicitud para actualizar el objeto, pasando como parametro el id de la persona y el nuevo objeto
        .then(respuesta => {setPersons(persons.map(person => person.id !== personaModificar.id ? person : respuesta)) //Actualizamos el estado de contactos para actualizar el objeto de la persona a modificar con el resultado de la solicitud
          setMessage([`Modified ${respuesta.name}`, 'exito']) //Mensaje de exito
        })
        .catch(error => { //Si la solicitud sale mal
          setMessage([`Number validation not passed`, 'error']) //Mensaje de error por un mal formato del numero de telefono
        })
        wait() //Llamamos a la funcion wait
      }
    }else{ //Si el nombre ingresado no se encuentra aun en la base de datos
      services //Realizamos una solicitud para crear un nuevo objeto, pasando como parametro el nuevo objeto
      .create({name: newName, number: newNumber})
      .then(agregado => {
        setPersons(persons.concat(agregado)) //Agregamos el nuevo objeto al arreglo del estado de contactos
        setMessage([`added ${agregado.name}`, 'exito'])}) //Mensaje de exito
      .catch(error => {
        setMessage([`Validation did not pass`, 'error']) //Mensaje de error porque no se dio adecuadamente el formato del nombre o el telefono
      })
    }
    wait()
    setNewName("") //Reiniciamos el estado de los input para ponerlos en blanco
    setNewNumber("")
  }

  //Controladores de evento de los input que realizan la sincronizacion por cada modificacion realizada en los input
  const nuevoNombre = (event) => {
    setNewName(event.target.value)
  }

  const nuevoNumero = (event) => {
    setNewNumber(event.target.value)
  }

  const nuevoFiltro = (event) => {
    setNewFilter(event.target.value)
  }

  const eliminar = (id, name) => { //Controlador de eventos de los botones de delete de cada contacto
    if(window.confirm(`¿Delete ${name}?`)){ //Preguntamos al usuario si realmente quiere eliminar el contacto
      services.deleted(id) //Realizamos una solicitud para eliminar el objeto, pasando el id de este
      setMessage([`${name} deleted`, 'exito']) //Mensaje de exito
      setPersons(persons.filter(person => person.id !== id)) //Actualizamos el estado de los contactos filtrando el contacto eliminado
      wait()
    }
  }

  const personsToShow = newFilter === '' //Definimos una variable que toma a todas las personas si la condicion se cumple o toma solo a las que contengan el filtro si la condicion no se cumple
  ? persons
  : persons.filter(person => person.name.toLowerCase().includes(newFilter)) //Filtramos para que solo se muestren los contactos que contienen el filtro

  return ( //Retornamos los componentes de REACT para que sean mostrados en el HTML
    <div>
      <h2>Phonebook</h2>
      <Notification mensaje={message[0]} tipo={message[1] /*Utilizamos el componente que muestra los mensajes de exito o error, enviamos el mensaje y el tipo de mensaje*/}/>
      <Filter valor={newFilter} controlador={nuevoFiltro /*Utilizamos el filtro enviamos el estado del input y el controlador para sincronizarlo*/}/>
      <h2>add a new</h2>
      <PersonForm controladorForm={agregar} estadoName={newName} estadoNum={newNumber} controladorName={nuevoNombre} controladorNum={nuevoNumero /*Utilizamos el formulario para añadir un contacto enviamos el controlador del envio de formulario, y los estados y controladores de ambos input*/}/>
      <h2>Numbers</h2>
      <div>
        {personsToShow.map(person => <Person key={person.id} nombre={person.name} numero={person.number} eliminar={() => eliminar(person.id, person.name) /*Mapeamos el arreglo de personas que puede estar filtrado o no y llamos al componente que muestra cada persona uno por uno enviando el id como llave ya que cada persona debe tener un identificador unico
          el nombre de la persona, su numero y el controlador del boton delete*/}/>)}
      </div>
    </div>
  )
}

export default App //Exportamos el modulo para que pueda ser utilizado en el main