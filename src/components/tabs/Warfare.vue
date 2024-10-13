<template>
    <div class="content">
        <table>
            <tr>
                <th class="left-align">Name</th>
                <th class="center-align">HP</th>
                <th class="center-align">Exh.</th>
                <th class="center-align">Rally</th>
            </tr>
            <tr v-for="unit in units">
                <td class="left-align">
                    <input type="text" @dblclick="focusUnit(unit)" :value="unit.name"/>
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
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'
import OBR, { buildImage, buildLabel, ContextMenuContext, ImageContent, ImageGrid, Item } from '@owlbear-rodeo/sdk';
import { utils } from '../../mixins/utils'

// @ts-ignore
import BaseTab from './BaseTab.js'

const ICON_SIZE = 200
const ICON_DPI = 150

const EXHAUSTED: string = "EXHAUSTED"
const RALLIED: string = "RALLIED"

const GLOBAL_MESSAGE = "obr.domain.sheet.warfare.channel"

export class Casuality {
    current: number;
    total: number;

    constructor() {
        this.current = -1;
        this.total = -1;
    }
}

export class DeployedUnit {
    id: string;
    name: string;
    casuality: Casuality;
    exhausted: boolean;
    rallied: boolean;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this.casuality = new Casuality();
        this.exhausted = false;
        this.rallied = false;
    }
}

export default defineComponent({
    mixins: [utils],
    extends: BaseTab,
    name: 'Warfare',
    data() {
        return {
            units: [] as DeployedUnit[]
        }
    },
    mounted() {
        const intervalId = window.setInterval(async () => {
            if (OBR.isReady) {
                const contextMenu = {
                    id: "my-id",
                    icons: [{
                        icon: "/kingdom.svg",
                        label: "Add Unit",
                        filter: {
                            every: [
                                { key: "visible", value: true },
                                { key: "layer", value: "CHARACTER" }
                            ]
                        }
                    }],
                    onClick: this.addUnit
                }

                OBR.contextMenu.create(contextMenu);

                OBR.scene.items.onChange((items) => {
                    this.onChange(items);
                });

                OBR.scene.onReadyChange((ready) => {
                    if (ready) {
                        // Load the metadata
                        OBR.scene.getMetadata().then(metadata => {
                            const data = metadata["com.obr.domain-sheet/warfare/metadata"] as any;
                            if (data) {
                                for (let entry of data.data) {
                                    const unit = Object.setPrototypeOf(entry, DeployedUnit.prototype);

                                    this.units.push(unit);

                                    this.refreshUnit(unit);
                                }
                            }
                        });
                    }
                });

                // Subscribe to Global Messages
                OBR.broadcast.onMessage(GLOBAL_MESSAGE, (event) => {
                    this.units = [];
                    for (let entry of event.data as any) {
                        this.units.push(Object.setPrototypeOf(entry, DeployedUnit.prototype));
                    }
                });
                
                clearInterval(intervalId);
            }
        }, 200);
    },
    methods: {
        /**
         * Method to save the array of deployed unit to the room metadata.
         * @param units The deployed units.
         */
        saveUnits(units: DeployedUnit[]) {
            let json = JSON.parse(JSON.stringify(units));

            const metadata = {
                "com.obr.domain-sheet/warfare/metadata": {
                    data: json
                }
            }

            // Set the metadata
            OBR.scene.setMetadata(metadata)

            // Broadcast a message to
            OBR.broadcast.sendMessage(GLOBAL_MESSAGE, json, { destination: "REMOTE" })
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
         * Method to add an unit to the deployment
         * @param context The context menu context
         * @param _elementId The element ID
         */
        addUnit(context: ContextMenuContext, _elementId: string) {
            for (let item of context.items) {
                let exists = false;
                for (let unit of this.units) {
                    if (unit.id === item.id) {
                        exists = true;
                    }
                }

                if (!exists) {
                    this.units.push(new DeployedUnit(item.id, item.name));
                }
            }

            this.saveUnits(this.units);
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
        async onCasualty(unit: DeployedUnit) {
            console.log(unit);
            const attachments = await OBR.scene.items.getItemAttachments([unit.id]);
            console.log(attachments);

            const index = attachments.findIndex((a) => a.name === "HEALTH");
            if (index < 0) {
                const items = await OBR.scene.items.getItems([unit.id]);
                const label = this.buildHealth(items[0], unit);
                await OBR.scene.items.addItems([label]);
            } else {
                await OBR.scene.items.updateItems([attachments[index]], (items) => {
                    items[0].text.plainText = unit.casuality.current + "/" + unit.casuality.total;
                });
                // Simply update the attachments
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

            this.refreshUnit(this.units[index]);
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

            this.saveUnits(this.units);
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
                url: "https://obr-kingdom-warfare.onrender.com/kingdom.svg"
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

            const circle = buildImage(imageContent, grid)
                .scale({ x: 1, y: 1 })
                .position(position)
                .attachedTo(item.id)
                .locked(true)
                .name(EXHAUSTED)
                .layer("ATTACHMENT")
                .disableHit(false)
                .visible(item.visible)
                .build();
            return circle;
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
                url: "https://obr-kingdom-warfare.onrender.com/person.svg"
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

            const circle = buildImage(imageContent, grid)
                .scale({ x: 1, y: 1 })
                .position(position)
                .attachedTo(item.id)
                .locked(true)
                .name(RALLIED)
                .layer("ATTACHMENT")
                .disableHit(true)
                .visible(item.visible)
                .build();
            return circle;
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
        }
    }
})  
</script>
  
<style scoped>

.input-number-value {
    width: 1.5rem;
}

table {
    width: 100%;

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

input[type="checkbox"] {
    appearance: none;
    width: 24px;
    height: 24px;
    border: 1px solid var(--OBR-font);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    margin: 0px 0px 2px;
    vertical-align: middle;
}

input[type="checkbox"]:checked::after {
    content: "";
    width: 12px;
    height: 12px;
    background-color: var(--accent);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

</style>