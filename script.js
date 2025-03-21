const inputTask = document.querySelector(".todo-input")
const todoList = document.querySelector(".todo-list")
const tasksLeft = document.querySelector(".tasks-left")
const themeToggle = document.querySelector(".theme-toggle")
const filterButtons = document.querySelectorAll(".filter-btn")
const clearButton = document.querySelector(".clear-completed")

// Check for saved theme preference or default to light
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode")
}

// Update task count
function updateTaskCount() {
  const activeTasks = document.querySelectorAll(".todo-item:not(.completed)").length
  tasksLeft.textContent = activeTasks
}

// Add new task
inputTask.addEventListener("keypress", (event) => {
if (event.key === "Enter" && inputTask.value.trim() !== "") {
    // Create task item
    const taskItem = document.createElement("li")
    taskItem.classList.add("todo-item")

    // Create circle
    const circle = document.createElement("span")
    circle.classList.add("task-circle")

    // Create task text
    const taskText = document.createElement("span")
    taskText.textContent = inputTask.value

    // Append elements
    taskItem.appendChild(circle)
    taskItem.appendChild(taskText)
    todoList.appendChild(taskItem)

    // Add event listener to circle
    circle.addEventListener("click", () => {
      taskItem.classList.toggle("completed")
      circle.classList.toggle("completed")
      updateTaskCount()
    })

    // Add event listener to task text
    taskItem.addEventListener("click", (e) => {
      if (e.target !== circle) {
        circle.click()
      }
    })

    // Clear input
    inputTask.value = ""
    updateTaskCount()

    // Apply current filter
    const activeFilter = document.querySelector(".filter-btn.active")
    if (activeFilter) {
      filterTasks(activeFilter.getAttribute("data-filter"))
    }
  }
})

// Toggle dark mode
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode")
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"))
})

// Filter tasks
function filterTasks(filter) {
  const todos = document.querySelectorAll(".todo-item")

  todos.forEach((todo) => {
    if (filter === "all") {
      todo.style.display = "flex"
    } else if (filter === "active") {
      todo.style.display = todo.classList.contains("completed") ? "none" : "flex"
    } else if (filter === "completed") {
      todo.style.display = todo.classList.contains("completed") ? "flex" : "none"
    }
  })
}

// Filter button click
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons
    filterButtons.forEach((btn) => btn.classList.remove("active"))

    // Add active class to clicked button
    button.classList.add("active")

    // Apply filter
    const filter = button.getAttribute("data-filter")
    filterTasks(filter)
  })
})

// Clear completed tasks
clearButton.addEventListener("click", () => {
  const completedTasks = document.querySelectorAll(".todo-item.completed")
  completedTasks.forEach((task) => task.remove())
  updateTaskCount()
})

// Initialize task count
updateTaskCount()

// Make tasks draggable (basic implementation)
let draggedItem = null

document.addEventListener("dragstart", (e) => {
  if (e.target.classList.contains("todo-item")) {
    draggedItem = e.target
    e.target.style.opacity = "0.5"
  }
})

document.addEventListener("dragend", (e) => {
  if (e.target.classList.contains("todo-item")) {
    e.target.style.opacity = "1"
  }
})

todoList.addEventListener("dragover", (e) => {
  e.preventDefault()
  const afterElement = getDragAfterElement(todoList, e.clientY)
  if (draggedItem) {
    if (afterElement == null) {
      todoList.appendChild(draggedItem)
    } else {
      todoList.insertBefore(draggedItem, afterElement)
    }
  }
})

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll(".todo-item:not(.dragging)")]

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect()
      const offset = y - box.top - box.height / 2

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child }
      } else {
        return closest
      }
    },
    { offset: Number.NEGATIVE_INFINITY },
  ).element
}

// Make todo items draggable
function makeItemsDraggable() {
  document.querySelectorAll(".todo-item").forEach((item) => {
    item.setAttribute("draggable", "true")
  })
}

// Initial setup
makeItemsDraggable()

// Make new items draggable when added
const originalAppendChild = todoList.appendChild
todoList.appendChild = function (node) {
  const result = originalAppendChild.call(this, node)
  if (node.classList && node.classList.contains("todo-item")) {
    node.setAttribute("draggable", "true")
  }
  return result
}

