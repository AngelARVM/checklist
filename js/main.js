// VARS --------------------------------------------------------
const formulario = document.getElementById('formulario')
const listaTarea = document.getElementById('lista-tareas')
const template = document.getElementById('template').content // es necesario acceder al contenido del template con .content
const fragment = document.createDocumentFragment()
let tareas = {}


//LISTENERS -----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    //Si existe algo guardado en el local storage del navegador, lo carga
    if(localStorage.getItem('tareas')){
        tareas = JSON.parse(localStorage.getItem('tareas'))
    }
    pintarTareas()
})

listaTarea.addEventListener('click', e =>{
    btnAccion(e)
})

formulario.addEventListener('submit', e => {
    e.preventDefault() // ignora el valor por defecto de html
    setTareas(e)
})


//FUNCTIONS -----------------------------------------------------

const setTareas = e => {
    /*  e.target toma formulario, [0] toma el input y .value toma el valor dentro de el
    *   Otras formas de realziar esto:
    *   e.target[0].value)
    *   e.target.querySelector('input')
    */

    //verificar que el input no esté vacio
    if (e.target[0].value.trim() === '') {
        e.target[0].value = ''
        e.target[0].focus()
        return
    }

    //crear un objeto con lo recibido desde el input y cargarlo al objeto principal
    const tarea = {
        id : Date.now(),
        texto : e.target[0].value,
        estado : false
    }

    tareas[tarea.id] = tarea
    e.target[0].value = ''
    e.target[0].focus()
    
    pintarTareas()
}

const pintarTareas = () => {
    // Guardar el objeto en el local storage del navegador
    localStorage.setItem('tareas', JSON.stringify(tareas))

    // Si el objeto esta vacio carga un div predeterminado
    if (Object.values(tareas).length === 0){
        listaTarea.innerHTML = `
        <div class="alert alert-dark text-center">
            No hay tareas ❤
        </div>
        `
        return
    }

    //Limpiar listaTarea
    listaTarea.innerHTML = ''

    //Llenar la lista html con el contenido del objeto tareas
    Object.values(tareas).forEach(tarea => {
        //Clonar el template (debe ir al principio)
        const clone = template.cloneNode(true)
        clone.querySelector('p').textContent = tarea.texto
        
        //Cambiar estilos si cambia el estado del objeto
        if(tarea.estado == true){
            clone.querySelector('.alert').classList.replace('alert-secondary', 'alert-dark')
            clone.querySelectorAll('.fas')[0].classList.replace('fa-check-circle', 'fa-undo-alt')
            clone.querySelector('p').style.textDecoration = 'line-through'
        }

        //1 por cada boton
        clone.querySelectorAll('.fas')[0].dataset.id = tarea.id
        clone.querySelectorAll('.fas')[1].dataset.id = tarea.id
        fragment.appendChild(clone) 
    })

    listaTarea.appendChild(fragment)
}

//Acciones asociadas a los botones
const btnAccion = e => {
    if (e.target.classList.contains('fa-check-circle')){
        tareas[e.target.dataset.id].estado = true
        pintarTareas()
    }

    if (e.target.classList.contains('fa-minus-circle')){
        delete tareas[e.target.dataset.id]
        pintarTareas()
    }

    if (e.target.classList.contains('fa-undo-alt')){
        tareas[e.target.dataset.id].estado = false
        pintarTareas()
    }
    
    //Evitar que se activen los demas eventos.
    e.stopPropagation()
}