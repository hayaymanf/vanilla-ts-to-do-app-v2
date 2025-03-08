import { TaskItem } from "./taskItem";
import { Task } from "../models/task";

export class TaskList {
    private tasks: Task[];

    constructor(tasks: Task[]) {
        this.tasks = tasks;
    }

    render(): string {
        return this.tasks.map((task) => new TaskItem(task).render()).join('');
    }
}
