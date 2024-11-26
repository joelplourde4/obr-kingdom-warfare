<template>
</template>

<script lang="ts">
import OBR, { Item, Player } from '@owlbear-rodeo/sdk';
import { defineComponent, PropType } from 'vue';
import { PinAction } from './models/PinAction.ts';
import { PinMode } from './models/PinMode.ts';
import { PinTool } from './models/PinTool.ts';
import { TOOL_METADATA_KEY } from './main.ts';

export default defineComponent({
    name: 'Tools',
    props: {
        currentPlayer: {
            type: Object as PropType<Player>,
            required: true
        },
    },
    data() {
        const playerItemSelection: Map<String, Item[]> = new Map();
        return {
            playerItemSelection,
            onPlayerChangeCallback: () => {}
        }
    },
    mounted() {
        OBR.onReady(() => {
            this.onPlayerChangeCallback = OBR.player.onChange((player) => {
                const selectedItemIds = (this.playerItemSelection.get(this.currentPlayer.id) || []).map(x => x.id);

                if (!player.selection) {
                    OBR.scene.items.getItemAttachments(selectedItemIds).then((items) => {
                        const itemToHide: Item[] = [];
                        for (const item of items) {
                            if (item.metadata[TOOL_METADATA_KEY]) {
                                itemToHide.push(item);
                            }
                        }
                        this.toggleItems(itemToHide, false);
                    });
                    return;
                }

                // Toggle the differences
                let difference = selectedItemIds.filter(x => !(player.selection || []).includes(x));
                // @ts-ignore
                this.toggleItems(difference, false);

                OBR.scene.items.getItemAttachments(player.selection).then((items) => {
                    this.playerItemSelection.set(this.currentPlayer.id, []);
                    for (const item of items) {
                        if (item.metadata[TOOL_METADATA_KEY]) {
                            this.playerItemSelection.get(this.currentPlayer.id)?.push(item);
                        }
                    }
                    return this.playerItemSelection.get(this.currentPlayer.id) as Item[];
                }).then((items) => {
                    this.toggleItems(items, true);
                });
            }),

            OBR.tool.create(new PinTool());
            OBR.tool.createMode(new PinMode());
            OBR.tool.createAction(new PinAction());
        });
    },
    unmounted() {
        this.onPlayerChangeCallback();
    },
    methods: {
        async toggleItems(items: Item[], visible: Boolean) {
            const json = JSON.parse(JSON.stringify(items)) as Item[];
            await OBR.scene.items.updateItems(
                json,    
                (texts) => {
                for (let text of texts) {
                    text.visible = visible;
                }
            });
        }
    }
});
</script>