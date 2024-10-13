export class Config {
    header: boolean;
    stats: boolean;
    relations: boolean;
    features: boolean;
    military: boolean;

    constructor() {
        this.header = true;
        this.stats = true;
        this.relations = true;
        this.features = true;
        this.military = true;
    }
};