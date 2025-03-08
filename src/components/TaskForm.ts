export class TaskForm {
    private taskInput: HTMLInputElement;
    private dueDateInput: HTMLInputElement;
    private reminderCheckbox: HTMLInputElement;
    private addButton: HTMLButtonElement;
    private editButton: HTMLButtonElement;
    private editTaskId: string | null = null;

    constructor() {
        this.taskInput = document.getElementById('task-input') as HTMLInputElement;
        this.dueDateInput = document.getElementById('due-date-input') as HTMLInputElement;
        this.reminderCheckbox = document.getElementById('reminder-checkbox') as HTMLInputElement;
        this.addButton = document.getElementById('add-task-button') as HTMLButtonElement;
        this.editButton = document.getElementById('edit-task-button') as HTMLButtonElement;
    }

    resetForm(): void {
        this.taskInput.value = '';
        this.dueDateInput.value = '';
        this.reminderCheckbox.checked = false;
        this.editTaskId = null;
        this.addButton.style.display = 'inline-block';
        this.editButton.style.display = 'none';
        this.taskInput.focus();
    }

    setEditMode(taskId: string, taskContent: string , dueDate: string | null, hasReminder: boolean): void {
        this.taskInput.value = taskContent;
        this.dueDateInput.value = dueDate || '';
        this.reminderCheckbox.checked = hasReminder;
        this.editTaskId = taskId;
        this.addButton.style.display = 'none';
        this.editButton.style.display = 'inline-block';
        this.taskInput.focus();
    }

    getTaskContent(): string {
        return this.taskInput.value.trim();
    }

    getDueDate():string | null {
        return this.dueDateInput.value ? this.dueDateInput.value : null
    }

    getHasReminder(): boolean {
        return this.reminderCheckbox.checked
    }

    getEditTaskId(): string | null {
        return this.editTaskId;
    }

    setAddTaskHandler(callback: (content: string, dueDate: string | null, hasReminder: boolean) => void): void {
        this.addButton.addEventListener('click', () => {
            const content = this.getTaskContent();
            if (content) {
                const dueDate = this.getDueDate()
                const hasReminder = this.getHasReminder()
                callback(content ,dueDate , hasReminder);
                this.resetForm();
            }
        });

        this.taskInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const content = this.getTaskContent();
                if (content) {
                    const dueDate = this.getDueDate()
                    const hasReminder = this.getHasReminder()
                    callback(content , dueDate ,hasReminder);
                    this.resetForm();
                }
            }
        });
    }

    setEditTaskHandler(callback: (id: string, content: string , dueDate: string | null, hasReminder: boolean) => void): void {
        this.editButton.addEventListener('click', () => {
            const content = this.getTaskContent();
            if (content && this.editTaskId) {
                const dueDate = this.getDueDate()
                const hasReminder = this.getHasReminder()
                callback(this.editTaskId, content ,dueDate , hasReminder);
                this.resetForm();
            }
        });

        this.taskInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && this.editTaskId) {
                const content = this.getTaskContent();
                if (content) {
                    const dueDate = this.getDueDate()
                    const hasReminder = this.getHasReminder()
                    callback(this.editTaskId, content ,dueDate , hasReminder);
                    this.resetForm();
                }
            }
        });
    }
}