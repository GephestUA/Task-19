export class TodoView {
	constructor(moadel, container) {
		this.moadel = moadel;
		this.container = container;
		
		this.subribers = [];
		this.handleTodoAdd= this.handleTodoAdd.bind(this);
		this.handleTodoRemove = this.handleTodoRemove.bind(this);
		this.handleEditTask = this.handleEditTask.bind(this);
		this.innitialRender()
	}

	subscribe(subscriber) {
		this.subribers.push(subscriber)
	}

	notify (data) {
		this.subribers.forEach(cb => cb(data))
	}

	handleTodoAdd(event) {
		event.preventDefault();

		this.notify({
			name: this.input.value,
			type: 'add'
		})

		this.input.value = '';
	}
	
	handleEditTask (event)  {
		const task = event.target.closest('.todo-item-name');
		if(task) {
			this.notify({
				id: Number(task.closest('.todo-item').dataset.id),
				name: task.value,
				type: 'edit',
			})
		}
	};

	handleTodoRemove(event) {
		const removeBtn = event.target.closest('.todo-remove-btn');
		const checkbox = event.target.closest('.todo-item-checkbox');
		
		if (removeBtn) {
			this.notify({
				id: Number(removeBtn.closest('.todo-item').dataset.id),
				type: 'remove'
			})
		}

		if (checkbox) {
			this.notify({
				id: Number(checkbox.closest('.todo-item').dataset.id),
				type: 'update'
			})
		}
	};

	innitialRender() {
		this.container.innerHTML = `
		<div class="todo-app">
			<form class="todo-form">
				<input type="text">
				<button>create</button>
			</form>
			<ul class="todo-list"></ul>
		</div>`	
		this.todoList = this.container.querySelector('.todo-list');
		this.todoForm = this.container.querySelector('.todo-form');
		this.input = this.container.querySelector('.todo-form input');

		this.todoForm.addEventListener('submit', this.handleTodoAdd);
		this.todoList.addEventListener('click', this.handleTodoRemove);
		this.todoList.addEventListener('blur', this.handleEditTask, true);
	}
	
	render() {
		this.todoList.innerHTML = null;
		this.moadel.getState().forEach(todo => {
			const todoElement = `
			<div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
				<input type="checkbox" class="todo-item-checkbox" ${todo.completed ? 'checked' : ''}>
				<input class="todo-item-name" type="text" value="${todo.name}"></input>
				<button class="todo-remove-btn">X</button>
			</div>`
			
			this.todoList.innerHTML += todoElement;
		});
	}
};