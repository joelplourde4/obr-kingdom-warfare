<template>
    <div class="column">
        <div class="tooltip">
            <h3 class="title">Core Settings</h3>
            <span class="tooltiptext">
                This extension does not assume any specific approach to the rules at your game table, so it offers multiple core configuration options.
            </span>
        </div>
        <Configuration
            :value="config.sharedMode"
            :title="'Shared Mode'"
            :description="'This extension offers two Domain Sheet options: a shared sheet for all players or individual sheets for each player, including the GM.'"
            :tooltip="'When unchecked, each player will have their own Domain Sheet.'"
            @update:model-value="onChanged($event, 'sharedMode')"
        />
        <Configuration
            :value="config.warfare"
            :title="'Warfare'"
            :description="'This extension provides the ability to track your units on the battlefield when using warfare rules.'"
            :tooltip="'When unchecked, the \'Warfare\' functionality will be disabled.'"
            @update:model-value="onChanged($event, 'warfare')"
        />
        <div class="tooltip">
            <h3 class="title">Functionality</h3>
            <span class="tooltiptext">
                This extension does not assume any specific approach to the rules at your game table, so it offers multiple core configuration options.
            </span>
        </div>
        <Configuration
            :value="config.header"
            :title="'Toggle Header'"
            :tooltip="'When unchecked, the \'Header\' section of the Domain Sheet will be hidden.'"
            @update:model-value="onChanged($event, 'header')"
        />
        <Configuration
            :value="config.stats"
            :title="'Toggle Stats Tab'"
            :tooltip="'When unchecked, the \'Stats\' tab of the Domain Sheet will be hidden.'"
            @update:model-value="onChanged($event, 'stats')"
        />
        <Configuration
            :value="config.relations"
            :title="'Toggle Relations Tab'"
            :tooltip="'When unchecked, the \'Relations\' tab of the Domain Sheet will be hidden.'"
            @update:model-value="onChanged($event, 'relations')"
        />
        <Configuration
            :value="config.features"
            :title="'Toggle Features Tab'"
            :tooltip="'When unchecked, the \'Features\' tab of the Domain Sheet will be hidden.'"
            @update:model-value="onChanged($event, 'features')"
        />
        <Configuration
            :value="config.military"
            :title="'Toggle Military Tab'"
            :tooltip="'When unchecked, the \'Military\' tab of the Domain Sheet will be hidden.'"
            @update:model-value="onChanged($event, 'military')"
        />
        <Configuration
            :value="config.inventory"
            :title="'Toggle Inventory Tab'"
            :tooltip="'When unchecked, the \'Inventory\' tab of the Domain Sheet will be hidden.'"
            @update:model-value="onChanged($event, 'inventory')"
        />
        <Configuration
            :value="config.treasury"
            :title="'Toggle Treasury Tab'"
            :tooltip="'When unchecked, the \'Treasury\' tab of the Domain Sheet will be hidden.'"
            @update:model-value="onChanged($event, 'treasury')"
        />
        <Configuration
            :value="config.multiplier"
            :title="'Resource Multiplier'"
            :tooltip="'Controls how many resources are generated every domain turn. A higher multiplier boosts resource availability without increasing upkeep, while a lower setting makes resource management more challenging, requiring careful planning to maintain profitability.'"
            :description="'Adjust the resource generation rate each domain turn.'"
            :disabled="!config.treasury"
            :isChild="true"
            @update:model-value="onChanged($event, 'multiplier')"
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
        onChanged($event: number | boolean, setting: string) {
            const key = setting as SettingKey;
            if (typeof this.config[key] === 'boolean') {
                // @ts-ignore
                this.config[key] = !this.config[key] as Boolean
            } else {
                // @ts-ignore
                this.config[key] = $event;
            }
            this.$emit('update:configuration', this.config);
        }
    }
})
  
</script>

<style scoped>

.title {
    margin: 0.5rem 0 0.5rem 0;
}

</style>