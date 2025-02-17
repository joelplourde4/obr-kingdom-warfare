<template>
    <div class="content">
        <p v-if="domain.features.length === 0 && !isEditMode">No features are available at this time.</p>
        <div class="feature row" v-for="feature in domain.features">
                <div v-if="isShown(feature)" class="container group">
                    <button type="button" class="collapsible" @click="onExpandFeature(feature)">
                        <input class="name" v-model="feature.name" @input="onUpdate" :disabled="isDisabled">
                        <div v-if="feature.expand" class="option-container tooltip">
                            <input type="button" class="icon-button arrow-up-button"/>
                        </div>
                        <div v-if="!feature.expand" class="option-container tooltip">
                            <input type="button" class="icon-button arrow-down-button"/>
                        </div>
                        <div v-if="isVisible" class="more">
                            <img class="dot" src="/more.svg">
                            <div class="more-options">
                                <div class="option-container show">
                                    <div v-if="!feature.visible" class="tooltip">
                                        <input type="button" class="icon-button show-button" @click="onToggleFeature(feature)"/>
                                        <span class="tooltiptext">
                                            Is shown to the players, click to hide.
                                        </span>
                                    </div>
                                    <div v-if="feature.visible" class="tooltip">
                                        <input type="button" class="icon-button hide-button" @click="onToggleFeature(feature)"/>
                                        <span class="tooltiptext">
                                            Is hidden from the players, click to show.
                                        </span>
                                    </div>
                                </div>
                                <div class="option-container tooltip">
                                    <input type="button" :disabled="feature.id === 0" class="icon-button arrow-up-button" @click="onMoveFeature(feature, -1)"/>
                                    <span class="tooltiptext">
                                        On click, move the Feature up.
                                    </span>
                                </div>
                                <div class="option-container tooltip">
                                    <input type="button" class="icon-button arrow-down-button" :disabled="feature.id === domain.features.length - 1" @click="onMoveFeature(feature, 1)"/>
                                    <span class="tooltiptext">
                                        On click, move the Feature down.
                                    </span>
                                </div>
                                <div class="option-container tooltip">
                                    <input type="button" class="icon-button remove-button" @click="onRemoveFeature(feature)"/>
                                    <span class="tooltiptext">
                                        On click, remove the Feature.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </button>
                    <div class="description-container">
                        <textarea 
                            v-if="feature.expand"
                            class="description"
                            ref="textarea"
                            v-model="feature.description"
                            @input="onTextAreaChange"
                            :disabled="isDisabled"
                            :class="isDisabled ? 'disabled' : ''"
                        />
                        <div 
                            v-if="feature.expand"
                            class="source row">
                            <p class="source-text">Source</p>
                            <select class="dropdown" v-model="feature.source" @click="preventPropagation" @change="onUpdate" :disabled="isDisabled">
                                <option v-for="relation in domain.relations" :value="relation.name">
                                    {{ relation.name }}
                                </option>
                            </select>
                        </div>
                    </div>
            </div>
        </div>
        <div v-show="isVisible" class="add-button-container tooltip">
            <input type="button" class="icon-button add-button" @click="onAddFeature"/>
            <span>Feature</span>
            <span class="tooltiptext add-feature-button">
                On click, add a Feature.
            </span>
        </div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'
import { utils } from '../../mixins/utils'

import { Feature } from '../../models/Feature';

import BaseTab from './BaseTab.ts'
    
export default defineComponent({
    mixins: [utils],
    extends: BaseTab,
    name: 'Feature',
    updated() {
        this.resizeAllTextArea();
    },
    created() {
        this.domain.features.forEach((feature: Feature, i: number) => { 
            feature.id = i;
        });
    },
    methods: {
        onTabSelected() {
            this.resizeAllTextArea();
        },
        onAddFeature() {
            const featureId = this.domain.features.length;
            this.domain.features.push(new Feature(featureId));
            this.onUpdate();
        },
        onRemoveFeature(feature: Feature) {
            this.domain.features = this.domain.features.filter((x: Feature) => {
                return x !== feature
            });
            this.onUpdate();
        },
        onTextAreaChange(event: any) {
            this.resizeTextArea(event.target);
            return this.onUpdate();
        },
        onToggleFeature(feature: Feature) {
            feature.visible = !feature.visible;
            this.onUpdate();
        },
        onExpandFeature(feature: Feature) {
            feature.expand = !feature.expand;
            if (feature.expand) {
                this.$nextTick(() => {
                    this.resizeTextArea(this.$refs.textarea);
                });
            }
        },
        isShown(feature: Feature) {
            if (this.isGM) {
                return true;
            }
            return !feature.visible;
        },
        onMoveFeature(feature: Feature, direction: number) {
            const index = this.domain.features.indexOf(feature);
            const newIndex = index + direction;

            // Invert the position in the Relation array
            if (newIndex >= 0 && newIndex < this.domain.features.length) {
                this.domain.features.splice(index, 1);
                this.domain.features.splice(newIndex, 0, feature);
            }

            // Re-calculate each index
            this.domain.features.forEach((feature: Feature, index: number) => {
                feature.id = index;
            });

            this.onUpdate();
        },
    }
})  
</script>
  
<style scoped>

.feature {

    .show {
        margin-top: 0.5rem;
        height: 25px;
        width: 25px;
    }

    input {
        margin-top: 5px;
    }

    .source {
        height: 24px;
        padding-left: 0.25rem;

        .source-text {
            font-size: smaller;
            font-style: italic;
            display: contents;
            padding-right: 0.125rem;
        }

        select {
            margin-left: 0.25rem;
        }
    }

    .name {
        margin: 0.25rem;
        height: 24px;
        float: left;
        align-self: center;
        width: 100%;
    }

    .description-container {
        margin: 0.25rem;
        width: 100%;
    }

    .description {
        margin: 0.25rem;
        min-height: 40px;
    }

    textarea {
        min-width: 350px;
        max-width: 350px;
    }

    textarea:disabled {
        resize: none;
    }
}

</style>