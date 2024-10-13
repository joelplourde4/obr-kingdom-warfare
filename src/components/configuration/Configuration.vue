<template>
    <div class="tooltip row">
        <input
            class="checkbox"
            type="checkbox"
            :checked="value"
            @click="onChanged"
        />
        <span>{{ description }}</span>
        <span class="tooltiptext">
            {{ tooltip }}
        </span>
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
        description: {
            type: String,
            required: true
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

</style>