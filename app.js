window.addEventListener('load', () => {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    const nameInput = document.querySelector('#name');
    const newTodoForm = document.querySelector('#new-todo-form');
    const filterButtons = document.querySelectorAll('.filters button');

    const username = localStorage.getItem('username') || '';
    nameInput.value = username;

    nameInput.addEventListener('change', e => {
        localStorage.setItem('username', e.target.value);
    });

    newTodoForm.addEventListener('submit', e => {
        e.preventDefault();

        const todo = {
            content: e.target.elements.content.value,
            category: e.target.elements.category.value,
            done: false,
            createdAt: new Date().getTime()
        };

        todos.push(todo);
        localStorage.setItem('todos', JSON.stringify(todos));
        e.target.reset();

        displayTodos(todos);
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            let filteredTodos = todos;
            if (filter !== 'all') {
                filteredTodos = todos.filter(todo => todo.category === filter);
            }
            displayTodos(filteredTodos);
        });
    });

    displayTodos(todos);
});

function displayTodos(todos) {
    const todoList = document.querySelector('#todo-list');
    todoList.innerHTML = '';

    todos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');

        const label = document.createElement('label');
        const input = document.createElement('input');
        const span = document.createElement('span');
        const content = document.createElement('div');
        const actions = document.createElement('div');
        const editButton = document.createElement('button');
        const deleteButton = document.createElement('button');

        input.type = 'checkbox';
        input.checked = todo.done;
        span.classList.add('bubble', todo.category);

        content.classList.add('todo-content');
        actions.classList.add('actions');
        editButton.classList.add('edit');
        deleteButton.classList.add('delete');

        content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
        editButton.textContent = 'Edit';
        deleteButton.textContent = 'Delete';

        label.appendChild(input);
        label.appendChild(span);
        actions.appendChild(editButton);
        actions.appendChild(deleteButton);
        todoItem.appendChild(label);
        todoItem.appendChild(content);
        todoItem.appendChild(actions);

        todoList.appendChild(todoItem);

        if (todo.done) {
            todoItem.classList.add('done');
        }

        input.addEventListener('click', () => {
            todo.done = input.checked;
            localStorage.setItem('todos', JSON.stringify(todos));
            displayTodos(todos);
        });

        editButton.addEventListener('click', () => {
            const inputField = content.querySelector('input');
            inputField.removeAttribute('readonly');
            inputField.focus();
            inputField.addEventListener('blur', () => {
                inputField.setAttribute('readonly', true);
                todo.content = inputField.value;
                localStorage.setItem('todos', JSON.stringify(todos));
                displayTodos(todos);
            });
        });

        deleteButton.addEventListener('click', () => {
            todos = todos.filter(t => t !== todo);
            localStorage.setItem('todos', JSON.stringify(todos));
            displayTodos(todos);
        });
    });
}
