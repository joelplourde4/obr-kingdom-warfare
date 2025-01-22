<template>
    <div class="content">
        <p v-if="domain.items?.length === 0 && !isEditMode">No Items are available at this time.</p>
        <div class="item row" v-for="item in domain.items">
            <div v-if="isItemShown(item)" class="container">
                <div class="row">
                    <input class="name" v-model="item.name" @input="onUpdate" :disabled="isDisabled">
                    <div v-if="isVisible" class="more">
                        <img class="dot" src="/more.svg">
                        <div class="more-options">
                            <div v-if="item.show" class="option-container tooltip">
                                <input type="button" class="icon-button show-button" @click="onToggleItem(item)"/>
                                <span class="tooltiptext">
                                    Is shown to the players, click to hide.
                                </span>
                            </div>
                            <div v-if="!item.show" class="option-container tooltip">
                                <input type="button" class="icon-button hide-button" @click="onToggleItem(item)"/>
                                <span class="tooltiptext">
                                    Is hidden from the players, click to show.
                                </span>
                            </div>
                            <div class="option-container tooltip">
                                <input type="button" :disabled="item.id === 0" class="icon-button arrow-up-button" @click="onMoveItem(item, -1)"/>
                                <span class="tooltiptext">
                                    On click, move the Item up.
                                </span>
                            </div>
                            <div class="option-container tooltip">
                                <input type="button" class="icon-button arrow-down-button" :disabled="item.id === domain.items?.length - 1" @click="onMoveItem(item, 1)"/>
                                <span class="tooltiptext">
                                    On click, move the Item down.
                                </span>
                            </div>
                            <div class="option-container tooltip">
                                <input v-show="isVisible" type="button" class="icon-button remove-button remove-item" @click="onRemoveItem(item)"/>
                                <span class="tooltiptext">
                                    On click, remove the Item.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <textarea class="description"
                        ref="textarea"
                        v-model="item.description"
                        @input="onTextAreaChange"
                        :disabled="isDisabled"
                        :class="isDisabled ? 'disabled' : ''"
                    />
            </div>
        </div>
        <div v-show="isVisible" class="add-button-container tooltip">
            <input type="button" class="icon-button add-button" @click="onAddItem()"/>
            <span>Item</span>
            <span class="tooltiptext">
                On click, add an Item.
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { utils } from '../../mixins/utils'

import BaseTab from './BaseTab.ts';
import { Item } from '../../models/Item.ts';

export default defineComponent({
    mixins: [utils],
    extends: BaseTab,
    name: 'Inventory',
    data() {
        return {}
    },
    created() {
        if (this.domain.items === undefined) {
            this.domain.items = [];
            this.onUpdate();
        }
    },
    methods: {
        onTabSelected() {
            this.resizeAllTextArea();
        },
        isItemShown(item: Item) {
            return item.show || this.isGM;
        },
        onToggleItem(item: Item) {
            item.show = !item.show;
            this.onUpdate();
        },
        onMoveItem(item: Item, direction: number) {
            const index = this.domain.items.indexOf(item);
            const newIndex = index + direction;

            // Invert the position in the Items array
            if (newIndex >= 0 && newIndex < this.domain.items.length) {
                this.domain.items.splice(index, 1);
                this.domain.items.splice(newIndex, 0, item);
            }

            this.domain.items.forEach((item, index) => {
                item.id = index;
            });
            this.onUpdate();
        },
        onAddItem() {
            const itemId = (this.domain.items || []).length;
            this.domain.items.push(new Item(itemId))
            this.onUpdate();
        },
        onRemoveItem(item: Item) {
            this.domain.items = this.domain.items.filter((x) => {
                return x !== item
            });
            this.onUpdate();
        },
        onTextAreaChange(event: any) {
            this.resizeTextArea(event.target);
            return this.onUpdate();
        },
    }
})

</script>
<style scoped>

.item {

    .name {
        margin: 0.25rem;
        height: 24px;
        float: left;
        align-self: center;
        width: 100%;
    }

    .description {
        margin: 0.25rem;
        min-height: 40px;
    }

    textarea {
        min-width: 370px;
        max-width: 370px;
    }

    textarea:disabled {
        resize: none;
    }
}

</style>