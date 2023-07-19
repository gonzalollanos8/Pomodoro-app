//agregar tareas para almacenar
const tasks= [];

//TIMER
let time = 0
let timer = null;
let timerBreak = null;
let current = null; 


const bAdd = document.querySelector("#bAdd"); //añadir tarea

const itTask = document.querySelector("#itTask"); //esta tarea

const form = document.querySelector("#form"); //formulario

const taskName = document.querySelector('#time #taskName');//Timer 

//-------------------------EVENTOS--------------------------

//cuando se presiona el boton de submit
form.addEventListener('submit', e =>{
    e.preventDefault();//se anula el envio para poder validar (funcionamiento nativo)
    if(itTask.value !== '' ){
        createTask(itTask.value);
        itTask.value = '';
        renderTasks()
    }
});


//~~~~~~~~~~~~~MOSTRAR RELOJ~~~~~~~~~~~~~~

renderTime()

renderTasks()


//-------------------------FUNCIONES--------------------------

//crear tarea
function createTask(value){

    const newTask = {
        id: (Math.random()*100).toString(36).slice(3), //creamo num random
        title:value,
        complete:false
    };
    tasks.unshift(newTask); //unshift:agrega un elemento. En este caso suma una tarea.
};

//renderizar la tarea en pantalla
function renderTasks(){
    const html = tasks.map(task =>{
        return `
        <div class="task">
            <div class="completed">${task.completed ? `<box-icon class='check' name='check' animation='tada' ></box-icon>`: `<box-icon name='play-circle' class='start-button' data-id="${task.id}" ></box-icon>`}</div>
            <div class="title">${task.title}</div>
        </div>
        `;
    });

    const tasksContainer = document.querySelector('#tasks');
    tasksContainer.innerHTML = html.join(''); //join une el array y lo carga al html
    const startButtons = document.querySelectorAll('.task .start-button');

    startButtons.forEach(button =>{
        button.addEventListener('click', e => {
            if(!timer){
                const id = button.getAttribute('data-id');
                startButtonHandler(id);
                button.textContent= "In progress...";
            }
        });
    });
}

function startButtonHandler(id) {
    //time= 25*60;
    time= 5;
    current= id;
    const taskIndex = tasks.findIndex((task) => task.id === id);

    taskName.textContent = tasks[taskIndex].title;
    renderTime() // para mostrar el primer elemento (numero de la cuenta regresiva)
    timer= setInterval(() =>{
        timerHandler(id);
    },1000);
}

function timerHandler(id){
    time--;
    renderTime();

    if(time === 0){
        clearInterval(timer);
        markCompleted(id)
        timer = null;
        renderTasks();
        startBreak()
    }
}

//--------------------RENDER DE RELOJ--------
function renderTime(){
    const timeDiv = document.querySelector('#time #value');
    const minutes = parseInt(time / 60);
    const seconds = parseInt(time % 60);

    timeDiv.textContent = `${minutes < 10 ? '0' : ""}${minutes}:${seconds < 10 ? '0' : ""}${seconds}`;
}

//--------------MARCAR TAREA COMO COMPLETADA-----------
function markCompleted(id) {
    const taskIndex = tasks.findIndex ((task)=> task.id === id)
    tasks[taskIndex].completed = true;

}
//--------------COMENZAR DESCANSO-----------
function startBreak(){
    //time= 5*60;
    time= 5;
    taskName.textContent = 'Break';
    renderTime();
    timerBreak = setInterval(()=>{
        timerBreakHandler()
    },1000)
}

function timerBreakHandler() {
    time--;
    renderTime();

    if(time === 0){
        clearInterval(timerBreak);
        current = null;
        taskName.textContent= '';
        timerBreak = null 
        renderTasks();
    }
}