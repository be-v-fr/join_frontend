/**
 * This model represents a subtask
 */
export class Subtask {
    id: number;
    task_id: number;
    name: string;
    status: 'To do' | 'Done';

    /**
     * Create new task and initialize obligatory properties
     * @param title task title
     */
       constructor(obj: any) {
        this.id = obj.id ? obj.id : -1;
        this.task_id = obj.task ? obj.task : -1;
        this.name = obj.name ? obj.name : '';
        this.status = obj.status ? obj.status : 'To do';
    }


    toJson(): {} {
        const json: any = {
            task : this.task_id,
            name : this.name,
            status: this.status,
        };
        if(this.id != -1) {json.id = this.id}
        return json;
    }
}