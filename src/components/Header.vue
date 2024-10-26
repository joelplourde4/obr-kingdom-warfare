<template>
    <div class="row">
        <input class="title" v-model="domain.name" @input="onUpdate" :disabled="isDisabled">
    </div>
    <div class="row">
            <div class="column row">
                <div class="tooltip">
                    <p class="descriptor tooltip">Domain Size</p>
                    <span class="tooltiptext">
                        Size is a relative measure of the reach, influence and how far a domain's power extends.
                    </span>
                </div>
                <select class="dropdown" v-model="domain.size" @change="onUpdate" :disabled="isDisabled">
                    <option v-for="size in Size" :value="size">
                        {{ size }}
                    </option>
                </select>
            </div>
            <div class="column row">
                <div class="tooltip">
                    <p class="descriptor">Power Die</p>
                    <span class="tooltiptext">
                        Each officer in a domain has one power die, 
                        with its type based on the domain's size. 
                        After rolling initiative, any officer can add their die to a shared pool.
                        The first officer to act can use any or all of the dice from the pool,
                        depending on the domain power they want to use.
                    </span>
                </div>
                <select class="dropdown" v-model="domain.powerDie" @change="onUpdate" :disabled="isDisabled">
                    <option v-for="powerDie in PowerDie" :value="powerDie">
                        {{ powerDie }}
                    </option>
                </select>
            </div>
    </div>
    <Time v-if="config.treasury"
        :isGM="isGM"
        :config="config"
        :realm="domain.realm"
        @update:time="onChangeTime"
    />
    <hr/>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import { Domain, Size, PowerDie } from '../models/Domain'
import { Civilization, GoverningStyle, Heritage } from '../models/Realm';
import { utils } from '../mixins/utils';
import { Config } from '../models/Config';

import Time from './Time.vue';
import OBR from '@owlbear-rodeo/sdk';
import { timeUtils } from '../mixins/timeUtils';

export const CALENDAR_METADATA_KEY = "com.obr.domain-sheet/treasury/calendar"

export default defineComponent({
    components: { Time },
    mixins: [utils, timeUtils],
    name: 'Header',
    props: {
        isGM: {
            type: Boolean,
            required: true
        },
        isEditMode: {
            type: Boolean,
            required: true
        },
        domain: {
            type: Object as PropType<Domain>,
            required: true
        },
        config: {
            type: Object as PropType<Config>,
            required: true
        },
    },
    data() {
        return {
            Heritage,
            Civilization,
            GoverningStyle,
            Size,
            PowerDie
        }
    },
    emits: ['update:modelValue', 'update:editMode'],
    computed: {
        isDisabled() {
            if (!this.isGM) {
                return true;
            }

            return !this.isEditMode;
        }
    },
    methods: {
        onChangeTime(forward: boolean) {
            if (forward) {
                this.incrementTime(this.config, this.domain.realm);
            } else {
                this.deincrementTime(this.config, this.domain.realm)
            }

            const data = {
                calendar: this.domain.realm.calendar,
                forward: forward
            }

            OBR.broadcast.sendMessage(CALENDAR_METADATA_KEY, JSON.stringify(data), { destination: "ALL" });

            if (this.isGM) {
                const intervalId = window.setInterval(() => {
                    this.onUpdate();
                    clearInterval(intervalId);
                }, 1500);
            }
        },
        onUpdate() {
            const json = JSON.parse(JSON.stringify(this.domain));
            this.$emit('update:modelValue', json);
        }
    }
})
  
</script>

<style scoped>

.title {
    font-size: x-large;
    width: 100%;
    text-align: center;
}

.descriptor {
    margin-left: 1.25rem;
}

.subtitle {
    margin: 0;
}

.dropdown {
    float: right;
    margin: auto;
}

</style>