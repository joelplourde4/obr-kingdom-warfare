export type Officers = {
    name: string;
    description: string;
    img: string;
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
    officers: Officers[]

    constructor () {
        this.name = "Default"
        this.img = ""
        this.relationStatus = RelationStatus.NEUTRAL
        this.officers = []
    }
}