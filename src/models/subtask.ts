/**
 * This model represents a subtask
 */
export class Subtask {
    id: number;
    task_id: number;
    name: string;
    status: 'To do' | 'Done';


    /**
     * Create class instance
     * @param obj data to initialize properties
     */
    constructor(obj: any) {
        this.id = obj.id ? obj.id : -1;
        this.task_id = obj.task ? obj.task : -1;
        this.name = obj.name ? obj.name : '';
        this.status = obj.status ? obj.status : 'To do';
    }


    /**
     * Converts the data to JSON format.
     * In detail, the data is formatted to meet the backend naming and requirements.
     * @returns data JSON
     */
    toJson(): {} {
        const json: any = {
            task: this.task_id,
            name: this.name,
            status: this.status,
        };
        if (this.id != -1) { json.id = this.id }
        return json;
    }
}