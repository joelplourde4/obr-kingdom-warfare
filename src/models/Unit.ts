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
    TREANT = "Treant",
    TROLL = "Troll"
}

export enum Type {
    LEVIES = "Levies",
    INFANTRY = "Infantry",
    ARTILLERY = "Artillery",
    CAVALRY = "Cavalry",
    AERIAL = "Aerial",
    SPELLCASTER = "Spellcaster",
    FORTIFICATION = "Fortification",
    SIEGE_ENGINE = "Siege Engine"
}

export enum Equipment {
    LIGHT = "Light",
    MEDIUM = "Medium",
    HEAVY = "Heavy",
    SUPER_HEAVY = "Super Heavy"
}

export enum Experience {
    GREEN = "Green",
    REGULAR = "Regular",
    SEASONED = "Seasoned",
    VETERAN = "Veteran",
    ELITE = "Elite",
    SUPER_ELITE = "Super Elite"
}

export enum Size {
    D4 = "1d4",
    D6 = "1d6",
    D8 = "1d8",
    D10 = "1d10",
    D12 = "1d12",
    D20 = "1d20",
    D24 = "2d12"
}

export class Unit {
    name: string;
    show: boolean;
    experience: Experience;
    equipment: Equipment;
    type: Type;
    ancestry: Ancestry;
    tier: Tier;
    size: Size;
    traits: Trait[];

    // Computed value
    cost: number;
    upkeep: number;

    constructor(
        name?: string,
        experience?: Experience,
        equipment?: Equipment,
        type?: Type,
        ancestry?: Ancestry,
        tier?: Tier,
        size?: Size,
        traits?: Trait[],
        // @ts-ignore
        cost?: number,
        // @ts-ignore
        upkeep?: number
    ) {
        this.name = name || "Default";
        this.experience = experience || Experience.GREEN;
        this.equipment = equipment || Equipment.LIGHT;
        this.type = type || Type.INFANTRY;
        this.ancestry = ancestry || Ancestry.HUMAN;
        this.tier = tier || Tier.I;
        this.size = size || Size.D4;
        this.traits = traits || [];
        this.show = false;
        this.cost = 0;
        this.upkeep = 0;
    }
}