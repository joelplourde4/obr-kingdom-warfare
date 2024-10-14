<template>
    <div class="tooltip row">
        <div class="row">
            <input
                class="checkbox"
                type="checkbox"
                :checked="value"
                @click="onChanged"
            />
            <span>{{ title }}</span>
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
            type: Boolean,
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
        }
    },
    emits: ['update:modelValue'],
    data() {
        const configuration = this.value

        return {
            configuration: configuration,
        }
    },
    methods: {
        onChanged() {
            this.configuration = !this.configuration;
            this.$emit('update:modelValue', this.configuration)
        }
    },
    computed: {
    }
})  
</script>
  
<style scoped>

.checkbox {
    margin-right: 0.5rem;
}

.description {
    margin: 0.25rem;
    text-align: left;
}

</style>