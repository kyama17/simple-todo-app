class TodoApp {
    constructor() {
        this.todos = this.loadTodos();
        this.currentFilter = 'all';
        this.initializeElements();
        this.bindEvents();
        this.render();
    }

    initializeElements() {
        this.todoInput = document.getElementById('todoInput');
        this.dueDateInput = document.getElementById('dueDateInput'); // Added
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.clearCompletedBtn = document.getElementById('clearCompleted');
        this.totalCount = document.getElementById('totalCount');
        this.activeCount = document.getElementById('activeCount');
        this.completedCount = document.getElementById('completedCount');
        this.themeToggleBtn = document.getElementById('themeToggleBtn'); 
        this.searchInput = document.getElementById('searchInput'); // Added
        this.currentTheme = localStorage.getItem('todoTheme') || 'light'; 
        this.applyTheme(this.currentTheme); 
        this.searchTerm = ''; // Added
    }

    bindEvents() {
        // 追加ボタンのクリックイベント
        this.addBtn.addEventListener('click', () => this.addTodo());
        
        // Enterキーでの追加
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });

        // フィルターボタンのクリックイベント
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // 完了済み削除ボタンのクリックイベント
        this.clearCompletedBtn.addEventListener('click', () => {
            this.clearCompleted();
        });

        // Theme toggle button event
        if (this.themeToggleBtn) {
            this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
        }

        // Search input event
        if (this.searchInput) {
            this.searchInput.addEventListener('input', () => {
                this.searchTerm = this.searchInput.value.toLowerCase().trim();
                this.render();
            });
        }
    }

    applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            if (this.themeToggleBtn) this.themeToggleBtn.textContent = '☀️';
        } else {
            document.body.classList.remove('dark-theme');
            if (this.themeToggleBtn) this.themeToggleBtn.textContent = '🌙';
        }
        this.currentTheme = theme;
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('todoTheme', newTheme);
        this.applyTheme(newTheme);
    }

    addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) {
            this.showMessage('タスクを入力してください');
            return;
        }

        const dueDateValue = this.dueDateInput.value;

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toLocaleString('ja-JP'),
            priority: 'medium', // Default priority for new todos
            dueDate: dueDateValue || null // Add dueDate
        };

        this.todos.unshift(todo);
        this.todoInput.value = '';
        this.dueDateInput.value = ''; // Clear due date input
        this.saveTodos();
        this.render();
        this.showMessage('タスクを追加しました');
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
        this.render();
        this.showMessage('タスクを削除しました');
    }

    toggleTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // アクティブなフィルターボタンを更新
        this.filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });

        this.render();
    }

    clearCompleted() {
        const completedCount = this.todos.filter(todo => todo.completed).length;
        if (completedCount === 0) {
            this.showMessage('完了済みのタスクがありません');
            return;
        }

        if (!confirm("本当に完了済みのタスクをすべて削除しますか？")) {
            return; // If user clicks 'Cancel', do nothing and exit the function.
        }

        this.todos = this.todos.filter(todo => !todo.completed);
        this.saveTodos();
        this.render();
        this.showMessage(`${completedCount}件の完了済みタスクを削除しました`);
    }

    getFilteredTodos() {
        let statusFilteredTodos;
        switch (this.currentFilter) {
            case 'active':
                statusFilteredTodos = this.todos.filter(todo => !todo.completed);
                break;
            case 'completed':
                statusFilteredTodos = this.todos.filter(todo => todo.completed);
                break;
            default:
                statusFilteredTodos = [...this.todos]; // Operate on a copy
                break;
        }

        if (this.searchTerm) {
            return statusFilteredTodos.filter(todo => 
                todo.text.toLowerCase().includes(this.searchTerm)
            );
        }
        return statusFilteredTodos;
    }

    render() {
        const filteredTodos = this.getFilteredTodos();
        
        // Todoリストの描画
        this.todoList.innerHTML = '';
        
        if (filteredTodos.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.className = 'todo-item';
            emptyMessage.innerHTML = `
                <div style="text-align: center; width: 100%; color: #999; font-style: italic;">
                    ${this.getEmptyMessage()}
                </div>
            `;
            this.todoList.appendChild(emptyMessage);
        } else {
            filteredTodos.forEach((todo, index) => { // Pass index and filteredTodos
                const todoItem = this.createTodoElement(todo, index, filteredTodos);
                this.todoList.appendChild(todoItem);
            });
        }

        // 統計の更新
        this.updateStats();
        
        // 完了済み削除ボタンの状態更新
        const hasCompleted = this.todos.some(todo => todo.completed);
        this.clearCompletedBtn.disabled = !hasCompleted;
    }

    createTodoElement(todo, index, filteredList) { // Added index and filteredList
        const li = document.createElement('li');
        let liClass = `todo-item ${todo.completed ? 'completed' : ''} priority-${todo.priority}`;

        // Visual reminders for due dates
        if (todo.dueDate && !todo.completed) {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalize today to start of day
            const dueDate = new Date(todo.dueDate);
            dueDate.setHours(0, 0, 0, 0); // Normalize due date

            const diffTime = dueDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 0) {
                liClass += ' overdue';
            } else if (diffDays <= 1) { // Today or tomorrow
                liClass += ' due-soon';
            }
        }
        li.className = liClass;
        
        const prioritySelectorHtml = `
            <select class="priority-selector" data-id="${todo.id}">
                <option value="low" ${todo.priority === 'low' ? 'selected' : ''}>低</option>
                <option value="medium" ${todo.priority === 'medium' ? 'selected' : ''}>中</option>
                <option value="high" ${todo.priority === 'high' ? 'selected' : ''}>高</option>
            </select>
        `;

        let dueDateHtml = '';
        if (todo.dueDate) {
            const formattedDueDate = new Date(todo.dueDate).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
            dueDateHtml = `<span class="task-due-date">(期日: ${formattedDueDate})</span>`;
        }

        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text">${this.escapeHtml(todo.text)}</span>
            ${prioritySelectorHtml}
            <span class="todo-date">${todo.createdAt}</span>
            ${dueDateHtml}
            <div class="todo-actions">
                <button class="move-up-btn" title="上に移動">↑</button>
                <button class="move-down-btn" title="下に移動">↓</button>
                <button class="edit-btn">編集</button>
                <button class="delete-btn">削除</button>
            </div>
        `;

        // チェックボックスのイベント
        const checkbox = li.querySelector('.todo-checkbox');
        checkbox.addEventListener('change', () => {
            this.toggleTodo(todo.id);
        });

        // 削除ボタンのイベント
        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            this.deleteTodo(todo.id);
        });

        //編集ボタンのイベント
        const editBtn = li.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => {
            this.switchToEditMode(li, todo);
        });

        // Priority selector event
        const prioritySelector = li.querySelector('.priority-selector');
        prioritySelector.addEventListener('change', (e) => {
            this.changePriority(todo.id, e.target.value);
        });

        // Move buttons events and state
        const moveUpBtn = li.querySelector('.move-up-btn');
        const moveDownBtn = li.querySelector('.move-down-btn');

        if (index === 0) {
            moveUpBtn.disabled = true;
        }
        if (index === filteredList.length - 1) {
            moveDownBtn.disabled = true;
        }

        moveUpBtn.addEventListener('click', () => {
            this.moveTask(todo.id, 'up');
        });

        moveDownBtn.addEventListener('click', () => {
            this.moveTask(todo.id, 'down');
        });

        return li;
    }

    switchToEditMode(listItem, todo) {
        const textSpan = listItem.querySelector('.todo-text');
        const currentText = todo.text;
        const currentDueDate = todo.dueDate || '';

        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.className = 'edit-input';
        textInput.value = currentText;
        textInput.maxLength = 100;

        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.className = 'edit-due-date-input';
        dateInput.value = currentDueDate;

        const saveBtn = document.createElement('button');
        saveBtn.className = 'save-btn';
        saveBtn.textContent = '保存';

        // Create a container for inputs
        const inputContainer = document.createElement('div');
        inputContainer.className = 'edit-input-container';
        inputContainer.appendChild(textInput);
        inputContainer.appendChild(dateInput);

        textSpan.replaceWith(inputContainer);
        textInput.focus();

        const saveChanges = () => {
            const newText = textInput.value.trim();
            const newDueDate = dateInput.value || null;

            if (!newText) {
                this.showMessage('タスク内容は空にできません。');
                this.render(); // Revert if text is empty
                return;
            }
            // Check if anything actually changed
            if (newText !== currentText || newDueDate !== currentDueDate) {
                this.editTodo(todo.id, newText, newDueDate);
            } else {
                this.render(); // Revert if nothing changed
            }
        };

        // Save on Enter in text input
        textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveChanges();
            }
        });
        
        // Save on Enter in date input (less common but good to have)
        dateInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveChanges();
            }
        });

        // Handle blur - this logic becomes a bit more complex with multiple inputs
        // A simpler approach for now: blur on either input outside the container might revert
        const inputs = [textInput, dateInput];
        inputs.forEach(inputField => {
            inputField.addEventListener('blur', (e) => {
                // Delay to allow save button click
                setTimeout(() => {
                    // If focus moves to an element not part of the edit (e.g. not save button, not the other input)
                    if (!inputContainer.contains(document.activeElement) && !saveBtn.contains(document.activeElement)) {
                        // Check if relatedTarget is null (focus left window) or not part of the edit form
                        if (e.relatedTarget === null || (!inputContainer.contains(e.relatedTarget) && e.relatedTarget !== saveBtn)) {
                           this.render(); // Revert
                        }
                    }
                }, 100);
            });
        });
        
        saveBtn.addEventListener('click', saveChanges);

        const editBtn = listItem.querySelector('.edit-btn');
        if (editBtn) {
            editBtn.style.display = 'none';
        }
        // Insert save button after the input container
        inputContainer.insertAdjacentElement('afterend', saveBtn);
    }

    editTodo(id, newText, newDueDate) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.text = newText;
            todo.dueDate = newDueDate; // Update due date
            this.saveTodos();
            this.render();
            this.showMessage('タスクを更新しました');
        }
    }

    moveTask(id, direction) {
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index === -1) return;

        if (direction === 'up' && index > 0) {
            // Swap with previous element
            [this.todos[index - 1], this.todos[index]] = [this.todos[index], this.todos[index - 1]];
        } else if (direction === 'down' && index < this.todos.length - 1) {
            // Swap with next element
            [this.todos[index + 1], this.todos[index]] = [this.todos[index], this.todos[index + 1]];
        } else {
            return; // Invalid move
        }

        this.saveTodos();
        this.render();
    }

    changePriority(id, newPriority) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo && ['low', 'medium', 'high'].includes(newPriority)) {
            todo.priority = newPriority;
            this.saveTodos();
            this.render();
            this.showMessage(`タスクの優先度を「${this.priorityToJapanese(newPriority)}」に変更しました`);
        }
    }

    priorityToJapanese(priority) {
        switch (priority) {
            case 'low': return '低';
            case 'medium': return '中';
            case 'high': return '高';
            default: return '';
        }
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(todo => todo.completed).length;
        const active = total - completed;

        this.totalCount.textContent = total;
        this.activeCount.textContent = active;
        this.completedCount.textContent = completed;
    }

    getEmptyMessage() {
        if (this.searchTerm && this.searchInput && this.searchInput.value.trim() !== '') {
            // Ensure searchInput value is also checked to differentiate from empty search triggering this
            return `「${this.escapeHtml(this.searchInput.value)}」に一致するタスクはありません`;
        }
        switch (this.currentFilter) {
            case 'active':
                return '未完了のタスクがありません';
            case 'completed':
                return '完了済みのタスクがありません';
            default:
                return 'タスクがありません。新しいタスクを追加してください。';
        }
    }

    showMessage(message) {
        // 簡単なメッセージ表示（実際のアプリではtoastライブラリなどを使用）
        console.log(message);
        
        // 一時的なメッセージ表示
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 12px 20px;
            border-radius: 5px;
            z-index: 1000;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    loadTodos() {
        const saved = localStorage.getItem('todos');
        const todos = saved ? JSON.parse(saved) : [];
        // Add default priority and ensure dueDate exists (as null if not present)
        return todos.map(todo => {
            const updatedTodo = { ...todo };
            if (!updatedTodo.priority) {
                updatedTodo.priority = 'medium';
            }
            if (typeof updatedTodo.dueDate === 'undefined') {
                updatedTodo.dueDate = null;
            }
            return updatedTodo;
        });
    }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});

// サービスワーカーの登録（オフライン対応）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}