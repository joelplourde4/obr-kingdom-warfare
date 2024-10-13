<template>
    <div class="column">
        <h3>Settings</h3>
        <Configuration
            :value="config.header"
            :description="'Header'"
            :tooltip="'When unchecked, the \'Header\' will be hidden.'"
            @update:model-value="onChanged('header')"
        />
        <Configuration
            :value="config.stats"
            :description="'Stats Tab'"
            :tooltip="'When unchecked, the \'Stats\' tab will be hidden.'"
            @update:model-value="onChanged('stats')"
        />
        <Configuration
            :value="config.relations"
            :description="'Relation Tab'"
            :tooltip="'When unchecked, the \'Relations\' tab will be hidden.'"
            @update:model-value="onChanged('relations')"
        />
        <Configuration
            :value="config.features"
            :description="'Feature Tab'"
            :tooltip="'When unchecked, the \'Features\' tab will be hidden.'"
            @update:model-value="onChanged('features')"
        />
        <Configuration
            :value="config.military"
            :description="'Military Tab'"
            :tooltip="'When unchecked, the \'Military\' tab will be hidden.'"
            @update:model-value="onChanged('military')"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Config } from '../models/Config';

import Configuration from './configuration/Configuration.vue'

type SettingKey = keyof Config;

export default defineComponent({
    components: { Configuration },
    name: 'Settings',
    props: {
        isGM: {
            type: Boolean,
            required: true
        },
        config: {
            type: Config,
            required: true
        },
    },
    emits: ['update:configuration'],
    data() {
        return {}
    },
    computed: {},
    methods: {
        onChanged(setting: string) {
            const key = setting as SettingKey;
            this.config[key] = !this.config[key]
            this.$emit('update:configuration', this.config);
        }
    }
})
  
</script>

<style scoped>

</style>