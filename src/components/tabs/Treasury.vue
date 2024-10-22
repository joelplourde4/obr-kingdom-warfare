<template>
    <div class="content">
        <div class="header row">
            <div class="tooltip">
                <p>Heritage</p>
                <select class="dropdown" v-model="domain.realm.heritage" @click="preventPropagation" @change="onChanges" :disabled="isDisabled">
                    <option v-for="heritage in Heritage" :value="heritage">
                        {{ heritage }}
                    </option>
                </select>
                <span class="tooltiptext">Heritage exploit terrain differently: Elves excel in forests, Dwarves in mountains, and Humans on plains, etc.</span>
            </div>
            <div class="tooltip">
                <p>Civilization</p>
                <select class="dropdown" v-model="domain.realm.civilization" @click="preventPropagation" @change="onChanges" :disabled="isDisabled">
                    <option v-for="civilization in Civilization" :value="civilization">
                        {{ civilization }}
                    </option>
                </select>
                <span class="tooltiptext">A realm's civilization dictates population center types, production, and troop mustering costs.</span>
            </div>
            <div class="tooltip">
                <p>Governing Style</p>
                <select class="dropdown" v-model="domain.realm.governingStyle" @click="preventPropagation" @change="onChanges" :disabled="isDisabled">
                    <option v-for="governingStyle in GoverningStyle" :value="governingStyle">
                        {{ governingStyle }}
                    </option>
                </select>
                <span class="tooltiptext">Governing style affects maintenance costs and the realm's efficient size limit.</span>
            </div>
        </div>
        <div class="treasury row">
            <h3>Treasury:</h3>
            <div class="tooltip">
                <h3>{{ treasury }}</h3>
                <span class="tooltiptext">The present amount in the Kingdom's Treasury.</span>
            </div>
            <div class="tooltip">
            <h3 :style=" { 'color': forecast > 0 ? 'green': 'red'} ">({{ forecast }})</h3>
                <span class="tooltiptext">The resources that will be added to or subtracted from the treasury during the next domain turn.</span>
            </div>
        </div>
        <p v-if="domain.realm.provinces.length === 0">To get started, right-click on a drawing and select the option to add it as a province.</p>
        <h3 v-if="domain.realm.provinces.length > 0">Provinces</h3>
        <table>
            <tr v-if="domain.realm.provinces.length > 0">
                <th class="left-align">Terrain</th>
                <th class="center-align">Population</th>
                <th class="right-align">Production</th>
                <th class="right-align">Profit</th>
            </tr>
            <tr v-for="province in domain.realm.provinces">
                <td class="left-align">
                    <div class="tooltip">
                        <select class="dropdown" v-model="province.terrain" @click="preventPropagation" @change="onChanges" :disabled="isDisabled">
                            <option v-for="terrain in Terrain" :value="terrain">
                                {{ terrain }}
                            </option>
                        </select>
                        <span class="tooltiptext">Terrain refers to the kind of land found in the province.</span>
                    </div>
                </td>
                <td class="center-align">
                    <div class="tooltip">
                        <select class="dropdown" v-model="province.populationCenter" @click="preventPropagation" @change="onChanges" :disabled="isDisabled">
                            <option v-for="populationCenter in availablePopulationCenter" :value="populationCenter">
                                {{ populationCenter }}
                            </option>
                        </select>
                        <span class="tooltiptext">Population centers are settlements ranging from small thorpes to large metropolises. Each province can have one population center, which enables resource extraction.</span>
                    </div>
                </td>
                <td class="right-align">
                    <div class="row">
                        <div class="tooltip">
                            <p class="production">+{{ computeProvinceProduction(domain.realm, province) }}</p>
                            <span class="tooltiptext">Larger population centers generate more resources by effectively utilizing the land.</span>
                        </div>
                        <div class="tooltip">
                        <p class="upkeep">({{ computeProvinceUpkeep(domain.realm, province) }})</p>
                            <span class="tooltiptext">Population centers require upkeep for maintenance, services, and salaries.</span>
                        </div>
                    </div>
                </td>
                <td class="right-align">
                    <div class="tooltip">
                        <p>{{ computeProvinceProfit(province) }}</p>
                        <span class="tooltiptext">Profit is calculated by subtracting the province's upkeep costs from its total revenue.</span>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { utils } from '../../mixins/utils'

import BaseTab from './BaseTab.ts'
import OBR, { ContextMenuContext, Player } from '@owlbear-rodeo/sdk';
import { Heritage, Civilization, GoverningStyle, PopulationCenter, Province, Realm, Terrain, POPULATION_CENTER_UPKEEP, GOVERNING_STYLE_PRODUCTION_MODIFIER, POPULATION_CENTER_PRODUCTION_MODIFIER, HERITAGE_TERRAIN_MODIFIER, CIVILIZATION_PRODUCTION_MODIFIER, CIVILIZATION_POPULATION_CENTER_UPKEEP_MODIFIER, UNIT_UPKEEP_FACTOR } from '../../models/Realm.ts';
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
            /** Data Map */
            POPULATION_CENTER_UPKEEP,
            GOVERNING_STYLE_PRODUCTION_MODIFIER,
            HERITAGE_TERRAIN_MODIFIER,
            CIVILIZATION_PRODUCTION_MODIFIER,
            CIVILIZATION_POPULATION_CENTER_UPKEEP_MODIFIER,

            /** Enums */
            Terrain,
            Heritage,
            Civilization,
            GoverningStyle,
            PopulationCenter,

            /** Functions */
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
    computed: {
        treasury() {
            return this.domain.realm.treasury || 0;
        },
        forecast() {
            const governingStyleModifier = GOVERNING_STYLE_PRODUCTION_MODIFIER.get(this.domain.realm.governingStyle) || 1.0;

            let profit = 0;
            for (let province of this.domain.realm.provinces) {
                profit += province.profit * governingStyleModifier;
            }

            // Upkeep from the Units.
            let upkeep = 0;
            for (let unit of this.domain.units) {
                // A unit’s upkeep is equal to 25% of the cost of the unit’s current value
                upkeep += Math.round(UNIT_UPKEEP_FACTOR * unit.cost);
            }

            return profit - upkeep;
        },
        /**
         * Compute what are the available population center based on the Kingdom's civilization
         */
        availablePopulationCenter() {
            const nomads = [PopulationCenter.SMALL_CAMP, PopulationCenter.MEDIUM_CAMP, PopulationCenter.LARGE_CAMP]
            if (this.domain.realm.civilization == Civilization.NOMADIC) {
                return nomads;
            }

            return Object.values(PopulationCenter).filter(
                (center) => !nomads.includes(center)
            );
        }
    },
    methods: {
        onChanges() {
            this.debouncedUpdate(this.domain.realm);
        },
        /**
         * Update the realm
         */
        updateRealm(_realm: Realm) {
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
        },
        computeProvinceUpkeep(realm: Realm, province: Province): number {
            if (realm.governingStyle == GoverningStyle.NONE) {
                province.upkeep = 0;
                return province.upkeep;
            }

            let upkeep =  POPULATION_CENTER_UPKEEP.get(province.populationCenter) || 0;

            upkeep *= CIVILIZATION_POPULATION_CENTER_UPKEEP_MODIFIER.get(realm.civilization) || 1.0;

            province.upkeep = upkeep;
            return province.upkeep;
        },
        computeProvinceProduction(realm: Realm, province: Province): number {
            // Based on the Terrain, get the base production of the province.
            const terrainModifiers = HERITAGE_TERRAIN_MODIFIER.get(realm.heritage);
            const terrainModifier = terrainModifiers?.get(province.terrain) || 0;

            // Based on the Population Center itself, adjust the production.
            const productionModifier = POPULATION_CENTER_PRODUCTION_MODIFIER.get(province.populationCenter) || 0;

            // Based on the Civilization, adjust the production.
            const civiliationModifier = CIVILIZATION_PRODUCTION_MODIFIER.get(realm.civilization) || 1.0;

            // Calculate the raw values
            let revenue = terrainModifier * productionModifier * this.config.multiplier;

            // Adjust the final modifier
            revenue *= civiliationModifier;

            province.production = revenue;
            return province.production;
        },
        computeProvinceProfit(province: Province) {
            province.profit = province.production - province.upkeep;
            return province.profit;
        }
    }
})
</script>
  
<style scoped>

.header {
    justify-content: space-around;

    p {
        margin: 0;
    }
}

.treasury {
    justify-content: center;

    h3 {
        margin: 0;
        padding-left: 0.5rem;
    }
}

.production {
    color: green;
}

.upkeep {
    color: red;
    padding-left: 0.25rem;
}

</style>