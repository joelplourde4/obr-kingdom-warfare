<template>
    <div class="content">
        <h1>Features</h1>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'
import { Feature } from '../../models/Feature'
    
export default defineComponent({
    name: 'Feature',
    props: {
        feature: Array<Feature>
    },
    setup () {
        console.log('Setup Feature!');
    },
})  
</script>
  
<style scoped>
</style>