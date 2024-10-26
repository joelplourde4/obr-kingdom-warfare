import { Config } from "../models/Config";
import { Calendar, Realm } from "../models/Realm";

export const timeUtils = {
    methods: {
        /**
         * ----------------- Time Section --------------------------
         */
        /**
         * Incrementing the time of the Realm from the settings in the Config.
         */
        incrementTime(config: Config, realm: Realm) {
            if (realm.calendar == undefined) {
                realm.calendar = new Calendar();
            }

            realm.calendar.week++;

            if (realm.calendar.week > config.time.weekCount) {
                realm.calendar.week = 1;
                realm.calendar.month++;

                if (realm.calendar.month > config.time.monthCount) {
                    realm.calendar.month = 1;
                    realm.calendar.year++;
                }
            }
        },
        /**
         * Deincrementing the time of the Realm from the settings in the Config.
         */
        deincrementTime(config: Config, realm: Realm) {
            if (realm.calendar == undefined) {
                realm.calendar = new Calendar();
            }

            realm.calendar.week--;

            if (realm.calendar.week <= 0) {
                realm.calendar.week = config.time.weekCount;
                realm.calendar.month--;

                if (realm.calendar.month <= 0) {
                    realm.calendar.month = config.time.monthCount;
                    realm.calendar.year--;
                }
            }
        }
    }
};