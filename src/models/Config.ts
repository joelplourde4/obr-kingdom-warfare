export class Config {
    header: boolean;
    stats: boolean;
    relations: boolean;
    features: boolean;
    military: boolean;
    warfare: boolean;
    treasury: boolean;
    inventory: boolean;
    multiplier: number;
    sharedMode: boolean;
    time: Time;

    constructor(
            header: boolean = true,
            stats: boolean = true,
            relations: boolean = true,
            features: boolean = true,
            military: boolean = true,
            warfare: boolean = true,
            treasury: boolean = false,
            inventory: boolean = false,
            multiplier: number = 250,
            sharedMode: boolean = true,
            time: Time = new Time()
    ){
        this.header = header;
        this.stats = stats;
        this.relations = relations;
        this.features = features;
        this.military = military;
        this.warfare = warfare;
        this.treasury = treasury;
        this.inventory = inventory;
        this.multiplier = multiplier;
        this.sharedMode = sharedMode;
        this.time = time;
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
            config.inventory,
            config.multiplier,
            config.sharedMode
        )
    } 
};

/**
 * This extension makes no assumption on the time in your setting.
 */
export class Time {
    /**
     * Number of weeks in a month
     */
    weekCount: number = 4;

    /**
     * Number of month in a year;
     */
    monthCount: number = 12;
}