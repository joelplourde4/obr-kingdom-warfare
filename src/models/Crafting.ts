// @ts-ignore
import {v4 as uuidv4} from 'uuid';

export class Category {
    id: number;
    name: string;
    activities: Activity[];
    show: boolean;

    constructor(id: number) {
        this.id = id;
        this.name = "Category";
        this.activities = [];
        this.show = false;
    }
}

export class Activity {
    id: string;
    name: string;
    currentHours: number;
    totalHours: number;

    constructor(
        id?: string,
        name?: string,
        currentHours?: number,
        totalHours?: number
    ) {
        this.id = id || uuidv4();
        this.name = name || "Activity";
        this.currentHours = currentHours || 0;
        this.totalHours = totalHours || 1;
    }
}