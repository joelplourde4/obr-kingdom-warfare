<template>
    <div class="content">
        <div class="feature row" v-for="feature in domain.features">
            <div class="container">
                <div class="row">
                    <input class="name" v-model="feature.name" @input="onUpdate" :disabled="isDisabled">
                    <input v-show="isVisible" type="button" class="remove-button" @click="onRemoveFeature(feature)"/>
                </div>
                <textarea class="description"
                v-model="feature.description"
                @input="onUpdate"
                :disabled="isDisabled"
                :class="isDisabled ? 'disabled' : ''"
                />
                <div class="source row">
                    <p>Source</p>
                    <select class="dropdown" v-model="feature.source" @click="preventPropagation" @change="onUpdate" :disabled="isDisabled">
                        <option v-for="relation in domain.relations" :value="relation.name">
                            {{ relation.name }}
                        </option>
                    </select>
                </div>
                <br>
            </div>
        </div>
        <input v-show="isVisible" type="button" class="add-button" @click="onAddFeature"/>
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
    methods: {
        onAddFeature() {
            this.domain.features.push(new Feature());
            this.onUpdate();
        },
        onRemoveFeature(feature: Feature) {
            this.domain.features = this.domain.features.filter((x) => {
                return x !== feature
            });
            this.onUpdate();
        }
    }
})  
</script>
  
<style scoped>

.feature {

    .source {
        height: 24px;
        padding-left: 0.25rem;

        p {
            display: contents;
            padding-right: 0.125rem;
        }

        select {
            margin-left: 1rem;
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