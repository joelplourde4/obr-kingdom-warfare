<template>
    <div class="content">
        <div class="row">
            <div class="column">
                <p class="title">Skills</p>
                <div class="attributes row">
                    <input type="number" class="column modifier" v-model="stats.skills.diplomacy.level" @input="onUpdate"/>
                    <div class="column text">
                        <h3>{{ stats.skills.diplomacy.name }}</h3>
                        <p>{{ stats.skills.diplomacy.description }}</p>
                    </div>
                </div>
                <div class="attributes row">
                    <input type="number" class="column modifier" v-model="stats.skills.espionage.level" @input="onUpdate"/>
                    <div class="column text">
                        <h3>{{ stats.skills.espionage.name }}</h3>
                        <p>{{ stats.skills.espionage.description }}</p>
                    </div>
                </div>
                <div class="attributes row">
                    <input type="number" class="column modifier" v-model="stats.skills.lore.level" @input="onUpdate"/>
                    <div class="column text">
                        <h3>{{ stats.skills.lore.name }}</h3>
                        <p>{{ stats.skills.lore.description }}</p>
                    </div>
                </div>
                <div class="attributes row">
                    <input type="number" class="column modifier" v-model="stats.skills.operations.level" @input="onUpdate"/>
                    <div class="column text">
                        <h3>{{ stats.skills.operations.name }}</h3>
                        <p>{{ stats.skills.operations.description }}</p>
                    </div>
                </div>
            </div>
            <div class="column">
                <p class="title">Defenses</p>
                <div class="attributes row">
                    <input type="number" class="column modifier" v-model="stats.defenses.communications.level" @input="onUpdate"/>
                    <div class="column text">
                        <h3>{{ stats.defenses.communications.name }}</h3>
                        <p>{{ stats.defenses.communications.description }}</p>
                    </div>
                </div>
                <div class="attributes row">
                    <input type="number" class="column modifier" v-model="stats.defenses.resolve.level" @input="onUpdate"/>
                    <div class="column text">
                        <h3>{{ stats.defenses.resolve.name }}</h3>
                        <p>{{ stats.defenses.resolve.description }}</p>
                    </div>
                </div>
                <div class="attributes row">
                    <input type="number" class="column modifier" v-model="stats.defenses.resources.level" @input="onUpdate"/>
                    <div class="column text">
                        <h3>{{ stats.defenses.resources.name }}</h3>
                        <p>{{ stats.defenses.resources.description }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'
import { Stats } from '../../models/Stats'
  
export default defineComponent({
    name: 'Stats',
    props: {
        stats: {
            type: Stats,
            required: true
        }
    },
    emits: ['update:modelValue'],
    methods: {
        onUpdate() {
            this.$emit('update:modelValue');
        }
    }
})
  
</script>
  
<style scoped>

.row {
  display: flex;
}

.column {
  flex: 50%;
}

.title {
    font-size: 1.5rem;
    margin: 0;
}

.modifier {
    margin: auto;
    padding-left: 0.125rem;
    height: 40px;
    max-width: 40px;
}

.attributes {
    padding: 0.5rem;
}

.text {
    display: grid;
    margin-left: 0.5rem;

    h3 {
        display: flex;
        float: left;
        margin: 0;
    }  

    p {
        display: flex;
        float: left;
        margin: 0;
    }
}

</style>