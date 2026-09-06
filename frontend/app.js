const API_URL = "http://localhost:8000/todos";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");

// Fetch and render todos
async function loadTodos() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch todos");
    const todos = await res.json();
    renderTodos(todos);
  } catch (err) {
    console.error("Error loading todos:", err);
  }
}

function renderTodos(todos) {
  list.innerHTML = "";
  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = `todo-item ${todo.completed ? "completed" : ""}`;

    const left = document.createElement("div");
    left.className = "todo-item-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = Boolean(todo.completed);
    checkbox.onchange = () => toggleTodo(todo.id, !todo.completed);

    const span = document.createElement("span");
    span.textContent = todo.title;

    left.appendChild(checkbox);
    left.appendChild(span);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = "&times;";
    deleteBtn.onclick = () => deleteTodo(todo.id);

    li.appendChild(left);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

// Add new todo
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = input.value.trim();
  if (!title) return;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (res.ok) {
      input.value = "";
      loadTodos();
    }
  } catch (err) {
    console.error("Error adding todo:", err);
  }
});

// Toggle todo completion
async function toggleTodo(id, completed) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });
    if (res.ok) {
      loadTodos();
    }
  } catch (err) {
    console.error("Error toggling todo:", err);
  }
}

// Delete todo
async function deleteTodo(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      loadTodos();
    }
  } catch (err) {
    console.error("Error deleting todo:", err);
  }
}

// Initial load
loadTodos();
