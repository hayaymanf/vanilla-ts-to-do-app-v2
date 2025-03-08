import { Task } from "../models/task";
import { saveTaskToLocalStorage, getTasksFromLocalStorage } from "../utils/storage";

export class TaskService {
    private tasks: Task[] = getTasksFromLocalStorage();

    addTask(content: string , dueDate: string | null , hasReminder: boolean): void {
        const newTask: Task = {
            id: Date.now().toString(),
            content,
            completed: false,
            dueDate,
            hasReminder,
        };
        this.tasks.push(newTask);
        this.updateLocalStorage();

        // If reminder is set and due date exists, schedule a notification
        if(hasReminder && dueDate){
            this.scheduleReminder(newTask)
        }

        
    }

    editTask(id: string, newContent: string ,dueDate: string | null , hasReminder: boolean): void {
        const task = this.tasks.find((task) => task.id === id);
        if (task) {
            task.content = newContent;
            task.dueDate = dueDate
            task.hasReminder = hasReminder
            this.updateLocalStorage();

            // If reminder is set and due date exists, schedule a notification
            if(hasReminder && dueDate) {
                this.scheduleReminder(task)
            }
        }
    }

    deleteTask(id: string): void {
        this.tasks = this.tasks.filter((task) => task.id !== id);
        this.updateLocalStorage();
    }

    toggleTaskCompletion(id: string): void {
        const task = this.tasks.find((task) => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.updateLocalStorage();
        }
    }

    moveTask(id: string, direction: "up" | "down"): void {
        const index = this.tasks.findIndex((task) => task.id === id);
        if (index === -1) return;

        const task = this.tasks[index];
        const targetIndex = direction === "up" ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= this.tasks.length) return;

        this.tasks.splice(index, 1);
        this.tasks.splice(targetIndex, 0, task);
        this.updateLocalStorage();
    }

    clearTasks(): void {
        this.tasks = [];
        this.updateLocalStorage();
    }

    getTasks(): Task[] {
        return [...this.tasks];
    }

    private updateLocalStorage(): void {
        saveTaskToLocalStorage(this.tasks);
    }

    private scheduleReminder(task: Task): void{
        if(!task.dueDate || !task.hasReminder) return

        // Parse the due date
        const dueDate = new Date(task.dueDate)
        const now = new Date()


        // calculate time until due date (in milliseconds)
        const timeUntilDue = dueDate.getTime() - now.getTime()

        // only if the due date is in the future
        if(timeUntilDue){
            // Request notification permission if not granted
            if(Notification && Notification.permission !== 'granted'){
                Notification.requestPermission()
            }

            //schedule the reminder  notification
            setTimeout(() => {
                if(Notification && Notification.permission === 'granted'){
                    new Notification ('Task reminder' , {
                        body: `Your task "${task.content}" is due today!!!`,
                        icon: '/public/favicon.ico'
                    })
                }
            }, timeUntilDue);

        }
    }

    // Check for tasks due today and create notifications if reminders are set
    checkDueTasks(): void {
        const today = new Date()
        today.setHours(0 , 0 , 0 ,0)

        const todayString = today.toISOString().split('T')[0]

        this.tasks.forEach(task => {
            if(!task.completed && task.dueDate === todayString && task.hasReminder){
                // Request notification permission if not granted
                if (Notification && Notification.permission !== "granted") {
                    Notification.requestPermission();
                }

                //show notification for tasks due to date
                if(Notification && Notification.permission === "granted"){
                    new Notification('Task Due Today!!' , {
                        body: `Your task "${task.content}" is due today !!`,
                        icon: '/public/favicon.ico'
                    })
                }
            }
        })
    }
}