<template>
    <div class="content">
        <div class="feature row" v-for="feature in domain.features">
            <div class="row">
                <div v-if="isShown(feature)" class="container">
                    <div class="row">
                        <input class="name" v-model="feature.name" @input="onUpdate" :disabled="isDisabled">
                        <div v-if="isVisible" class="more">
                            <img class="dot" src="/more.svg">
                            <div class="more-options">
                                <div class="option-container show">
                                    <div v-if="!feature.visible" class="tooltip">
                                        <input type="button" class="show-button" @click="onToggleFeature(feature)"/>
                                        <span class="tooltiptext">
                                            Is shown to the players, click to hide.
                                        </span>
                                    </div>
                                    <div v-if="feature.visible" class="tooltip">
                                        <input type="button" class="hide-button" @click="onToggleFeature(feature)"/>
                                        <span class="tooltiptext">
                                            Is hidden from the players, click to show.
                                        </span>
                                    </div>
                                </div>
                                <div class="option-container tooltip">
                                    <input type="button" class="remove-button" @click="onRemoveFeature(feature)"/>
                                    <span class="tooltiptext">
                                        On click, remove the Feature.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <textarea class="description"
                        ref="textarea"
                        v-model="feature.description"
                        @input="onTextAreaChange"
                        :disabled="isDisabled"
                        :class="isDisabled ? 'disabled' : ''"
                    />
                    <div class="source row">
                        <p class="source-text">Source</p>
                        <select class="dropdown" v-model="feature.source" @click="preventPropagation" @change="onUpdate" :disabled="isDisabled">
                            <option v-for="relation in domain.relations" :value="relation.name">
                                {{ relation.name }}
                            </option>
                        </select>
                    </div>
                    <br>
                </div>
            </div>
        </div>
        <div v-show="isVisible" class="add-button-container tooltip">
            <input type="button" class="add-button" @click="onAddFeature"/>
            <span>Feature</span>
            <span class="tooltiptext">
                On click, add a Feature.
            </span>
        </div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'
import { utils } from '../../mixins/utils'

import { Feature } from '../../models/Feature';

// @ts-ignore
import BaseTab from './BaseTab.js'
    
export default defineComponent({
    mixins: [utils],
    extends: BaseTab,
    name: 'Feature',
    updated() {
        ((this.$refs.textarea || []) as Array<any>).forEach((element: any) => {
            this.resizeTextArea(element);
        });
    },
    methods: {
        onAddFeature() {
            this.domain.features.push(new Feature());
            this.onUpdate();
        },
        onRemoveFeature(feature: Feature) {
            this.domain.features = this.domain.features.filter((x: Feature) => {
                return x !== feature
            });
            this.onUpdate();
        },
        resizeTextArea(target: any) {
            target.style.height = "auto";
            target.style.height = `${target.scrollHeight}px`;
        },
        onTextAreaChange(event: any) {
            this.resizeTextArea(event.target);
            return this.onUpdate();
        },
        onToggleFeature(feature: Feature) {
            feature.visible = !feature.visible;
            this.onUpdate();
        },
        isShown(feature: Feature) {
            if (this.isGM) {
                return true;
            }
            return !feature.visible;
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