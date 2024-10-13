import { Stats } from './Stats.ts'
import { Relation } from './Relation.ts';
import { Feature } from './Feature.ts';
import { Unit } from './Unit.ts';

export enum Size {
    TINY = "Tiny",
    SMALL = "Small",
    MEDIUM = "Medium",
    BIG = "Big",
    LARGE = "Large"
}

export enum PowerDie {
    D4 = "D4",
    D6 = "D6",
    D8 = "D8",
    D12 = "D12",
    D20 = "D20"
}

export class Domain {
    name: string;
    size: Size;
    powerDie: PowerDie;
    stats: Stats;
    relations: Relation[];
    features: Feature[];
    units: Unit[];

    constructor(
        name: string = "Kingdom",
        size: Size = Size.TINY,
        powerDie: PowerDie = PowerDie.D4,
        stats: Stats = new Stats(),
        relations: Relation[] = [],
        features: Feature[] = [],
        units: Unit[] = []
    ) {
        this.name = name;
        this.size = size;
        this.powerDie = powerDie;
        this.stats = stats;
        this.relations = relations;
        this.features = features;
        this.units = units;
    }

    static fromJson(domain: any): Domain {
        return new Domain(
            domain.name,
            domain.size,
            domain.powerDie,
            domain.stats,
            domain.relations,
            domain.features,
            domain.units
        )
    }
};