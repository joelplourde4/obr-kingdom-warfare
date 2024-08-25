<template lang="html">
    <tabs class="tabs">
        <tab name="Stats">
            <Stats
            :stats="domain.stats"
            @update:model-value="onStatsUpdate"
            />
        </tab>
        <tab name="Relations">
            <Relations :relation="domain.relations"/>
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
        domain: {
            type: Domain,
            required: true
        }
    },
    emits: ['update:stats'],
    methods: {
        onStatsUpdate(stats: any) {
            this.$emit('update:stats', stats);
        }
    }
})

</script>

<style scoped>
</style>