import { expect, test } from 'vitest'

import { statsCalculator } from '../../../unit/mixins/statsCalculator';
import { Ancestry, Equipment, Experience, Size, Trait, Type, Unit } from '../../../src/models/Unit';
import { Civilization, GoverningStyle } from '../../../src/models/Realm';

const unit = {
    ancestry: Ancestry.DWARF,
    experience: Experience.ELITE,
    equipment: Equipment.HEAVY,
    type: Type.INFANTRY,
    size: Size.D6,
    traits: [
        Trait.STALWART
    ]
} as Unit

test('calculate attack should work as expected', () => {
    expect(statsCalculator.methods.calculateAttack(unit)).toBe(5)
});

test('calculate defense should work as expected', () => {
    expect(statsCalculator.methods.calculateDefense(unit)).toBe(16)
});

test('calculate toughness should work as expected', () => {
    expect(statsCalculator.methods.calculateToughness(unit)).toBe(14)
});

test('calculate power should work as expected', () => {
    expect(statsCalculator.methods.calculatePower(unit)).toBe(5)
});

test('calculate morale should work as expected', () => {
    expect(statsCalculator.methods.calculateMorale(unit)).toBe(6)
});

test('calculate cost should work as expected', () => {
    expect(statsCalculator.methods.calculateCost(unit)).toBe(400)
});

test('calculate cost should work as expected with NONE governing style', () => {
    expect(statsCalculator.methods.calculateCost(unit, GoverningStyle.NONE)).toBe(400)
});

test('calculate cost should work as expected with NOBLE governing style', () => {
    expect(statsCalculator.methods.calculateCost(unit, GoverningStyle.NOBLE)).toBe(360)
});

test('calculate cost should work as expected with BARBARIC civilization', () => {
    expect(statsCalculator.methods.calculateCost(unit, GoverningStyle.NONE, Civilization.BARBARIC)).toBe(280)
});

test('calculate cost should work as expected with NOBLE and BARBARIC civilization', () => {
    expect(statsCalculator.methods.calculateCost(unit, GoverningStyle.NOBLE, Civilization.BARBARIC)).toBe(240)
});

test('calculate cost should work as expected with NOMADIC civilization', () => {
    expect(statsCalculator.methods.calculateCost(unit, GoverningStyle.NONE, Civilization.NOMADIC)).toBe(320)
});

test('calculate cost should work as expected with NOBLE and NOMADIC civilization', () => {
    expect(statsCalculator.methods.calculateCost(unit, GoverningStyle.NOBLE, Civilization.NOMADIC)).toBe(280)
});

test('calculate cost should work as expected with CIVILIZED civilization', () => {
    expect(statsCalculator.methods.calculateCost(unit, GoverningStyle.NONE, Civilization.CIVILIZED)).toBe(400)
});