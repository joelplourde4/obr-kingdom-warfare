<template>
    <div class="content">
        <input class="title" v-model="title">
        <select v-model="size">
            <option>Tiny</option>
            <option>Small</option>
            <option>Medium</option>
            <option>Big</option>
            <option>Large</option>
        </select>
        <select v-model="powerDie">
            <option>D4</option>
            <option>D6</option>
            <option>D8</option>
            <option>D12</option>
            <option>D20</option>
        </select>
        <div class="row">
            <div class="column">
                <p class="subtitle">Skills</p>
                <div class="attributes row">
                    <Attributes
                        :attribute="stats.skills.diplomacy"
                        @update:model-value="onAttributeUpdate"
                        />
                </div>
                <div class="attributes row">
                    <Attributes
                        :attribute="stats.skills.espionage"
                        @update:model-value="onAttributeUpdate"
                        />
                </div>
                <div class="attributes row">
                    <Attributes
                        :attribute="stats.skills.lore"
                        @update:model-value="onAttributeUpdate"
                        />
                </div>
                <div class="attributes row">
                    <Attributes
                        :attribute="stats.skills.operations"
                        @update:model-value="onAttributeUpdate"
                    />
                </div>
            </div>
            <div class="column">
                <p class="subtitle">Defenses</p>
                <div class="attributes row">
                    <Attributes
                        :attribute="stats.defenses.communications"
                        @update:model-value="onAttributeUpdate"
                    />
                </div>
                <div class="attributes row">
                    <Attributes
                        :attribute="stats.defenses.resolve"
                        @update:model-value="onAttributeUpdate"
                    />
                </div>
                <div class="attributes row">
                    <Attributes
                        :attribute="stats.defenses.resources"
                        @update:model-value="onAttributeUpdate"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'
import { Stats } from '../../models/Stats'
import { Size, PowerDie } from '../../models/Domain';
import Attributes from './Attributes.vue';
  
export default defineComponent({
    components: { Attributes },
    name: 'Stats',
    props: {
        title: {
            type: String,
            required: true
        },
        size: {
            type: Size,
            required: true
        },
        powerDie: {
            type: PowerDie,
            required: true
        },
        stats: {
            type: Stats,
            required: true
        }
    },
    data() {
        size: null
    },
    emits: ['update:attributeValue', 'update:titleValue'],
    methods: {
        onTitleUpdate() {
            this.$emit('update:titleValue', this.title);
        },
        onAttributeUpdate() {
            this.$emit('update:attributeValue', this.stats);
        }
    }
})
  
</script>
  
<style scoped>

.title {
    font-size: 1.5rem;
    width: 95%;
    text-align: center;
}

.subtitle {
    font-size: 1.25rem;
    margin: 0;
}

.attributes {
    padding: 0.5rem;
}

</style>