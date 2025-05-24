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
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.clearCompletedBtn = document.getElementById('clearCompleted');
        this.totalCount = document.getElementById('totalCount');
        this.activeCount = document.getElementById('activeCount');
        this.completedCount = document.getElementById('completedCount');
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
    }

    addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) {
            this.showMessage('タスクを入力してください');
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toLocaleString('ja-JP')
        };

        this.todos.unshift(todo);
        this.todoInput.value = '';
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

        this.todos = this.todos.filter(todo => !todo.completed);
        this.saveTodos();
        this.render();
        this.showMessage(`${completedCount}件の完了済みタスクを削除しました`);
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
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
            filteredTodos.forEach(todo => {
                const todoItem = this.createTodoElement(todo);
                this.todoList.appendChild(todoItem);
            });
        }

        // 統計の更新
        this.updateStats();
        
        // 完了済み削除ボタンの状態更新
        const hasCompleted = this.todos.some(todo => todo.completed);
        this.clearCompletedBtn.disabled = !hasCompleted;
    }

    createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text">${this.escapeHtml(todo.text)}</span>
            <span class="todo-date">${todo.createdAt}</span>
            <button class="delete-btn">削除</button>
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

        return li;
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
        return saved ? JSON.parse(saved) : [];
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