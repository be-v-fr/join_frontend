/**
 * This interface represents a subtask (which is a task that is part of a larger task)
 */
export interface Subtask {
    name: string;
    status: 'To do' | 'In progress' | 'Await feedback' | 'Done';
}