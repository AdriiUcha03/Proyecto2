# IndexedDB

IndexedDB es un **API de bajo nivel** que nos ofrece en el propio cliente un sistema de  almacenamiento de datos no SQL(base de datos no relacional), estructurados en grandes cantidades, **Archivos y [BLOBS](https://developer.mozilla.org/en-US/docs/Web/API/Blob)**, para dicha busqueda utiliza índices para la búsqueda de los datos de alto rendimiento. 

También tenemos el DOM Storage, para el almacenamiento de cantidades pequeñas de datos, pero claro para grandes cantidades de datos no es una solución, para eso tenemos a IndexedDB.Este tiene las siguientes carácterisitcas:
- Almacena casi todo tipo de valores por calves, tipos de clave múltiple.
- Soporta transacciones para confiabilidad.
- Soporta consultas de rango por clave, e índices.
- Puede almacenar mucho mayor volumen de datos que localStorage(Visto en clase).

Vamos a ver unas instucciones para utilizar IndexedDB en JavaScript:
### Comporbar compatiblidad del navegador
A día de hoy casi todos son compatibles aun así, por si acaso es bueno comprobarlo utilizando la siguiente validación:


```
if (!window.indexedDB) {
    window.alert("Su navegador no soporta indexedDB.");
}
```

### Apertura de la base de datos:
Metemos el API en una variable para hacer un uso cómod de esta
```
const indexedDB = window.indexedDB;
```

Declaramos donde almacenaremos la instacia de la base de datos(lo que vamos haciendo), es la forma más cómoda de manejar la escucha de resultados.
```
let db;

//Creamos la conexion a la base de datos
const conexion = indexedDB.open("CRM",1);
```

- `nombre` --> Un string, nombre que le queramos dar a la base de datos.
- `version` --> Un entero positivo, predeterminado en 1.

Ahora este el open() puede generar 3 resultados **onsucces, onupgradeneeded o onerror**:

```
//Evento que se dispara cuando la base de datos se abré
conexion.onsuccess = () =>{
    db = conexion.result;
    console.log('Base de datos abierta');
};

//Evento que se dispara cuando la base de datos se crea o se actualiza
conexion.onupgradeneeded = (e) =>{
    db = e.target.result;
    console.log('Base de datos creada', db);
}

//Evento que se dispara cuando la base de datos no se puede abrir
conexion.onerror = (error) =>{
    console.log('Error ', error);
};
```

### Creacion de un almacen de datos

Una vez sabemos manejar los eventos inciales del IndexedDB, vamos a ver como agregar un almacen de datos u objeto(tabla para almacenar datos), esta agregación se debe realizar median el evento **onupgrandeneeded**:

```
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
```

Dentro de este creamos un `objectStore` que es lo que maneja la creación y edición de las tablas, y con `createIndex` desde el propio objectStore, agregamos los atributos a al almacen de objetos creado(tabla)

### Subir objetos al almacen de objetos

Para agregar datos al almacen de objetos tenemos que tener una sesión de la base abierta y utilizar `objectStore.add(objeto a agregar)`, es importante que el objeto tenga las mismas propiedades que el alamacen si no, dara error.

Este nos genera dos eventos de nuevo, **onsuccess y onerror**, con los que podemos generar mensajes para informar al usuario, ahora veremos un ejemplo del código utilizado en el programa.

**Ejemplo**
```
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
```

Lo que hacemos es agregar el objeto con los valore y si esta da error mostrarle un mensaje de error al cliente, si todo va bien este se agrega al almacen y muestra el mensaje de que se agrego con exito.

### Mostrar Datos de un almacen de objetos.
Para el muestreo de datos utilizamos cursores algo parecido a los que se utliza en SQL.
Abrimos un cursor con `objectStore.openCursor().onsuccess{ funcion a ejecutar }`, y ejecutamos la comprobación que queramos dentro y vamos recoriendo el cursor con `.continue()`, como si fuera un bucle.

**Ejemplo**
```
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
```

### Edición
La funcion no funciona correctamente en el programa no e podido testear la edicion bien
para entenderla y explicarla con mis palabras


### Eliminacion
La funcion no funciona correctamente en el programa no e podido testear la edicion bien
para entenderla y explicarla con mis palabras