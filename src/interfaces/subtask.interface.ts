export interface Subtask {
    name: string;
    status: 'To do' | 'In progress' | 'Await feedback' | 'Done';
}