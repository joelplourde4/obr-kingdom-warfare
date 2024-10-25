import { Civilization, GoverningStyle, UNIT_COST_CIVILIZATION_BARBARIC_MODIFIER, UNIT_COST_CIVILIZATION_NOMADIC_MODIFIER, UNIT_COST_GOVERNING_STYLE_NOBLE_MODIFIER } from '../../src/models/Realm.ts';
import { Tier, Type, Unit } from '../../src/models/Unit.ts';
import { ANCESTRY_STATS_MAP, EXPERIENCE_STATS_MAP, EQUIPMENT_STATS_MAP, TYPE_STATS_MAP, TYPE_COST_MODIFIER_MAP, SIZE_COST_MODIFIER_MAP, TRAIT_COST_MAP, INFANTRY_ATTACK_MAP, CAVALRY_AERIAL_ATTACK_MAP, ARTILLERY_ATTACK_MAP, INFANTRY_DAMAGE_MAP, CAVALRY_AERIAL_DAMAGE_MAP, TIER_I, TIER_II, TIER_III, TIER_IV } from '../models/Stats.ts'

export const statsCalculator = {
    methods: {
        calculateAttack(unit: Unit) {
            let attack = 0;
            attack += ANCESTRY_STATS_MAP.get(unit.ancestry)?.attack || 0;
            attack += EXPERIENCE_STATS_MAP.get(unit.experience)?.attack || 0;
            attack += EQUIPMENT_STATS_MAP.get(unit.equipment)?.attack || 0;
            attack += TYPE_STATS_MAP.get(unit.type)?.attack || 0;
            return attack;
        },
        calculateDefense(unit: Unit) {
            let defense = 10;
            defense += ANCESTRY_STATS_MAP.get(unit.ancestry)?.defense || 0;
            defense += EXPERIENCE_STATS_MAP.get(unit.experience)?.defense || 0;
            defense += EQUIPMENT_STATS_MAP.get(unit.equipment)?.defense || 0;
            defense += TYPE_STATS_MAP.get(unit.type)?.defense || 0;
            return defense;
        },
        calculateToughness(unit: Unit) {
            let toughness = 10;
            toughness += ANCESTRY_STATS_MAP.get(unit.ancestry)?.toughness || 0;
            toughness += EXPERIENCE_STATS_MAP.get(unit.experience)?.toughness || 0;
            toughness += EQUIPMENT_STATS_MAP.get(unit.equipment)?.toughness || 0;
            toughness += TYPE_STATS_MAP.get(unit.type)?.toughness || 0;
            return toughness;
        },
        calculatePower(unit: Unit) {
            let power = 0;
            power += ANCESTRY_STATS_MAP.get(unit.ancestry)?.power || 0;
            power += EXPERIENCE_STATS_MAP.get(unit.experience)?.power || 0;
            power += EQUIPMENT_STATS_MAP.get(unit.equipment)?.power || 0;
            power += TYPE_STATS_MAP.get(unit.type)?.power || 0;
            return power;
        },
        calculateMorale(unit: Unit) {
            let morale = 0;
            morale += ANCESTRY_STATS_MAP.get(unit.ancestry)?.morale || 0;
            morale += EXPERIENCE_STATS_MAP.get(unit.experience)?.morale || 0;
            morale += EQUIPMENT_STATS_MAP.get(unit.equipment)?.morale || 0;
            morale += TYPE_STATS_MAP.get(unit.type)?.morale || 0;
            return morale;
        },
        calculateCost(unit: Unit, governingStyle: GoverningStyle = GoverningStyle.NONE, civilization: Civilization = Civilization.CIVILIZED) {
            let cost = 0;

            cost += this.calculateAttack(unit);
            cost += this.calculatePower(unit);
            cost += this.calculateDefense(unit) - 10;
            cost += this.calculateToughness(unit) - 10;

            cost += this.calculateMorale(unit) * 2;

            cost *= TYPE_COST_MODIFIER_MAP.get(unit.type) || 1;

            cost *= SIZE_COST_MODIFIER_MAP.get(unit.size) || 1;

            cost *= 10;

            unit.traits.forEach(trait => {
                cost += TRAIT_COST_MAP.get(trait) || 50;
            });

            cost += 30;

            let bonusGoverningStyle = 0;
            let bonusCivilization = 0;

            if (governingStyle == GoverningStyle.NOBLE) {
                // For Noble Governing Style, the cost of troops is 10% less.
                bonusGoverningStyle = cost * (1 - UNIT_COST_GOVERNING_STYLE_NOBLE_MODIFIER);
            }

            if (civilization == Civilization.BARBARIC) {
                // For Barbaric Civilization, the cost of recruiting units is 30% less.
                bonusCivilization = cost * (1 - UNIT_COST_CIVILIZATION_BARBARIC_MODIFIER);
            } else if (civilization == Civilization.NOMADIC) {
                // For Nomadic Civilization, the cost of recruiting units is 20% less.
                bonusCivilization = cost * (1 - UNIT_COST_CIVILIZATION_NOMADIC_MODIFIER);
            }

            cost = cost - bonusGoverningStyle - bonusCivilization;

            return Math.round(cost);
        },
        calculateNumberAttacks(unit: Unit) {
            let numberAttack = 1;
            if (unit.type === Type.INFANTRY) {
                numberAttack += INFANTRY_ATTACK_MAP.get(unit.experience) || 0;
            } else if (unit.type === Type.CAVALRY) {
                numberAttack += CAVALRY_AERIAL_ATTACK_MAP.get(unit.experience) || 0;
            } else if (unit.type === Type.AERIAL) {
                numberAttack += CAVALRY_AERIAL_ATTACK_MAP.get(unit.experience) || 0;
            } else if (unit.type === Type.ARTILLERY) {
                numberAttack += ARTILLERY_ATTACK_MAP.get(unit.experience) || 0;
            }
            return numberAttack;
        },
        calculateDamage(unit: Unit) {
            let damage = 1;

            if (unit.type === Type.INFANTRY) {
                damage += INFANTRY_DAMAGE_MAP.get(unit.equipment) || 0;
            } else if (unit.type === Type.CAVALRY) {
                damage += CAVALRY_AERIAL_DAMAGE_MAP.get(unit.equipment) || 0;
            } else if (unit.type === Type.AERIAL) {
                damage += CAVALRY_AERIAL_DAMAGE_MAP.get(unit.equipment) || 0;
            }
            return damage;
        },
        calculateMovement(unit: Unit) {
            let movement = 1;
            if (unit.type === Type.CAVALRY) {
                movement += 1;
            }
            if (unit.type === Type.AERIAL) {
                movement += 1;
            }
            return movement;
        },
        calculateTier(unit: Unit) {
            if (unit.cost <= 0) {
                unit.cost = this.calculateCost(unit);
            }

            if (unit.cost <= TIER_I) {
                return Tier.I;
            } else if (unit.cost <= TIER_II) {
                return Tier.II;
            } else if (unit.cost <= TIER_III) {
                return Tier.III;
            } else if (unit.cost <= TIER_IV) {
                return Tier.IV;
            }
            return Tier.V;
        }
    },
  };