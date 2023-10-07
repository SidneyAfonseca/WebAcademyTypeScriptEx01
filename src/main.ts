//Tupla para definir uma tarefa como solicitado nas aulas de typescript
type Task = [string,string, Date, Date, boolean] ;

// Classe para gerenciar a lista de tarefas
class ToDoList {
  public tasks: Task[] = [];
  public currentIndex: number = -1;

  constructor() {
    this.loadTasksFromStorage();
    this.renderTaskList();
    this.setupEventListeners();
  }

  // Adicionar um tarefa à lista
  addTask(title: string, dueDate: Date, description: string): void {
    const insertDate = new Date();
    const done = false;
    const task: Task = [title, description, dueDate, insertDate, done];
     
    this.tasks.push(task);
    this.saveTasksToStorage();
    this.renderTaskList();   

  }

  //Popular os campos para edição
  fillInputs(index:number): void { 
    const titleInput = document.getElementById("title") as HTMLInputElement;
    const dueDateInput = document.getElementById("dueDate") as HTMLInputElement;
    const descriptionInput = document.getElementById("description") as HTMLInputElement;
    const addBtn = document.getElementById("addBtn") as HTMLButtonElement;
    const taskIndex = index;


    if(taskIndex !== -1){
      titleInput.value = this.tasks[taskIndex][0];
      descriptionInput.value = this.tasks[taskIndex][1];
      dueDateInput.value = new Date(this.tasks[taskIndex][2]).toISOString().substring(0,10);
      addBtn.innerHTML = "Editar";
    }

  }
//Editar uma task com base no index
  editTask(title: string, dueDate: Date, description: string){
    const task = this.tasks[this.currentIndex];
    console.log(title, dueDate, description)
    console.log(task)
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
  checkTask(title:string): void { 
    const task = this.tasks.find((task) => task[0] === title);
    if(task){
      task[4] = true;
    }   
    this.saveTasksToStorage();
    this.renderTaskList();
  }

  // Remover uma task com base no título
  removeTask(title: string): void {
    const taskIndex = this.tasks.findIndex((task) => task[0] === title);

    if (taskIndex !== -1) {
      this.tasks.splice(taskIndex, 1);
      this.saveTasksToStorage();
      this.renderTaskList();
    } else {
      console.log(`Tarefa com o título '${title}' não encontrado.`);
    }
  }

  // Listar todas as tasks
  renderTaskList(): void {
    const taskList = document.getElementById("taskList");
    if (!taskList) return;

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
  saveTasksToStorage(): void {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }
  // Carregar tasks do armazenamento local
  loadTasksFromStorage(): void {
    const tasksJson = localStorage.getItem("tasks");
    if (tasksJson) {
      this.tasks = JSON.parse(tasksJson);
    }
  }
  // Configurar os ouvintes de eventos
  setupEventListeners(): void {
    const addBtn = document.getElementById("addBtn") as HTMLButtonElement;

    console.log(addBtn)

    if (addBtn) {
      addBtn.addEventListener("click", () => {
        const titleInput = document.getElementById("title") as HTMLInputElement;
        const dueDateInput = document.getElementById("dueDate") as HTMLInputElement;
        const descriptionInput = document.getElementById("description") as HTMLInputElement;
        const title = titleInput.value;
        const dueDate = new Date(dueDateInput.value);
        const description = descriptionInput.value;
        if(addBtn.innerHTML === "Adicionar"){

          console.log(title &&  description && !isNaN(Date.parse(dueDateInput.value)))
          console.log(!isNaN(Date.parse(dueDateInput.value)))
          if (title &&  description && !isNaN(Date.parse(dueDateInput.value))) {
            this.addTask(title, dueDate, description);
  
            titleInput.value = "";
            dueDateInput.value = "";
            descriptionInput.value = "";
          } else {
            alert("Por favor, preencha todos os campos.");
          }

        }else{
          this.editTask(title, dueDate, description)
        }

      });
    }
  }
}
// Função para remover um lembrete
function removeTask(index: number): void {
  const task = toDoList.tasks[index];
  if (task) {
    toDoList.removeTask(task[0]);
  }
}

function editTask(index:number) : void{
  toDoList.currentIndex = index;
  toDoList.fillInputs(index);  
}

function checkTask(index: number) : void{
  const task = toDoList.tasks[index];
  if (task) {
    toDoList.checkTask(task[0]);
  }
}

function formatDate(date: Date, showHour: boolean) {
  let hour:string = ""
  if(showHour){
    hour =     [
      (date.getHours()),
      (date.getMinutes()),
      ("0" + `${date.getSeconds()}`).slice(-2),
    ].join(':') + "hrs"
  }
  return (
    [
      ("0" + `${date.getDate()}`).slice(-2),
      ("0" + `${date.getMonth()+1}`).slice(-2),
      date.getFullYear()
    ].join('/') +
    ' ' + hour

  );
}
const toDoList = new ToDoList();
