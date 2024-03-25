import { User } from '../models/user';
import { Subtask } from '../interfaces/subtask.interface';

export class Task {
    id: number;
    title: string;
    description: string;
    assignedTo: User[] = [];
    due: string;
    prio: 'Urgent' | 'Medium' | 'Low';
    category: 'Technical Task' | 'User Story';
    subtasks: Subtask[] = [];
    timestamp: number = Date.now();
    status: 'To do' | 'In progress' | 'Await feedback' | 'Done' = 'To do';

    constructor() {
        this.id = -1;
        this.title = 'New task';
        this.description = '';
        this.due = '';
        this.prio = 'Medium';
        this.category = 'Technical Task';
    }
}