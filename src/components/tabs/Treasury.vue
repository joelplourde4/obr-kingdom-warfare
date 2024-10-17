<template>
    <div class="content">
        <p v-if="domain.realm.provinces.length === 0">To get started, right-click on a drawing and select the option to add it as a province.</p>
        <table>
            <tr v-if="domain.realm.provinces.length > 0">
                <th class="left-align">ID</th>
            </tr>
            <tr v-for="province in domain.realm.provinces">
                <div>
                    <td class="left-align">
                        <span>
                            {{ province.id }}
                        </span>
                    </td>
                </div>
            </tr>
        </table>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { utils } from '../../mixins/utils'

import BaseTab from './BaseTab.ts'
import OBR, { ContextMenuContext, Player } from '@owlbear-rodeo/sdk';
import { Province, Realm } from '../../models/Realm.ts';
import { useDebounceFn } from '@vueuse/core';
import { Config } from '../../models/Config.ts';

const ID = "com.obr.domain-sheet/treasury"

const TREASURY_METADATA_KEY = ID + "/metadata";
const OWNER_METADATA_KEY = ID + "/owner";

export default defineComponent({
    mixins: [utils],
    extends: BaseTab,
    name: 'Treasury',
    props: {
        config: {
            type: Config,
            required: true
        },
        currentPlayer: {
            type: Object as PropType<Player>,
            required: true
        },
        players: {
            type: Array<Player>,
            required: true,
        }
    },
    data() {
        const debouncedUpdate = useDebounceFn((realm) => { 
            // @ts-ignore
            this.updateRealm(realm);
        }, 500)
        let sceneItemChangeCallback = () => {};
        let sceneMetadataCallback = () => {};
        return {
            debouncedUpdate: debouncedUpdate,
            sceneItemChangeCallback,
            sceneMetadataCallback
        }
    },
    created() {
        // If the previous load file did not contain the Realm, add it.
        if (!this.domain.realm) {
            this.domain.realm = new Realm();
        }
    },
    mounted() {
        const obrIntervalId = window.setInterval(async () => {
            if (OBR.isReady) {
                OBR.contextMenu.create(this.buildContextMenu());
                clearInterval(obrIntervalId);
            }
        }, 200);

        const sceneIntervalId = window.setInterval(async () => {
            const isReady = await OBR.scene.isReady();
            if (isReady) {
                this.sceneItemChangeCallback = OBR.scene.items.onChange((items) => {
                    if (this.config.sharedMode) {
                        return;
                    }

                    const drawings = items.filter((item) => item.layer == "DRAWING");

                    // Scan all of your province to make sure they still have that metadata tag, if not remove that province, another player claimed it.
                    let hasChanged = false;
                    for (let province of this.domain.realm.provinces) {

                        let found = false;
                        for (let drawing of drawings) {
                            if (drawing.metadata[OWNER_METADATA_KEY] === this.currentPlayer.id) {
                                found = true;
                                break;
                            }
                        }

                        if (!found) {
                            this.domain.realm.provinces = this.domain.realm.provinces.filter((x) => x.id !== province.id);
                            hasChanged = true;
                        }
                    }

                    if (hasChanged) {
                        this.updateRealm(this.domain.realm);
                    }
                });

                clearInterval(sceneIntervalId);
            }
        }, 200);
    },
    unmounted() {
        this.sceneItemChangeCallback();
        this.sceneMetadataCallback();
    },
    methods: {
        /**
         * Update the realm
         */
        updateRealm(realm: Realm) {
            this.onUpdate();
        },
        /**
         * Add the province to the Realm
         * @param context
         */
        addProvinceToRealm(context: ContextMenuContext) {
            // Update the Hex in the scene.
            OBR.scene.items.updateItems(context.items, (items) => {
                for (let item of items) {
                    if (item.metadata[TREASURY_METADATA_KEY] === undefined) {
                        const province = new Province(item.id);
                        province.color = this.currentPlayer.color;
                        this.domain.realm.provinces.push(province);

                        item.style.fillColor = this.currentPlayer.color;
                        item.style.strokeColor = this.currentPlayer.color;
                        item.style.fillOpacity = 0.10;
                        item.style.strokeOpacity = 1;
                        item.metadata = {
                            [OWNER_METADATA_KEY]: this.currentPlayer.id
                        };
                    }

                    item.metadata[TREASURY_METADATA_KEY] = {
                        key: item.id
                    };
                }

                this.updateRealm(this.domain.realm);
            });
        },
        /**
         * Method to remove a provice from the realm when the user click on 'Remove Province' in the scene.
         * @param context The context
         */
         removeProvinceFromRealm(context: ContextMenuContext) {
            OBR.scene.items.updateItems(context.items, (items) => {
                for (let item of items) {
                    if (item.metadata[TREASURY_METADATA_KEY] !== undefined) {
                        this.domain.realm.provinces = this.domain.realm.provinces.filter((x: Province) =>
                            x.id !== item.id
                        );

                        item.style.fillColor = "#000000";
                        item.style.strokeColor = "#000000";
                        item.style.fillOpacity = 0.10;
                        item.style.strokeOpacity = 1;
                        item.metadata = {
                            [OWNER_METADATA_KEY]: undefined
                        };

                        delete item.metadata[TREASURY_METADATA_KEY];
                    }
                }

                this.updateRealm(this.domain.realm);
            });
        },
         /**
         * Event triggered whenever the context menu gets clicked.
         * @param context  The context menu context
         * @param _elementId The element
         */
         onContextMenuClick(context: ContextMenuContext, _elementId: string) {
            const addToRealm = context.items.every(
                (item) => item.metadata[TREASURY_METADATA_KEY] === this.player
            );
            if (addToRealm) {
                this.addProvinceToRealm(context);
            } else {
                this.removeProvinceFromRealm(context);
            }
        },
        /**
         * Build the context menu to be right-clicked.
         */
         buildContextMenu() {
            return {
                id: ID,
                icons: [
                    {
                        icon: "/pin.svg",
                        label: "Claim Province",
                        filter: {
                            every: [
                                { key: "visible", value: true },
                                { key: "layer", value: "DRAWING" },
                                { key: ["metadata", TREASURY_METADATA_KEY], value: undefined }
                            ]
                        }
                    },
                    {
                        icon: "/pin.svg",
                        label: "Remove Province",
                        filter: {
                            every: [
                                { key: "visible", value: true },
                                { key: "layer", value: "DRAWING" },
                            ]
                        }
                    }
                ],
                onClick: this.onContextMenuClick
            }
        }
    }
})
</script>
  
<style scoped>
</style>