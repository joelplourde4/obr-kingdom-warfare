<template>
    <input 
        type="number"
        class="column modifier"
        v-model="attribute.level"
        @input="onUpdate"
    />
    <div class="column text">
        <div class="tooltip">
            <h3>{{ attribute.name }}</h3>
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
        attribute: {
            type: Attributes,
            required: true
        }
    },
    emits: ['update:attributeValue'],
    methods: {
        onUpdate() {
            this.$emit('update:attributeValue', this.attribute);
        }
    },
    computed: {
        modifier() {
            return 15;
        }
    }
})  
</script>
  
<style scoped>

.text {
    display: grid;
    margin-left: 0.5rem;
    align-items: center;

    h3 {
        font-size: small;
        display: flex;
        float: left;
        margin: auto auto auto 0;
    }  

    p {
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
  width: 240px;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
 
  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: visible;
}

.tooltip .tooltiptext {
  top: -5px;
  left: 75%;
}

</style>