<template lang="html">
    <NavigationBar
        :players="players"
        :isGM="isGM"
        :config="config"
        :isSettings="settings"
        :isWarfare="warfare"
        :isSharedMode="config.sharedMode"
        :hasPermission="hasPermission"
        @update:edit-mode="onEditMode"
        @update:settings="onSettings"
        @update:switch-sheet="onSwitchSheet"
        @update:warfare="onWarfare"
    />
    <div v-if="isPage">
        <Settings
            v-if="settings"
            :isGM="isGM"
            :config="config"
            @update:configuration="onConfigChanged"
        />
        <Warfare
            v-show="warfare"
            :config="config"
            :players="players"
            :domain="domain"
            :isGM="hasPermission"
            :isEditMode="editMode"
            @update:model-value="onUpdate"
        />
    </div>
    <div v-else>
        <div v-if="config.header">
        <Header
            :domain="domain"
            :config="config"
            :isGM="isGM"
            :isEditMode="editMode"
            @update:model-value="onUpdate"
        />
        </div>
        <tabs ref="tabs" class="tabs" @clicked="onTabClicked">
            <tab v-if="config.stats" id="stats" name="Stats">
                <Stats
                    :domain="domain"
                    :isGM="hasPermission"
                    :isEditMode="editMode"
                    @update:model-value="onUpdate"
                />
            </tab>
            <tab v-if="config.relations" id="relations" name="Relations">
                <Relations
                    ref="relations"
                    :domain="domain"
                    :isGM="hasPermission"
                    :isEditMode="editMode"
                    @update:model-value="onUpdate"
                />
            </tab>
            <tab v-if="config.features" id="features" name="Features">
                <Features
                    ref="features"
                    :domain="domain"
                    :isGM="hasPermission"
                    :isEditMode="editMode"
                    @update:model-value="onUpdate"
                />
            </tab>
            <tab v-if="config.military" id="military" name="Military">
                <Military
                    :domain="domain"
                    :isGM="hasPermission"
                    :isEditMode="editMode"
                    @update:model-value="onUpdate"
                />
            </tab>
            <tab v-if="config.treasury" id="treasury" name="Treasury">
                <Treasury
                    :config="config"
                    :domain="domain"
                    :currentPlayer="currentPlayer"
                    :players="players"
                    :isGM="isGM"
                    :hasPermission="hasPermission"
                    :isEditMode="editMode"
                    @update:model-value="onUpdate"
                />
            </tab>
            <tab v-if="config.inventory" id="inventory" name="Inventory">
                <Inventory
                    ref="inventory"
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
import Warfare from './tabs/Warfare.vue';
import Treasury from './tabs/Treasury.vue';
import Inventory from './tabs/Inventory.vue';

import { Domain } from '../models/Domain';
import { Config } from '../models/Config';
import OBR, { Player } from '@owlbear-rodeo/sdk';

export default defineComponent({
    components: { Settings, NavigationBar, Header, Stats, Relations, Features, Military, Warfare, Treasury, Inventory },
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
        currentPlayer: {
            type: Object as PropType<Player>,
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
        return {
            editMode: false,
            settings: false,
            warfare: false
        }
    },
    mounted() {
        const intervalId = window.setInterval(async () => {
            if (OBR.isReady) {
                const tabs = this.$refs.tabs;
                if (tabs) {
                    // @ts-ignore
                    tabs.selectTab('#' + this.getDefaultTab().defaultTabHash);
                }
                window.clearInterval(intervalId);
            }
        }, 1000);
    },
    computed: {
        isPage() {
            return this.settings || this.warfare;
        }
    },
    methods: {
        getDefaultTab() {
            if (this.config.stats) {
                return { 
                    defaultTabHash: 'stats'
                };
            } else if (this.config.relations) {
                return { 
                    defaultTabHash: 'relations'
                };
            } else if (this.config.features) {
                return { 
                    defaultTabHash: 'features'
                };
            } else if (this.config.military) {
                return { 
                    defaultTabHash: 'military'
                };
            } else if (this.config.treasury) {
                return { 
                    defaultTabHash: 'treasury'
                };
            } else if (this.config.inventory) {
                return { 
                    defaultTabHash: 'inventory'
                };
            }
            return {};
        },
        onEditMode(editMode: boolean) {
            this.editMode = editMode;
        },
        onSettings(settings: boolean) {
            this.settings = settings;
            this.warfare = false;
        },
        onWarfare(warfare: boolean) {
            this.warfare = warfare;
            this.settings = false;
        },
        onUpdate(domain: Domain) {
            this.$emit('update:domain', domain);
        },
        onConfigChanged(config: Config) {
            this.$emit('update:config', config);
        },
        onSwitchSheet(playerId: string) {
            this.$emit('update:switchSheet', playerId);
        },
        onTabClicked(event: any) {
            const computedId = event.tab.computedId;
            const ref = this.$refs[computedId];
            if (ref) {
                // @ts-ignore
                ref.onTabSelected();
            }
        }
    }
})

</script>

<style scoped>
</style>