const state = {
    taskList: []
}

// DOM
const taskContents = document.querySelector(".task_contents");
const taskModal = document.querySelector(".task_modal_body");

const htmlTaskContent = ({ id, title, description, type, url }) => `
<div class="col-md-6 col-lg-4 mt-3" id=${id} key=${id}>
    <div class="card shadow-sm task_card">
        <div class="card-header d-flex justify-content-end task_card_header gap-2">
            <button type="button" class="btn btn-outline-primary mr-2" name=${id} onclick="editTask.apply()this,argument">
                <i class="fas fa-pencil-alt" name=${id}></i>
            </button>
            <button type="button" class="btn btn-outline-danger mr-2" name=${id} onclick="deleteTask(event)">
                <i class="fas fa-trash-alt" name=${id}></i>
            </button>
        </div>
        <div class="card-body">
            ${url ? `<img src=${url} alt="card image" class="card-img-top md-3 rounded-lg"/>`
                   : `<img src="https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg" alt="card image" class="card-img-top md-3 rounded-lg"/>`}
            <h4 class="card-title">${title}</h4>
            <p class="trim-3-lines-muted">${description}</p>
            <div class="tags text-white d-flex flex-wrap">
                <span class="badge text-bg-primary m-1">${type}</span>
            </div>
        </div>
        <div class="card-footer">
            <button type="button" class="btn btn-outline-primary float-right" data-toggle="modal" data-target="#showtask" id=${id} onclick="openTask(event)">Open task</button>
        </div>
    </div>
</div>
`;

const htmlModalContent = ({ id, title, description, url }) => {
    const date = new Date(parseInt(id));
    return `
    <div id=${id}>
        ${url ? `<img src=${url} alt="card image cap" class="img-fluid mb-3"/>` 
            : `<img src="https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg" alt="card image cap" class="img-fluid mb-3"/>`}
        <strong class="text-sm text-muted">Created on ${date.toDateString()}</strong>
        <h4>${title}</h4>
        <p>${description}</p>
    </div>
    `;
}

const updateLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify({
        tasks: state.taskList
    }));
}

const loadInitialData = () => {
    const localStorageCopy = JSON.parse(localStorage.getItem('tasks'));

    if (localStorageCopy) state.taskList = localStorageCopy.tasks;

    state.taskList.forEach((cardData) => {
        taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData));
    });
}

const handleSubmit = () => {
    const id = `${Date.now()}`;
    const input = {
        url: document.getElementById('imageURL').value,
        title: document.getElementById('TaskTitle').value,
        type: document.getElementById('TaskType').value,
        description: document.getElementById('taskDescription').value,
    }

    if (input.title === "" || input.description === "" || input.type === "")
        return alert("Please fill out the necessary details");

    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent({
        ...input,
        id,
    }));

    state.taskList.push({ ...input, id });
    updateLocalStorage();
}

const openTask = (e) => {
    const id = e.target.id;
    const getTask = state.taskList.find(task => task.id === id);
    if (getTask) {
        taskModal.innerHTML = htmlModalContent(getTask);
    }
}

const deleteTask = (e) => {
    const targetID = e.target.getAttribute("name");
    
    
    state.taskList = state.taskList.filter(({ id }) => id !== targetID);
    
    
    updateLocalStorage();
    
    
    const taskCard = document.getElementById(targetID);
    if (taskCard) {
        taskCard.remove();


        if(type == "BUTTON"){
            console.log(e.target.parentNode.parentNode.parentNode)
            return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode.parentNode)
        }

        return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode.parentNode.parentNode

        )   ;
    }
}

const editTask = (e) => {
  if(!e) e = window.event;

  const targetID = e.target.id;
  const type = e.target.tagName;

  let parentNode;
  let TaskTitle;
  let taskDescription;
  let TaskType;
  let submitButton;

  if(type==="BUTTON"){
    parentNode =e.target.parentNode.parentNode;
  } else{
    parentNode = e.target.parentNode.parentNode.parentNode
  }

  TaskTitle = parentNode.childNodes[5].childNodes[1];
  taskDescription = parentNode.childNodes[3].childNodes[5];
    TaskType = parentNode.childNodes[3].childNodes[7].childNodes[1];


    submitButton =parentNode.childNodes[5].childNodes[1]

    TaskTitle.setAttribute("contenteditable", "true");
    taskDescription.setAttribute("contenteditable", "true");
    TaskType.setAttribute("contenteditable", "true");


    submitButton.removeAttribute("data-bs-toggle");
    submitButton.removeAttribute("data-bs-target");
    submitButton.innerHTML = "Save Changes"; 

  }

const saveEdit = (e) => {
    if(!e) e = window.event;

    const targetID = e.target.id;
    const parentNode = e.target.parentNode.parentNode;
    // console.log(parentNode.childNodes)


    TaskTitle = parentNode.childNodes[5].childNodes[1];
  taskDescription = parentNode.childNodes[3].childNodes[5];
    TaskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    const submitButton = parentNode.childNodes[5].childNodes[1];

    const updateData = {
        TaskTitle: TaskTitle.innerHTML,
        taskDescription: taskDescription.innerHTML,
        TaskType: TaskType.innerHTML,
    };

    let  stateCopy = state.taskList;

    stateCopy = stateCopy.map((task) => task.id === targetID ? {
        id:task.id,
        title:updateData.TaskTitle,
        description: updateData.taskDescription, 
        type: updateData.TaskType,
        url: task.url
    } : task);


    state.taskList =  stateCopy;
    updateLocalStorage();

    TaskTitle.setAttribute("contenteditable", "false");
    taskDescription.setAttribute("contenteditable", "false");
    TaskType.setAttribute("contenteditable", "false");

    submitButton.setAttribute('onclick', "openTask.apply(this, arguments)");

    submitButton.removeAttribute("data-bs-toggle", "modal");
    submitButton.removeAttribute("data-bs-target", "#showTask");
    submitButton.innerHTML = "Open Task"; 

}


const searchTask = (e) => {
    if(!e) e = window.event;

    while(taskContents.firstChild){
        taskContents.removeChild(taskContents.firstChild)

    }

    const resultData = state.taskList.filter(({title}) =>

        title.includes(e.target.value))

        console.log(resultData);

        resultData.map((cardData)=>{
            taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData))
        })
    
   
}



