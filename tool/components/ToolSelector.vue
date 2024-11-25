<template>
    <div class="row icon-container">
        <input
            type="button"
            class="icon-button pin-button"
            :class="(selectedIcon == 'pin') ? 'selected' : 'not-selected'"
            @click="onSelection('pin')"
        />
        <input
            type="button"
            class="icon-button quest-button"
            :class="(selectedIcon == 'quest') ? 'selected' : 'not-selected'"
            @click="onSelection('quest')"
        />
    </div>
</template>

<script lang="ts">
import OBR from '@owlbear-rodeo/sdk';
import { defineComponent } from 'vue';
import { TOOL_ID } from '../main';

export default defineComponent({
    name: 'ToolSelector',
    data() {
        const selectedIcon: string = "pin";
        return {
            selectedIcon: selectedIcon
        }
    },
    mounted() {
        OBR.onReady(() => {
            OBR.tool.getMetadata(`${TOOL_ID}/tool`).then((metadata) => {
                // @ts-ignore
                this.selectedIcon = metadata?.iconKey || "pin";
            });
        });
    },
    methods: {
        onSelection(key: string) {
            this.selectedIcon = key;
            OBR.tool.setMetadata(`${TOOL_ID}/tool`, { 
                iconKey: key
            });
        }
    }
});
</script>

<style scoped>

.icon-container {
    justify-content: center;
}

input.pin-button {
    background-image: url(/pin.svg);
}

input.quest-button {
    background-image: url(/quest.svg);
}

.selected {
    filter: invert(80%) sepia(29%) saturate(6341%) hue-rotate(207deg) brightness(100%) contrast(102%);
}

.not-selected {
    filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(106deg) brightness(103%) contrast(102%);
}

</style>