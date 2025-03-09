import { TaskService } from "./services/taskService";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/taskList";
import { Task } from "./models/task";

export class App {
    private taskService: TaskService;
    private taskForm: TaskForm;
    private taskListContainer: HTMLElement;
    private taskCountElement: HTMLElement;
    private clearTasksButton: HTMLElement;

    constructor() {
        this.taskService = new TaskService();
        this.taskForm = new TaskForm();
        this.taskListContainer = document.getElementById('task-list') as HTMLElement;
        this.taskCountElement = document.getElementById('task-count') as HTMLElement;
        this.clearTasksButton = document.getElementById('clear-tasks') as HTMLElement;
    }

    init(): void {
        // Initialize the form handlers
        this.taskForm.setAddTaskHandler(this.handleAddTask.bind(this));
        this.taskForm.setEditTaskHandler(this.handleEditTask.bind(this));
        
        // Initialize clear all button
        this.clearTasksButton.addEventListener('click', this.handleClearTasks.bind(this));
        
        // Render initial tasks
        this.render();
        
        // Set up task list event delegation
        this.setupTaskListEventHandlers();

        // Request notification permissions when the app starts
        this.requestNotificationPermission();
        
        // Check for due tasks when the app starts
        this.taskService.checkDueTasks();
    }

    handleAddTask(content: string, dueDate: string | null, hasReminder: boolean): void {
        this.taskService.addTask(content, dueDate, hasReminder);
        this.render();
    }

    handleEditTask(id: string, content: string, dueDate: string | null, hasReminder: boolean): void {
        this.taskService.editTask(id, content, dueDate, hasReminder);
        this.render();
    }

    handleToggleTask(id: string): void {
        this.taskService.toggleTaskCompletion(id);
        this.render();
    }

    handleDeleteTask(id: string): void {
        this.taskService.deleteTask(id);
        this.render();
    }

    handleMoveTask(id: string, direction: "up" | "down"): void {
        this.taskService.moveTask(id, direction);
        this.render();
    }

    handleClearTasks(): void {
        // Simple confirmation
        if (confirm('Are you sure you want to delete all tasks?')) {
            this.taskService.clearTasks();
            this.render();
        }
    }

    setupTaskListEventHandlers(): void {
        this.taskListContainer.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const taskId = this.findTaskId(target);
            
            if (!taskId) return;
            
            // Check if checkbox was clicked
            if (target.classList.contains('task-checkbox') || target.closest('.task-checkbox')) {
                this.handleToggleTask(taskId);
            }
            
            // Check if edit button was clicked
            else if (target.classList.contains('edit-task') || target.closest('.edit-task')) {
                const task = this.findTask(taskId);
                if (task) {
                    this.taskForm.setEditMode(taskId, task.content, task.dueDate, task.hasReminder);
                }
            }
            
            // Check if delete button was clicked
            else if (target.classList.contains('delete-task') || target.closest('.delete-task')) {
                this.handleDeleteTask(taskId);
            }
            
            // Check if move up button was clicked
            else if (target.classList.contains('move-up') || target.closest('.move-up')) {
                this.handleMoveTask(taskId, "up");
            }
            
            // Check if move down button was clicked
            else if (target.classList.contains('move-down') || target.closest('.move-down')) {
                this.handleMoveTask(taskId, "down");
            }
        });
    }

    findTaskId(element: HTMLElement): string | null {
        // Try to get id from data attribute
        const id = element.getAttribute('data-id');
        if (id) return id;
        
        // Try to get from parent
        const parent = element.closest('[data-id]') as HTMLElement;
        if (parent) return parent.getAttribute('data-id');
        
        return null;
    }

    findTask(taskId: string): Task | null {
        // Get the full task object from the service
        const tasks = this.taskService.getTasks();
        return tasks.find(task => task.id === taskId) || null;
    }

    // Calculate the number of remaining (incomplete) tasks
    getIncompleteTaskCount(tasks: Task[]): number {
        return tasks.filter(task => !task.completed).length;
    }

    // Request notification permission
    requestNotificationPermission(): void {
        if (Notification && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }

    render(): void {
        const tasks = this.taskService.getTasks();
        const taskList = new TaskList(tasks);
        
        this.taskListContainer.innerHTML = taskList.render();
        
        // Update the task count to show only incomplete tasks
        const remainingTasks = this.getIncompleteTaskCount(tasks); 
        this.taskCountElement.textContent = `${remainingTasks}`;
    }
}
