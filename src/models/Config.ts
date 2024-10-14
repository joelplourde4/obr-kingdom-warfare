export class Config {
    header: boolean;
    stats: boolean;
    relations: boolean;
    features: boolean;
    military: boolean;
    sharedMode: boolean;

    constructor(
            header: boolean = true,
            stats: boolean = true,
            relations: boolean = true,
            features: boolean = true,
            military: boolean = true,
            sharedMode: boolean = true
    ){
        this.header = header;
        this.stats = stats;
        this.relations = relations;
        this.features = features;
        this.military = military;
        this.sharedMode = sharedMode;
    }

    static fromJson(config: any): Config {
        return new Config(
            config.header,
            config.stats,
            config.relations,
            config.features,
            config.military,
            config.sharedMode
        )
    } 
};