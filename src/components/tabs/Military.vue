<template>
    <div class="content">
        <h1>Military</h1>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'
import { utils } from '../../mixins/utils'

// @ts-ignore
import BaseTab from './BaseTab.js'
    
export default defineComponent({
    mixins: [utils],
    extends: BaseTab,
    name: 'Military'
})  
</script>
  
<style scoped>
</style>