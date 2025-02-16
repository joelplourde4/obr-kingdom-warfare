export class Item {
    id: number;
    name: string;
    description: string;
    show: boolean;
    expand: boolean;

    constructor(id: number) {
        this.id = id;
        this.name = "Default";
        this.description = "Description";
        this.show = false;
        this.expand = false;
    }
}