<template lang="html">
    <NavigationBar
        :players="players"
        :isGM="isGM"
        :isSettings="settings"
        :isSharedMode="config.sharedMode"
        :hasPermission="hasPermission"
        @update:edit-mode="onEditMode"
        @update:settings="onSettings"
        @update:switch-sheet="onSwitchSheet"
    />
    <div v-if="settings">
        <Settings
            :isGM="isGM"
            :config="config"
            @update:configuration="onConfigChanged"
        />
    </div>
    <div v-else>
        <div v-if="config.header">
        <Header
            :domain="domain"
            :isGM="hasPermission"
            :isEditMode="editMode"
            @update:model-value="onUpdate"
        />
        </div>
        <tabs class="tabs">
            <tab v-if="config.stats" name="Stats">
                <Stats
                    :domain="domain"
                    :isGM="hasPermission"
                    :isEditMode="editMode"
                    @update:model-value="onUpdate"
                />
            </tab>
            <tab v-if="config.relations" name="Relations">
                <Relations
                    :domain="domain"
                    :isGM="hasPermission"
                    :isEditMode="editMode"
                    @update:model-value="onUpdate"
                />
            </tab>
            <tab v-if="config.features" name="Features">
                <Features
                    :domain="domain"
                    :isGM="hasPermission"
                    :isEditMode="editMode"
                    @update:model-value="onUpdate"
                />
            </tab>
            <tab v-if="config.military" name="Military">
                <Military
                    :domain="domain"
                    :isGM="hasPermission"
                    :isEditMode="editMode"
                    @update:model-value="onUpdate"
                />
            </tab>
        </tabs>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import Settings from './Settings.vue';
import NavigationBar from './NavigationBar.vue';
import Header from './Header.vue'
import Stats from './tabs/Stats.vue'
import Relations from './tabs/Relations.vue';
import Features from './tabs/Features.vue';
import Military from './tabs/Military.vue';

import { Domain } from '../models/Domain';
import { Config } from '../models/Config';
import { Player } from '@owlbear-rodeo/sdk';

export default defineComponent({
    components: { Settings, NavigationBar, Header, Stats, Relations, Features, Military },
    name: 'Sheet',
    props: {
        isGM: {
            type: Boolean,
            required: true
        },
        hasPermission: {
            type: Boolean,
            required: true
        },
        players: {
            type: Array<Player>,
            required: true
        },
        domain: {
            type: Object as PropType<Domain>,
            required: true
        },
        config: {
            type: Config,
            required: true
        },
    },
    emits: ['update:domain','update:config', 'update:switchSheet'],
    data() {
        const editMode = false;
        const settings = false;

        return {
            editMode: editMode,
            settings: settings
        }
    },
    methods: {
        onEditMode(editMode: boolean) {
            this.editMode = editMode;
        },
        onSettings(settings: boolean) {
            this.settings = settings;
        },
        onUpdate(domain: Domain) {
            this.$emit('update:domain', domain);
        },
        onConfigChanged(config: Config) {
            this.$emit('update:config', config);
        },
        onSwitchSheet(playerId: string) {
            this.$emit('update:switchSheet', playerId);
        }
    }
})

</script>

<style scoped>
</style>