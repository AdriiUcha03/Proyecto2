/*Como no especificas como hay que organizar lo que hay para hacer lo 
ordene segun mi comodidad. En esta parte tenemos la gestion de la base 
datos con sus funciones de lectura escritura edición y borrado*/

//Selector 
const listaClientes = document.querySelector("#listado-clientes")

// Listener pero no funciona bien porque cuando no hay para eliminar no se borra
// listaClientes.addEventListener('click',eliminarCliente)

//Comprobante de que el navegador es compatible con indexedDB
if (!window.indexedDB) {
    window.alert("Su navegador no soporta indexedDB.");
}

//Metemos la API IndexedDB en una variable para manejarla
const indexedDB = window.indexedDB;

//Donde almacenaremos la instacia de la base de datos(lo que vamos haciendo), 
// es la forma más cómoda de manejar la escucha de resultados
export let db;

//Abrimos la base datos
const conexion = indexedDB.open("CRM",1);

//Evento que se dispara cuando la base de datos se abré
conexion.onsuccess = () =>{
    db = conexion.result;
    console.log('Base de datos abierta');
    mostrarClientes();
};

//Evento que se dispara cuando la base de datos se crea o se actualiza
conexion.onupgradeneeded = (e) =>{
    db = e.target.result;
    console.log('Base de datos creada', db);
    //Creación de la tablas
    const objectStore = db.createObjectStore('clientes', {keyPath:'email'});

    //Indices o Atributos
    objectStore.createIndex('email','email',{unique: true});
    objectStore.createIndex('name','name',{unique: false});
    objectStore.createIndex('telefono','telefono',{unique: false});
    objectStore.createIndex('empresa','empresa',{unique: false});
}

//Evento que se dispara cuando la base de datos no se puede abrir
conexion.onerror = (error) =>{
    console.log('Error ', error);
};

//Funcion para agregar cliente
export function addClient(cliente){
    const transaction = db.transaction('clientes','readwrite');
    const objectStore = transaction.objectStore('clientes');
    //Se agrega a la tabla
    const request = objectStore.add(cliente);

    //Interpretamos la subida y mostramos un mensaje
    request.onsuccess = () => {
        setTimeout(function() {
          //Ocultamos el spinner
          spinner.classList.add("hidden");
  
          // Mostrar el mensaje de error después de 3-4 segundos
          const mensaje = document.createElement("P");
          mensaje.classList.add("bg-green-500", "text-white", "p-2", "text-center", "rounded-lg", "mt-10", "font-bold", "text-sm", "uppercase");
          mensaje.textContent = "Cliente Agregado";
          formulario.appendChild(mensaje);
          
          setTimeout(() => {
            mensaje.remove();
          // Eliminar el mensaje después de 1 segundo
          }, 1000); 
      // Mostrar el mensaje después de 3 segundos
      }, 3000);     
    }
    
    request.onerror = () => {
      setTimeout(function() {
        //Ocultamos el spinner
        spinner.classList.add("hidden");

        // Mostrar el mensaje de error después de 3-4 segundos
        const mensaje = document.createElement("P");
        mensaje.classList.add("bg-red-500", "text-white", "p-2", "text-center", "rounded-lg", "mt-10", "font-bold", "text-sm", "uppercase");
        mensaje.textContent = "Error Agregado Cliente";
        formulario.appendChild(mensaje);
        
        setTimeout(() => {
          mensaje.remove();
        // Eliminar el mensaje después de 1 segundo
        }, 1000); 
    // Mostrar el mensaje después de 3 segundos
    }, 3000);     
  }
}; 

//Funcion para mostrar clientes en una tabla
function mostrarClientes(){
  //Seleccionamos la base de datos con la tabla actual
  const objectStore = db.transaction('clientes').objectStore('clientes');
      //Con openCursor recorremos los datos de la tabla agregados
      objectStore.openCursor().onsuccess = function(e){
          // Obtenemos el resultado del cursor
          const cursor = e.target.result
          //Comprbamos que el cursor tenga los valores que buscamos
          if(cursor){
              const {email, nombre, telefono, empresa} = cursor.value
              //Insetamos los datos en forma de tabla dentro del tbody que tenemos y además le agregamos dos botones para editar y eliminar
              listaClientes.innerHTML +=
                                      ` <tr>
                                          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                            <p class="text-sm leading-5 font-medium text-black-700 text-lg  font-bold"> ${nombre} </p>
                                            <p class="text-sm leading-10 text-black-700"> ${email} </p>
                                          </td>
                                          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                            <p class="text-gray-700">${telefono}</p>
                                          </td>
                                          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                                            <p class="text-gray-600">${empresa}</p>
                                          </td>
                                          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                                            <a href="editar-cliente.html?id=${email}" class="text-teal-600 hover:text-teal-900 mr-5  font-bold">Editar</a>
                                            <a href="#" data-cliente="${email}" class="text-red-600 hover:text-red-900 eliminar font-bold">Eliminar</a>
                                          </td>
                                        </tr>
                                      `; 
              //Para que los vaya mostrando
              cursor.continue();
          }
      }
}

function eliminarCliente(e){
  if(e.target.classList.contains('eliminar')){
      //Lee el correo que es el valor principal de donde hacemos click
      const emailCliente = e.target.dataset.cliente
      console.log(emailCliente)
      const transaction = db.transaction(['clientes'],'readwrite')
      const objectStore = transaction.objectStore('clientes')
      objectStore.delete(emailCliente)
      transaction.onerror = function(){
          imprimirAlerta('Hubo un error!')
      }
      transaction.oncomplete = function(){
        //Refrescamos...
        mostrarClientes();
      }

  }
}
