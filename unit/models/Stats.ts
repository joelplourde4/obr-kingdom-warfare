import { Ancestry, Equipment, Experience, Size, Trait, Type } from "../../src/models/Unit";

export class Stats {
    attack: number;
    power: number;
    defense: number;
    toughness: number;
    morale: number;

    constructor(attack: number, power: number, defense: number, toughness: number, morale: number) {
        this.attack = attack;
        this.power = power;
        this.defense = defense;
        this.toughness = toughness;
        this.morale = morale;
    }
}

export const TIER_I = 500;
export const TIER_II = 800;
export const TIER_III = 1300;
export const TIER_IV = 2000;
// Tier V is anything above.

export const ANCESTRY_STATS_MAP = new Map<Ancestry, Stats>([
    [Ancestry.DRAGONBORN, new Stats(2, 2, 1, 1, 1)],
    [Ancestry.DWARF, new Stats(3, 1, 1, 1 ,2)],
    [Ancestry.ELF, new Stats(2, 0, 0, 0, 1)],
    [Ancestry.GIANT, new Stats(0, 0, 0, 0, 0)],     // TODO Finish this
    [Ancestry.GHOUL, new Stats(-1, 0, 2, 2, 0)],
    [Ancestry.GNOLL, new Stats(2, 0, 0, 0, 1)],
    [Ancestry.GNOME, new Stats(1, -1, 1, -1, 1)],
    [Ancestry.GOBLINOID, new Stats(-1, -1, 1, -1, 0)],
    [Ancestry.HOBGOBLIN, new Stats(2, 0, 0, 0, 1)],
    [Ancestry.HUMAN, new Stats(2, 0, 0, 0, 1)],
    [Ancestry.KOBOLD, new Stats(-1, -1, 1, -1, -1)],
    [Ancestry.LIZARDFOLK, new Stats(2, 1, -1, 1, 1)],
    [Ancestry.OGRE, new Stats(0, 2, 0, 2, 1)],
    [Ancestry.ORC, new Stats(2, 1, 1, 1, 2)],
    [Ancestry.UNDEAD, new Stats(-2, -1, 1, 1, 1)], // MIGHT BE MISSING ZOMBIES
    // TODO finish this.
    [Ancestry.FIEND, new Stats(0, 0, 0, 0, 0)],
    [Ancestry.MONSTROUS, new Stats(0, 0, 0, 0, 0)],
    [Ancestry.SPECIAL, new Stats(0, 0, 0, 0, 0)],
    [Ancestry.TREANT, new Stats(0, 0, 0, 0, 0)],
    [Ancestry.TROLL, new Stats(0, 0, 0, 0, 0)]
]);

export const EXPERIENCE_STATS_MAP = new Map<Experience, Stats>([
    [Experience.GREEN, new Stats(0, 0, 0, 0, 0)],
    [Experience.REGULAR, new Stats(1, 0, 0, 1, 1)],
    [Experience.SEASONED, new Stats(1, 0, 0, 1, 2)],
    [Experience.VETERAN, new Stats(1, 0, 0, 1, 3)],
    [Experience.ELITE, new Stats(2, 0, 0, 2, 4)],
    [Experience.SUPER_ELITE, new Stats(2, 0, 0, 2, 5)],
]);

export const EQUIPMENT_STATS_MAP = new Map<Equipment, Stats>([
    [Equipment.LIGHT, new Stats(0, 1, 1, 0, 0)],
    [Equipment.MEDIUM, new Stats(0, 2, 2, 0, 0)],
    [Equipment.HEAVY, new Stats(0, 4, 4, 0, 0)],
    [Equipment.SUPER_HEAVY, new Stats(0, 6, 6, 0, 0)]
]);

export const TYPE_STATS_MAP = new Map<Type, Stats>([
    [Type.AERIAL, new Stats(0, 0, 0, 0, 3)],
    [Type.ARTILLERY, new Stats(0, 1, 0, 0, 1)],
    [Type.CAVALRY, new Stats(1, 1, 0, 0, 2)],
    [Type.FORTIFICATION, new Stats(0,0,0,0,0)],
    [Type.INFANTRY, new Stats(0, 0, 1, 1, 0)],
    [Type.LEVIES, new Stats(0, 0, 0, 0, -1)],
    [Type.SIEGE_ENGINE, new Stats(1, 1, 0, 1, 0)],
    [Type.SPELLCASTER, new Stats(2, 2, -1, -1, 0)],
]);

export const TRAIT_COST_MAP = new Map<Trait, number>([
    [Trait.AMPHIBIOUS, 50],
    [Trait.AAAUUUGH, 50],
    [Trait.ADAPTABLE, 50],
    [Trait.BRED_FOR_WAR, 100],
    [Trait.BRUTAL, 200],
    [Trait.COURAGEOUS, 50],
    [Trait.ETERNAL, 50],
    [Trait.FRENZY, 50],
    [Trait.HORRIFY, 200],
    [Trait.MARTIAL, 100],
    [Trait.MINDLESS, 100],
    [Trait.RAVENOUS, 50],
    [Trait.ROCK_HURLER, 250],
    [Trait.SAVAGE, 50],
    [Trait.STALWART, 50],
    [Trait.UNDEAD, 50],
]);

export const TYPE_COST_MODIFIER_MAP = new Map<Type, number>([
    [Type.AERIAL, 2],
    [Type.ARTILLERY, 1.75],
    [Type.CAVALRY, 1.5],
    [Type.FORTIFICATION, 1.5],
    [Type.INFANTRY, 1],
    [Type.LEVIES, 0.75],
    [Type.SIEGE_ENGINE, 1.5],
    [Type.SPELLCASTER, 2]
]);

export const SIZE_COST_MODIFIER_MAP = new Map<Size, number>([
    [Size.D4, 0.66],
    [Size.D6, 1],
    [Size.D8, 1.33],
    [Size.D10, 1.66],
    [Size.D12, 2],

    // TODO Balance this.
    [Size.D20, 3],
    [Size.D24, 4],
]);

export const ANCESTRY_COLOR_MAP = new Map<Ancestry, string>([
    [Ancestry.DRAGONBORN, "#ff4d00"],
    [Ancestry.DWARF, "#ff7400"],
    [Ancestry.ELF, "#34a84a"],
    [Ancestry.GIANT, "#e4d3ca"],
    [Ancestry.GHOUL, "#443745"],
    [Ancestry.GNOLL, "#442a19"],
    [Ancestry.GNOME, "#8aff6f"],
    [Ancestry.GOBLINOID, "#84b07d"],
    [Ancestry.HOBGOBLIN, "#6e3195"],
    [Ancestry.HUMAN, "#061749"],
    [Ancestry.KOBOLD, "#a5a09e"],
    [Ancestry.LIZARDFOLK, "#6e9827"],
    [Ancestry.OGRE, "#e8dcaf"],
    [Ancestry.ORC, "#5f5b65"],
    [Ancestry.UNDEAD, "#1b1c25"],
    [Ancestry.FIEND, "#932205"],
    [Ancestry.MONSTROUS, "#67000c"],
    [Ancestry.SKAVEN, "#483c32"],
    [Ancestry.SPECIAL, "#2e1f3c"],
    [Ancestry.TREANT, "#5c1c00"],
    [Ancestry.TROLL, "#544000"]
]);

export const INFANTRY_ATTACK_MAP = new Map<Experience, number>([
    [Experience.GREEN, 0],
    [Experience.REGULAR, 0],
    [Experience.SEASONED, 0],
    [Experience.VETERAN, 1],
    [Experience.ELITE, 1],
    [Experience.SUPER_ELITE, 1],
]);

export const CAVALRY_AERIAL_ATTACK_MAP = new Map<Experience, number>([
    [Experience.GREEN, 0],
    [Experience.REGULAR, 0],
    [Experience.SEASONED, 0],
    [Experience.VETERAN, 0],
    [Experience.ELITE, 1],
    [Experience.SUPER_ELITE, 1]
]);

export const ARTILLERY_ATTACK_MAP = new Map<Experience, number>([
    [Experience.GREEN, 0],
    [Experience.REGULAR, 0],
    [Experience.SEASONED, 0],
    [Experience.VETERAN, 1],
    [Experience.ELITE, 1],
    [Experience.SUPER_ELITE, 1]
]);

export const INFANTRY_DAMAGE_MAP = new Map<Equipment, number>([
    [Equipment.LIGHT, 0],
    [Equipment.MEDIUM, 0],
    [Equipment.HEAVY, 0],
    [Equipment.SUPER_HEAVY, 1]
]);

export const CAVALRY_AERIAL_DAMAGE_MAP = new Map<Equipment, number>([
    [Equipment.LIGHT, 0],
    [Equipment.MEDIUM, 0],
    [Equipment.HEAVY, 0],
    [Equipment.SUPER_HEAVY, 1]
]);