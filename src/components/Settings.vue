<template>
    <div class="column">
        <div class="tooltip">
            <h3>Core Settings</h3>
            <span class="tooltiptext">
                This extension does not assume any specific approach to the rules at your game table, so it offers multiple core configuration options.
            </span>
        </div>
        <Configuration
            :value="config.sharedMode"
            :title="'Shared Mode'"
            :description="'This extension offers two Domain Sheet options: a shared sheet for all players or individual sheets for each player, including the GM.'"
            :tooltip="'When unchecked, each player will have their own Domain Sheet.'"
            @update:model-value="onChanged('sharedMode')"
        />
        <div class="tooltip">
            <h3>Functionality</h3>
            <span class="tooltiptext">
                This extension does not assume any specific approach to the rules at your game table, so it offers multiple core configuration options.
            </span>
        </div>
        <Configuration
            :value="config.header"
            :title="'Toggle Header'"
            :tooltip="'When unchecked, the \'Header\' section of the Domain Sheet will be hidden.'"
            @update:model-value="onChanged('header')"
        />
        <Configuration
            :value="config.stats"
            :title="'Toggle Stats Tab'"
            :tooltip="'When unchecked, the \'Stats\' tab of the Domain Sheet will be hidden.'"
            @update:model-value="onChanged('stats')"
        />
        <Configuration
            :value="config.relations"
            :title="'Toggle Relations Tab'"
            :tooltip="'When unchecked, the \'Relations\' tab of the Domain Sheet will be hidden.'"
            @update:model-value="onChanged('relations')"
        />
        <Configuration
            :value="config.features"
            :title="'Toggle Features Tab'"
            :tooltip="'When unchecked, the \'Features\' tab of the Domain Sheet will be hidden.'"
            @update:model-value="onChanged('features')"
        />
        <Configuration
            :value="config.military"
            :title="'Toggle Military Tab'"
            :tooltip="'When unchecked, the \'Military\' tab of the Domain Sheet will be hidden.'"
            @update:model-value="onChanged('military')"
        />
        <Configuration
            :value="config.warfare"
            :title="'Toggle Warfare Tab'"
            :tooltip="'When unchecked, the \'Warfare\' tab of the Domain Sheet will be hidden.'"
            @update:model-value="onChanged('warfare')"
        />
        <Configuration
            :value="config.treasury"
            :title="'Toggle Treasury Tab'"
            :tooltip="'When unchecked, the \'Treasury\' tab of the Domain Sheet will be hidden.'"
            @update:model-value="onChanged('treasury')"
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

.title {
    align-self: center;
}

</style>