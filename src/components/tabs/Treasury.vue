<template>
    <span>Hello World!</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { utils } from '../../mixins/utils'

import BaseTab from './BaseTab.ts'
    
export default defineComponent({
    mixins: [utils],
    extends: BaseTab,
    name: 'Treasury'
})
</script>
  
<style scoped>
</style>