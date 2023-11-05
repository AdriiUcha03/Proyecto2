//Importaciones de los otros scripts necesarias
import { validar, uploadData} from "./funciones.js";

//Selectores para Nuevo cliente
export const inputNombre = document.querySelector("#nombre");
export const inputEmail = document.querySelector("#email");
export const inputTelefono = document.querySelector("#telefono");
export const inputEmpresa = document.querySelector("#empresa");
export const formulario = document.querySelector("#formulario");
export const agregarCliente = document.querySelector('#formulario input[type="submit"]')
export const snipper = document.querySelector("#spinner");

//Listeners del formulario
inputNombre.addEventListener("blur", validar);
inputEmail.addEventListener("blur", validar);
inputTelefono.addEventListener("blur", validar);
inputEmpresa.addEventListener("blur", validar);
agregarCliente.addEventListener("click", uploadData)

//Objeto del cliente a agregar que se rellenara con las validaciones en funciones.js
export let datosCliente = {
    email: "",
    nombre: "",
    telefono: "",
    empresa:"",
}