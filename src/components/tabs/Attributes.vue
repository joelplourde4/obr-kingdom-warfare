<template>
    <input 
        type="number"
        class="column modifier"
        v-model="attribute.level"
        :disabled="isDisabled"
        @input="onUpdate"
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
import { Attributes } from '../../models/Stats'
    
export default defineComponent({
    name: 'Feature',
    props: {
        isGM: {
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
        }
    },
    computed: {
        hasSkills() {
            return this.attribute.skills.length !== 0;
        },
        isDisabled() {
            return !this.isGM;
        },
        modifier() {
            return 15;
        }
    }
})  
</script>
  
<style scoped>

.container {
    display: grid;
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

/* Tooltip container */
.tooltip {
  position: relative;
  display: inline-block;
}

/* Tooltip text */
.tooltip .tooltiptext {
    visibility: hidden;
    width: 100%;
    background-color: #0000002e;
    color: #fff;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;
    
    /* Position the tooltip text - see examples below! */
    z-index: 1;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: visible;
}

.tooltip .tooltiptext {
    left: 0%;
    bottom: 0px;
    position: fixed;
}

</style>