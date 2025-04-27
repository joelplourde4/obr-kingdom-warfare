<template>
    <div class="content crafting">
        <p v-if="getCategories.length === 0 && !isEditMode">No activities have been started yet.</p>
        <div v-for="category in getCategories" class="category-content">
            <button type="button" class="category collapsible" @click="openCategoryCollapsible($event, category)" :id="category.id + ''" :ondrop="drop" :ondragover="allowDrop">
                <div class="label">
                    <input class="name category-name" v-model="category.name" @input="onUpdate" @click="preventPropagation" :disabled="isDisabled">
                </div>
                <div class="row">
                    <div class="caret">
                        <img v-if="category.show" src="/caret-up.svg">
                        <img v-if="!category.show" src="/caret-down.svg">
                    </div>
                    <input v-show="isVisible && canRemoveCategory" type="button" class="icon-button remove-button" @click="onRemoveCategory(category)"/>
                </div>
            </button>
            <div v-if="category.show" class="collapsible-content">
                <p v-if="category.activities.length == 0" class="no-activity">No activities have been started yet.</p>
                <div class="activity" v-for="activity in category.activities" :id="activity.id" draggable="true" :ondragstart="drag">
                    <div v-if="isEditMode" class="row edit-mode">
                        <input
                            type="text"
                            class="name"
                            v-model="activity.name"
                            :disabled="isDisabled"
                            @input="onUpdate"
                        />
                        <input 
                            type="number"
                            class="hours"
                            v-model="activity.currentHours"
                            :disabled="isDisabled"
                            @input="onUpdate"
                        />
                        <input 
                            type="number"
                            class="hours"
                            min="1"
                            v-model="activity.totalHours"
                            :disabled="isDisabled"
                            @input="onUpdate"
                        />
                        <input v-show="isVisible" type="button" class="icon-button remove-button" @click="onRemoveActivity(category, activity)"/>
                    </div>
                    <div v-else class="row read-only-mode">
                        <span class="name">{{ activity.name }}</span>
                        <div class="progress-bar">
                            <p class="background"></p>
                            <p class="gradient" :style="{
                                'width': calculateProgress(activity),
                                'background': getGradientColor(activity)
                            }"></p>
                            <p class="text">{{ activity.currentHours }} / {{ activity.totalHours}} hours</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="isVisible" class="add-button-container tooltip">
            <input type="button" class="icon-button add-button" @click="onAddCategory"/>
            <span>Category</span>
            <span class="tooltiptext">
                On click, add a Category.
            </span>
        </div>
        <div v-show="isVisible" class="add-button-container tooltip">
            <input type="button" class="icon-button add-button" @click="onAddActivity"/>
            <span>Activity</span>
            <span class="tooltiptext">
                On click, add an Activity.
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { utils } from '../../mixins/utils'
import BaseTab from './BaseTab.ts'

import { Category, Activity } from '../../models/Crafting.ts'
import { craftingUtils } from '../../mixins/craftingUtils.ts'

const PROGRESS_BAR_WIDTH = 150; // px

const COLORS = [
    '#e5405e', // Red
    '#ffdb3a', // Yellow
    '#3fffa2'  // Green
];

export default defineComponent({
    mixins: [utils, craftingUtils],
    extends: BaseTab,
    name: 'Crafting',
    computed: {
        getCategories() {
            return this.domain.categories || [];
        },
    },
    methods: {
        /*
         * Adding
         */
        onAddCategory() {
            this.addCategory(this.domain.categories);
            this.onUpdate();
        },
        onAddActivity() {
            if (!this.domain.categories) {
                this.domain.categories = [];
            }

            if (this.domain.categories.length == 0) {
                this.domain.categories.push(new Category(1));
            }
            this.domain.categories[0].activities.push(new Activity());
            this.onUpdate();
        },
        /*
         * Removing
         */
        onRemoveCategory(category: Category) {
            this.preventPropagation(event);
            this.removeCategory(this.domain.categories, category);
            this.onUpdate();
        },
        onRemoveActivity(category: Category, activity: Activity) {
            this.preventPropagation(event);
            const index = this.domain.categories.findIndex((x) => {
                return x.id == category.id;
            });

            this.domain.categories[index].activities = this.domain.categories[index].activities.filter((x: Activity) => {
                return x !== activity
            });
            this.onUpdate();
        },
        canRemoveCategory() {
            return this.domain.categories.length > 1;
        },
        openCategoryCollapsible($event: any, category: Category) {
            if ($event.detail === 0) {
                // Ignore spacebar press
                return;
            }
            category.show = !category.show;
        },
        /**
         * ---------- Drag and Drop
         */
         allowDrop(event: any) {
            event.preventDefault();
        },
        drag(event: any) {
            event.dataTransfer.setData("data", event.target.id);
        },
        drop(event: any) {
            event.preventDefault();
            if (!event.target.id) {
                console.log('No event target id');
                return;
            }

            // Find where the activity was dropped.
            const categoryId = Number(event.target.id);
            const index = this.domain.categories.findIndex((x) => {
                return x.id == categoryId;
            });

            // Return early if it wasn't dropped on a category.
            if (index < 0) {
                console.log('Wrong categoryId!');
                return;
            }

            const targetId = event.dataTransfer.getData("data");
            this.moveActivity(this.domain.categories, targetId, this.domain.categories[index]);
            this.onUpdate();
        },
        /*
        * ---------- Gradient
        */
        calculatePercentage(activity: Activity) {
            if (activity.totalHours == 0) {
                return 0;
            }
            return (activity.currentHours / activity.totalHours);
        },
        calculateProgress(activity: Activity) {
            return this.calculatePercentage(activity) * PROGRESS_BAR_WIDTH + 'px';
        },
        getGradientColor(activity: Activity) {
            // Clamp percentage between 0 and 100
            const percentage = this.calculatePercentage(activity) * 100;
            
            // Find the two colors to interpolate between
            const index = (COLORS.length - 1) * percentage / 100;
            const i = Math.floor(index);
            const t = index - i;
            
            const color1 = COLORS[i];
            const color2 = COLORS[Math.min(i + 1, COLORS.length - 1)];
            
            // Interpolate between the two colors
            const rgb = [0, 1, 2].map(j => {
                const c1 = parseInt(color1.slice(1 + j * 2, 3 + j * 2), 16);
                const c2 = parseInt(color2.slice(1 + j * 2, 3 + j * 2), 16);
                return Math.round(c1 * (1 - t) + c2 * t);
            });
            
            // Convert RGB to hex
            return '#' + rgb.map(c => c.toString(16).padStart(2, '0')).join('');
        }
    }
})  
</script>

<style scoped>

.crafting {
    padding-bottom: 50px;
}

.category {
    color: var(--text);
    justify-content: space-between;
    align-items: center;
    min-height: 50px;
}

.category-content {
    outline: outset;
    outline-color: #00000036;
    outline-width: 0.125rem;
    margin-bottom: 0.75rem;
}

.category-name {
    width: 100%;
    padding: 0.5rem;
}

.no-activity {
    padding-bottom: 0.5rem;
}

.activity {
    padding: 1rem;

    .edit-mode {

        .name {
            width: 175px;
            margin: 0.25rem;
        }

        .hours {
            margin: 0.25rem;
            width: 50px;
            text-align: center;
        }
    }

    .read-only-mode {
        .name {
            text-align: left;
            max-width: 175px;
            width: 50%;
        }
    }

    .progress-bar {
        height: 20px;

        .background {
            margin: 0;
            position: absolute;
            height: 20px;
            width: 150px;
            background-color: #00000036;
        }

        .gradient {
            margin: 0;
            position: absolute;
            height: 20px;
        }

        .text {
            width: 150px;
            margin: 0;
            position: relative;
        }
    }
}
</style>