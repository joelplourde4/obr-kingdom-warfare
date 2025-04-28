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
    currentTime: number;
    totalTime: number;
    timeUnit: TimeUnit;

    constructor(
        id?: string,
        name?: string,
        currentTime?: number,
        totalTime?: number,
        timeUnit: TimeUnit = TimeUnit.HOURS
    ) {
        this.id = id || uuidv4();
        this.name = name || "Activity";
        this.currentTime = currentTime || 0;
        this.totalTime = totalTime || 1;
        this.timeUnit = timeUnit || TimeUnit.HOURS;
    }
}

export enum TimeUnit {
    HOURS = 'Hours',
    DAYS = 'Days',
    WEEKS = 'Weeks',
    MONTHS = 'Months',
    YEARS = 'Years'
}