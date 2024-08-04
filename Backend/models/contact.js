const mongoose = require('mongoose') //Importamos la libreria mongoose que nos facilita operar con nuestra base de datos de MongoDB

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI //Definimos la URL a traves de nuestra variable de entorno creada en el archivo .env

console.log('connecting to', url)

mongoose.connect(url) //Se realiza la conexion a nuestra base de datos a traves de la url de nuestra base de datos que utilizamos como variable de entorno
  .then(result => {
    console.log('connected to MongoDB') //Se realizo la conexion correctamente
})
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message) //Hubo un error al intentar conectarnos a nuestra base de datos
})

const contactSchema = new mongoose.Schema({ //Definimos el esquema de nuestros contactos que se almacenaran en la base de datos
  name: { //Deben tener un nombre
    type: String, //De tipo string
    minLength: 3, //Con no menos de 3 caracteres
    required: true, //Y el nombre debe estar si o si
  },
  number: { //Deben tener un numero
    type: String, //de tipo string
    match: /^\d{2,3}-\d{5,}$/, //Que debe cumplir con esta expresion regular, nos dice que debe tener 2 o 3 digitos, un guion y luego por lo menos 5 digitos mas
    required: true, //Y el numero debe estar si o si
  }
}) //Si no se cumplen las validaciones saltara un error de validacion

contactSchema.set('toJSON', { //Utilizamos el metodo set para configurar algunas opciones de nuestro esquema, lo pasamos a un formato JSON con toJSON
  transform: (document, returnedObject) => { //Con transform modificamos nuestro esquema a traves de returnedObject que es el esquema final, document es el documento original de mongoose que contiene toda la informacion de la base de datos
    returnedObject.id = returnedObject._id.toString() //Almacenamos el id que MongoDB genera automaticamente a los objetos nuevos que guardamos en una nueva variable convirtiendolo en un string
    delete returnedObject._id //Eliminamos la clave id por defecto del esquema
    delete returnedObject.__v //Eliminamos esta otra clave que se crea por defecto
  }
})

module.exports = mongoose.model('Contact', contactSchema) //Exportamos el esquema