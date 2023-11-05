//Funciones para realizar la edicion del cliente
import {inputEmail, inputEmpresa, inputNombre, inputTelefono,agregarCliente} from "./nuevocliente.js"
import {db} from "./app.js"
import { validar } from "./funciones.js";

inputNombre.addEventListener("blur", validar);
inputEmail.addEventListener("blur", validar);
inputTelefono.addEventListener("blur", validar);
inputEmpresa.addEventListener("blur", validar);
agregarCliente.addEventListener("click", saveChanges()) 

//Lanzamos la funcion una vez cargado el DOM
document.addEventListener('DOMContentLoaded',()=>{
    
    //Creamos una variable para realizar busqueda de parametros
    const URL = new URLSearchParams(window.location.search);
    //Almacenamos el resultado de la busqueda que en nuestro caso es por el correo
    const emailCliente = URL.get('id');
    console.log(emailCliente);
    editarCliente(emailCliente)
})


function editarCliente(email){
    const request = indexedDB.open('crm', 1);
    request.onsuccess = () => {
        const objectStore = db.transaction('clientes').objectStore('clientes')
        objectStore.openCursor().onsuccess = function(e){
        const cursor = e.target.result
            if(cursor){
                //Hacemos una comparitva de los correos
                const emailcursor = cursor.value.email;
                /*Si el email encontrado en el click coincide con el del
                cursor pondra los valores en el los input para que sean editados*/
                if(email === emailcursor){
                    const {email, nombre, telefono, empresa} = cursor.value
                    inputNombre.value = nombre
                    inputEmail.value = email
                    inputTelefono.value = telefono
                    inputEmpresa.value = empresa             
                }
            cursor.continue()
            }
        }
  };
}

function saveChanges() {

}