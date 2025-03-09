// 获取DOM元素
const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodo');
const todoList = document.getElementById('todoList');
const todoCount = document.getElementById('todoCount');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filterBtns = document.querySelectorAll('.filter-btn');

// 初始化待办事项数组和过滤器
let todos = [];
let currentFilter = 'all';

// 从后端获取所有待办事项
async function fetchTodos() {
    try {
        const response = await fetch('http://localhost:5000/api/todos');
        todos = await response.json();
        updateTodoCount();
        renderTodos();
    } catch (error) {
        console.error('获取待办事项失败:', error);
    }
}

// 保存待办事项到后端
async function saveTodo(todo) {
    try {
        const response = await fetch('http://localhost:5000/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(todo)
        });
        return await response.json();
    } catch (error) {
        console.error('保存待办事项失败:', error);
        return null;
    }
}

// 更新待办事项
async function updateTodoInServer(todo) {
    try {
        await fetch(`http://localhost:5000/api/todos/${todo.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(todo)
        });
    } catch (error) {
        console.error('更新待办事项失败:', error);
    }
}

// 删除待办事项
async function deleteTodoFromServer(todoId) {
    try {
        await fetch(`http://localhost:5000/api/todos/${todoId}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error('删除待办事项失败:', error);
    }
}

// 更新待办事项计数
function updateTodoCount() {
    const activeCount = todos.filter(todo => !todo.completed).length;
    todoCount.textContent = `${activeCount} 个待办事项`;
}

// 创建待办事项元素
function createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''} priority-${todo.priority}`;
    li.innerHTML = `
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
        <div class="todo-content">
            <span class="todo-text">${todo.text}</span>
            <div class="todo-details">
                ${todo.due_date ? `<span class="todo-due-date">截止: ${new Date(todo.due_date).toLocaleDateString()}</span>` : ''}
                ${todo.category ? `<span class="todo-category">分类: ${todo.category}</span>` : ''}
                <span class="todo-priority">优先级: ${
                    {
                        'low': '低',
                        'medium': '中',
                        'high': '高'
                    }[todo.priority] || '中'
                }</span>
            </div>
        </div>
        <button class="delete-btn">删除</button>
    `;

    // 切换完成状态
    const checkbox = li.querySelector('.todo-checkbox');
    checkbox.addEventListener('change', async () => {
        todo.completed = checkbox.checked;
        li.classList.toggle('completed', todo.completed);
        await updateTodoInServer(todo);
        await fetchTodos();
    });

    // 删除待办事项
    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', async () => {
        await deleteTodoFromServer(todo.id);
        await fetchTodos();
    });

    return li;
}

// 渲染待办事项列表
function renderTodos() {
    todoList.innerHTML = '';
    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'active') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
        return true;
    });

    filteredTodos.forEach(todo => {
        todoList.appendChild(createTodoElement(todo));
    });
}

// 添加新的待办事项
async function addTodo() {
    const text = todoInput.value.trim();
    if (text) {
        const todo = {
            text,
            completed: false,
            priority: document.getElementById('priorityInput').value,
            due_date: document.getElementById('dueDateInput').value || null,
            category: document.getElementById('categoryInput').value || null
        };
        const savedTodo = await saveTodo(todo);
        if (savedTodo) {
            todoInput.value = '';
            document.getElementById('dueDateInput').value = '';
            document.getElementById('priorityInput').value = 'medium';
            document.getElementById('categoryInput').value = '';
            await fetchTodos();
        }
    }
}

// 清除已完成的待办事项
clearCompletedBtn.addEventListener('click', async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    for (const todo of completedTodos) {
        await deleteTodoFromServer(todo.id);
    }
    await fetchTodos();
});

// 切换过滤器
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTodos();
    });
});

// 添加待办事项的事件监听
addTodoBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

// 主题切换功能
const themeToggleBtn = document.getElementById('themeToggle');
const systemThemeBtn = document.getElementById('systemTheme');

async function updateTheme(isDark, followSystem) {
    try {
        await fetch('http://localhost:5000/api/theme', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dark_mode: isDark,
                follow_system: followSystem
            })
        });
        if (followSystem) {
            setTheme(checkSystemTheme());
        } else {
            setTheme(isDark);
        }
    } catch (error) {
        console.error('更新主题设置失败:', error);
    }
}

themeToggleBtn.addEventListener('click', async () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    await updateTheme(currentTheme !== 'dark', false);
});

systemThemeBtn.addEventListener('click', async () => {
    await updateTheme(false, true);
});

// 初始化数据和渲染
fetchTodos();