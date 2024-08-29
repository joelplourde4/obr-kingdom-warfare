<template>
    <div class="content">
            <input class="title" v-model="domain.name" @input="onUpdate" :disabled="isDisabled">
            <div class="row">
                    <div class="column row">
                        <p class="descriptor">Domain Size</p>
                        <select class="dropdown" v-model="domain.size" @input="onUpdate" :disabled="isDisabled">
                            <option v-for="size in Size" :value="size">
                                {{ size }}
                            </option>
                        </select>
                    </div>
                    <div class="column row">
                        <p class="descriptor">Power Die</p>
                        <select class="dropdown" v-model="domain.powerDie" @input="onUpdate" :disabled="isDisabled">
                            <option v-for="powerDie in PowerDie" :value="powerDie">
                                {{ powerDie }}
                            </option>
                        </select>
                    </div>
            </div>
        <div class="row">
            <div class="column">
                <p class="subtitle">Skills</p>
                <div class="attributes row">
                    <Attributes
                        :isGM="isGM"
                        :attribute="domain.stats.skills.diplomacy"
                        @update:model-value="onUpdate"
                        />
                </div>
                <div class="attributes row">
                    <Attributes
                        :isGM="isGM"
                        :attribute="domain.stats.skills.espionage"
                        @update:model-value="onUpdate"
                        />
                </div>
                <div class="attributes row">
                    <Attributes
                        :isGM="isGM"
                        :attribute="domain.stats.skills.lore"
                        @update:model-value="onUpdate"
                        />
                </div>
                <div class="attributes row">
                    <Attributes
                        :isGM="isGM"
                        :attribute="domain.stats.skills.operations"
                        @update:model-value="onUpdate"
                    />
                </div>
            </div>
            <div class="column">
                <p class="subtitle">Defenses</p>
                <div class="attributes row">
                    <Attributes
                        :isGM="isGM"
                        :attribute="domain.stats.defenses.communications"
                        @update:model-value="onUpdate"
                    />
                </div>
                <div class="attributes row">
                    <Attributes
                        :isGM="isGM"
                        :attribute="domain.stats.defenses.resolve"
                        @update:model-value="onUpdate"
                    />
                </div>
                <div class="attributes row">
                    <Attributes
                        :isGM="isGM"
                        :attribute="domain.stats.defenses.resources"
                        @update:model-value="onUpdate"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent, toRaw } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { Domain, Size, PowerDie } from '../../models/Domain'
import Attributes from './Attributes.vue';

export default defineComponent({
    components: { Attributes },
    name: 'Stats',
    props: {
        isGM: {
            type: Boolean,
            required: true
        },
        domain: {
            type: Domain,
            required: true
        }
    },
    data() {
        return {
            Size,
            PowerDie
        }
    },
    emits: ['update:modelValue'],
    computed: {
        isDisabled() {
            return !this.isGM
        }
    },
    methods: {
        onUpdate() {
            this.$emit('update:modelValue', toRaw(this.domain));
        }
    }
})
  
</script>
  
<style scoped>

.title {
    font-size: 1.5rem;
    width: 95%;
    text-align: center;
}

.subtitle {
    font-size: 1.25rem;
    margin: 0;
}

.attributes {
    padding: 0.5rem 0rem 0.5rem 0rem;
}

.descriptor {
    margin-left: 1.25rem;
    font-size: 0.875rem;
}

.dropdown {
    float: right;
    margin: auto;
}

</style>