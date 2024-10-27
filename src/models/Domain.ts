import { Stats } from './Stats.ts'
import { Relation } from './Relation.ts';
import { Feature } from './Feature.ts';
import { Regiment } from './Unit.ts';
import { Realm } from './Realm.ts';

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
    regiments: Regiment[];
    realm: Realm;

    // For versioning purposes.
    version: number;

    constructor(
        name?: string,
        size: Size = Size.TINY,
        powerDie: PowerDie = PowerDie.D4,
        stats: Stats = new Stats(),
        relations: Relation[] = [],
        features: Feature[] = [],
        regiments: Regiment[] = [],
        realm?: Realm,
        // @ts-ignore
        version: number = 0
    ) {
        this.name = name || "Kingdom";
        this.size = size;
        this.powerDie = powerDie;
        this.stats = stats;
        this.relations = relations;
        this.features = features;
        this.regiments = regiments;
        this.realm = realm || new Realm();
        this.version = 0;
    }

    static fromJson(domain: any): Domain {
        return new Domain(
            domain.name,
            domain.size,
            domain.powerDie,
            domain.stats,
            domain.relations,
            domain.features,
            domain.regiment,
            domain.realm,
            domain.version
        )
    }
};