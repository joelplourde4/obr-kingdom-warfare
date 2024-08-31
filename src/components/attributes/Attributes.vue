<template>
    <input 
        v-if="isEditMode"
        type="number"
        class="column modifier"
        v-model="attribute.level"
        :disabled="isDisabled"
        @input="onUpdate"
    />
    <input
        v-if="!isEditMode"
        type="text"
        :value="formattedModifier"
        class="column modifier"
        :disabled="true"
    />
    <div class="column text tooltip">
        <div class="container">
            <h3>{{ attribute.name }}</h3>
            <p class="skills" v-if="hasSkills">{{ attribute.skills }}</p>
            <span class="tooltiptext">{{ attribute.description }}</span>
        </div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'
import { utils } from '../../mixins/utils'
import { Attributes } from '../../models/Stats'
    
export default defineComponent({
    mixins: [utils],
    name: 'Feature',
    props: {
        isGM: {
            type: Boolean,
            required: true
        },
        isEditMode: {
            type: Boolean,
            required: true
        },
        attribute: {
            type: Attributes,
            required: true
        }
    },
    emits: ['update:modelValue'],
    methods: {
        onUpdate() {
            this.$emit('update:modelValue', this.attribute);
        },
    },
    computed: {
        formattedModifier(): string {
            const modifier = (this.attribute.level - 10) / 2;
            
            if (modifier >= 0) {
                return '+' + modifier
            }
            
            return '-' + modifier
        },
        hasSkills() {
            return this.attribute.skills.length !== 0;
        },
        isDisabled() {
            if (!this.isGM) {
                return true;
            }

            return !this.isEditMode;
        }
    }
})  
</script>
  
<style scoped>

input {
    text-align: center;
}

.text {
    display: grid;
    margin-left: 0.5rem;
    align-items: center;

    h3 {
        font-size: medium;
        display: flex;
        float: left;
        margin: auto auto auto 0;
    }  

    p {
        font-size: small;
        font-style: italic;
        display: flex;
        float: left;
        margin: 0;
    }

    img {
        filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(269deg) brightness(103%) contrast(107%);
    }
}

.modifier {
    margin: auto;
    padding-left: 0.125rem;
    height: 40px;
    max-width: 40px;
}

</style>