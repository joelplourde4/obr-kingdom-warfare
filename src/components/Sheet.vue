<template lang="html">
    <tabs class="tabs">
        <tab name="Stats">
            <Stats
                :domain="domain"
                :isGM="isGM"
                @update:model-value="onUpdate"
            />
        </tab>
        <tab name="Relations">
            <Relations
                :domain="domain"
                :isGM="isGM"
                @update:model-value="onUpdate"
            />
        </tab>
        <tab name="Features">
            <Features/>
        </tab>
        <tab name="Military">
            <p>Coming soon</p>
        </tab>
    </tabs>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import Stats from './tabs/Stats.vue'
import Relations from './tabs/Relations.vue';
import Features from './tabs/Features.vue';
import Military from './tabs/Military.vue';

import { Domain } from '../models/Domain'

export default defineComponent({
    components: { Stats, Relations, Features, Military },
    name: 'Sheet',
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
    emits: ['update:domain'],
    methods: {
        onUpdate(domain: Domain) {
            this.$emit('update:domain', domain);
        }
    }
})

</script>

<style scoped>
</style>