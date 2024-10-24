<template>
    <div class="tooltip row container" :style="{ 'margin-left': isChild ? '50px' : '0px'}">
        <div class="row">
            <input
                v-if="isBoolean"
                class="checkbox"
                type="checkbox"
                :disabled="disabled"
                :checked="valueAsBoolean"
                @click="onChanged"
            />
            <span>{{ title }}</span>
            <input
                v-if="isNumber"
                class="number"
                type="number"
                :disabled="disabled"
                :value="value"
                @input="onChanged($event, value)"
            />
            <span class="tooltiptext">
                {{ tooltip }}
            </span>
        </div>
        <div v-if="description" class="row">
            <p class="description">{{ description }}</p>
        </div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'Feature',
    props: {
        value: {
            type: [Boolean, Number],
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        tooltip: {
            type: String,
            required: true
        },
        disabled: {
            type: Boolean,
            required: false
        },
        isChild: {
            type: Boolean,
            required: false
        }
    },
    emits: ['update:modelValue'],
    data() {
        const configuration = this.value

        return {
            configuration: configuration,
        }
    },
    computed: {
        isBoolean() {
            return typeof this.value === 'boolean'
        },
        valueAsBoolean(): boolean {
            return this.value as boolean;
        },
        isNumber() {
            return typeof this.value === 'number'
        },
        valueAsNumber(): number {
            return this.value as number;
        }
    },
    methods: {
        onChanged(event: any) {
            if (this.isBoolean) {
                this.configuration = !this.configuration;
            } else {
                this.configuration = event.target.valueAsNumber
            }
            this.$emit('update:modelValue', this.configuration)
        }
    },
})  
</script>
  
<style scoped>

.checkbox {
    margin-right: 0.5rem;
}

.number {
    width: 50%;
    margin-left: 0.5rem;
}

.description {
    margin: 0.25rem;
    text-align: left;
}

</style>