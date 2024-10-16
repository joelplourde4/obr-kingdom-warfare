<template>
    <div class="content">
        <div class="row">
            <div class="column">
                <p class="subtitle">Skills</p>
                <div class="attributes row">
                    <Attributes
                        :isGM="isGM"
                        :isEditMode="isEditMode"
                        :attribute="domain.stats.skills.diplomacy"
                        @update:model-value="onUpdate"
                        />
                </div>
                <div class="attributes row">
                    <Attributes
                        :isGM="isGM"
                        :isEditMode="isEditMode"
                        :attribute="domain.stats.skills.espionage"
                        @update:model-value="onUpdate"
                        />
                </div>
                <div class="attributes row">
                    <Attributes
                        :isGM="isGM"
                        :isEditMode="isEditMode"
                        :attribute="domain.stats.skills.lore"
                        @update:model-value="onUpdate"
                        />
                </div>
                <div class="attributes row">
                    <Attributes
                        :isGM="isGM"
                        :isEditMode="isEditMode"
                        :attribute="domain.stats.skills.operations"
                        @update:model-value="onUpdate"
                    />
                </div>
            </div>
            <div class="column">
                <p class="subtitle">Defenses</p>
                <div class="attributes row">
                    <Attributes
                        :isGM="isGM"
                        :isEditMode="isEditMode"
                        :attribute="domain.stats.defenses.communications"
                        @update:model-value="onUpdate"
                    />
                </div>
                <div class="attributes row">
                    <Attributes
                        :isGM="isGM"
                        :isEditMode="isEditMode"
                        :attribute="domain.stats.defenses.resolve"
                        @update:model-value="onUpdate"
                    />
                </div>
                <div class="attributes row">
                    <Attributes
                        :isGM="isGM"
                        :isEditMode="isEditMode"
                        :attribute="domain.stats.defenses.resources"
                        @update:model-value="onUpdate"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'
import { utils } from '../../mixins/utils'

import { Size, PowerDie } from '../../models/Domain'
import Attributes from '../attributes/Attributes.vue';

import BaseTab from './BaseTab.ts'

export default defineComponent({
    mixins: [utils],
    components: { Attributes },
    extends: BaseTab,
    name: 'Stats',
    data() {
        return {
            Size,
            PowerDie
        }
    }
})
  
</script>
  
<style scoped>

.subtitle {
    font-size: large;
    margin: 0;
}

.attributes {
    padding: 0.5rem 0rem 0.5rem 0rem;
}

</style>