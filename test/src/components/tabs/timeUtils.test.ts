import { expect, test } from 'vitest'
import { Config, Time } from '../../../../src/models/Config';
import { Calendar, Realm } from '../../../../src/models/Realm';

import { timeUtils } from '../../../../src/mixins/timeUtils';

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

    realm = timeUtils.methods.incrementTime(config, realm);
    expect(realm.calendar.week).toBe(2);
    realm = timeUtils.methods.incrementTime(config, realm);
    expect(realm.calendar.week).toBe(3);
    realm = timeUtils.methods.incrementTime(config, realm);
    expect(realm.calendar.week).toBe(4);
    realm = timeUtils.methods.incrementTime(config, realm);
    expect(realm.calendar.week).toBe(1);
    expect(realm.calendar.month).toBe(2);
    realm = timeUtils.methods.deincrementTime(config, realm);
    expect(realm.calendar.week).toBe(4);
    expect(realm.calendar.month).toBe(1);
    realm = timeUtils.methods.deincrementTime(config, realm);
    expect(realm.calendar.week).toBe(3);
    realm = timeUtils.methods.deincrementTime(config, realm);
    expect(realm.calendar.week).toBe(2);
    realm = timeUtils.methods.deincrementTime(config, realm);
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
        realm = timeUtils.methods.incrementTime(config, realm);
    }

    expect(realm.calendar.week).toBe(1);
    expect(realm.calendar.month).toBe(1);
    expect(realm.calendar.year).toBe(2);

    for (let i = 0; i < 48; i++) {
        realm = timeUtils.methods.deincrementTime(config, realm);
    }

    expect(realm.calendar.week).toBe(1);
    expect(realm.calendar.month).toBe(1);
    expect(realm.calendar.year).toBe(1);
});