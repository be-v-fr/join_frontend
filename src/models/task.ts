import { User } from '../models/user';
import { Subtask } from '../interfaces/subtask.interface';

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

    constructor(title: string) {
        this.id = '';
        this.title = title;
        this.due = getCurrentDate();
        this.prio = 'Medium';
        this.category = 'Technical Task';
    }

    isAssignedTo(user: User): boolean {
        return this.assigned.includes(user.uid);
    }

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

function getCurrentDate(): string {
    const d = new Date();
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}