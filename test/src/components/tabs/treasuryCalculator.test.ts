import { expect, test } from 'vitest'

import { treasuryCalculator } from '../../../../src/mixins/treasuryCalculator';
import { Config, Time } from '../../../../src/models/Config';
import { Calendar, Civilization, GoverningStyle, Heritage, PopulationCenter, Province, Realm, Terrain } from '../../../../src/models/Realm';
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
    populationCenter: PopulationCenter.VILLAGE
} as Province;

test ('calculateProvinceModifier should work as expected', () => {
    expect(treasuryCalculator.methods.getProvinceProductionModifier(realm)).toBe(0.25);
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
    
    expect(treasuryCalculator.methods.getProvinceUpkeepDiscount(realm)).toBe(-0.1);
    expect(treasuryCalculator.methods.getProvinceUpkeepDiscount(realm2)).toBe(0);
});

test ('calculateProvinceUpkeep should calculate civilization bonus independently than governing style bonus.', () => {
    expect(treasuryCalculator.methods.calculateProvinceUpkeep(realm, province)).toBe(248);
});

test ('calculateProvinceProfit should work as expected', () => {
    const realm = {
        heritage: Heritage.ELVES,
        civilization: Civilization.CIVILIZED,
        governingStyle: GoverningStyle.NOBLE,
    } as Realm
    
    const province = {
        terrain: Terrain.FOREST,
        populationCenter: PopulationCenter.VILLAGE
    } as Province;

    expect(treasuryCalculator.methods.calculateProvinceProduction(config, realm, province)).toBe(1000);
    expect(treasuryCalculator.methods.calculateProvinceUpkeep(realm, province)).toBe(248);
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

/**
 * Nomads
 */
test ('Switching civilization should reset province production', () => {
    const nomadicRealm = {
        heritage: Heritage.ELVES,
        civilization: Civilization.NOMADIC,
        governingStyle: GoverningStyle.NONE,
    } as Realm

    const province1 = {
        terrain: Terrain.FOREST,
        populationCenter: PopulationCenter.VILLAGE, // Village is not a valid NOMADIC population
    } as Province;

    expect(treasuryCalculator.methods.calculateProvinceProduction(config, nomadicRealm, province1)).toBe(0);

    const barbaricRealm = {
        heritage: Heritage.ELVES,
        civilization: Civilization.BARBARIC,
        governingStyle: GoverningStyle.NONE,
    } as Realm

    const province2 = {
        terrain: Terrain.FOREST,
        populationCenter: PopulationCenter.SMALL_CAMP, // Small Camp is not a valid BARBARIC population
    } as Province;

    expect(treasuryCalculator.methods.calculateProvinceProduction(config, barbaricRealm, province2)).toBe(0);
});

test ('incrementing time (weeks) should work as expected', () => {
    // Regular calendar
    const config = {
        time: {
            weekCount: 4,
            monthCount: 12
        } as Time
    } as Config

    // The game starts at any point in time
    let realm = {
        calendar: {
            week: 1,
            month: 1,
            year: 1
        } as Calendar
    } as Realm

    realm = treasuryCalculator.methods.incrementTime(config, realm);
    expect(realm.calendar.week).toBe(2);
    realm = treasuryCalculator.methods.incrementTime(config, realm);
    expect(realm.calendar.week).toBe(3);
    realm = treasuryCalculator.methods.incrementTime(config, realm);
    expect(realm.calendar.week).toBe(4);
    realm = treasuryCalculator.methods.incrementTime(config, realm);
    expect(realm.calendar.week).toBe(1);
    expect(realm.calendar.month).toBe(2);
    realm = treasuryCalculator.methods.deincrementTime(config, realm);
    expect(realm.calendar.week).toBe(4);
    expect(realm.calendar.month).toBe(1);
    realm = treasuryCalculator.methods.deincrementTime(config, realm);
    expect(realm.calendar.week).toBe(3);
    realm = treasuryCalculator.methods.deincrementTime(config, realm);
    expect(realm.calendar.week).toBe(2);
    realm = treasuryCalculator.methods.deincrementTime(config, realm);
    expect(realm.calendar.week).toBe(1);
});

test ('incrementing/deincrementing time should work as expected', () => {
    // Regular calendar
    const config = {
        time: {
            weekCount: 4,
            monthCount: 12
        } as Time
    } as Config

    // The game starts at any point in time
    let realm = {
        calendar: {
            week: 1,
            month: 1,
            year: 1
        } as Calendar
    } as Realm

    for (let i = 0; i < 48; i++) {
        realm = treasuryCalculator.methods.incrementTime(config, realm);
    }

    expect(realm.calendar.week).toBe(1);
    expect(realm.calendar.month).toBe(1);
    expect(realm.calendar.year).toBe(2);

    for (let i = 0; i < 48; i++) {
        realm = treasuryCalculator.methods.deincrementTime(config, realm);
    }

    expect(realm.calendar.week).toBe(1);
    expect(realm.calendar.month).toBe(1);
    expect(realm.calendar.year).toBe(1);
});

test ('adding to treasury should work as expected', () => {
    // The game starts every player have 0 in there treasury
    let realm = {
        treasury: 0
    } as Realm

    realm = treasuryCalculator.methods.addForecastToTreasury(realm, 100);
    expect(realm.treasury).toBe(100);
    expect(realm.forecasts).toStrictEqual([100]);

    realm = treasuryCalculator.methods.addForecastToTreasury(realm, 100);
    expect(realm.treasury).toBe(200);
    expect(realm.forecasts).toStrictEqual([100, 100]);
})

test ('should be able to go back in time for a player to re-make a turn', () => {
    // The game starts every player have 0 in there treasury
    let realm = {
        treasury: 0
    } as Realm

    realm = treasuryCalculator.methods.addForecastToTreasury(realm, 500);
    expect(realm.treasury).toBe(500);
    expect(realm.forecasts).toStrictEqual([500]);

    realm = treasuryCalculator.methods.addForecastToTreasury(realm, 300);
    expect(realm.treasury).toBe(800);
    expect(realm.forecasts).toStrictEqual([500, 300]);

    // Now one of the player wasn't ready before we proceeded.
    realm = treasuryCalculator.methods.removeFromTreasury(realm);
    expect(realm.treasury).toBe(500);
    expect(realm.forecasts).toStrictEqual([500]);

    // We can now proceed after the player made an adjustment.
    realm = treasuryCalculator.methods.addForecastToTreasury(realm, 400);
    expect(realm.treasury).toBe(900);
    expect(realm.forecasts).toStrictEqual([500, 400]);
});

test ('should only be able to go back in time up to 5 turns', () => {
    // The game starts every player have 0 in there treasury
    let realm = {
        treasury: 0
    } as Realm

    // The game goes on for 10 rounds
    for (let i = 0; i < 10; i++) {
        realm = treasuryCalculator.methods.addForecastToTreasury(realm, 100);
    }

    expect(realm.treasury).toBe(1000);
    expect(realm.forecasts).toStrictEqual([100, 100, 100, 100, 100]);

    // You should only be able to go back 5 turns, further attempts won't do anything.
    for (let i = 0; i < 10; i++) {
        realm = treasuryCalculator.methods.removeFromTreasury(realm);
    }

    expect(realm.treasury).toBe(500);
    expect(realm.forecasts).toStrictEqual([]);
});

test ('evaluate an expression should work as expected', () => {
    expect(treasuryCalculator.methods.evaluateExpression('9500-123', 9500)).toBe(9377)
    expect(treasuryCalculator.methods.evaluateExpression('9500+123', 9500)).toBe(9623)
    expect(treasuryCalculator.methods.evaluateExpression('9500*2', 9500)).toBe(19000)
    expect(treasuryCalculator.methods.evaluateExpression('9500/2', 9500)).toBe(4750)
    expect(treasuryCalculator.methods.evaluateExpression('9500 allo 2', 9500)).toBe(9500)
});

test ('compareCalendar should work as expected', () => {
    const before = {
        week: 3,
        month: 2,
        year: 1
    } as Calendar;

    const after = {
        week: 4,
        month: 2,
        year: 1
    } as Calendar;

    expect(treasuryCalculator.methods.compareCalendar(before, after)).toBe(1);
    expect(treasuryCalculator.methods.compareCalendar(before, before)).toBe(0);
    expect(treasuryCalculator.methods.compareCalendar(after, after)).toBe(0);
    expect(treasuryCalculator.methods.compareCalendar(after, before)).toBe(-1);
});