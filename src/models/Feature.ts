export class Feature {
    id: number;
    name: string;
    source: string;
    description: string;
    visible: boolean;
    expand: boolean;

    constructor(id: number) {
        this.id = id;
        this.name = "Default"
        this.source = ""
        this.description = ""
        this.visible = false
        this.expand = false
    }
}