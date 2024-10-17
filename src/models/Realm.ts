/**
 * A Realm is the main class that represents the physical attributes of the Kingdom.
 */
export class Realm {
    provinces : Province[];

    constructor () {
        this.provinces = [];
    }
}

export class Province {
    id: string;
    terrain: Terrain;
    populationCenter: PopulationCenter;
    color: string;

    constructor (id: string) {
        this.id = id;
        this.terrain = Terrain.NONE;
        this.populationCenter = PopulationCenter.NONE;
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
    AQUATIC = "Aquatic"
}

export enum PopulationCenter {
    NONE = "None",
    CAMP = "Camp",
    HAMLET = "Hamlet",
    VILLAGE = "Village",
    SMALL_TOWN = "Small Town",
    LARGE_TOWN = "Large Town",
    SMALL_CITY = "Small City",
    LARGE_CITY = "Large City",
    METROPOLIS = "Metropolis"
}