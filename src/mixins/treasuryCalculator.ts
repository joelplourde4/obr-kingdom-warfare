import { Config } from "../models/Config";
import { Calendar, Civilization, CIVILIZATION_POPULATION_CENTER_UPKEEP_MODIFIER, CIVILIZATION_PRODUCTION_MODIFIER, GOVERNING_STYLE_PRODUCTION_MODIFIER, GOVERNING_STYLE_PROVINCE_UPKEEP, GoverningStyle, HERITAGE_TERRAIN_MODIFIER, POPULATION_CENTER_PRODUCTION_MODIFIER, POPULATION_CENTER_UPKEEP, PopulationCenter, Province, Realm, UNIT_COST_CIVILIZATION_BARBARIC_MODIFIER, UNIT_COST_CIVILIZATION_NOMADIC_MODIFIER, UNIT_COST_GOVERNING_STYLE_NOBLE_MODIFIER } from "../models/Realm";
import { Unit } from "../models/Unit";

export const treasuryCalculator = {
    methods: {
        validatePopulationCenter(realm: Realm, populationCenter: PopulationCenter): PopulationCenter {
            const nomadicCenter = [
                PopulationCenter.NONE, 
                PopulationCenter.SMALL_CAMP,
                PopulationCenter.MEDIUM_CAMP,
                PopulationCenter.LARGE_CAMP
            ]

            const index = nomadicCenter.findIndex(x => x == populationCenter);
            if (realm.civilization == Civilization.NOMADIC) {
                if (index < 0) {
                    return PopulationCenter.NONE;
                } 
            } else {
                if (index >= 0) {
                    return PopulationCenter.NONE;
                }
            }
            return populationCenter;
        },
        /**
         * Calculate the production of a province based on the province as well as realm's heritage, civilization, and governing style.
         */
        calculateProvinceProduction(config: Config, realm: Realm, province: Province): number {
            // Based on the Terrain, get the base production of the province.
            const terrainModifiers = HERITAGE_TERRAIN_MODIFIER.get(realm.heritage);
            const terrainModifier = terrainModifiers?.get(province.terrain) || 0;

            province.populationCenter = this.validatePopulationCenter(realm, province.populationCenter);

            const productionModifier = POPULATION_CENTER_PRODUCTION_MODIFIER.get(province.populationCenter) || 0;

            // Calculate the base value
            let revenue = terrainModifier * productionModifier * config.multiplier;

            const modifier = this.getProvinceProductionModifier(realm);
            revenue = revenue + (revenue * modifier);

            province.production = Math.round(revenue);
            return province.production;
        },
        getUnitCostModifier(governingStyle: GoverningStyle, civilization: Civilization): number {
            let bonusGoverningStyle = 0;
            let bonusCivilization = 0;

            if (governingStyle == GoverningStyle.NOBLE) {
                bonusGoverningStyle = 1 - UNIT_COST_GOVERNING_STYLE_NOBLE_MODIFIER;
            }

            if (civilization == Civilization.BARBARIC) {
                bonusCivilization = 1 - UNIT_COST_CIVILIZATION_BARBARIC_MODIFIER;
            } else if (civilization == Civilization.NOMADIC) {
                bonusCivilization = 1 - UNIT_COST_CIVILIZATION_NOMADIC_MODIFIER;
            }

            return - bonusGoverningStyle - bonusCivilization;
        },
        getProvinceProductionModifier(realm: Realm): number {
            let modifier = 0;
            modifier += (CIVILIZATION_PRODUCTION_MODIFIER.get(realm.civilization) || 1.0) - 1;
            modifier += (GOVERNING_STYLE_PRODUCTION_MODIFIER.get(realm.governingStyle) || 1.0) - 1;
            return Number(modifier.toFixed(3))
        },
        /**
         * Calculate the discount of a province's upkeep based on the realm's civilization and governing style.
         */
        getProvinceUpkeepDiscount(realm: Realm): number {
            let discount = 0;
            discount += 1 - (CIVILIZATION_POPULATION_CENTER_UPKEEP_MODIFIER.get(realm.civilization) || 1.0);
            discount += 1 - (GOVERNING_STYLE_PROVINCE_UPKEEP.get(realm.governingStyle) || 1.0);
            return Number(discount.toFixed(3))
        },
        /**
         * Calculate the upkeep of a province based on the province as well as realm's civilization and governing style.
         */
        calculateProvinceUpkeep(realm: Realm, province: Province): number {
            // Get the base value
            let upkeep =  POPULATION_CENTER_UPKEEP.get(province.populationCenter) || 0;
            let discount = this.getProvinceUpkeepDiscount(realm);
            upkeep = upkeep - (upkeep * discount);
            province.upkeep = Math.round(upkeep);
            return province.upkeep;
        },
        /**
         * Calculate the profit of a province based on the production and upkeep of the province.
         */
        calculateProvinceProfit(province: Province): number {
            province.profit = Math.round(province.production - province.upkeep);
            return province.profit;
        },
        /**
         * Calculate the total profit of a list of provinces.
         */
        calculateProvinceProfits(provinces: Province[]): number {
            let profit = 0;
            for (let province of provinces) {
                profit += province.profit;
            }
            return Math.round(profit);
        },
        /**
         * Calculate the upkeep of a list of units.
         */
        calculateUnitsUpkeep(units: Unit[]) {
            let upkeep = 0;
            for (let unit of units) {
                upkeep += unit.upkeep;
            }
            return Math.round(upkeep);
        },
        /**
         * Calculate the forecast based on the total profit and total upkeep.
         */
        calculateForecast(totalProfit: number, totalUpkeep: number) {
            return Math.round(totalProfit - totalUpkeep);
        },
        /**
         * ----------------- Time Section --------------------------
         */
        /**
         * Incrementing the time of the Realm from the settings in the Config.
         */
        incrementTime(config: Config, realm: Realm) {
            const copy = JSON.parse(JSON.stringify(realm));

            if (copy.calendar == undefined) {
                copy.calendar = new Calendar();
            }

            copy.calendar.week++;

            if (copy.calendar.week > config.time.weekCount) {
                copy.calendar.week = 1;
                copy.calendar.month++;

                if (copy.calendar.month > config.time.monthCount) {
                    copy.calendar.month = 1;
                    copy.calendar.year++;
                }
            }
            return copy;
        },
        /**
         * Deincrementing the time of the Realm from the settings in the Config.
         */
        deincrementTime(config: Config, realm: Realm) {
            const copy = JSON.parse(JSON.stringify(realm));

            copy.calendar.week--;

            if (copy.calendar.week <= 0) {
                copy.calendar.week = config.time.weekCount;
                copy.calendar.month--;

                if (copy.calendar.month <= 0) {
                    copy.calendar.month = config.time.monthCount;
                    copy.calendar.year--;
                }
            }
            return copy;
        },
        /**
         * Compare two calendar to determine whether it has advanced or not.
         * @param source The source calendar
         * @param next The next calendar
         */
        compareCalendar(before: Calendar, after: Calendar) {
            if (before.year < after.year) {
                return 1;
            }

            if (before.year > after.year) {
                return -1;
            }

            if (before.month < after.month) {
                return 1;
            }
        
            if (before.month > after.month) {
                return -1;
            }

            if (before.week < after.week) {
                return 1;
            }
        
            if (before.week > after.week) {
                return -1;
            }

            return 0;
        },
        /**
         * ----------------- Treasury Section --------------------------
         */
        /**
         * Add a value to the treasury
         * @param realm The realm
         * @param forecast The value that was forecasted.
         */
        addForecastToTreasury(realm: Realm, forecast: number) {
            const copy = JSON.parse(JSON.stringify(realm));

            copy.treasury += forecast;
            if (copy.forecasts === undefined) {
                copy.forecasts = [];
            }
            copy.forecasts.push(forecast);

            // We only keep the previous 5 turns for simplicity sake
            if (copy.forecasts.length > 5) {
                copy.forecasts.shift();
            }
            return copy;
        },
        /**
         * Remove from the Treasury based on the previous turns.
         * @param realm The realm
         */
        removeFromTreasury(realm: Realm) {
            const copy = JSON.parse(JSON.stringify(realm));

            if (copy.forecasts.length !== 0) {
                const previousValue = copy.forecasts.pop() || 0;
                copy.treasury -= previousValue;
            }
            return copy;
        },
        /**
         * Evaluate an Expression
         */
        evaluateExpression(expression: string, value: number): number {
            try {
                return Function(`'use strict'; return (${expression})`)()
            } catch (error) {
                return value;
            }
        }
    }
};