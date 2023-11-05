//Funciones para la validacion, envio y comunicación con la base de datos

//Importaciones de los otros script para manejar todo organizadamente
import { addClient } from "./app.js";
import { agregarCliente, datosCliente, formulario, snipper } from "./nuevocliente.js";

//Funcion para validar que los campos no van vacíos
export function validar(e) {
  if (e.target.value.trim() === "") {
    warning(`El campo ${e.target.id} es obligatorio`, e.target.parentElement);
    datosCliente[e.target.name] = "";
    checkDatos();
    return; //Para cortar la ejecucion del código si cumple la condición y no limpie el mensaje de error
  }

  if (e.target.id === "nombre" && !checkNombre(e.target.value)) {
    warning("El Nombre no es válido", e.target.parentElement);
    datosCliente[e.target.name] = "";
    checkDatos();
    return;
  }

  if (e.target.id === "email" && !checkEmail(e.target.value)) {
    warning("El Email no es válido", e.target.parentElement);
    datosCliente[e.target.name] = "";
    checkDatos();
    return;
  }

  if (e.target.id === "telefono" && !checkTelefono(e.target.value)) {
    warning("El Teléfono no es válido", e.target.parentElement);
    datosCliente[e.target.name] = "";
    checkDatos();
    return;
  }

  if (e.target.id === "empresa" && !checkEmpresa(e.target.value)) {
    warning("La Empresa no es válida", e.target.parentElement);
    datosCliente[e.target.name] = "";
    checkDatos();
    return;
  }
  cleanWarning(e.target.parentElement);

  //Vamos sobreescribiendo los datos hasta que esten todos bien y deje enviar el objeto
  datosCliente[e.target.name] = e.target.value;
  checkDatos();
} 

//Mensaje básico de error insertado en el HTML
function warning(mensaje, ubielmento) {
  cleanWarning(ubielmento);
  const error = document.createElement("P");
  error.textContent = mensaje;
  error.classList.add("bg-orange-500", "text-white", 
  "text-center", "p-2","font-semibold", "rounded-md");
  ubielmento.appendChild(error);
}

//Funcion para quitar warnings
function cleanWarning(ubielmento) {
  //Seleccionamos el warning y lo almacenamos
  const alert = ubielmento.querySelector(".bg-orange-500");
  if (alert) {
    alert.remove();
  }; 
}; 

//Validación del nombre con pattern
function checkNombre(nombre) {
  //Utilzamos una expresión regular
  const regex = /^[A-Za-z\s'-]+$/;
  //La testeamos
  const resultado = regex.test(nombre);
  //Retornamos el resultado del testeo
  return resultado;
}

//Validación del email con pattern
function checkEmail(email)  {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
  const resultado = regex.test(email);
  return resultado;
};

//Validacion del telefono con pattern
function checkTelefono(telefono) {
  const regex = /^(6|7|8|9)\d{8}$/;
  const resultado = regex.test(telefono);
  return resultado
};

//Validacion del telefono con pattern
function checkEmpresa(telefono) {
  //Es una limitación muy básica y poco limitada ya que no especifica caracteristicas en el nombre de empresa
  const regex = /^[A-Za-z0-9\s\-,.&'()]*$/;
  const resultado = regex.test(telefono);
  return resultado;
};

// Con esto habilitamos el boton una vez se haya introducido el valor en el objeto
function checkDatos() {
  const values = Object.values(datosCliente);
  if(values.includes("")){
    agregarCliente.classList.remove("bg-teal-500");
    agregarCliente.classList.add("bg-gray-500");
    agregarCliente.disabled = false;
    agregarCliente.value="Rellena los Datos"
  } else {
    agregarCliente.classList.remove("bg-gray-500");
    agregarCliente.classList.add("bg-teal-500");
    agregarCliente.disabled = false;
    agregarCliente.value="Agregar Cliente"
  }
}

export function uploadData(e) {
  e.preventDefault();
  snipper.classList.remove("hidden");
  //Pasamos el resultado de el agregado desde addClient
  addClient(datosCliente);

  datosCliente.email = "";
  datosCliente.nombre = "";
  datosCliente.telefono = "";
  datosCliente.empresa = "";
  formulario.reset();
  checkDatos();
}

