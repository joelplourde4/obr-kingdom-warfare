<template>
    <div class="content">
        <div class="feature row" v-for="feature in domain.features">
            <div class="container">
                <input class="name" v-model="feature.name" @input="onUpdate" :disabled="isDisabled">
                <div class="source row">
                    <p>Source</p>
                    <select class="dropdown" v-model="feature.source" @click="preventPropagation" :disabled="isDisabled">
                        <option v-for="relation in domain.relations" :value="relation.name">
                            {{ relation.name }}
                        </option>
                    </select>
                </div>
                <textarea class="description"
                v-model="feature.description"
                @input="onUpdate"
                :disabled="isDisabled"
                :class="isDisabled ? 'disabled' : ''"
                />
                <br>
            </div>
            <input v-show="isVisible" type="button" class="remove-button" @click="onRemoveFeature(feature)"/>
        </div>
        <input v-show="isVisible" type="button" class="add-button" @click="onAddFeature"/>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'
import { Domain } from '../../models/Domain'
import { Feature } from '../../models/Feature';
    
export default defineComponent({
    name: 'Feature',
    props: {
        isGM: {
            type: Boolean,
            required: true
        },
        isEditMode: {
            type: Boolean,
            required: true
        },
        domain: {
            type: Domain,
            required: true
        }
    },
    emits: ['update:modelValue'],
    computed: {
        isVisible() {
            return this.isEditMode === true;
        },
        isDisabled() {
            if (!this.isGM) {
                return true;
            }

            return !this.isEditMode;
        }
    },
    methods: {
        preventPropagation(event: any) {
            event.stopPropagation();
        },
        onAddFeature() {
            this.domain.features.push(new Feature());
            this.onUpdate();
        },
        onRemoveFeature(feature: Feature) {
            this.domain.features = this.domain.features.filter((x) => {
                return x !== feature
            });
            this.onUpdate();
        },
        onUpdate() {
            const json = JSON.parse(JSON.stringify(this.domain));
            this.$emit('update:modelValue', json);
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