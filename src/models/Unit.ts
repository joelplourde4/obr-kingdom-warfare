// @ts-ignore
import {v4 as uuidv4} from 'uuid';

export enum Trait {
    AAAUUUGH = "Aaauuugh!!",
    ADAPTABLE = "Adaptable",
    AERIAL_BOMBARDMENT = "Aerial Bombardment",
    AMORPHOUS = "Amorphous",
    AMPHIBIOUS = "Amphibious",
    ANTI_ARMOR = "Anti-Armor",
    ANTI_INFANTRY = "Anti-Infantry",
    ANTI_LARGE = "Anti-Large",
    ARCADIAN = "Arcadian",
    ARCHERS = "Archers",
    ARMORED_CARAPACE = "Armored Carapace",
    BARBS = "Barbs",
    BATTLE_HYMN = "Battle Hymn",
    BEES = "Bees!?",
    BETTER_THAN_ONE = "Better than One",
    BIG = "Big",
    BLANKET_FIRE = "Blanket Fire",
    BLINDING = "Blinding",
    BRACING = "Bracing",
    BRACING_AGAINST_LARGE = "Bracing Against Large",
    BRED_FOR_WAR = "Bred for War",
    BRUTAL = "Brutal",
    BURNING = "Burning",
    BURROW = "Burrow",
    CAVALRY_UNIT = "Cavalry Unit",
    CELESTIAL = "Celestial",
    CHAOS_VULNERABILITY = "Chaos Vulnerability",
    CHARGE = "Charge",
    CHARGE_DEFENSE = "Charge Defense",
    CHARGE_DEFENSE_AGAINST_LARGE = "Charge Defense Against Large",
    CHORUS_OF_VICTORY = "Chorus of Victory",
    CLOSE_RANGE = "Close Range",
    CLOUD_OF_DARKNESS = "Cloud of Darkness",
    COLLATERAL_DAMAGE = "Collateral Damage",
    CONSUME = "Consume",
    CORRODE = "Corrode",
    CORROSIVE_BREATH = "Corrosive Breath",
    COURAGEOUS = "Courageous",
    COWARDLY = "Cowardly",
    CREATE_DEAD = "Create Dead",
    DAMAGE_RESISTANT = "Damage Resistant",
    DAMAGE_TYPES = "Damage Types",
    DAYLIGHT_WEAKNESS = "Daylight Weakness",
    DEAD = "Dead",
    DEFLECT = "Deflect",
    DEMONIC = "Demonic",
    DIG = "Dig!",
    DIMINISHED = "Diminished",
    DIRE_HYENA_MOUNTS = "Dire Hyena Mounts",
    DISENGAGE = "Disengage",
    DISRUPTIVE = "Disruptive",
    DRACONIC_ANCESTRY = "Draconic Ancestry",
    DRAGONKIN = "Dragonkin",
    DRONE = "Drone",
    ELFSHOT = "Elfshot",
    EMBIGGEN = "Embiggen",
    ENCOURAGE = "Encourage",
    ETERNAL = "Eternal",
    ETHEREAL = "Ethereal",
    EXPENDABLE = "Expendable",
    FADE = "Fade",
    FAST_SIEGE_WEAPON_HEAVY = "Fast Siege Weapon (Heavy)",
    FAST_SIEGE_WEAPON = "Fast Siege Weapon",
    FEARLESS = "Fearless",
    FEARSOME = "Fearsome",
    FEAST = "Feast",
    FIENDISH = "Fiendish",
    FIRE_BLAST = "Fire Blast",
    FIRE_BREATH = "Fire Breath",
    FIRE_IMMUNITY = "Fire Immunity",
    FLAMING_WEAPONS = "Flaming Weapons",
    FLIGHT = "Flight",
    FOLLOW_THE_STANDARD = "Follow the Standard!",
    FRENZY = "Frenzy",
    GUERRILLAS = "Guerrillas",
    GULP = "Gulp",
    HALLUCINATORY_SPORES = "Hallucinatory Spores",
    HARD_HATS = "Hard Hats",
    HARRIERS = "Harriers",
    HARROWING = "Harrowing",
    HEROES_OF_THE_MYRIAD_WORLDS = "Heroes of the Myriad Worlds",
    HOLY = "Holy",
    HONORABLE = "Honorable",
    HOP = "Hop",
    HORRIFY = "Horrify",
    HURL_ROCKS = "Hurl Rocks",
    IMMUNITY = "Immunity",
    IMPLACABLE = "Implacable",
    INDISTINCT = "Indistinct",
    INEXORABLE = "Inexorable",
    INSPIRE_FEAR = "Inspire Fear",
    INTO_THE_BREACH = "Into the Breach",
    INVISIBILITY = "Invisibility",
    JAUNT = "Jaunt",
    LIFE_DRAIN = "Life Drain",
    LIGHTNING_BREATH = "Lightning Breath",
    LIMITED_FLIGHT = "Limited Flight",
    LOAD_THE_BONES = "Load the Bones",
    LONG_LIVED = "Long-Lived",
    LONG_RANGED = "Long-Ranged",
    MAGIC_RESISTANCE = "Magic Resistance",
    MAGIC_RESISTANT = "Magic Resistant",
    MAGICAL_ADEPTS = "Magical Adepts",
    MANEUVER_EVASIVE_MANEUVERS = "Maneuver: “Evasive Maneuvers!”",
    MANEUVER_FIRE = "Maneuver: “Fire!!”",
    MANEUVER_HOLD_THE_LINE = "Maneuver: “Hold the Line!”",
    MANEUVER_LANCERS_FLANK_THEM = "Maneuver: “Lancers! Flank Them!”",
    MANEUVER_LAND_AND_CHARGE = "Maneuver: “Land and Charge!”",
    MANEUVER_PREY_ON_THE_WEAK = "Maneuver: “Prey on the Weak.”",
    MANEUVER_RAM_THEM = "Maneuver: “Ram Them!”",
    MANEUVER_DETONATE = "Maneuver: Detonate",
    MANEUVER_OUTFLANK = "Maneuver: Outflank",
    MANEUVER_REPAIR = "Maneuver: Repair",
    MANEUVER_SPIT_UPON_THEIR_HORNS = "Maneuver: Spit Upon Their Horns",
    MANEUVER_STRAFE = "Maneuver: Strafe",
    MANEUVER_TESTUDO = "Maneuver: Testudo",
    MARTIAL = "Martial",
    MASS_PROTECTION_AGAINST_EVIL = "Mass Protection Against Evil",
    MEAT_SHIELD = "Meat Shield",
    MELD = "Meld",
    MINDLESS = "Mindless",
    MOBILE = "Mobile",
    NAME = "Name",
    NATURES_BOND = "Nature’s Bond",
    NONE = "None",
    NOXIOUS_FOG = "Noxious Fog",
    OBSCURING = "Obscuring",
    PACK_TACTICS = "Pack Tactics",
    PIKE_TRAINING = "Pike Training",
    PIKE_WALL = "Pike Wall",
    POINT_BLANK = "Point Blank",
    POISONOUS = "Poisonous",
    POOL_OF_SOULS_BLOOD = "Pool of Soul’s Blood",
    POWERFUL_CHARGE = "Powerful Charge",
    QUADRUPED = "Quadruped",
    RAM_RIDERS = "Ram Riders",
    RAVENOUS = "Ravenous",
    RECKLESS = "Reckless",
    REFLECTOR = "Reflector",
    REGENERATE = "Regenerate",
    RELENTLESS = "Relentless",
    RESOLUTE = "Resolute",
    RIME = "Rime",
    ROCK_HURLER = "Rock Hurler",
    ROCK = "Rock!",
    ROCK_BREAKER = "Rockbreaker",
    ROLLING_THUNDER = "Rolling Thunder",
    RUSH = "Rush",
    SAVAGE = "Savage",
    SCOURGE_OF_THE_WILD = "Scourge of the Wild",
    SCOUTS = "Scouts",
    SCREECH = "Screech",
    SHIELDED = "Shielded",
    SHOCK_TROOPS = "Shock Troops",
    SHORT_RANGED = "Short-Ranged",
    SIEGE = "Siege",
    SIEGE_ENGINE = "Siege Engine",
    SIEGE_UNIT = "Siege Unit",
    SIEGE_WEAPON = "Siege Weapon",
    SKIRMISH = "Skirmish",
    SLAM = "Slam",
    SLOW = "Slow",
    SMOKE_SCREEN = "Smoke Screen",
    SOLAR_FLARE = "Solar Flare",
    SOPORIFIC_SPORES = "Soporific Spores",
    SOW_CHAOS = "Sow Chaos",
    SPECIAL = "Special",
    SPIKE_SHOT = "Spike Shot",
    SPLIT = "Split",
    SPORES = "Spores",
    STALWART = "Stalwart",
    STEALTH = "Stealth",
    STINKY = "Stinky",
    STONE = "Stone",
    STONESKIN = "Stoneskin",
    STRENGTH_DRAIN = "Strength Drain",
    STRENGTH_IN_NUMBERS = "Strength in Numbers",
    STUPID = "Stupid",
    SWORDS_OF_THE_DRAGON_LORD = "Swords of the Dragon Lord",
    TO_THE_DEATH = "To the Death",
    TRAMPLE = "Trample",
    TWISTING_ROOTS = "Twisting Roots",
    UNDEAD = "Undead",
    UNDERMINE = "Undermine",
    UNSOLDIERS = "Unsoldiers",
    UNSTOPPABLE = "Unstoppable",
    VETERANS_OF_A_THOUSAND_WARS = "Veterans of a Thousand Wars",
    VULNERABILITY = "Vulnerability",
    WAIL = "Wail",
    WARBRED = "Warbred",
    WAVE = "Wave",
    WHIRLWIND = "Whirlwind",
    YOU_FOLLOW = "You Follow!"
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
    SKAVEN = "Skaven",
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
    id: string;
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
        id?: string,
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
        this.id = id || uuidv4();
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

export class Regiment {
    id: number;
    units: Unit[];
    show: boolean;

    constructor(id: number) {
        this.id = id;
        this.units = [];
        this.show = false;
    }
}