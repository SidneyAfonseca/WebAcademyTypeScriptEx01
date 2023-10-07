"use strict";
// Classe para gerenciar a lista de tarefas
class ToDoList {
    constructor() {
        this.tasks = [];
        this.currentIndex = -1;
        this.loadTasksFromStorage();
        this.renderTaskList();
        this.setupEventListeners();
    }
    // Adicionar um tarefa à lista
    addTask(title, dueDate, description) {
        const insertDate = new Date();
        const done = false;
        const task = [title, description, dueDate, insertDate, done];
        this.tasks.push(task);
        this.saveTasksToStorage();
        this.renderTaskList();
    }
    //Popular os campos para edição
    fillInputs(index) {
        const titleInput = document.getElementById("title");
        const dueDateInput = document.getElementById("dueDate");
        const descriptionInput = document.getElementById("description");
        const addBtn = document.getElementById("addBtn");
        const taskIndex = index;
        if (taskIndex !== -1) {
            titleInput.value = this.tasks[taskIndex][0];
            descriptionInput.value = this.tasks[taskIndex][1];
            dueDateInput.value = new Date(this.tasks[taskIndex][2]).toISOString().substring(0, 10);
            addBtn.innerHTML = "Editar";
        }
    }
    //Editar uma task com base no index
    editTask(title, dueDate, description) {
        const task = this.tasks[this.currentIndex];
        console.log(title, dueDate, description);
        console.log(task);
        task[0] = title;
        task[1] = description;
        task[2] = dueDate;
        task[4] = false;
        this.tasks.splice(this.currentIndex, 1, task);
        this.saveTasksToStorage();
        this.renderTaskList();
        this.currentIndex = -1;
    }
    // Marcar uma task como concluída com base no titulo
    checkTask(title) {
        const task = this.tasks.find((task) => task[0] === title);
        if (task) {
            task[4] = true;
        }
        this.saveTasksToStorage();
        this.renderTaskList();
    }
    // Remover uma task com base no título
    removeTask(title) {
        const taskIndex = this.tasks.findIndex((task) => task[0] === title);
        if (taskIndex !== -1) {
            this.tasks.splice(taskIndex, 1);
            this.saveTasksToStorage();
            this.renderTaskList();
        }
        else {
            console.log(`Tarefa com o título '${title}' não encontrado.`);
        }
    }
    // Listar todas as tasks
    renderTaskList() {
        const taskList = document.getElementById("taskList");
        if (!taskList)
            return;
        taskList.innerHTML = "";
        this.tasks.forEach((task, index) => {
            const listItem = document.createElement("li");
            const titleClass = task[4] ? "line-through" : "";
            listItem.innerHTML = `
        <strong id="title-${task[0]}" class="${titleClass}">${task[0]}</strong> (${formatDate(new Date(task[3]), true)})<br>
        <strong>Data Limite: </strong>${formatDate(new Date(task[2]), false)}<br>
        <p><strong>Descrição: </strong>${task[1]}</p>
        <button class="button-check" id="check-${task[0]}" onclick="checkTask(${index})">Concluir</button>
        <button class="button-edit" onclick="editTask(${index})">Editar</button>
        <button class="button-remove"onclick="removeTask(${index})">Remover</button>
      `;
            taskList.appendChild(listItem);
        });
    }
    // Salvar tasks no armazenamento local
    saveTasksToStorage() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }
    // Carregar tasks do armazenamento local
    loadTasksFromStorage() {
        const tasksJson = localStorage.getItem("tasks");
        if (tasksJson) {
            this.tasks = JSON.parse(tasksJson);
        }
    }
    // Configurar os ouvintes de eventos
    setupEventListeners() {
        const addBtn = document.getElementById("addBtn");
        console.log(addBtn);
        if (addBtn) {
            addBtn.addEventListener("click", () => {
                const titleInput = document.getElementById("title");
                const dueDateInput = document.getElementById("dueDate");
                const descriptionInput = document.getElementById("description");
                const title = titleInput.value;
                const dueDate = new Date(dueDateInput.value);
                const description = descriptionInput.value;
                if (addBtn.innerHTML === "Adicionar") {
                    console.log(title && description && !isNaN(Date.parse(dueDateInput.value)));
                    console.log(!isNaN(Date.parse(dueDateInput.value)));
                    if (title && description && !isNaN(Date.parse(dueDateInput.value))) {
                        this.addTask(title, dueDate, description);
                        titleInput.value = "";
                        dueDateInput.value = "";
                        descriptionInput.value = "";
                    }
                    else {
                        alert("Por favor, preencha todos os campos.");
                    }
                }
                else {
                    this.editTask(title, dueDate, description);
                   
                }
            });
        }
    }
}
// Função para remover um lembrete
function removeTask(index) {
    const task = toDoList.tasks[index];
    if (task) {
        toDoList.removeTask(task[0]);
    }
}
function editTask(index) {
    toDoList.currentIndex = index;
    toDoList.fillInputs(index);
}
function checkTask(index) {
    const task = toDoList.tasks[index];
    if (task) {
        toDoList.checkTask(task[0]);
    }
}
function formatDate(date, showHour) {
    let hour = "";
    if (showHour) {
        hour = [
            (date.getHours()),
            (date.getMinutes()),
            ("0" + `${date.getSeconds()}`).slice(-2),
        ].join(':') + "hrs";
    }
    return ([
        ("0" + `${date.getDate()}`).slice(-2),
        ("0" + `${date.getMonth() + 1}`).slice(-2),
        date.getFullYear()
    ].join('/') +
        ' ' + hour);
}
// Inicializar a lista de tarefas
const toDoList = new ToDoList();
