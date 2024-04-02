import { User } from '../models/user';
import { Subtask } from '../interfaces/subtask.interface';

export class Task {
    id: number;
    title: string;
    description: string = '';
    assigned: boolean[] = [];
    due: string;
    prio: 'Urgent' | 'Medium' | 'Low' | null;
    category: 'Technical Task' | 'User Story';
    subtasks: Subtask[] = [];
    timestamp: number = Date.now();
    status: 'To do' | 'In progress' | 'Await feedback' | 'Done' = 'To do';

    constructor(title: string) {
        this.id = -1;
        this.title = title;
        this.due = getCurrentDate();
        this.prio = 'Medium';
        this.category = 'Technical Task';
    }
}

function getCurrentDate(): string {
    const d = new Date();
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}