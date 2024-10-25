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
        }
    }
};