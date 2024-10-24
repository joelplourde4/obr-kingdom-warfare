export class Config {
    header: boolean;
    stats: boolean;
    relations: boolean;
    features: boolean;
    military: boolean;
    warfare: boolean;
    treasury: boolean;
    multiplier: number;
    sharedMode: boolean;

    constructor(
            header: boolean = true,
            stats: boolean = true,
            relations: boolean = true,
            features: boolean = true,
            military: boolean = true,
            warfare: boolean = true,
            treasury: boolean = false,
            multiplier: number = 250,
            sharedMode: boolean = true
    ){
        this.header = header;
        this.stats = stats;
        this.relations = relations;
        this.features = features;
        this.military = military;
        this.warfare = warfare;
        this.treasury = treasury;
        this.multiplier = multiplier;
        this.sharedMode = sharedMode;
    }

    static fromJson(config: any): Config {
        return new Config(
            config.header,
            config.stats,
            config.relations,
            config.features,
            config.military,
            config.warfare,
            config.treasury,
            config.multiplier,
            config.sharedMode
        )
    } 
};