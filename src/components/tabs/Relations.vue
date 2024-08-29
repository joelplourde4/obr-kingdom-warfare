<template>
    <div class="content">
        <div class="relation" v-for="relation in domain.relations">
            <button type="button" class="collapsible" @click="openCollapsible(relation)">
                <img class="image" src="/public/kingdom.svg">
                <input class="name" v-model="relation.name" @input="onUpdate" @click="preventPropagation" :disabled="isDisabled">
                <select class="dropdown" v-model="relation.relationStatus" @click="preventPropagation" :disabled="isDisabled">
                    <option v-for="status in RelationStatus" :value="status">
                        {{ status }}
                    </option>
                </select>
                <div class="caret">
                    <img v-if="relation.show" src="/public/caret-up.svg">
                    <img v-if="!relation.show" src="/public/caret-down.svg">
                </div>
                <input v-show="isVisible" type="button" class="remove-button" @click="onRemoveRelation(relation)"/>
            </button>
            <div v-if="relation.show" class="collapsible-content">
                <div class="officer row" v-for="officer in relation.officers">
                    <img class="image" src="/public/person.svg">
                    <div class="container">
                        <input class="name" v-model="officer.name" @input="onUpdate" :disabled="isDisabled">
                        <input class="description" v-model="officer.description" @input="onUpdate" :disabled="isDisabled">
                    </div>
                    <input v-show="isVisible" type="button" class="remove-button" @click="onRemoveOfficer(relation, officer)"/>
                </div>
                <input v-show="isVisible" type="button" class="add-button" @click="onAddOfficer(relation)"/>
            </div>
        </div>
        <input v-show="isVisible" type="button" class="add-button" @click="onAddRelation"/>
    </div>
  </template>
  
<script lang="ts">
import { defineComponent, toRaw } from 'vue'

import { Domain } from '../../models/Domain'
import { Relation, RelationStatus, Officer } from '../../models/Relation';
    
export default defineComponent({
    name: 'Relation',
    props: {
        isGM: {
            type: Boolean,
            required: true
        },
        isEditMode: {
            type: Boolean,
            required: true
        },
        domain: {
            type: Domain,
            required: true
        }
    },
    data() {
        return {
            RelationStatus
        }
    },
    emits: ['update:modelValue'],
    computed: {
        isVisible() {
            return this.isEditMode === true;
        },
        isDisabled() {
            return !this.isGM
        }
    },
    methods: {
        preventPropagation(event: any) {
            event.stopPropagation();
        },
        openCollapsible(relation: Relation) {
            relation.show = !relation.show;
        },
        onAddRelation() {
            this.domain.relations.push(new Relation());
            this.onUpdate();
        },
        onRemoveRelation(relation: Relation) {
            this.domain.relations = this.domain.relations.filter((x) => {
                return x !== relation
            });
            this.onUpdate();
        },
        onAddOfficer(relation: Relation) {
            relation.officers.push(new Officer())
            this.onUpdate();
        },
        onRemoveOfficer(relation: Relation, officer: Officer) {
            relation.officers = relation.officers.filter((x) => {
                return x !== officer
            });
            this.onUpdate();
        },
        onUpdate() {
            this.$emit('update:modelValue', toRaw(this.domain));
        }
    }
})
    
</script>
<style scoped>

.relation {

    .image {
        height: 40px;
        width: 40px;
        margin: auto;
    }
    
    .name {
        margin: 0.25rem;
        height: 24px;
        float: left;
        align-self: center;
    }

    .description {
        margin: 0.25rem;
    }

    .dropdown {
        margin: 0.25rem;
        width: 130px;
        height: 30px;
        align-self: center;
    }

    .caret {
        filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(269deg) brightness(103%) contrast(107%);
        float: right;
        align-self: center;
    }
}

.officer {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
}

.collapsible {
    display: inline-flex;
    background-color: #0000002e;
    cursor: pointer;
    padding: 0.75rem;
    width: 100%;
    border: none;
    text-align: left;
    outline: none;
}

/* Add a background color to the button if it is clicked on (add the .active class with JS), and when you move the mouse over it (hover) */
.active, .collapsible:hover {
    transform: scale(1.02);
}

input.add-button {
    filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(269deg) brightness(103%) contrast(107%);
    background-image: url(/add.svg); /* 16px x 16px */
    background-color: transparent; /* make the button transparent */
    background-repeat: no-repeat;  /* make the background image appear only once */
    background-position: 0px 0px;  /* equivalent to 'top left' */
    border: none;           /* assuming we don't want any borders */
    cursor: pointer;        /* make the cursor like hovering over an <a> element */
    height: 25px;           /* make this the size of your image */
    width: 25px;
}

input.remove-button {
    filter: invert(13%) sepia(89%) saturate(7390%) hue-rotate(0deg) brightness(99%) contrast(111%);
    background-image: url(/remove.svg); /* 16px x 16px */
    background-color: transparent; /* make the button transparent */
    background-repeat: no-repeat;  /* make the background image appear only once */
    background-position: 0px 0px;  /* equivalent to 'top left' */
    border: none;           /* assuming we don't want any borders */
    cursor: pointer;        /* make the cursor like hovering over an <a> element */
    height: 25px;           /* make this the size of your image */
    width: 25px;
}
</style>