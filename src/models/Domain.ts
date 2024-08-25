import { Stats } from './Stats.ts'
import { Relation } from './Relation.ts';
import { Feature } from './Feature.ts';

export class Domain {
    name: string;
    stats: Stats;
    relations: Relation[];
    features: Feature[];

    constructor() {
        this.name = "Kingdom";
        this.stats = new Stats();
        this.relations = [];
        this.features = [];
    }
};