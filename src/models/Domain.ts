import { Stats } from './Stats.ts'
import { Relation } from './Relation.ts';
import { Feature } from './Feature.ts';

export enum Size {
    TINY = "Tiny",
    SMALL = "Small",
    MEDIUM = "Medium",
    BIG = "Big",
    LARGE = "Large"
}

export enum PowerDie {
    D4,
    D6,
    D8,
    D12,
    D20
}

export class Domain {
    name: string;
    size: Size;
    powerDie: PowerDie;
    stats: Stats;
    relations: Relation[];
    features: Feature[];

    constructor() {
        this.name = "Kingdom";
        this.size = Size.TINY;
        this.powerDie = PowerDie.D4;
        this.stats = new Stats();
        this.relations = [];
        this.features = [];
    }
};