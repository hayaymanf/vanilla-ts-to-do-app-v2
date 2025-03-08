export interface Task {
    id: string;
    content: string;
    completed: boolean;
    dueDate: string | null ;
    hasReminder: boolean ;
}