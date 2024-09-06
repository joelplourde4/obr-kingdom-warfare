import { Experience, Equipment, Type, Ancestry, Tier, Trait, Size } from '../../src/models/Unit'

export class Card {
    name: string;
    experience: Experience;
    equipment: Equipment;
    type: Type;
    ancestry: Ancestry;
    tier: Tier;
    size: Size;
    traits: Trait[];

    // Calculated Values
    cost: number;
    numberAttack: number;
    damage: number;

    constructor(
        name?: string,
        experience?: Experience,
        equipment?: Equipment,
        type?: Type,
        ancestry?: Ancestry,
        tier?: Tier,
        size?: Size,
        traits?: Trait[]
    ) {
        this.name = name || "";
        this.experience = experience || Experience.GREEN;
        this.equipment = equipment || Equipment.LIGHT;
        this.type = type || Type.INFANTRY;
        this.ancestry = ancestry || Ancestry.DWARF;
        this.tier = tier || Tier.I;
        this.size = size || Size.D4;
        this.traits = traits || [];

        this.cost = 0;
        this.numberAttack = 1;
        this.damage = 1;
    }
}