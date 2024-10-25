<template>
    <div class="row center">
        <button v-if="isDecrementShown" type="button" class="borderless-button" @click="changeTime(false)">
            <img class="left-arrow" src="/arrow.svg">
        </button>
        <span>Week {{ realm.calendar?.week }}, </span>
        <span>Month {{ realm.calendar?.month }}, </span>
        <span>Year {{ realm.calendar?.year }}</span>
        <button v-if="isIncrementShown" type="button" class="borderless-button" @click="changeTime(true)">
            <img class="right-arrow" src="/arrow.svg">
        </button>
    </div>
</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue'
import { Config } from '../models/Config';
import { Realm } from '../models/Realm';
import { treasuryCalculator } from '../mixins/treasuryCalculator';

export default defineComponent({
    name: 'Time',
    mixins: [treasuryCalculator],
    props: {
        isGM: {
            type: Boolean,
            required: true
        },
        hasScene: {
            type: Boolean,
            required: true
        },
        config: {
            type: Object as PropType<Config>,
            required: true
        },
        realm: {
            type: Object as PropType<Realm>,
            required: true
        }
    },
    emit: ['update:time'],
    computed: {
        isDecrementShown() {
            if (!this.hasScene) {
                return false;
            }

            if (!this.isGM) {
                return false;
            }

            if (!this.realm.forecasts) {
                return false;
            }

            return this.realm.forecasts.length != 0;
        },
        isIncrementShown() {
            if (!this.hasScene) {
                return false;
            }
            
            if (!this.isGM) {
                return false;
            }

            return true;
        }
    },
    methods: {
        changeTime(forward: boolean) {
            this.$emit('update:time', forward);
        }
    }
});

</script>

<style scoped>

.center {
    align-items: center;
    justify-content: center;
}

.borderless-button {
    filter: invert(80%) sepia(29%) saturate(6341%) hue-rotate(207deg) brightness(100%) contrast(102%);
    display: inline-flex;
    background-color: #00000000;
    cursor: pointer;
    width: 40px;
    height: 40px;
    border: none;
}

.left-arrow {
    transform: rotate(0deg);
}

.right-arrow {
    margin-right: auto;
    transform: rotate(180deg);
}

</style>