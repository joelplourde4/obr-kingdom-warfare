<template lang="html">
    <NavigationBar
        :isGM="isGM"
        @update:edit-mode="onEditMode"
        @update:settings="onSettings"
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
            :isGM="isGM"
            @update:model-value="onUpdate"
        />
        </div>
        <tabs class="tabs">
            <tab v-if="config.stats" name="Stats">
                <Stats
                    :domain="domain"
                    :isGM="isGM"
                    :isEditMode="editMode"
                    @update:model-value="onUpdate"
                />
            </tab>
            <tab v-if="config.relations" name="Relations">
                <Relations
                    :domain="domain"
                    :isGM="isGM"
                    :isEditMode="editMode"
                    @update:model-value="onUpdate"
                />
            </tab>
            <tab v-if="config.features" name="Features">
                <Features
                    :domain="domain"
                    :isGM="isGM"
                    :isEditMode="editMode"
                    @update:model-value="onUpdate"
                />
            </tab>
            <tab v-if="config.military" name="Military">
                <Military
                    :domain="domain"
                    :isGM="isGM"
                    :isEditMode="editMode"
                    @update:model-value="onUpdate"
                />
            </tab>
        </tabs>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import Settings from './Settings.vue';
import NavigationBar from './NavigationBar.vue';
import Header from './Header.vue'
import Stats from './tabs/Stats.vue'
import Relations from './tabs/Relations.vue';
import Features from './tabs/Features.vue';
import Military from './tabs/Military.vue';

import { Domain } from '../models/Domain'
import { Config } from '../models/Config';

export default defineComponent({
    components: { Settings, NavigationBar, Header, Stats, Relations, Features, Military },
    name: 'Sheet',
    props: {
        isGM: {
            type: Boolean,
            required: true
        },
        domain: {
            type: Domain,
            required: true
        },
        config: {
            type: Config,
            required: true
        },
    },
    emits: ['update:domain','update:config'],
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
        }
    }
})

</script>

<style scoped>
</style>