export enum Trait {
    AMPHIBIOUS = "Amphibious",
    AAAUUUGH = "Aaauuugh!!",
    ADAPTABLE = "Adaptable",
    AERIAL_BOMBARDMENT = "Aerial Bombardment",
    BRED_FOR_WAR = "Bred for War",
    BRUTAL = "Brutal",
    COURAGEOUS = "Courageous",
    ETERNAL = "Eternal",
    FRENZY = "Frenzy",
    HORRIFY = "Horrify",
    MARTIAL = "Martial",
    MINDLESS = "Mindless",
    RAVENOUS = "Ravenous",
    ROCK_HURLER = "Rock Hurler",
    SAVAGE = "Savage",
    STALWART = "Stalwart",
    UNDEAD = "Undead",
}

export enum Tier {
    I = "I",
    II = "II",
    III = "III",
    IV = "IV",
    V = "V"
}

export enum Ancestry {
    DRAGONBORN = "Dragonborn",
    DWARF = "Dwarf",
    ELF = "Elf",
    FIEND = "Fiend",
    GIANT = "Giant",
    GHOUL = "Ghoul",
    GNOLL = "Gnoll",
    GNOME = "Gnome",
    GOBLINOID = "Goblinoid",
    HOBGOBLIN = "Hobgoblin",
    HUMAN = "Human",
    KOBOLD = "Kobold",
    LIZARDFOLK = "Lizardfolk",
    MONSTROUS = "Monstrous",
    OGRE = "Ogre",
    ORC = "Orc",
    UNDEAD = "Undead",
    SPECIAL = "Special",
}

export enum Type {
    LEVIES = "Levies",
    INFANTRY = "Infantry",
    ARTILLERY = "Artillery",
    CAVALRY = "Cavalry",
    SIEGE = "Siege",
    AERIAL = "Aerial",
    SPELLCASTER = "Spellcaster"
}

export enum Equipment {
    LIGHT = "Light",
    MEDIUM = "Medium",
    HEAVY = "Heavy",
    SUPER_HEAVY = "Super Heavy"
}

export enum Experience {
    LEVIES = "Levies",
    REGULAR = "Regular",
    VETERAN = "Veteran",
    ELITE = "Elite",
    SUPER_ELITE = "Super Elite"
}

export class Unit {
    name: string;
    show: boolean;
    experience: Experience;
    equipment: Equipment;
    type: Type;
    ancestry: Ancestry;
    tier: Tier;
    traits: Trait[];

    constructor() {
        this.name = "Default";
        this.show = false;
        this.experience = Experience.REGULAR;
        this.equipment = Equipment.LIGHT;
        this.type = Type.INFANTRY;
        this.ancestry = Ancestry.HUMAN;
        this.tier = Tier.I;
        this.traits = [];
    }
}