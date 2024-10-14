<template>
    <div class="content">
        <table>
            <tr v-if="units.length > 0">
                <th class="left-align">Name</th>
                <th class="center-align">HP</th>
                <th class="center-align">Exh.</th>
                <th class="center-align">Rally</th>
            </tr>
            <tr v-for="unit in units">
                <td class="left-align">
                    <div class="name-container" @mouseleave="onNameMouseLeave($event, unit)">
                        <input 
                            type="text" 
                            :value="unit.name"
                            :style="{'border': 'solid 0.0625rem ' + unit.color}"
                            @dblclick="focusUnit(unit)"
                            @contextmenu="onNameRightClick($event, unit)"
                        />
                        <div v-if="unit.opened" class="dropdown hover">
                            <div v-for="player in players">
                                <span
                                    class="pill"
                                    :style="{'background-color': player.color }"
                                    @click="onAssignColor(unit, player.color )"
                                >
                                </span>
                            </div>
                        </div>
                    </div>
                </td>
                <td class="center-align">
                    <div>
                        <input
                            class="input-number-value"
                            type="number" 
                            v-model="unit.casuality.current"
                            @change="onCasualty(unit)"
                        />
                        <span>/</span>
                        <input 
                            class="input-number-value"
                            type="number" 
                            v-model="unit.casuality.total"
                            @change="onCasualty(unit)"
                        />
                    </div>
                </td>
                <td class="center-align">
                    <input
                        type="checkbox"
                        :checked="unit.exhausted"
                        @click="onExhausted(unit)"
                    />
                </td>
                <td class="center-align">
                    <input
                        type="checkbox"
                        :checked="unit.rallied"
                        @click="onRallied(unit)"
                    />
                </td>
            </tr>
        </table>
        <div v-if="units.length > 0" class="footer row">
            <div class="refresh-menu" @mouseleave="onMouseLeaveRefreshMenu">
                <div v-if="refreshDropdownOpened" class="refresh-menu-content">
                    <button v-for="player in players" class="refresh-button" @click="refreshArmy(player.color)">
                        Army 
                        <span
                            class="pill"
                            :style="{'background-color': player.color }"
                        >
                        </span>
                    </button>
                </div>
                <button class="refresh-button" @click="toggleRefreshMenu">
                    Refresh Units
                    <img v-if="refreshDropdownOpened" class="caret" src="/caret-up.svg">
                    <img v-if="!refreshDropdownOpened" class="caret" src="/caret-down.svg">
                </button>
            </div>
            <button class="refresh-button" @click="removeAllDrawings">
                Remove Drawings
            </button>
        </div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'
import OBR, { buildImage, buildLabel, ContextMenuContext, ImageContent, ImageGrid, Item, Metadata, Player } from '@owlbear-rodeo/sdk';
import { utils } from '../../mixins/utils'

import BaseTab from './BaseTab.ts'
import { DeployedUnit } from '../../models/DeployedUnit.js';

const ICON_SIZE = 200
const ICON_DPI = 150

const EXHAUSTED: string = "EXHAUSTED"
const RALLIED: string = "RALLIED"

const ID = "com.obr.domain-sheet/warfare"

const WARFARE_METADATA_KEY = ID + "/metadata";

export default defineComponent({
    mixins: [utils],
    extends: BaseTab,
    name: 'Warfare',
    props: {
        players: {
            type: Array<Player>,
            required: true
        }
    },
    data() {
        let sceneItemChangeCallback = () => {};
        let sceneMetadataCallback = () => {};
        return {
            refreshDropdownOpened: false,
            sceneItemChangeCallback,
            sceneMetadataCallback,
            units: [] as DeployedUnit[]
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
                    this.onChange(items);
                });

                OBR.scene.getMetadata().then(metadata => {
                    this.loadUnits(metadata);
                });

                this.sceneMetadataCallback = OBR.scene.onMetadataChange((metadata) => {
                    this.loadUnits(metadata);
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
         * Method to save the array of deployed unit to the room metadata.
         * @param units The deployed units.
         */
        saveUnits(units: DeployedUnit[]) {
            OBR.scene.setMetadata({
                [WARFARE_METADATA_KEY]: { data: JSON.parse(JSON.stringify(units)) }
            })
        },
        /**
         * Load the units from the metadata.
         */
        loadUnits(metadata: Metadata) {
            this.units = [];

            const data = metadata[WARFARE_METADATA_KEY] as any;
            if (data) {
                for (let entry of data.data) {
                    this.units.push(DeployedUnit.fromJson(entry));
                }
            }
            return this.units;
        },
        /**
         * Method trigger when the unit name is double-click
         * @param unit the deployed unit.
         */
        async focusUnit(unit: DeployedUnit) {
            const items = await OBR.scene.items.getItems([unit.id]);
            this.centerViewportOnImage(items[0]);
        },
        /**
         * Method called whenever there is an item that changes in the scene
         * @param items The items
         */
        onChange(items: Item[]) {
            for (let unit of this.units) {
                let exists = false;
                for (let item of items) {
                    if (unit.id === item.id) {
                        exists = true;
                    }
                }
                if (!exists) {
                    this.removeUnit(unit);
                }
            }
        },
        /**
         * Event triggered whenever the context menu gets clicked.
         * @param context  The context menu context
         * @param _elementId The element
         */
        onContextMenuClick(context: ContextMenuContext, _elementId: string) {
            const addToRoster = context.items.every(
                (item) => item.metadata[WARFARE_METADATA_KEY] === undefined
            );
            if (addToRoster) {
                this.addUnitToRoster(context, _elementId);
            } else {
                this.removeUnitFromRoster(context, _elementId);
            }
        },
        /**
         * Method to add an unit to the deployment
         * @param context The context menu context
         * @param _elementId The element ID
         */
        addUnitToRoster(context: ContextMenuContext, _elementId: string) {
            OBR.scene.items.updateItems(context.items, (items) => {
                for (let item of items) {
                    if (item.metadata[WARFARE_METADATA_KEY] === undefined) {
                        const unit = new DeployedUnit(item.id, item.name);
                        const player = this.players.find((player) => player.id === item.lastModifiedUserId);
                        if (player) {
                            unit.color = player.color;
                        }

                        this.units.push(unit);
                    }

                    item.metadata[WARFARE_METADATA_KEY] = {
                        key: item.id
                    };
                }

                this.saveUnits(this.units);
            });
        },
        /**
         * Method to remove an unit from the roster when the user click on 'Remove Unit' in the scene.
         * @param context The context
         * @param _elementId The element id
         */
        removeUnitFromRoster(context: ContextMenuContext, _elementId: string) {
            OBR.scene.items.updateItems(context.items, (items) => {
                for (let item of items) {
                    if (item.metadata[WARFARE_METADATA_KEY] !== undefined) {
                        this.units = this.units.filter((x: DeployedUnit) =>
                            x.id !== item.id
                        );

                        delete item.metadata[WARFARE_METADATA_KEY];
                    }
                }

                this.saveUnits(this.units);
            });
        },
        /**
         * Method to remove an unit from the roster when it gets deleted from the scene.
         * @param unit The deployed unit.
         */
        removeUnit(unit: DeployedUnit) {
            this.units = this.units.filter((x: DeployedUnit) =>
                x.id !== unit.id
            );

            this.saveUnits(this.units);
        },
        /**
         * Method to update the value of the casualty bar.
         */
        async onCasualty(unit: DeployedUnit) {
            const attachments = await OBR.scene.items.getItemAttachments([unit.id]);

            const index = attachments.findIndex((a) => a.name === "HEALTH");
            if (index < 0) {
                const items = await OBR.scene.items.getItems([unit.id]);
                const label = this.buildHealth(items[0], unit);
                await OBR.scene.items.addItems([label]);
            } else {
                // Simply update the attachments
                await OBR.scene.items.updateItems([attachments[index]], (items) => {
                    items[0].text.plainText = unit.casuality.current + "/" + unit.casuality.total;
                });
            }

            this.saveUnits(this.units);
        },
        /**
         * Method called when the unit is exhausted.
         * @param unit The deployed unit.
         */
        onExhausted(unit: DeployedUnit) {
            const index = this.units.findIndex((x: { id: string; }) => x.id === unit.id);
            if (index < 0) {
                return;
            }

            this.units[index].exhausted = !this.units[index].exhausted;

            this.refreshUnits([this.units[index]]);
        },
        /**
         * Method called when the unit is rallied.
         * @param unit The deployed unit.
         */
        onRallied(unit: DeployedUnit) {
            const index = this.units.findIndex((x: { id: string; }) => x.id === unit.id);
            if (index < 0) {
                return;
            }

            this.units[index].rallied = !this.units[index].rallied;

            this.rallyUnit(this.units[index]);
        },
        /**
         * Refresh all units in input
         * @param units The units to refresh
         */
        async refreshUnits(units: DeployedUnit[]) {
            for (let unit of units) {
                // TODO combine these await.
                await this.refreshUnit(unit);
            }

            this.saveUnits(this.units);
        },
        /**
         * Method to add the Exhausted indicator in the scene.
         * @param unit The deployed unit.
         */
        async refreshUnit(unit: DeployedUnit) {
            if (unit.exhausted) {
                const items = await OBR.scene.items.getItems([unit.id]);
                const image = this.buildExhaustedImage(items[0], unit.rallied);
                await OBR.scene.items.addItems([image]);
            } else {
                const allAttachments = await OBR.scene.items.getItemAttachments([unit.id]);
                const allIds = allAttachments
                    .filter((item) => item.name === EXHAUSTED)
                    .map((item) => item.id)
                    .filter((id) => id !== unit.id);
                await OBR.scene.items.deleteItems(allIds);
            }
        },
        /**
         * Method to add the Rallied indicator in the scene.
         * @param unit 
         */
        async rallyUnit(unit: DeployedUnit) {
            if (unit.rallied) {
                const items = await OBR.scene.items.getItems([unit.id]);
                const image = this.buildRalliedImage(items[0], unit.exhausted);
                await OBR.scene.items.addItems([image]);
            } else {
                const allAttachments = await OBR.scene.items.getItemAttachments([unit.id]);
                const allIds = allAttachments
                    .filter((item) => item.name === RALLIED)
                    .map((item) => item.id)
                    .filter((id) => id !== unit.id);
                await OBR.scene.items.deleteItems(allIds);
            }

            this.saveUnits(this.units);
        },
        /**
         * Build the context menu to be right-clicked.
         */
        buildContextMenu() {
            return {
                id: ID + '/add-unit',
                icons: [
                    {
                        icon: "/sword.svg",
                        label: "Add Unit",
                        filter: {
                            every: [
                                { key: "visible", value: true },
                                { key: "layer", value: "CHARACTER" },
                                { key: ["metadata", WARFARE_METADATA_KEY], value: undefined }
                            ]
                        }
                    },
                    {
                        icon: "/sword.svg",
                        label: "Remove Unit",
                        filter: {
                            every: [
                                { key: "visible", value: true },
                                { key: "layer", value: "CHARACTER" },
                            ]
                        }
                    }
                ],
                onClick: this.onContextMenuClick
            }
        },
        /**
         * Build the Exhausted Image associated to the item.
         * @param item The parent item.
         */
        buildExhaustedImage(item: Item, isRallied: boolean) {
            const position = {
                x: item.position.x,
                y: item.position.y
            }

            const imageContent = {
                width: ICON_SIZE,
                height: ICON_SIZE,
                mime: "image/svg+xml",
                url: "https://obr-kingdom-warfare.onrender.com/exhausted.svg"
            } as ImageContent;

            const offsetY = isRallied ? ICON_DPI : 0;

            const grid = {
                offset: {
                    // @ts-ignore
                    x: -(item.grid.offset.x / 2) - (ICON_SIZE / 4),
                    // @ts-ignore
                    y: (item.grid.offset.y / 2) + (ICON_SIZE / 2) - offsetY
                },
                dpi: ICON_DPI
            } as ImageGrid;

            return buildImage(imageContent, grid)
                .scale({ x: 1, y: 1 })
                .position(position)
                .attachedTo(item.id)
                .locked(true)
                .name(EXHAUSTED)
                .layer("ATTACHMENT")
                .disableHit(false)
                .visible(item.visible)
                .build();
        },
        /**
         * Build the Rallied Image associated to the item.
         * @param item The parent item.
         */
        buildRalliedImage(item: Item, isExhausted: boolean) {
            const position = {
                x: item.position.x,
                y: item.position.y
            }
            
            const imageContent = {
                width: ICON_SIZE,
                height: ICON_SIZE,
                mime: "image/svg+xml",
                url: "https://obr-kingdom-warfare.onrender.com/flag.svg"
            } as ImageContent;

            const offsetY = isExhausted ? ICON_DPI : 0;

            const grid = {
                offset: {
                    // @ts-ignore
                    x: -(item.grid.offset.x / 2) - (ICON_SIZE / 4),
                    // @ts-ignore
                    y: (item.grid.offset.y / 2) + (ICON_SIZE / 2) - offsetY
                },
                dpi: ICON_DPI
            } as ImageGrid;

            return buildImage(imageContent, grid)
                .scale({ x: 1, y: 1 })
                .position(position)
                .attachedTo(item.id)
                .locked(true)
                .name(RALLIED)
                .layer("ATTACHMENT")
                .disableHit(true)
                .visible(item.visible)
                .build();
        },
        /**
         * This method builds the health component displayed on screen
         * @param item The parent item
         */
        buildHealth(item: Item, unit: DeployedUnit) {
            const position = {
                x: item.position.x,
                y: item.position.y
            }

            return buildLabel()
                .position(position)
                .attachedTo(item.id)
                .height(40)
                .fontSize(15)
                .name("HEALTH")
                .textAlign("CENTER")
                .backgroundOpacity(0.5)
                .plainText(unit.casuality.current + "/" + unit.casuality.total)
                .build();
        },
        async centerViewportOnImage(ctu: any) {
            const dpi = await OBR.scene.grid.getDpi();
            const scale = await OBR.viewport.getScale();
            const viewportWidth = await OBR.viewport.getWidth();
            const viewportHeight = await OBR.viewport.getHeight();
            const viewportCenter = { x: viewportWidth / 2, y: viewportHeight / 2 };
            // Scale the viewport center to match the items coordinate space
            const relativeViewportCenter = {
                x: viewportCenter.x / scale,
                y: viewportCenter.y / scale,
            };

            const imageCenter = await this.getImageCenter(ctu, dpi);
            // Offset the image to find out what viewport position would center it
            const center = {
                x: imageCenter.x - relativeViewportCenter.x,
                y: imageCenter.y - relativeViewportCenter.y,
            };

            // Scale and invert the position to match the viewport's offset direction
            const position = {
                x: center.x * scale * -1,
                y: center.y * scale * -1,
            };

            await OBR.viewport.animateTo({
                position,
                scale,
            });
        },
        async getImageCenter(ctu: any, dpi: number)
        {
            const dpiScale = dpi / ctu.grid.dpi;
            const width = ctu.image.width * dpiScale;
            const height = ctu.image.height * dpiScale;
            const offsetX = (ctu.grid.offset.x / ctu.image.width) * width;
            const offsetY = (ctu.grid.offset.y / ctu.image.height) * height;
            return {
                x: ctu.position.x - offsetX + width / 2,
                y: ctu.position.y - offsetY + height / 2,
            };
        },
        /**
         * Method called when the player assigns a color to this unit.
         * @param unit The deployed unit.
         * @param color The color to assign.
         */
        onAssignColor(unit: DeployedUnit, color: string) {
            unit.color = color;
            unit.opened = !unit.opened;

            this.saveUnits(this.units);
        },
        /**
         * Event triggered whenever the mouse leaves the hovering of the name
         * @param event The event.
         * @param unit The deployed unit.
         */
        onNameMouseLeave(event: any, unit: DeployedUnit) {
            if (!unit.opened) {
                return;
            }

            event.preventDefault();
            unit.opened = false;
        },
        /**
         * Method called when the unit's name is right-clicked.
         */
        onNameRightClick(event: any, unit: DeployedUnit) {
            event.preventDefault();
            unit.opened = !unit.opened;
        },
        /**
         * Event triggered whenever the mouse leaves the refresh menu when it is opened.
         */
        onMouseLeaveRefreshMenu() {
            if (!this.refreshDropdownOpened) {
                return;
            }
            this.refreshDropdownOpened = false;
        },
        /**
         * Toggle the refresh menu.
         */
        toggleRefreshMenu() {
            this.refreshDropdownOpened = !this.refreshDropdownOpened;
        },
        /**
         * Method to refresh the army assigned to the color
         * @param color The color
         */
        refreshArmy(color: string) {
            // Find all units that needs to be refreshed.
            const affectedUnits = this.units.filter((unit) => unit.color === color);

            if (affectedUnits.length == 0) {
                return;
            }

            // Mark these as refreshed.
            affectedUnits.forEach((unit) => {
                unit.exhausted = false;
            });

            this.refreshUnits(affectedUnits);
            this.refreshDropdownOpened = !this.refreshDropdownOpened;
        },
        /**
         * Method to remove all drawings from the scene.
         */
        removeAllDrawings() {
            OBR.scene.items.getItems((item: Item) => item.layer === "DRAWING").then((drawings) => {
                const ids = drawings.map((item) => item.id)
                OBR.scene.items.deleteItems(ids);
            });
        }
    }
})  
</script>
  
<style scoped>

.input-number-value {
    width: 1.5rem;
    text-align: center;
}

table {
    overflow-y: auto;
    height: 325px;
    display: block;

    .left-align {
        text-align: left;
    }

    .center-align {
        text-align: center;
    }
}

th {
    font-size: small;
}

.footer {
    position: relative;
    padding-top: 0.5rem;
    justify-content: center;
}

.name-container {
    position: relative;
}

.hover {
    background-color: var(--default);
    position: absolute;
    z-index: 100;
    padding: 0.5rem;
    column-count: 4;
    width: min-content;
}

.pill {
    cursor: pointer;
    display: inline-block;
    margin: 0.5rem;
    height: 1.5rem;
    width: 1.5rem;
    border-radius: 1rem;
}

.refresh-button {
    cursor: pointer;
    color: var(--text);
    width: max-content;
    background-color: var(--background);
    border: none;
    align-items: center;
    display: flex;
    height: 2.5rem;
    border-radius: 0.5rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;

    .pill {
        height: 0.75rem;
        width: 0.75rem;
    }

    .caret {
        filter: invert(80%) sepia(29%) saturate(6341%) hue-rotate(207deg) brightness(100%) contrast(102%);;
    }
}

.refresh-menu {
    position: relative;
    display: inline-block;
    width: max-content;

    .refresh-menu-content {
        left: 0.625rem;
        bottom: 2.5rem;
        width: inherit;
        position: absolute;
        background-color: var(--default);

        button {
            background-color: var(--default);
        }
    }
}

</style>