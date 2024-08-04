require('dotenv').config() //Importamos esta libreria para poder trabajar con variables de entorno que se encuentran en el archivo .env
const express = require('express') //Importamos la libreria express que nos permite trabajar con el backend, con mayor facilidad al respoder a las solicitudes HTTP
const morgan = require('morgan') //Importamos la libreria morgan que nos permite obtener informacion adicional de las solicitudes HTTP
const cors = require('cors') //Con cors podemos permitir solicitudes desde otros origenes distintos al de nuestro servidor

const app = express() //Creamos una aplicacion express

const Contact = require('./models/contact') //Importamos el esquema para trabajar con la base de datos

app.use(express.static('dist')) //Con esto habilitamos a express para que muestre el contenido estatico, es decir configuramos nuestro backend para que muestre nuestro frontend
app.use(express.json()) //Con esto podemos acceder al body de las solicitudes HTTP para saber que debemos agregar a la base de datos

morgan.token('body', (request) => { //Creamos un token para el middleware morgan de el body de la solicitud hecho en formato de texto
    return JSON.stringify(request.body)
})
app.use(morgan(':method :url :status :response-time ms - :body')) //Utilizamos el middleware morgan, nos permite obtener datos de las solicitudes HTTP realizadas, lo usamos para acceder al momento en el que se realizo la solicitud para la ruta /info

app.use(cors()) //Usamos el middleware cors

let cantidad = 0 //Esta variable la utilizamos para almacenar la cantidad de contactos que tenemos almacenados

app.get('/api/persons', (request, response) => { //Creamos una ruta para obtener todos los resultados de la base de datos
    Contact.find({}).then(result => { //Utilizamos el esquema y el metodo find para obtener todos los objetos almacenados, obtenemos todos ya que como parametro enviamos un objeto vacio
        cantidad = result.length //Almacenamos la cantidad de elementos del arreglo que obtenemos como respuesta
        response.json(result) //Respondemos a la solicitud realizada en formato JSON
    })
})

app.get('/api/persons/:id', (request, response, next) => { //Creamos una ruta para obtener un resultado de la base de datos por su id
    Contact.findById(request.params.id).then(result =>{ //A traves del esquema y el metodo findById buscamos un objeto por su id
        if (result) { //Si obtenemos un resultado lo enviamos como respuesta de la solicitud en formato JSON
            response.json(result)
        } else { //Si no obtenemos ningun objeto devolvemos un estado de error
            response.status(404).end() 
        }
    }) //Y si ocurre algun error procesando la solicitud llamamos al controlador de errores y le enviamos el objeto del error como parametro
    .catch(error => next(error)) //Llamamos al controlador de errores
})

app.post('/api/persons', (request, response, next) => { //Creamos una ruta para agregar un nuevo contacto a la base de datos
    const body = request.body //Almacenamos el cuerpo de la solicitud

    const contact = new Contact({ //Creamos un nuevo contacto a traves del esquema con su nombre y su numero, el id es agregado automaticamente por MongoDB
        name: body.name,
        number: body.number,
    })

    contact.save() //Almacenamos el nuevo contacto
    .then(result => {
        response.json(result) //Enviamos el resultado de la solicitud en formato JSON si todo sale bien
    })
    .catch(error => next(error)) //Si ocurre algun error al procesar la solicitud llamamos al controlador de errores
})

app.put('/api/persons/:id', (request, response, next) => { //Creamos una ruta para actualizar el numero de una persona que ya esta agendada
    const body = request.body //Almacenamos el cuerpo de la solicitud

    const contact = { //Almacenamos los cambios que se van a realizar al objeto
        number: body.number
    }

    Contact.findByIdAndUpdate(request.params.id, contact, { new: true, runValidators: true, context: 'query' } /*Este parámetro (new:true) sirve para 
    que updateContact reciba el valor actualizado no el antiguo y los otros dos son para que se tengan en cuenta las validaciones del esquema*/)
    //Con este metodo de esquema buscamos un objeto por su id y lo actualizamos, le pasamos el id, los cambios y configuraciones opcionales
    .then(updateContact => {
        response.json(updateContact) //Enviamos el nuevo objeto en formato JSON como respuesta si todo sale bien
    })
    .catch(error => next(error)) //Si ocurre algun error al procesar la solicitud llamamos al controlador de errores
})

app.delete('/api/persons/:id', (request, response, next) => { //Creamos una ruta para eliminar un resultado de la base de datos por su id
    Contact.findByIdAndDelete(request.params.id) //Con este metodo del esquema buscamos un objeto por su id y lo eliminamos
    .then(result => {
        response.status(204).end() //Devolvemos un estado de exito si todo sale bien
    })
    .catch(error => next(error)) //Si ocurre algun error al procesar la solicitud llamamos al controlador de errores
})

app.get('/info', (request, response) => { //Declaramos una ruta para mostrar informacion de la cantidad de contactos almacenados
    let fecha = Date.now() //Obtenemos la fecha actual en el momento
    fecha = new Date(fecha) //Le damos un formato adecuado a la fecha
    response.send(`<p>Phonebook has info for ${cantidad} people</p><p>${fecha}</p>`) //Respondemos a la solicitud con un texto
})

const errorHandler = (error, request, response, next) => { //Creamos el controlador de errores
    console.error(error)
  
    if (error.name === 'CastError') { //Verificamos si el error se da porque el id tiene un formato incorrecto
      return response.status(400).send({ error: 'malformatted id' })
    }else if(error.name === 'ValidationError'){ //Verificamos si es un error de validacion
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(errorHandler) //Llamamos al middleware del controlador de errores

const PORT = process.env.PORT || 3001 //Definimos el puerto
app.listen(PORT, () => { //Iniciamos el servidor con el puerto definido
    console.log(`Server running in port ${PORT}`)
})