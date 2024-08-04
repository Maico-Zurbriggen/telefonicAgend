import axios from 'axios' //Importamos la libreria axios que nos permite trabajar con la interaccion entre el servidor y el navegador
//Manejando las solicitudes HTTP

const baseURL = '/api/persons' //Definimos una URL relativa para nuestro hosting, creamos un proxy en vite.config
//para poder continuar utilizando la aplicacion en modo desarrollo sin que esta URL relativa afecte

const getAll = () => { //Creamos la funcion para obtener todos los objetos de la base de datos
    const request = axios.get(baseURL) //Enviamos una solicitud GET a la url base
    return request.then(respuesta => respuesta.data) //Retornamos los datos de la respuesta
}

const create = newPerson => { //Creamos la funcion para crear un nuevo contacto
    const request = axios.post(baseURL, newPerson) //Realizamos una solicitud POST a la url base y enviamos el objeto con los datos de la nueva persona
    return request.then(respuesta => respuesta.data) //Retornamos los datos de la respuesta
}

const update = (id, newPerson) => { //Creamos la funcion para actualizar los datos de una persona ya existente
    const request = axios.put(`${baseURL}/${id}`, newPerson) //Realizamos una solicitud PUT a la url del objeto a actualizar, utilizando su id junto con la url base
    //Tambien enviamos un objeto con los cambios a realizar
    return request.then(respuesta => respuesta.data) //Retornamos los datos de la respuesta
}

const deleted = id => { //Creamos la funcion para eliminar contactos
    axios.delete(`${baseURL}/${id}`) //Realizamos una solicitud DELETE a la url concreta del contacto a eliminar utilizando el metodo anterior del id
}

export default {getAll, create, update, deleted} //Exportamos estas 4 funciones