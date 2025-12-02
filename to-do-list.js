// select DOM element 
const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');

// try to load saved todos from local storage (if any)
const saved = localStorage.getItem('todos');
const todos = saved ? JSON.parse(saved) : [];

function saveTodos() {
  // save current todo array to localStorage
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Create a dom node for todo object and append it to the list
function createTodoNode(todo, index) {
  const li = document.createElement('li');

  // checkbox to toggle completion
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = !!todo.completed;

  // text of the todo
  const textSpan = document.createElement('span');
  textSpan.textContent = todo.text;
  textSpan.style.margin = '0 8px';
  if (todo.completed) {
    textSpan.style.textDecoration = 'line-through';
  }

  checkbox.addEventListener('change', () => {
    todo.completed = checkbox.checked;
    // visualize
    textSpan.style.textDecoration = todo.completed ? 'line-through' : '';
    saveTodos();
    // no need to re-render the whole list unless you want to reorder items
  });

  // add double click event listener to edit todo
  textSpan.addEventListener('dblclick', () => {
    const newText = prompt('Edit todo', todo.text);
    if (newText !== null) {
      todo.text = newText.trim();
      textSpan.textContent = todo.text;
      saveTodos();
    }
  });

  // add delete button (use <button>, not <delete>)
  const delBtn = document.createElement('button');
  delBtn.textContent = 'Delete';
  delBtn.addEventListener('click', () => {
    todos.splice(index, 1);
    saveTodos();
    render();
  });

  li.appendChild(checkbox);
  li.appendChild(textSpan);
  li.appendChild(delBtn);
  return li;
}

// render the whole todo list from todos array
function render() {
  list.innerHTML = '';

  // recreate each item 
  todos.forEach((todo, index) => {
    const node = createTodoNode(todo, index);
    list.appendChild(node);
  });
}

function addTodo() {
  const text = input.value.trim();
  if (!text) return;

  // push a new todo object
  todos.push({ text, completed: false });
  input.value = '';
  saveTodos();
  render();
}

// single event listeners (no duplicates)
addBtn.addEventListener('click', addTodo);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});

// initial render
render();
