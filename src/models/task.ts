import { User } from '../models/user';
import { Subtask } from '../interfaces/subtask.interface';


/**
 * This component represents a task
 */
export class Task {
    id: string;
    title: string;
    description: string = '';
    assigned: string[] = [];
    due: string;
    prio: 'Urgent' | 'Medium' | 'Low' | null;
    category: 'Technical Task' | 'User Story';
    subtasks: Subtask[] = [];
    timestamp: number = Date.now();
    status: 'To do' | 'In progress' | 'Await feedback' | 'Done' = 'To do';


    /**
     * Create new task and initialize obligatory properties
     * @param title task title
     */
    constructor(title: string) {
        this.id = '';
        this.title = title;
        this.due = getCurrentDate();
        this.prio = 'Medium';
        this.category = 'Technical Task';
    }


    /**
     * Check if this task is assigned to a user
     * @param user user to check for
     * @returns check result
     */
    isAssignedTo(user: User): boolean {
        return this.assigned.includes(user.uid);
    }


    /**
     * Transform the default date format used for "due" (yyyy-mm-dd)
     * to the text date format displayed to the user (dd/mm/yyyy)
     * @returns transformed date string (or undefined if due is empty or does not exist)
     */
    getDueToText(): string | undefined {
        if (this.due && this.due.length > 0) {
            const parts = this.due.split('-');
            const year = parts[0];
            let month: string | number = parseInt(parts[1]);
            let day: string | number = parseInt(parts[2]);
            month = (month < 10 ? '0' : '') + month;
            day = (day < 10 ? '0' : '') + day;
            return day + '/' + month + '/' + year;
        } else {
            return undefined;
        }
    }
}


/**
 * This function returns the current date in the default date string format (yyyy-mm-dd) 
 * @returns current date
 */
function getCurrentDate(): string {
    const d = new Date();
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}