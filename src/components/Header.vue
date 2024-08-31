<template>
    <div class="row">
        <input class="title" v-model="domain.name" @input="onUpdate" :disabled="isDisabled">
        <label v-if="isGM" class="switch">
            <input type="checkbox" @click="toggleEditMode"/>
            <span class="slider round"></span>
        </label>
    </div>
    <div class="row">
            <div class="column row">
                <div class="tooltip">
                    <p class="descriptor tooltip">Domain Size</p>
                    <span class="tooltiptext">
                        Size is a relative measure of the reach, influence and how far a domain's power extends.
                    </span>
                </div>
                <select class="dropdown" v-model="domain.size" @change="onUpdate" :disabled="isDisabled">
                    <option v-for="size in Size" :value="size">
                        {{ size }}
                    </option>
                </select>
            </div>
            <div class="column row">
                <div class="tooltip">
                    <p class="descriptor">Power Die</p>
                    <span class="tooltiptext">
                        Each officer in a domain has one power die, 
                        with its type based on the domain's size. 
                        After rolling initiative, any officer can add their die to a shared pool.
                        The first officer to act can use any or all of the dice from the pool,
                        depending on the domain power they want to use.
                    </span>
                </div>
                <select class="dropdown" v-model="domain.powerDie" @change="onUpdate" :disabled="isDisabled">
                    <option v-for="powerDie in PowerDie" :value="powerDie">
                        {{ powerDie }}
                    </option>
                </select>
            </div>
    </div>
    <hr class="horizontal-line"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { Domain, Size, PowerDie } from '../models/Domain'

export default defineComponent({
    name: 'Header',
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
    data() {
        const editMode = false;
        return {
            editMode: editMode,
            Size,
            PowerDie
        }
    },
    emits: ['update:modelValue', 'update:editMode'],
    computed: {
        isDisabled() {
            if (!this.isGM) {
                return true;
            }

            return !this.editMode;
        }
    },
    methods: {
        toggleEditMode() {
            this.editMode = !this.editMode;
            this.$emit('update:editMode', this.editMode);
        },
        onUpdate() {
            const json = JSON.parse(JSON.stringify(this.domain));
            this.$emit('update:modelValue', json);
        }
    }
})
  
</script>

<style scoped>

.title {
    font-size: x-large;
    width: 95%;
    text-align: center;
}

.descriptor {
    margin-left: 1.25rem;
}

.dropdown {
    float: right;
    margin: auto;
}

/* The switch - the box around the slider */
.switch {
  align-self: center;
  position: relative;
  display: inline-block;
  width: 56px;
  height: 24px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #0000002e;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: rgb(187, 153, 255);
}

input:focus + .slider {
  box-shadow: 0 0 1px rgb(187, 153, 255);
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}

.horizontal-line {
    border-width: 0px 0px thin;
    border-style: solid;
    border-color: rgba(255, 255, 255, 0.12);
}


</style>