<template>
    <div class="content">
        <h1>Relation</h1>
        <div class="columns">
        </div>
    </div>
  </template>
  
<script lang="ts">
import { defineComponent, toRaw } from 'vue'

import { Domain } from '../../models/Domain'
    
export default defineComponent({
    name: 'Relation',
    props: {
        isGM: {
            type: Boolean,
            required: true
        },
        domain: {
            type: Domain,
            required: true
        }
    },
    emits: ['update:modelValue'],
    methods: {
        onAddRelation() {
            this.$emit('update:modelValue', toRaw(this.domain));
        },
        onUpdate() {
            this.$emit('update:modelValue', toRaw(this.domain));
        }
    }
})
    
</script>
  
<style scoped>
</style>