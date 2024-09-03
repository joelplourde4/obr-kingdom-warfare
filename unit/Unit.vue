<template>
    <h1>Hello World!</h1>
</template>

<script lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { defineComponent } from 'vue'

export default defineComponent({
    created() {
        const route = useRoute();
        console.log(route.query);
        
    }
})
</script>

<style scoped>
</style>