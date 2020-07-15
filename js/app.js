const formularioContactos = document.querySelector('#contacto'),
      listadoContactos = document.querySelector('#listado-contactos tbody');

eventListeners();

function eventListeners(){
    //Cuando el formulario de crear o editar se ejecuta
    formularioContactos.addEventListener('submit', leerFormulario);

    //listener para el boton eliminar
    if(listadoContactos){
        listadoContactos.addEventListener('click', eliminarContacto);
    }
}

function leerFormulario(e){
    e.preventDefault();
    
    const nombre = document.querySelector('#nombre').value,
          empresa = document.querySelector('#empresa').value,
          telefono = document.querySelector('#telefono').value,
          accion = document.querySelector('#accion').value;

    if(nombre === '' || empresa === '' || telefono === ''){
        mostrarNotificacion('Todos los Campos son Obligarotios', 'error');
    } else {
        //pasa la validacion
        const infoContacto = new FormData();
        infoContacto.append('nombre', nombre);
        infoContacto.append('empresa', empresa);
        infoContacto.append('telefono', telefono);
        infoContacto.append('accion', accion);

        //console.log(...infoContacto);

        if(accion === 'crear'){
            insertarBD(infoContacto);
        } else {
            const idRegistro = document.querySelector('#id').value;
            infoContacto.append('id', idRegistro);
            actualizarRegistro(infoContacto);
        }
    }
}

function insertarBD(data){
    //llamado a ajax

    //Crear el objeto
    const xhr = new XMLHttpRequest();

    //abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);

    //pasar los datos
    xhr.onload = function(){
        if(this.status === 200){
            
            const respuesta = JSON.parse(xhr.responseText);
            console.log(respuesta);

            //inserta nuevo elemento en la tabla
            const nuevoContacto = document.createElement('tr');

            nuevoContacto.innerHTML = `
                <td>${respuesta.datos.nombre}</td>
                <td>${respuesta.datos.empresa}</td>
                <td>${respuesta.datos.telefono}</td>
            `;

            //crear contenedor para los botones
            const contenedorAcciones = document.createElement('td');

            //crear el icono editar
            const iconoEditar = document.createElement('i');
            iconoEditar.classList.add('fas', 'fa-pen-square');

            //crea el enlace para editar
            const btnEditar = document.createElement('a');
            btnEditar.appendChild(iconoEditar);
            btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`;
            btnEditar.classList.add('btn', 'btn-editar');

            //agregarlo al padre
            contenedorAcciones.appendChild(btnEditar);

            //crear el icono de eliminar
            const iconoEliminar = document.createElement('i');
            iconoEliminar.classList.add('fas', 'fa-trash-alt');

            //crear el boton de eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.appendChild(iconoEliminar);
            btnEliminar.setAttribute('data-id', respuesta.datos.id_insertado);
            btnEliminar.classList.add('btn', 'btn-borrar');

            //agregarlo al padre
            contenedorAcciones.appendChild(btnEliminar);

            //Agregar elemento a la fila
            nuevoContacto.appendChild(contenedorAcciones);

            //Agregarlo con los contactos
            listadoContactos.appendChild(nuevoContacto);   

            //Resetear el formulario
            document.querySelector('form').reset();
            //mostrar la notificacion
            mostrarNotificacion('Contacto creado Correctamente', 'correcto');
        }
    }

    //enviar los datos
    xhr.send(data);
}

function actualizarRegistro(data){
    const xhr = new XMLHttpRequest();

    xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);

    xhr.onload = function(){
        if(this.status === 200){
            const respuesta = JSON.parse(xhr.responseText);

            if(respuesta.respuesta === 'correcto'){
                mostrarNotificacion('Contacto editado correctamente', 'correcto');
            } else {
                mostrarNotificacion('Hubo un error!', 'error');
            }

            setTimeout(() => {
                window.location.href = 'index.php';
            }, 3000);
        }
    }

    xhr.send(data);
}

function eliminarContacto(e){
    if(e.target.parentElement.classList.contains('btn-borrar')){
        const id = e.target.parentElement.getAttribute('data-id');
        
        //preguntar al usuario
        const respuesta = confirm('Estás seguro?');

        if(respuesta){
            //llamado Ajax
            //crear obteto
            const xhr = new XMLHttpRequest();
            //abrir la conexion
            xhr.open('GET', `inc/modelos/modelo-contactos.php?id=${id}&accion=borrar`, true);
            //leer la respuesta
            xhr.onload = function(){
                if (this.status === 200) {
                    const resultado = JSON.parse(xhr.responseText);

                    if(resultado.respuesta === 'correcto'){
                        //Eliminar registro deo DOM
                        e.target.parentElement.parentElement.parentElement.remove();
                        mostrarNotificacion('Contacto Eliminado', 'correcto');
                    } else {
                        mostrarNotificacion('Hubo un error...', 'error');
                    }
                }
            };
            //enviar la peticion
            xhr.send();
        } 

    }
}

function mostrarNotificacion(mensaje, clase){
    const notificacion = document.createElement('div');
    notificacion.classList.add(clase, 'notificacion', 'sombra');
    notificacion.textContent = mensaje;

    formularioContactos.insertBefore(notificacion, document.querySelector('form legend'));

    setTimeout(() => {
        notificacion.classList.add('visible');

        setTimeout(() => {
            notificacion.classList.remove('visible');
            setTimeout(() => {
                notificacion.remove();
            }, 500);
        }, 3000);
    }, 100);
}