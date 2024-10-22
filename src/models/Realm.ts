/**
 * A Realm is the main class that represents the physical attributes of the Kingdom.
 */
export class Realm {
    provinces : Province[];
    heritage: Heritage;
    civilization: Civilization;
    governingStyle: GoverningStyle;
    treasury: number;

    constructor () {
        this.provinces = [];
        this.heritage = Heritage.HUMAN;
        this.civilization = Civilization.CULTURED;
        this.governingStyle = GoverningStyle.NONE;
        this.treasury = 0;
    }
}

export class Province {
    id: string;
    terrain: Terrain;
    populationCenter: PopulationCenter;
    production: number;
    upkeep: number;
    profit: number;
    color: string;

    constructor (id: string) {
        this.id = id;
        this.terrain = Terrain.NONE;
        this.populationCenter = PopulationCenter.NONE;
        this.production = 0;
        this.upkeep = 0;
        this.profit = 0;
        this.color = "#000000";
    }
}

export enum Terrain {
    NONE = "None",
    PLAINS = "Plains",
    HILL = "Hill",
    MOUNTAIN = "Mountain",
    MARSH = "Marsh",
    FOREST = "Forest",
    DESERT = "Desert",
    AQUATIC = "Aquatic",
    UNDERGROUND = "Underground",
}

export enum PopulationCenter {
    NONE = "None",
    THORPE = "Thorpe",
    HAMLET = "Hamlet",
    VILLAGE = "Village",
    SMALL_TOWN = "Small Town",
    LARGE_TOWN = "Large Town",
    SMALL_CITY = "Small City",
    LARGE_CITY = "Large City",
    METROPOLIS = "Metropolis",
    /** Nomadic Civilization */
    SMALL_CAMP = "Small Camp",
    MEDIUM_CAMP = "Medium Camp",
    LARGE_CAMP = "Large Camp"
}

export enum Heritage {
    HUMAN = "Human",
    DWARVEN = "Dwarf",
    ELVES = "Elf",
    SKAVEN = "Skaven"
}

export enum Civilization {
    NOMADIC = "Nomadic",
    BARBARIC = "Barbaric",
    CULTURED = "Cultured",
    CIVILIZED = "Civilized"
}

export enum GoverningStyle {
    NONE = "None",
    DESPOTIC = "Despotic",
    WARLORD = "Warlord",
    NOBLE = "Noble",
    NEUTRAL = "Neutral"
}

/** Constant */
// A unit’s upkeep is equal to 25% of the cost of the unit’s current value
export const UNIT_UPKEEP_FACTOR = 0.25;

export const UNIT_COST_GOVERNING_STYLE_NOBLE_MODIFIER = 0.9;
export const UNIT_COST_CIVILIZATION_BARBARIC_MODIFIER = 0.7;
export const UNIT_COST_CIVILIZATION_NOMADIC_MODIFIER = 0.8;

/** Data Map */
export const POPULATION_CENTER_PRODUCTION_MODIFIER = new Map<PopulationCenter, number>([
    [PopulationCenter.NONE, 0],
    [PopulationCenter.THORPE, 0.25],
    [PopulationCenter.HAMLET, 0.5],
    [PopulationCenter.VILLAGE, 1],
    [PopulationCenter.SMALL_TOWN, 2],
    [PopulationCenter.LARGE_TOWN, 2.5],
    [PopulationCenter.SMALL_CITY, 3],
    [PopulationCenter.LARGE_CITY, 4],
    [PopulationCenter.METROPOLIS, 5],
    /** Nomadic Civilization */
    [PopulationCenter.SMALL_CAMP, 1],
    [PopulationCenter.MEDIUM_CAMP, 1.5],
    [PopulationCenter.LARGE_CAMP, 2]
]);

export const POPULATION_CENTER_UPKEEP = new Map<PopulationCenter, number>([
    [PopulationCenter.THORPE, 100],
    [PopulationCenter.HAMLET, 150],
    [PopulationCenter.VILLAGE, 225],
    [PopulationCenter.SMALL_TOWN, 1000],
    [PopulationCenter.LARGE_TOWN, 1500],
    [PopulationCenter.SMALL_CITY, 2000],
    [PopulationCenter.LARGE_CITY, 3600],
    [PopulationCenter.METROPOLIS, 5500],
    /** Nomadic Civilization */
    [PopulationCenter.SMALL_CAMP, 0],
    [PopulationCenter.MEDIUM_CAMP, 0],
    [PopulationCenter.LARGE_CAMP, 0]
]);

export const CIVILIZATION_PRODUCTION_MODIFIER = new Map<Civilization, number>([
    [Civilization.NOMADIC, 0.0],
    [Civilization.BARBARIC, 0.75],
    [Civilization.CULTURED, 1.0],
    [Civilization.CIVILIZED, 1.25]
]);

export const CIVILIZATION_POPULATION_CENTER_UPKEEP_MODIFIER = new Map<Civilization, number>([
    [Civilization.NOMADIC, 1.0],
    [Civilization.BARBARIC, 0.75],
    [Civilization.CULTURED, 1.0],
    [Civilization.CIVILIZED, 1.0]
]);

export const GOVERNING_STYLE_PRODUCTION_MODIFIER = new Map<GoverningStyle, number>([
    [GoverningStyle.DESPOTIC, 1.25],
    [GoverningStyle.WARLORD, 1.1],
    [GoverningStyle.NOBLE, 1.0],
    [GoverningStyle.NONE, 1.0],
    [GoverningStyle.NEUTRAL, 1.0]
]);

export const HERITAGE_TERRAIN_MODIFIER = new Map<Heritage, Map<Terrain, number>>([
    [
        Heritage.HUMAN, 
        new Map<Terrain, number>([
            [Terrain.AQUATIC, 3],
            [Terrain.DESERT, 2],
            [Terrain.FOREST, 4],
            [Terrain.HILL, 4],
            [Terrain.MARSH, 2],
            [Terrain.MOUNTAIN, 2],
            [Terrain.NONE, 0],
            [Terrain.PLAINS, 6],
            [Terrain.UNDERGROUND, 1]
        ])
    ],
    [
        Heritage.DWARVEN, 
        new Map<Terrain, number>([
            [Terrain.AQUATIC, 1],
            [Terrain.DESERT, 2],
            [Terrain.FOREST, 1],
            [Terrain.HILL, 5],
            [Terrain.MARSH, 1],
            [Terrain.MOUNTAIN, 8],
            [Terrain.NONE, 0],
            [Terrain.PLAINS, 2],
            [Terrain.UNDERGROUND, 2]
        ])
    ],
    [
        Heritage.ELVES, 
        new Map<Terrain, number>([
            [Terrain.AQUATIC, 3],
            [Terrain.DESERT, 2],
            [Terrain.FOREST, 8],
            [Terrain.HILL, 2],
            [Terrain.MARSH, 2],
            [Terrain.MOUNTAIN, 1],
            [Terrain.NONE, 0],
            [Terrain.PLAINS, 3],
            [Terrain.UNDERGROUND, 3]
        ])
    ],
    [
        Heritage.SKAVEN, 
        new Map<Terrain, number>([
            [Terrain.AQUATIC, 1],
            [Terrain.DESERT, 4],
            [Terrain.FOREST, 2],
            [Terrain.HILL, 2],
            [Terrain.MARSH, 1],
            [Terrain.MOUNTAIN, 4],
            [Terrain.NONE, 0],
            [Terrain.PLAINS, 2],
            [Terrain.UNDERGROUND, 8]
        ])
    ]
]);