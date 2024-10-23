import { expect, test } from 'vitest'

import { treasuryCalculator } from '../../../../src/mixins/treasuryCalculator';
import { Config } from '../../../../src/models/Config';
import { Civilization, GoverningStyle, Heritage, PopulationCenter, Province, Realm, Terrain } from '../../../../src/models/Realm';
import { Unit } from '../../../../src/models/Unit';

const config = {
    multiplier: 100
} as Config;

const realm = {
    heritage: Heritage.ELVES,
    civilization: Civilization.CIVILIZED,
    governingStyle: GoverningStyle.NOBLE,
} as Realm

const province = {
    terrain: Terrain.FOREST,
    populationCenter: PopulationCenter.VILLAGE,
    production: 1000,
    upkeep: 248
} as Province;

test ('calculateProvinceModifier should work as expected', () => {
    expect(treasuryCalculator.methods.calculateProvinceProductionModifier(realm)).toBe(0.25);
});

test ('calculateProvinceProduction should calculate civilization bonus independently than governing style bonus.', () => {
    const realm2 = {
        heritage: Heritage.ELVES,
        civilization: Civilization.CIVILIZED,
        governingStyle: GoverningStyle.DESPOTIC,
    } as Realm

    expect(treasuryCalculator.methods.calculateProvinceProduction(config, realm, province)).toBe(1000);
    expect(treasuryCalculator.methods.calculateProvinceProduction(config, realm2, province)).toBe(1200);
});

test ('calculateProvinceUpkeepDiscount should work as expected', () => {
    const realm2 = {
        heritage: Heritage.ELVES,
        civilization: Civilization.BARBARIC,
        governingStyle: GoverningStyle.DESPOTIC,
    } as Realm
    
    expect(treasuryCalculator.methods.calculateProvinceUpkeepDiscount(realm)).toBe(-0.1);
    expect(treasuryCalculator.methods.calculateProvinceUpkeepDiscount(realm2)).toBe(0);
});

test ('calculateProvinceUpkeep should calculate civilization bonus independently than governing style bonus.', () => {
    expect(treasuryCalculator.methods.calculateProvinceUpkeep(realm, province)).toBe(248);
});

test ('calculateProvinceProfit should work as expected', () => {
    expect(treasuryCalculator.methods.calculateProvinceProfit(province)).toBe(752);
});

test ('calculateProvincesProfit should work as expected', () => {
    const provinces = [
        { profit: 752 } as Province,
        { profit: 112.5 } as Province,
        { profit: 300 } as Province,
    ]

    expect(treasuryCalculator.methods.calculateProvinceProfits(provinces)).toBe(1165);
})

test ('calculateUnitsUpkeep should work as expected', () => {
    const units = [
        { upkeep: 10 } as Unit,
        { upkeep: 22.5 } as Unit,
        { upkeep: 30 } as Unit,
    ];

    expect(treasuryCalculator.methods.calculateUnitsUpkeep(units)).toBe(63);
});

test ('calculateForecast should work as expected', () => {
    expect(treasuryCalculator.methods.calculateForecast(1165, 63)).toBe(1102);
});