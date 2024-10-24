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
    <div v-if="config.treasury" class="row centered-header">
        <div class="tooltip">
            <p class="subtitle">Heritage</p>
            <select class="dropdown" v-model="domain.realm.heritage" @click="preventPropagation" @change="onUpdate" :disabled="isDisabled">
                <option v-for="heritage in Heritage" :value="heritage">
                    {{ heritage }}
                </option>
            </select>
            <span class="tooltiptext">Heritage exploit terrain differently: Elves excel in forests, Dwarves in mountains, and Humans on plains, etc.</span>
        </div>
        <div class="tooltip">
            <p class="subtitle">Civilization</p>
            <select class="dropdown" v-model="domain.realm.civilization" @click="preventPropagation" @change="onUpdate" :disabled="isDisabled">
                <option v-for="civilization in Civilization" :value="civilization">
                    {{ civilization }}
                </option>
            </select>
            <span class="tooltiptext">A realm's civilization dictates population center types, production, and troop mustering costs.</span>
        </div>
        <div class="tooltip">
            <p class="subtitle">Governance</p>
            <select class="dropdown" v-model="domain.realm.governingStyle" @click="preventPropagation" @change="onUpdate" :disabled="isDisabled">
                <option v-for="governingStyle in GoverningStyle" :value="governingStyle">
                    {{ governingStyle }}
                </option>
            </select>
            <span class="tooltiptext">Governing style affects maintenance costs and the realm's efficient size limit.</span>
        </div>
    </div> 
    <hr/>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import { Domain, Size, PowerDie } from '../models/Domain'
import { Civilization, GoverningStyle, Heritage } from '../models/Realm';
import { utils } from '../mixins/utils';
import { Config } from '../models/Config';

export default defineComponent({
    mixins: [utils],
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

.centered-header {
    justify-content: space-around;
    align-items: center;
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