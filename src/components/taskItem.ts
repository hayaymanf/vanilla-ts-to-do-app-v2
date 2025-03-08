import { Task } from "../models/task";

export class TaskItem {
  private task: Task;

  constructor(task: Task) {
    this.task = task;
  }

  private formatDueDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  private getDueDateClass(): string {
    if (!this.task.dueDate) return '';
    
    const dueDate = new Date(this.task.dueDate);
    dueDate.setHours(23, 59, 59, 999); // End of the day
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);
    
    if (this.task.completed) {
      return 'text-gray-500';
    } else if (dueDate < today) {
      return 'text-red-600 font-bold';
    } else if (dueDate <= tomorrow) {
      return 'text-orange-500 font-bold';
    } else {
      return 'text-blue-500';
    }
  }

  render(): string {
    // Define the variables needed in the template
    const dueDateClass = this.getDueDateClass();
    const dueDateDisplay = this.task.dueDate ? this.formatDueDate(this.task.dueDate) : '';

    return `
        <div class="task-item group flex justify-between items-center p-4 border border-gray-200 rounded-xl bg-white hover:border-blue-300 transition-all duration-200 shadow-md hover:shadow-lg">
            <div class="flex items-center gap-4">
                <input type="checkbox"
                class="task-checkbox w-5 h-5 cursor-pointer rounded-lg border-2 border-gray-400 checked:bg-blue-500 checked:border-blue-500 focus:ring-blue-500/30 transition-all duration-200"
                 ${this.task.completed ? "checked" : ""}
                data-id="${this.task.id}" />
                <span class="task-content text-gray-700 text-lg font-medium ${
                  this.task.completed ? "line-through text-gray-500" : ""
                }">
                    ${this.task.content}
                </span>
                
                ${this.task.dueDate ?
                       `<div class="flex items-center mt-1">
                          <span class="text-xs ${dueDateClass}">
                              <i class="far fa-calendar-alt mr-1"></i> ${dueDateDisplay}
                          </span>
                          ${this.task.hasReminder ?
                               `<span class="text-xs text-gray-500 ml-2">
                                  <i class="far fa-bell mr-1"></i> Reminder
                              </span>` : ''}
                      </div>` : ''}
            </div>
            <div class="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button class="edit-task text-blue-500 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-100" data-id="${
                  this.task.id
                }">
                    <i class="fas fa-pencil-alt fa-sm"></i>
                </button>
                <button class="delete-task text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-100" data-id="${
                  this.task.id
                }">
                    <i class="fas fa-trash-alt fa-sm"></i>
                </button>
                <div class="flex flex-col gap-1 ml-2">
                    <button class="move-up text-gray-500 hover:text-blue-500 p-1 rounded-md hover:bg-gray-100" data-id="${
                      this.task.id
                    }">
                        <i class="fas fa-arrow-up fa-xs"></i>
                    </button>
                    <button class="move-down text-gray-500 hover:text-red-500 p-1 rounded-md hover:bg-gray-100" data-id="${
                      this.task.id
                    }">
                        <i class="fas fa-arrow-down fa-xs"></i>
                    </button>
                </div>
            </div>
        </div>
        `;
  }
}