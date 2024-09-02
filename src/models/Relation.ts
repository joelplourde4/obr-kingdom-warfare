export class Officer {
    name: string;
    description: string;
    img: string;
    show: boolean;

    constructor() {
        this.name = "Default";
        this.description = "Description";
        this.img = "/person.svg";
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
    name: string;
    img: string;
    relationStatus: RelationStatus
    officers: Officer[]
    expand: boolean
    show: boolean

    constructor () {
        this.name = "Default"
        this.img = "/kingdom.svg"
        this.relationStatus = RelationStatus.NEUTRAL
        this.officers = []
        this.expand = false
        this.show = false
    }
}