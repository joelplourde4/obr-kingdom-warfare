<template>
    <div class="content">
        <h1>Relation</h1>
        <div class="columns">
        </div>
    </div>
  </template>
  
<script lang="ts">
import { defineComponent } from 'vue'
import { Relation } from '../../models/Relation'
    
export default defineComponent({
    name: 'Relation',
    props: {
        relation: Array<Relation>
    },
    setup () {
        console.log('Setup Relation!');
    },
})
    
</script>
  
<style scoped>
</style>