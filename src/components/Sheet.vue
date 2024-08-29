<template lang="html">
    <Header
        :domain="domain"
        :isGM="isGM"
        @update:model-value="onUpdate"
        @update:edit-mode="onEditMode"
    />
    <tabs class="tabs">
        <tab name="Stats">
            <Stats
                :domain="domain"
                :isGM="isGM"
                :isEditMode="editMode"
                @update:model-value="onUpdate"
            />
        </tab>
        <tab name="Relations">
            <Relations
                :domain="domain"
                :isGM="isGM"
                :isEditMode="editMode"
                @update:model-value="onUpdate"
            />
        </tab>
        <tab name="Features">
            <Features
                :domain="domain"
                :isGM="isGM"
                :isEditMode="editMode"
                @update:model-value="onUpdate"
            />
        </tab>
        <tab name="Military">
            <Military/>
        </tab>
    </tabs>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import Header from './Header.vue'
import Stats from './tabs/Stats.vue'
import Relations from './tabs/Relations.vue';
import Features from './tabs/Features.vue';
import Military from './tabs/Military.vue';

import { Domain } from '../models/Domain'

export default defineComponent({
    components: { Header, Stats, Relations, Features, Military },
    name: 'Sheet',
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
    emits: ['update:domain'],
    data() {
        const editMode = false;
        return {
            editMode: editMode
        }
    },
    methods: {
        onEditMode(editMode: boolean) {
            this.editMode = editMode;
        },
        onUpdate(domain: Domain) {
            this.$emit('update:domain', domain);
        }
    }
})

</script>

<style scoped>
</style>