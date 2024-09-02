export class Officer {
    id: string;
    name: string;
    description: string;
    img: string;
    show: boolean;

    constructor() {
        this.id = crypto.randomUUID();
        this.name = "Default";
        this.description = "Description";
        this.img = "";
        this.show = false;
    }
}

export enum RelationStatus {
    ALLIED = "Allied",
    FRIENDLY = "Friendly",
    NEUTRAL = "Neutral",
    SUSPICIOUS = "Suspicious",
    HOSTILE = "Hostile"
} 

export class Relation {
    id: string;
    name: string;
    img: string;
    relationStatus: RelationStatus
    officers: Officer[]
    expand: boolean
    show: boolean

    constructor () {
        this.id = crypto.randomUUID();
        this.name = "Default"
        this.img = "/kingdom.svg"
        this.relationStatus = RelationStatus.NEUTRAL
        this.officers = []
        this.expand = false
        this.show = false
    }
}