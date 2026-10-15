const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");

const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

// Load saved tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// Add Task
addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});


function addTask() {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(task);

    // Save task
    saveTasks();

    taskInput.value = "";

    displayTasks();
}


// Display Tasks
function displayTasks() {

    pendingTasks.innerHTML = "";
    completedTasks.innerHTML = "";

    const pending = tasks.filter(task => !task.completed);
    const completed = tasks.filter(task => task.completed);

    pendingCount.textContent = pending.length;
    completedCount.textContent = completed.length;


    // Pending Tasks
    if (pending.length === 0) {

        pendingTasks.innerHTML =
            '<li class="empty-message">No pending tasks 🎉</li>';

    } else {

        pending.forEach(task => {
            createTaskElement(task, pendingTasks);
        });
    }


    // Completed Tasks
    if (completed.length === 0) {

        completedTasks.innerHTML =
            '<li class="empty-message">No completed tasks yet.</li>';

    } else {

        completed.forEach(task => {
            createTaskElement(task, completedTasks);
        });
    }
}


// Create Task
function createTaskElement(task, list) {

    const li = document.createElement("li");

    li.innerHTML = `
        <span>${task.text}</span>

        <div class="task-buttons">

            ${
                !task.completed
                ? `<button class="complete-btn" onclick="completeTask(${task.id})">✓</button>`
                : ""
            }

            <button class="edit-btn" onclick="editTask(${task.id})">✎</button>

            <button class="delete-btn" onclick="deleteTask(${task.id})">🗑</button>

        </div>
    `;

    list.appendChild(li);
}


// Complete Task
function completeTask(id) {

    const task = tasks.find(task => task.id === id);

    if (task) {
        task.completed = true;
    }

    saveTasks();
    displayTasks();
}


// Edit Task
function editTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    const newText = prompt("Edit your task:", task.text);

    if (newText !== null && newText.trim() !== "") {
        task.text = newText.trim();
    }

    saveTasks();
    displayTasks();
}


// Delete Task
function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    displayTasks();
}


// Save Tasks to Local Storage
function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}


// Show saved tasks when page opens
displayTasks();